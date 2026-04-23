import { type EventSlice } from "./eventSlice";
import { type ShortcutsSlice } from "./shortcutsSlice";
import { type ObsScenesSlice } from "./obsScenesSlice";
import { type ObsWebsocketSlice } from "./obsWebsocketSlice";
import { type SlippiSlice } from "./slippiSlice";
import { type StartggSlice } from "./startggSlice";

export type StoreSliceType = ObsScenesSlice &
  StartggSlice &
  SlippiSlice &
  ObsWebsocketSlice &
  EventSlice &
  ShortcutsSlice;
