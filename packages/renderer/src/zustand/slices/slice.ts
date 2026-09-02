import { type EventSlice } from "./eventSlice";
import { type ShortcutsSlice } from "./shortcutsSlice";
import { type ObsScenesSlice } from "./obsScenesSlice";
import { type ObsWebsocketSlice } from "./obsWebsocketSlice";
import { type SlippiRelaySlice } from "./slippiRelaySlice";
import { type PlatformSlice } from "./platformSlice";
import { ZustandStateSlice } from "./zustandStateSlice";

export type StoreSliceType = ObsScenesSlice &
  PlatformSlice &
  SlippiRelaySlice &
  ObsWebsocketSlice &
  EventSlice &
  ZustandStateSlice &
  ShortcutsSlice;
