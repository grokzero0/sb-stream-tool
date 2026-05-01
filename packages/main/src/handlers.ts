import { Socket } from "socket.io-client";
import { FileHandler } from "./components/FileHandler.js";
import { ObsController } from "./components/ObsController.js";
import { SlippiRelayHandler } from "./components/SlippiRelayHandler.js";
import { ClientToServerEvents, ServerToClientEvents } from "./types.js";
import {
  ObsScene,
  ObsSceneSettings,
  ObsWebsocketSettings,
  ShortcutSettings,
  SlippiRelaySettings,
  Tournament,
} from "@app/common";
import { dialog, shell } from "electron";

export type SharedRegistry = {
  [key: string]: (...args: any[]) => Promise<any> | any;
};

export function createHandlers(
  mainSocket: Socket<ServerToClientEvents, ClientToServerEvents>,
  //   obs: ObsController,
  //   fileDataManager: FileReaderWriter,
  //   slippi: SlippiRelayHandler,
): SharedRegistry {
  return {
    "obs/connect": (ip: string, port: string, password: string) => {
      ObsController.connect("ws://", ip, port, password);
    },

    "obs/update-scenes": (
      gameStartScenes: ObsScene[],
      gameEndScenes: ObsScene[],
      setEndScenes: ObsScene[],
    ) => {
      ObsController.updateScenes(gameStartScenes, gameEndScenes, setEndScenes);
    },

    "overlay/update": (newData: Tournament) => {
      mainSocket.emit("sendDataToServer", newData);
      FileHandler.writeData(newData);
    },

    "obs/play-game-start-scenes": () => ObsController.playScenes("game-start"),

    "obs/play-game-end-scenes": () => ObsController.playScenes("game-end"),

    "obs/play-set-end-scenes": () => ObsController.playScenes("set-end"),

    "obs/save-websocket-settings": (newSettings: ObsWebsocketSettings) =>
      FileHandler.writeObsWebsocketSettings(newSettings),

    "obs/get-settings": () => FileHandler.getObsSettings(),

    "obs/save-scenes": (newScenes: ObsSceneSettings) =>
      FileHandler.writeObsScenes(newScenes),

    "startgg/get-api-key": async () => FileHandler.getApiKey(),

    "startgg/update-api-key": (newApiKey: string) =>
      FileHandler.writeApiKey(newApiKey),

    "shortcuts/get-shortcuts": async () => FileHandler.getShortcuts(),

    "shortcuts/save-shortcuts": (newSettings: ShortcutSettings) =>
      FileHandler.writeShortcutSettings(newSettings),

    "file:openDialog": async () => {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openDirectory"],
      });
      if (canceled) {
        return "";
      } else {
        return filePaths[0];
      }
    },

    "link/open": (link: string) => shell.openExternal(link),

    "slippi-relay/read-folder": (listenPath: string) => {
      SlippiRelayHandler.setup(listenPath);
    },

    "slippi-relay/stop-reading-folder": () => {
      SlippiRelayHandler.stop(false);
    },

    "slippi-relay/auto-stop-reading-folder": () => {
      SlippiRelayHandler.stop(true);
    },

    "slippi-relay/save-settings": (newSettings: SlippiRelaySettings) => {
      FileHandler.writeSlippiRelaySettings(newSettings);
    },

    "slippi-relay/get-settings": () => FileHandler.getSlippiRelaySettings(),
  };
}
