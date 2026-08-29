import chokidar, { FSWatcher } from "chokidar";
import { SlippiRelay } from "./SlippiRelay.js";
import { BrowserWindow } from "electron";
import {
  SlippiGameEndData,
  SlippiGameData,
  SlippiPlayer,
  SlippiGameStartData,
} from "@app/common";
import {
  FrameEntryType,
  GameEndType,
  GameStartType,
  MetadataType,
  SlippiGame,
  StatsType,
  characters as characterUtils,
} from "@slippi/slippi-js/node";
import { SlippiSettingsData } from "../../types.js";
import { EventStream } from "../EventStream.js";

export class SlippiFolderRelay implements SlippiRelay {
  private browserWindow: BrowserWindow;
  private watcher: FSWatcher;
  private listenPath: string;
  private previousPlayers: SlippiGameData | null;
  // settings field in games is used to detect if game started or not, see line 97-100 of https://github.com/project-slippi/slippi-js/blob/master/src/common/SlippiGameBase.ts
  // possibly delete all handwarmers games tbh
  private games: Map<string, SlippiSettingsData>;

  constructor(listenPath: string, browserWindow: BrowserWindow) {
    this.browserWindow = browserWindow;
    this.listenPath = listenPath;
    this.previousPlayers = null;
    this.games = new Map();
    this.watcher = chokidar.watch(listenPath, {
      ignored: "!*.slp", // TODO: This doesn't work. Use regex?
      depth: 0,
      persistent: true,
      usePolling: true,
      ignoreInitial: true,
    });
  }

  async setBrowserWindow(browserWindow: BrowserWindow) {
    this.browserWindow = browserWindow;
  }

  private isSameGame(gameData: SlippiGameData) {
    if (
      this.previousPlayers === null || // first game ever recorded
      this.previousPlayers.isTeams !== gameData.isTeams ||
      this.previousPlayers.players.length !== gameData.players.length
    )
      return false;
    for (let i = 0; i < gameData.players.length; i++) {
      if (gameData.players[i].length !== this.previousPlayers.players[i].length)
        return false;
      for (let j = 0; j < gameData.players[i].length; j++) {
        if (
          gameData.players[i][j].character !==
            this.previousPlayers.players[i][j].character ||
          gameData.players[i][j].color !==
            this.previousPlayers.players[i][j].color ||
          gameData.players[i][j].playerId !==
            this.previousPlayers.players[i][j].playerId ||
          gameData.players[i][j].port !==
            this.previousPlayers.players[i][j].port ||
          gameData.players[i][j].teamId !==
            this.previousPlayers.players[i][j].teamId
        )
          return false;
      }
    }
    return true;
  }

  private isActualGame(
    metadata: MetadataType | undefined,
    gameEnd: GameEndType | undefined,
    stats: StatsType | undefined,
  ) {
    if (!metadata || !gameEnd || !stats) return false;

    if (metadata.lastFrame && metadata.lastFrame > 5400) return true;

    const allDamageDealt = stats.overall.map((s) => s.totalDamage);
    const totalDamage = allDamageDealt.reduce((a, b) => a + b, 0);
    if (totalDamage > 100) return true;

    // lras = LT + RT + A + START
    const lras = gameEnd.gameEndMethod === 7;

    return (lras && totalDamage > 100) || (!lras && totalDamage > 100); // this could be better tbh ill figure it out later
  }

  private getWinner(
    settings: GameStartType | undefined,
    lastFrame: FrameEntryType | undefined,
    gameEnd: GameEndType | undefined,
  ): SlippiGameEndData | undefined {
    if (!settings || !lastFrame || !gameEnd) {
      return undefined;
    }
    // add time
    const playerResults = settings.players.map((player) => ({
      playerIndex: player.playerIndex,
      teamId: player.teamId,
      stocks: lastFrame.players[player.playerIndex]?.post.stocksRemaining ?? -1,
      percent: lastFrame.players[player.playerIndex]?.post.percent ?? -1,
      lras: gameEnd.lrasInitiatorIndex === player.playerIndex,
    }));
    if (settings.isTeams) {
      const teamStocks = playerResults.reduce(
        (acc: Record<number, number>, currentPlayer) => {
          if (currentPlayer.teamId === undefined) {
            return acc;
          }
          acc[currentPlayer.teamId] =
            (acc[currentPlayer.teamId] || 0) + currentPlayer.stocks;
          return acc;
        },
        {},
      );
      const teamWinnerId = Object.keys(teamStocks).reduce(
        (a: string, b: string) =>
          teamStocks[Number(a)] > teamStocks[Number(b)] ? a : b,
      );
      return {
        isTeams: true,
        winners: playerResults.reduce((acc: number[], curr) => {
          if (curr.teamId === (parseInt(teamWinnerId) ?? -1)) {
            acc.push(curr.playerIndex);
          }
          return acc;
        }, []),
      };
    }

    const playerWinnerId = playerResults.sort((a, b) => {
      if (a.stocks !== b.stocks) return b.stocks - a.stocks;
      return a.percent - b.percent;
    })[0].playerIndex;

    return { isTeams: false, winners: [playerWinnerId] };
  }

