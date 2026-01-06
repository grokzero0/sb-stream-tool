/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlippiGame, characters as characterUtils } from '@slippi/slippi-js/node'
import { BrowserWindow } from 'electron'
import chokidar, { FSWatcher } from 'chokidar'
import * as _ from 'lodash-es'
import { EventStream } from './observer'

export class SlippiRelayHandler extends EventStream {
  private browserWindow?: BrowserWindow | null
  private watcher?: FSWatcher | null
  private listenPath: string | null
  private ip: string | null
  private port: string | null
  constructor() {
    super()
    this.browserWindow = null
    this.watcher = null
    this.listenPath = null
    this.ip = null
    this.port = null
  }

  async setBrowserWindow(browserWindow: BrowserWindow): Promise<void> {
    this.browserWindow = browserWindow
  }

  async setWiiPort(newPort: string): Promise<void> {
    this.port = newPort
  }

  async setWiiIp(newIp: string): Promise<void> {
    this.ip = newIp
  }

  async stop(): Promise<void> {
    console.log(this.ip)
    console.log(this.port)
    if (this.listenPath) {
      this.watcher?.unwatch(this.listenPath)
      this.watcher?.close()
      this.listenPath = null
    }
    this.notify('Slippi Relay', 'Stopped Relay')
  }

  async setup(newListenPath: string): Promise<void> {
    this.browserWindow?.webContents.send('toast-message', 'slippi-test-read')
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

  async read(): Promise<void> {
    const gameByPath = {}
    const gameState: Record<string, any> = {}
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
        gameState.settings = settings
      }

      _.forEach(settings.players, (player) => {
        console.log(
          `${characterUtils.getCharacterName(player.characterId)}, ${characterUtils.getCharacterColorName(player.characterId, player.characterColor)} [Port ${player.port}] `
        )
      })

      if (gameEnd) {
        console.log('game ended')
        console.log(gameEnd)
        // NOTE: These values and the quitter index will not work until 2.0.0 recording code is
        // NOTE: used. This code has not been publicly released yet as it still has issues
        const endTypes = {
          1: 'TIME!',
          2: 'GAME!',
          7: 'No Contest'
        }

        const endMessage = _.get(endTypes, gameEnd.gameEndMethod) || 'Unknown'

        const lrasText =
          gameEnd.gameEndMethod === 7 ? ` | Quitter Index: ${gameEnd.lrasInitiatorIndex}` : ''
        console.log(`[Game Complete] Type: ${endMessage}${lrasText}`)
      }
    })
    console.log('Done')
  }
}
