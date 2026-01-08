/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlippiGame, characters as characterUtils } from '@slippi/slippi-js/node'
import { BrowserWindow } from 'electron'
import chokidar, { FSWatcher } from 'chokidar'
import * as _ from 'lodash-es'
import { EventStream } from './observer'
import { SlippiGameData } from '../../common/types'

export class SlippiRelayHandler extends EventStream {
  private browserWindow?: BrowserWindow | null
  private watcher?: FSWatcher | null
  private listenPath: string | null
  private ip: string | null
  private port: string | null
  private players: SlippiGameData | null
  constructor() {
    super()
    this.browserWindow = null
    this.watcher = null
    this.listenPath = null
    this.ip = null
    this.port = null
    this.players = null
  }

  async getPlayers(): Promise<SlippiGameData | null> {
    return this.players
  }

  async setBrowserWindow(browserWindow: BrowserWindow): Promise<void> {
    this.browserWindow = browserWindow
  }

  async setWiiPort(newPort: string): Promise<void> {
    this.port = newPort
    console.log(this.ip)
    console.log(this.port)
  }

  async setWiiIp(newIp: string): Promise<void> {
    this.ip = newIp
  }

  async stop(quiet: boolean): Promise<void> {
    if (this.listenPath) {
      this.watcher?.unwatch(this.listenPath)
      this.watcher?.close()
      this.listenPath = null
    }
    if (!quiet) {
      this.notify('Slippi Relay', 'Stopped Relay')
    }
  }

  async setup(newListenPath: string): Promise<void> {
    this.listenPath = newListenPath
    this.watcher = chokidar.watch(newListenPath, {
      ignored: '!*.slp', // TODO: This doesn't work. Use regex?
      depth: 0,
      persistent: true,
      usePolling: true,
      ignoreInitial: true
    })
    this.read()
    this.notify('Slippi Relay', 'Started Relay')
  }

  private isSameGame(previousGame: SlippiGameData | null, currentGame: SlippiGameData): boolean {
    if (
      !previousGame ||
      (previousGame.isTeams && currentGame.isTeams && previousGame.isTeams !== currentGame.isTeams) // covers different sized games (singles vs doubles) case
    ) {
      return false
    }
    for (let i = 0; i < currentGame.players.length; i++) {
      for (let j = 0; j < currentGame.players[i].length; j++) {
        const playerOne = currentGame.players[i][j]
        const playerTwo = previousGame.players[i][j]
        if (playerOne.character !== playerTwo.character || playerOne.color !== playerTwo.color) {
          return false
        }
      }
    }
    return true
  }
  async read(): Promise<void> {
    const gameByPath = {}
    let gameState: Record<string, any> = {}
    let settings: Record<string, any> = {}
    let gameEnd: Record<string, any> = {}
    this.watcher?.on('change', (path) => {
      try {
        let game = _.get(gameByPath, [path, 'game'])
        if (!game) {
          console.log(`New file at: ${path}`)
          game = new SlippiGame(path, { processOnTheFly: true })
          gameByPath[path] = {
            game: game,
            state: {
              settings: null,
              detectedPunishes: {}
            }
          }
        }

        settings = game.getSettings()

        gameEnd = game.getGameEnd()
      } catch (err) {
        console.log(err)
        return
      }

      if (!gameState.settings && settings) {
        console.log(`[Game Start] New game has started`)
        console.log(settings)
        const playerData = [] as any[]
        if (!settings.isTeams) {
          console.log('singles')
          for (const player of settings.players) {
            const a = [] as any[]
            a.push({
              character: characterUtils.getCharacterName(player.characterId),
              color: characterUtils.getCharacterColorName(
                player.characterId,
                player.characterColor
              ),
              playerId: player.playerIndex,
              port: player.port
            })
            playerData.push(a)
          }
        } else {
          console.log('doubles')
          const teamIdsIndex = new Map<number, number>()
          for (const player of settings.players) {
            if (teamIdsIndex.get(player.teamId) === undefined) {
              const a = [] as any[]
              teamIdsIndex.set(player.teamId, playerData.length)
              a.push({
                character: characterUtils.getCharacterName(player.characterId),
                color: characterUtils.getCharacterColorName(
                  player.characterId,
                  player.characterColor
                ),
                playerId: player.playerIndex,
                port: player.port
              })
              playerData.push(a)
            } else {
              playerData[teamIdsIndex.get(player.teamId) as number].push({
                character: characterUtils.getCharacterName(player.characterId),
                color: characterUtils.getCharacterColorName(
                  player.characterId,
                  player.characterColor
                ),
                playerId: player.playerIndex,
                port: player.port
              })
            }
          }
        }
        gameState.settings = settings
        const newData: SlippiGameData = {
          isTeams: settings.isTeams,
          players: playerData
        }
        if (!this.isSameGame(this.players, newData)) {
          this.browserWindow?.webContents.send('slippi:new-game-start-data', newData)
        }
        this.players = newData
      }

      if (gameEnd) {
        console.log('game ended')
        // console.log(gameEnd)

        // NOTE: These values and the quitter index will not work until 2.0.0 recording code is
        // NOTE: used. This code has not been publicly released yet as it still has issues
        const endTypes = {
          1: 'TIME!',
          2: 'GAME!',
          7: 'No Contest'
        }

        const endMessage = _.get(endTypes, gameEnd.gameEndMethod) || 'Unknown'
        if (gameEnd.gameEndMethod !== 7) {
          const winner = gameEnd.placements.find((player) => player.position === 0)
          if (winner)
            this.browserWindow?.webContents.send('slippi:new-game-end-data', winner.playerIndex)
        }
        const lrasText =
          gameEnd.gameEndMethod === 7 ? ` | Quitter Index: ${gameEnd.lrasInitiatorIndex}` : ''
        console.log(`[Game Complete] Type: ${endMessage}${lrasText}`)
        gameState = {}
        settings = {}
        gameEnd = {}
      }
    })
  }
}
