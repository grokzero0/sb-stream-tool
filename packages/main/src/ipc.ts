import { ipcMain } from "electron";
import type { TournamentState } from './tournament-types.js'
import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./socketio/types.js";
import { ObsController, ObsScene } from "./ObsController.js";
import { writeToFiles } from "./helpers.js";

export function ipcSetup(
  mainSocket: Socket<ServerToClientEvents, ClientToServerEvents>,
  obs: ObsController
) {
  ipcMain.handle(
    "obs/connect",
    (_event, ip: string, port: string, password: string) => {
      console.log("obs");
      console.log(ip);
      console.log(port);
      console.log(password);
    }
  );

  ipcMain.handle("overlay/update", (_event, newData: TournamentState) => {
    console.log("overlay/update");
    console.log(newData);
    mainSocket.emit("sendDataToServer", newData);
    writeToFiles(newData);
  });

  ipcMain.handle(
    "obs/update-scenes",
    (
      _event,
      gameStartScenes: ObsScene[],
      gameEndScenes: ObsScene[],
      setEndScenes: ObsScene[]
    ) => {
      obs.updateScenes(gameStartScenes, gameEndScenes, setEndScenes);
    }
  );

  ipcMain.handle("obs/play-game-start-scenes", () => obs.playGameStartScenes());
  
  ipcMain.handle("obs/play-game-end-scenes", () => obs.playGameEndScenes());
  
  ipcMain.handle("obs/play-set-end-scenes", () => obs.playSetEndScenes());
}
