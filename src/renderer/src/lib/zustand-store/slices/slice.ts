import { ObsScenesSlice } from './obsScenesSlice'
import { ObsWebsocketSlice } from './obsWebsocketSlice'
import { SlippiSlice } from './slippiSlice'
import { StartggSlice } from './startggSlice'

export type StoreSliceType = ObsScenesSlice & StartggSlice & SlippiSlice & ObsWebsocketSlice
