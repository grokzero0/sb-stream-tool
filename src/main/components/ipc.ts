import { dialog, ipcMain } from 'electron'
import { ObsController } from '../ObsController'
import { Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents } from '../types'
import { ObsScene, TournamentState } from '../types'
import { FileReaderWriter } from './FileReaderWriter'
import { SlippiFileMonitor } from './slippi'

export function ipcSetup(
  mainSocket: Socket<ServerToClientEvents, ClientToServerEvents>,
  obs: ObsController,
  fileDataManager: FileReaderWriter,
  fileMonitor: SlippiFileMonitor
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

  ipcMain.handle('file:openDialog', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (canceled) {
      return ''
    } else {
      return filePaths[0]
    }
  })

  ipcMain.handle('slippi:readDirectory', (_event, listenPath) => fileMonitor.setup(listenPath))
}
