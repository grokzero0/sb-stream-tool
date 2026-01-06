import { StateCreator } from 'zustand'
import { StoreSliceType } from './slice'

export type SlippiSlice = {
  relayStatus: 'disabled' | 'folder' | 'direct'
  directory: string
  ip: string
  port: string
  consoleConnection: boolean
  updateRelayStatus: (newRelayStatus: 'disabled' | 'folder' | 'direct') => void
  updateDirectory: (newDirectory: string) => void
  updateConsoleConnection: (enabled: boolean) => void
}
// https://github.com/pmndrs/zustand/discussions/676
export const createSlippiSlice: StateCreator<
  StoreSliceType,
  [['zustand/immer', never]],
  [],
  SlippiSlice
> = (set) => ({
  relayStatus: 'disabled',
  directory: '',
  ip: '',
  port: '',
  consoleConnection: false,
  updateDirectory: (newDirectory: string) =>
    set((state) => {
      state.directory = newDirectory
    }),
  updateRelayStatus: (newRelayStatus: 'disabled' | 'folder' | 'direct') =>
    set((state) => {
      state.relayStatus = newRelayStatus
    }),
  updateConsoleConnection: (enabled: boolean) =>
    set((state) => {
      state.consoleConnection = enabled
    })
})
