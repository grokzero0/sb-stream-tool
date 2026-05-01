import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";
import { createObsScenesSlice } from "./slices/obsScenesSlice";
import { createStartggSlice } from "./slices/startggSlice";
import { type StoreSliceType } from "./slices/slice";
import { createSlippiSlice } from "./slices/slippiSlice";
import { createObsWebsocketSlice } from "./slices/obsWebsocketSlice";
import { send } from "@app/preload";
import { createEventSlice } from "./slices/eventSlice";
import {
  createShortcutsSlice,
  defaultShortcuts,
} from "./slices/shortcutsSlice";
import { enableMapSet } from "immer";
import {
  ObsScene,
  ObsSceneSettings,
  ObsWebsocketSettings,
  ShortcutSettings,
  SlippiRelaySettings,
} from "@app/common";
import { Hotkey } from "@tanstack/react-hotkeys";

enableMapSet();

export const useSettingsStore = create<StoreSliceType>()(
  subscribeWithSelector(
    immer((...a) => ({
      ...createObsScenesSlice(...a),
      ...createStartggSlice(...a),
      ...createSlippiSlice(...a),
      ...createObsWebsocketSlice(...a),
      ...createEventSlice(...a),
      ...createShortcutsSlice(...a),
    })),
  ),
);

// restore settings
// https://github.com/pmndrs/zustand/discussions/676
send("startgg/get-api-key")
  .then((key: string) => {
    useSettingsStore.setState({ startggApiKey: key });
  })
  .catch((reason) => console.log(reason));

send("shortcuts/get-shortcuts")
  .then((shortcutsList: ShortcutSettings | undefined) => {
    if (shortcutsList === undefined) return;
    shortcutsList.forEach((shortcut) =>
      defaultShortcuts.set(shortcut.action, shortcut.hotkey as Hotkey),
    );
    useSettingsStore.setState({ shortcuts: defaultShortcuts });
  })
  .catch((reason) => console.log(reason));

send("obs/get-settings")
  .then(
    (settings: {
      websocket: ObsWebsocketSettings | undefined;
      scenes: ObsSceneSettings | undefined;
    }) => {
      if (settings.websocket === undefined) return;
      useSettingsStore.setState({
        websocketIp: settings.websocket.ip,
        websocketPort: settings.websocket.port,
      });

      if (settings.scenes === undefined) return;

      const scenesList = {
        gameStartScenes: [] as ObsScene[],
        gameEndScenes: [] as ObsScene[],
        setEndScenes: [] as ObsScene[],
      };

      settings.scenes.forEach((scene) => {
        switch (scene.type) {
          case "game-start":
            scenesList.gameStartScenes.push(scene.scene);
            break;
          case "game-end":
            scenesList.gameEndScenes.push(scene.scene);
            break;
          case "set-end":
            scenesList.setEndScenes.push(scene.scene);
            break;
          default:
            throw new Error(
              `UNKNOWN TYPE, idk how you even got this on a known typed value`,
            );
        }

        useSettingsStore.setState({
          gameStartScenes: scenesList.gameStartScenes,
          gameEndScenes: scenesList.gameEndScenes,
          setEndScenes: scenesList.setEndScenes,
        });
      });
    },
  )
  .catch((reason) => console.log(reason));

send("slippi-relay/get-settings")
  .then((settings: SlippiRelaySettings | undefined) => {
    if (settings === undefined) return;
    useSettingsStore.setState({
      slippiRelayStatus: settings.relayStatus,
      slippiRelayDirectory: settings.directory,
      slippiRelayIp: settings.ip,
      slippiRelayPort: settings.port,
    });
  })
  .catch((error) => console.log(error));
