import { type EventSlice } from "./eventSlice";
import { type ShortcutsSlice } from "./shortcutsSlice";
import { type ObsScenesSlice } from "./obsScenesSlice";
import { type ObsWebsocketSlice } from "./obsWebsocketSlice";
import { type SlippiRelaySlice } from "./slippiSlice";
import { type StartggSlice } from "./startggSlice";

export type StoreSliceType = ObsScenesSlice &
  StartggSlice &
  SlippiRelaySlice &
  ObsWebsocketSlice &
  EventSlice &
  ShortcutsSlice;
