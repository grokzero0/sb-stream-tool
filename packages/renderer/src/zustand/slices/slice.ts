import { type EventSlice } from "./eventSlice";
import { type ShortcutsSlice } from "./shortcutsSlice";
import { type ObsScenesSlice } from "./obsScenesSlice";
import { type ObsWebsocketSlice } from "./obsWebsocketSlice";
import { type SlippiRelaySlice } from "./slippiRelaySlice";
import { type StartggSlice } from "./startggSlice";
import { ZustandStateSlice } from "./zustandStateSlice";

export type StoreSliceType = ObsScenesSlice &
  StartggSlice &
  SlippiRelaySlice &
  ObsWebsocketSlice &
  EventSlice &
  ZustandStateSlice &
  ShortcutsSlice;
