import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createObsScenesSlice, ObsScenesSlice } from './slices/obsScenesSlice'

export const useSettingsStore = create<ObsScenesSlice>()(immer((...a) => ({
    ...createObsScenesSlice(...a)
})));