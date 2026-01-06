import { app, shell, BrowserWindow, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { ObsController } from './ObsController'
import { FileReaderWriter } from './components/FileReaderWriter'
import { ToastMessageCommunicator } from './components/ToastMessageCommunication'
import { buildMenu } from './components/menu'
import { ipcSetup } from './components/ipc'
import { ClientToServerEvents, ServerToClientEvents } from './types'
import { Socket, io } from 'socket.io-client'
import { SlippiRelayHandler } from './components/SlippiRelayHandler'

const obs = new ObsController()
const slippi = new SlippiRelayHandler()
const dataFileManager = new FileReaderWriter()
;(async () => {
  await dataFileManager.createDirs()
})()
const mainSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:20242')

obs.initEvents()
function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: false,
    icon: join(__dirname, '../../resources/icon.ico'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: false
    }
  })

  const toast = new ToastMessageCommunicator(mainWindow)
  obs.attach(toast)
  dataFileManager.attach(toast)
  slippi.attach(toast)
  slippi.setBrowserWindow(mainWindow)

  const menu = buildMenu(mainWindow, obs)
  Menu.setApplicationMenu(menu)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('sb-stream-tool')
  ipcSetup(mainSocket, obs, dataFileManager, slippi)
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  // ipcMain.handle('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
