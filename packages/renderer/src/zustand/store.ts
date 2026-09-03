/* eslint-disable no-useless-escape */
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";
import { createObsScenesSlice } from "./slices/obsScenesSlice";
import { createStartggSlice } from "./slices/startggSlice";
import { type StoreSliceType } from "./slices/slice";
import { createSlippiRelaySlice } from "./slices/slippiRelaySlice";
import { createObsWebsocketSlice } from "./slices/obsWebsocketSlice";
import { send } from "@app/preload";
import { createEventSlice } from "./slices/eventSlice";
import { createShortcutsSlice } from "./slices/shortcutsSlice";
import { enableMapSet } from "immer";
import {
  Action,
  ObsScene,
  ObsSceneSettings,
  ObsWebsocketSettings,
  ShortcutSettings,
  SlippiRelaySettings,
  // SlippiRelaySettings,
} from "@app/common";
import { Hotkey } from "@tanstack/react-hotkeys";
import { createZustandStateSlice } from "./slices/zustandStateSlice";

enableMapSet();

export const useSettingsStore = create<StoreSliceType>()(
  subscribeWithSelector(
    immer((...a) => ({
      ...createObsScenesSlice(...a),
      ...createStartggSlice(...a),
      ...createSlippiRelaySlice(...a),
      ...createObsWebsocketSlice(...a),
      ...createEventSlice(...a),
      ...createShortcutsSlice(...a),
      ...createZustandStateSlice(...a),
    })),
  ),
);

// restore settings
// https://github.com/pmndrs/zustand/discussions/676
Promise.all([
  send("startgg/get-api-key")
    .then((key: string) => {
      useSettingsStore.setState({ startggApiKey: key });
    })
    .catch((error) => console.log(error)),
  send("shortcuts/get-shortcuts")
    .then((shortcutsList: ShortcutSettings | undefined) => {
      if (shortcutsList === undefined) return;
      const retrievedShortcuts = new Map<Action, Hotkey>();
      shortcutsList.forEach((shortcut) =>
        retrievedShortcuts.set(shortcut.action, shortcut.hotkey as Hotkey),
      );
      useSettingsStore.setState({ shortcuts: retrievedShortcuts });
    })
    .catch((error) => console.log(error)),
  send("obs/get-settings")
    .then(
      (settings: {
        websocket: ObsWebsocketSettings | undefined;
        scenes: ObsSceneSettings | undefined;
      }) => {
        if (settings.websocket !== undefined) {
          useSettingsStore.setState({
            websocketIp: settings.websocket.ip,
            websocketPort: settings.websocket.port,
          });
        }

        if (settings.scenes !== undefined) {
          const gameStartScenes = [] as ObsScene[];
          const gameEndScenes = [] as ObsScene[];
          const setEndScenes = [] as ObsScene[];

          settings.scenes.forEach((scene) => {
            switch (scene.type) {
              case "game-start":
                gameStartScenes.push(scene.scene);
                break;
              case "game-end":
                gameEndScenes.push(scene.scene);
                break;
              case "set-end":
                setEndScenes.push(scene.scene);
                break;
              default:
                throw new Error(
                  `UNKNOWN TYPE, idk how you even got this on a known typed value`,
                );
            }
          });
          useSettingsStore.setState({
            gameStartScenes: gameStartScenes,
            gameEndScenes: gameEndScenes,
            setEndScenes: setEndScenes,
          });
        }
      },
    )
    .catch((error) => console.log(error)),
  send("slippi-relay/get-settings")
    .then((settings: SlippiRelaySettings | undefined) => {
      console.log("yess")
      console.log(settings)
      if (settings === undefined) return;
      useSettingsStore.setState({
        slippiRelayStatus: settings.relayStatus,
        slippiRelayDirectory: settings.directory,
        slippiWiiRelayIp: settings.wiiIp,
        slippiWiiRelayPort: settings.wiiPort,
        slippiDolphinRelayIp: settings.dolphinIp,
        slippiDolphinRelayPort: settings.dolphinPort,
      });
    })
    .catch((error) => console.log(error)),
  send("startgg/get-tournament-url")
    .then((url: string) => {
      const regex =
        /^https:\/\/(?:www\.)?start\.gg\/tournament\/([^\/?#]+)\/event\/([^\/?#]+)(?:[\/?#].*)?$/;
      const match = url.match(regex);
      if (!match) return;
      const [, tournamentSlug, eventSlug] = match;
      useSettingsStore.setState({
        eventUrl: url,
        eventSlug: `tournament/${tournamentSlug}/event/${eventSlug}`,
      });
    })
    .catch((error) => console.log(error)),
])
  .then(() => useSettingsStore.setState({ isIpcHydrated: true }))
  .catch((error) => {
    useSettingsStore.setState({ isIpcHydrated: false });
    console.log(error);
  });
