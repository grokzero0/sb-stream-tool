/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer } from 'electron'
import { SlippiGameData } from './types'
import { TournamentState } from '../common/types'
const api = {
  send: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
  updateOverlay: (data: TournamentState) => ipcRenderer.invoke('overlay/update', data),
  navigation: (callback: (location: string) => void) =>
    ipcRenderer.on('navigation', (_event, location) => callback(location)),
  toastMessage: (callback: (message?: string, description?: string) => void) =>
    ipcRenderer.on('toast-message', (_event, message, description) =>
      callback(message, description)
    ),
  slippiGameDataReceived: (callback: (data: SlippiGameData) => void) =>
    ipcRenderer.on('slippi:new-game-start-data', (_event, data) => callback(data)),
  slippiGameEnded: (callback: (winner: number) => void) =>
    ipcRenderer.on('slippi:new-game-end-data', (_event, winner) => callback(winner)),
  clearAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  // window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.electronAPI = api
}
