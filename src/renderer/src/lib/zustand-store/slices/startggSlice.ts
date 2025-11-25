import { StateCreator } from 'zustand'
import { StoreSliceType } from './slice'

export type StartggSlice = {
  apiKey: string
  tournamentUrl: string
  tournamentSlug: string
  updateTournamentUrl: (newUrl: string) => void
  updateKey: (newApiKey: string) => void
}
// https://github.com/pmndrs/zustand/discussions/676
export const createStartggSlice: StateCreator<
  StoreSliceType,
  [['zustand/immer', never]],
  [],
  StartggSlice
> = (set) => ({
  apiKey: '',
  tournamentUrl: '',
  tournamentSlug: '',
  updateTournamentUrl: (newUrl) =>
    set((state) => {
      state.tournamentUrl = newUrl
      state.tournamentSlug = new URL(newUrl).pathname.split('/').slice(1, 5).join('/')
    }),
  updateKey: (newApiKey) =>
    set((state) => {
      state.apiKey = newApiKey
      // toast api key
      window.electronAPI.send('startgg/update-api-key', newApiKey)
    })
})
