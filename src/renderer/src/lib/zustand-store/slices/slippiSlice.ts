import { StateCreator } from 'zustand'
import { StoreSliceType } from './slice'

export type SlippiSlice = {
  directory: string
  ip: string
  port: string
  consoleConnection: boolean
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
  directory: '',
  ip: '',
  port: '',
  consoleConnection: false,
  updateDirectory: (newDirectory: string) =>
    set((state) => {
      state.directory = newDirectory
    }),
  updateConsoleConnection: (enabled: boolean) =>
    set((state) => {
      state.consoleConnection = enabled
    })
})
