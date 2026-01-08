import { SlippiGameData } from './types'
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    electronAPI: ElectronAPI
    // api: unknown
  }
}

export interface ElectronAPI {
  send: (channel: string, ...args: any[]) => Promise<any>
  navigation: (callback: (location: string) => void) => void
  toastMessage: (callback: (message?: string, description?: string) => void) => void
  onNewSlippiGameData: (callback: (data: SlippiGameData) => void) => void
  onNewSlippiGameEndData: (callback: (winner: number) => void) => void
  updateOverlay: (data: TournamentState) => void
  clearAllListeners: (channel: string) => void
}
