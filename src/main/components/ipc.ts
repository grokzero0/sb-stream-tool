import { ipcMain } from 'electron'
import { ObsController } from '../ObsController'
import { Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents } from '../types'
import { ObsScene, TournamentState } from '../types'
import { FileReaderWriter } from './FileReaderWriter'

export function ipcSetup(
  mainSocket: Socket<ServerToClientEvents, ClientToServerEvents>,
  obs: ObsController,
  fileDataManager: FileReaderWriter
): void {
  ipcMain.handle('obs/connect', (_event, ip: string, port: string, password: string) => {
    obs.connect('ws://', ip, port, password)
  })

  ipcMain.handle('overlay/update', (_event, newData: TournamentState) => {
    mainSocket.emit('sendDataToServer', newData)
    fileDataManager.writeData(newData)
  })

  ipcMain.handle(
    'obs/update-scenes',
    (_event, gameStartScenes: ObsScene[], gameEndScenes: ObsScene[], setEndScenes: ObsScene[]) => {
      obs.updateScenes(gameStartScenes, gameEndScenes, setEndScenes)
    }
  )

  ipcMain.handle('obs/play-game-start-scenes', () => obs.playScenes('game-start'))

  ipcMain.handle('obs/play-game-end-scenes', () => obs.playScenes('game-end'))

  ipcMain.handle('obs/play-set-end-scenes', () => obs.playScenes('set-end'))

  ipcMain.handle('startgg/get-api-key', async () => await fileDataManager.getApiKey())

  ipcMain.handle('startgg/update-api-key', (_event, newApiKey) =>
    fileDataManager.writeApiKey(newApiKey)
  )

  //   ipcMain.handle('slippi/connect', (_event, address, slpPort) =>
  //     slpRealtime.connect(address, slpPort)
  //   )
}
