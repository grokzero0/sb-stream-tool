import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { subscribeWithSelector } from 'zustand/middleware'
import { createObsScenesSlice } from './slices/obsScenesSlice'
import { createStartggSlice } from './slices/startggSlice'
import { StoreSliceType } from './slices/slice'
import { createSlippiSlice } from './slices/slippiSlice'

export const useSettingsStore = create<StoreSliceType>()(
  subscribeWithSelector(
    immer((...a) => ({
      ...createObsScenesSlice(...a),
      ...createStartggSlice(...a),
      ...createSlippiSlice(...a)
    }))
  )
)

// https://github.com/pmndrs/zustand/discussions/676
window.electronAPI.send('startgg/get-api-key').then((apiKey) => {
  useSettingsStore.setState({ apiKey: apiKey || '' })
})
