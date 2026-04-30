import { BrowserWindow } from "electron";
import { EventStream } from "./EventStream.js";
import chokidar, { FSWatcher } from "chokidar";
import { SlippiGameData, SlippiGameEndData, SlippiPlayer } from "@app/common";
import {
  FrameEntryType,
  GameEndType,
  GameStartType,
  MetadataType,
  SlippiGame,
  StatsType,
  characters as characterUtils,
} from "@slippi/slippi-js/node";
import { SlippiSettingsData } from "../types.js";

export class SlippiRelayHandler {
  private static browserWindow?: BrowserWindow | null = null;
  private static watcher?: FSWatcher | null = null;
  private static listenPath: string = "";
  private static ip: string = "";
  private static port: string = "";
  private static players: SlippiGameData | null = null;
  private static bestOf: number = 0;
  // private static previousPlayers:
  // settings field is used to detect if game started or not, see line 97-100 of https://github.com/project-slippi/slippi-js/blob/master/src/common/SlippiGameBase.ts
  // possibly delete all handwarmers games tbh
  private static games: Map<string, SlippiSettingsData> = new Map();
  // constructor() {
  //   super();
  //   this.browserWindow = null;
  //   this.watcher = null;
  //   this.listenPath = null;
  //   this.ip = null;
  //   this.port = null;
  //   this.players = null;
  //   this.games = new Map<string, SlippiSettingsData>();
  // }

  static async getPlayers() {
    return this.players;
  }

  static async setBrowserWindow(browserWindow: BrowserWindow) {
    this.browserWindow = browserWindow;
  }

  static async setWiiPort(port: string) {
    this.port = port;
  }

  static async setWiiIp(ip: string) {
    this.ip = ip;
  }

  static async stop(quiet: boolean) {
    if (this.listenPath) {
      this.watcher?.unwatch(this.listenPath);
      this.watcher?.close();
      this.listenPath = "";
    }
    if (!quiet) {
      EventStream.notify("Slippi Relay", "Stopped Relay");
    }
  }

  static async setup(listenPath: string) {
    this.listenPath = listenPath;
    this.watcher = chokidar.watch(listenPath, {
      ignored: "!*.slp", // TODO: This doesn't work. Use regex?
      depth: 0,
      persistent: true,
      usePolling: true,
      ignoreInitial: true,
    });

    this.read();
    console.log("SETUP COMPLETE");
    EventStream.notify("Slippi Relay", "Started Relay");
  }

  private static isActualGame(
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

  private static getWinner(
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
  private static getStartGameData(settings: GameStartType): SlippiGameData {
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

  static async read() {
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
            },
          });
        }

        game = this.games.get(path);
        gameState = game?.state;
        settings = game?.gameDataController.getSettings();
        gameEnd = game?.gameDataController.getGameEnd();
      } catch (err) {
        EventStream.notify("Slippi Relay Error");
        return;
      }
      if (!gameState?.settings && settings) {
        // a new game has ACTUALLY started, since the settings portion didn't exist before and there are new settings
        const newData = this.getStartGameData(settings);
        this.browserWindow?.webContents.send(
          "slippi:new-game-start-data",
          newData,
        );
      }
      game = this.games.get(path);
      if (game?.state) {
        game.state.settings = settings;
        this.games.set(path, game);
      }
      if (gameEnd !== undefined) {
        if (
          this.isActualGame(
            game?.gameDataController.getMetadata(),
            gameEnd,
            game?.gameDataController.getStats(),
          )
        ) {
          const winner = this.getWinner(
            settings,
            game?.gameDataController.getLatestFrame(),
            gameEnd,
          );
          if (winner !== undefined) {
            this.browserWindow?.webContents.send(
              "slippi:new-game-end-data",
              winner,
            );
            console.log(
              `winners = ${winner.winners}, isTeam = ${winner.isTeams}`,
            );
          }
        }
      }
    });
  }
}
