import { ipcMain } from "electron";
// import { ObsController } from "./components/ObsController.js";
import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./types.js";
// import { FileHandler } from "./components/FileHandler.js";
// import { SlippiRelayHandler } from "./components/SlippiRelayHandler.js";
// import { ObsScene, Tournament } from "@app/common";
import { createHandlers } from "./handlers.js";

export function ipcSetup(
  mainSocket: Socket<ServerToClientEvents, ClientToServerEvents>,
): void {
  const handlers = createHandlers(mainSocket);
  Object.entries(handlers).forEach(([channel, fn]) => {
    ipcMain.handle(channel, (_event, ...args) => fn(...args));
  });
  // ipcMain.handle(
  //   "obs/connect",
  //   (_event, ip: string, port: string, password: string) => {
  //     ObsController.connect("ws://", ip, port, password);
  //   },
  // );

  // ipcMain.handle("overlay/update", (_event, newData: Tournament) => {
  //   mainSocket.emit("sendDataToServer", newData);
  //   FileReaderWriter.writeData(newData);
  // });

  // ipcMain.handle(
  //   "obs/update-scenes",
  //   (
  //     _event,
  //     gameStartScenes: ObsScene[],
  //     gameEndScenes: ObsScene[],
  //     setEndScenes: ObsScene[],
  //   ) => {
  //     obs.updateScenes(gameStartScenes, gameEndScenes, setEndScenes);
  //   },
  // );

  // ipcMain.handle("obs/play-game-start-scenes", () =>
  //   obs.playScenes("game-start"),
  // );

  // ipcMain.handle("obs/play-game-end-scenes", () => obs.playScenes("game-end"));

  // ipcMain.handle("obs/play-set-end-scenes", () => obs.playScenes("set-end"));

  // ipcMain.handle(
  //   "startgg/get-api-key",
  //   async () => await fileDataManager.getApiKey(),
  // );

  // ipcMain.handle("startgg/update-api-key", (_event, newApiKey) =>
  //   fileDataManager.writeApiKey(newApiKey),
  // );

  // ipcMain.handle("shortcuts/update-shortcuts", (_event, newSettings) =>
  //   fileDataManager.writeShortcutSettings(newSettings),
  // );

  // ipcMain.handle("file:openDialog", async () => {
  //   const { canceled, filePaths } = await dialog.showOpenDialog({
  //     properties: ["openDirectory"],
  //   });
  //   if (canceled) {
  //     return "";
  //   } else {
  //     return filePaths[0];
  //   }
  // });

  // ipcMain.handle("link/open", (_event, link: string) =>
  //   shell.openExternal(link),
  // );

  // ipcMain.handle("slippi:readFolder", (_event, listenPath) => {
  //   slippi.setup(listenPath);
  // });

  // //   ipcMain.handle("slippi:stopReadingFolder", () => slippi.stop(false));

  // //   ipcMain.handle("slippi:autoStopReadingFolder", () => slippi.stop(true));
}