  private getStartGameData(settings: GameStartType): SlippiGameData {
    const playerData = [] as SlippiPlayer[][];
    let isTeams = settings.isTeams;
    if (!isTeams) {
      for (const player of settings.players) {
        playerData.push([
          {
            character: characterUtils.getCharacterName(
              player.characterId as number,
            ),
            color: characterUtils.getCharacterColorName(
              player.characterId as number,
              player.characterColor as number,
            ),
            playerId: player.playerIndex,
            port: player.port,
            teamId: player.teamId as number,
          },
        ]);
      }
    } else {
      const teamIdsToArrayIndex = new Map<number, number>(); // map each team id to the array index for easy lookups
      for (const player of settings.players) {
        if (player.teamId !== undefined) {
          if (teamIdsToArrayIndex.get(player.teamId) === undefined) {
            teamIdsToArrayIndex.set(player.teamId, playerData.length);
            playerData.push([
              {
                character: characterUtils.getCharacterName(
                  player.characterId as number,
                ),
                color: characterUtils.getCharacterColorName(
                  player.characterId as number,
                  player.characterColor as number,
                ),
                playerId: player.playerIndex,
                port: player.port,
                teamId: player.teamId,
              },
            ]);
          } else {
            let index = teamIdsToArrayIndex.get(player.teamId);
            if (
              index !== undefined &&
              index < playerData.length &&
              playerData[index].length <= 2 // <=2 because you can have 1 player on one team and 3 players on another, can't handle that right now in frontend, will do in a future update
            ) {
              playerData[index].push({
                character: characterUtils.getCharacterName(
                  player.characterId as number,
                ),
                color: characterUtils.getCharacterColorName(
                  player.characterId as number,
                  player.characterColor as number,
                ),
                playerId: player.playerIndex,
                port: player.port,
                teamId: player.teamId,
              });
            }
          }
        }
      }
    }
    return { isTeams: isTeams ?? false, players: playerData };
  }

  async start() {
    this.watcher?.on("change", (path) => {
      let gameState: SlippiSettingsData["state"] | undefined,
        settings: GameStartType | undefined,
        gameEnd: GameEndType | undefined,
        // metadata: MetadataType | undefined,
        game: SlippiSettingsData | undefined;
      try {
        if (!this.games.get(path)?.gameDataController) {
          // new file detected, but this doesn't necessarily mean a new game has started (possibly could be a delay between actual game starting and the file being created)
          this.games.set(path, {
            gameDataController: new SlippiGame(path, { processOnTheFly: true }),
            state: {
              settings: undefined,
              gameEnded: false,
            },
          });
        }

        game = this.games.get(path);
        gameState = game?.state;
        settings = game?.gameDataController.getSettings();
        gameEnd = game?.gameDataController.getGameEnd();
      } catch (err) {
        EventStream.notify("toast", "Slippi Relay Error");
        return;
      }
      if (!gameState?.settings && settings) {
        // a new game has ACTUALLY started, since the settings portion didn't exist before and there are new settings
        const newGameData = this.getStartGameData(settings);
        // now check if it's a runback with the same characters, and the set isn't over
        const isSameGame = this.isSameGame(newGameData);

        const data: SlippiGameStartData = {
          isTeams: newGameData.isTeams,
          players: newGameData.players,
          isSameGame: isSameGame,
        };

        this.browserWindow.webContents.send("slippi:new-game-start-data", data);

        this.previousPlayers = newGameData;
      }
      game = this.games.get(path);
      if (game?.state) {
        game.state.settings = settings;
        this.games.set(path, game);
      }
      // 3rd condition is to avoid duplicates
      if (game && gameEnd !== undefined && game.state.gameEnded === false) {
        if (
          this.isActualGame(
            game.gameDataController.getMetadata(),
            gameEnd,
            game.gameDataController.getStats(),
          )
        ) {
          const winner = this.getWinner(
            settings,
            game.gameDataController.getLatestFrame(),
            gameEnd,
          );
          if (winner !== undefined) {
            this.browserWindow?.webContents.send(
              "slippi:new-game-end-data",
              winner,
            );
            console.log(
              `winners = ${winner.winners}, isTeam = ${winner.isTeams}, gameEnded = ${game.state.gameEnded}`,
            );
          }
        }
        // chokidar does sometimes fire twice on one slippi file a second apart from each other: this could be because of a slight change in the file, metadata flush, some small, very minute, irrelevant change to the file/buffer via os, etc
        // so we must ensure the file end stuff only gets read once
        game.state.gameEnded = true;
        this.games.set(path, game);
        console.log(this.games.get(path));
      }
    });
  }

  async stop(quiet: boolean) {
    if (this.listenPath) {
      this.watcher?.unwatch(this.listenPath);
      this.watcher?.close();
      this.listenPath = "";
    }
    if (!quiet) {
      EventStream.notify("toast", "Slippi Relay", "Stopped Relay");
    }
  }

  // async setup() {
  //   this.watcher = chokidar.watch(this.listenPath, {
  //     ignored: "!*.slp", // TODO: This doesn't work. Use regex?
  //     depth: 0,
  //     persistent: true,
  //     usePolling: true,
  //     ignoreInitial: true,
  //   });

  //   this.read();
  //   EventStream.notify("Slippi Folder Relay", "Started Folder Relay");
  // }
}
