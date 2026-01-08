import { StateCreator } from 'zustand'
import { StoreSliceType } from './slice'
import { SlippiPlayer } from 'src/common/types'

export type SlippiSlice = {
  relayStatus: 'disabled' | 'folder' | 'direct'
  directory: string
  ip: string
  port: string
  consoleConnection: boolean
  players: SlippiPlayer[][]
  setPlayers: (newData: SlippiPlayer[][]) => void
  swap: (firstIndex: number, secondIndex: number) => void
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
  players: [] as SlippiPlayer[][],
  setPlayers: (newData) =>
    set((state) => {
      state.players = newData
    }),
  swap: (firstIndex, secondIndex) =>
    set((state) => {
      if (
        firstIndex >= state.players.length ||
        firstIndex < 0 ||
        secondIndex >= state.players.length ||
        secondIndex < 0
      ) {
        return
      }
      const first = state.players[firstIndex]
      state.players[firstIndex] = state.players[secondIndex]
      state.players[secondIndex] = first
    }),
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
