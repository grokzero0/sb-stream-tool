import { ipcMain } from "electron";
import type { TournamentState } from "../../../types/tournament.js";
import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./modules/Socketio/types.js";
import { ObsController } from "./ObsController.js";
import { ObsScene } from "../../../types/obs.js";
import { writeToFiles } from "./helpers.js";

export function ipcSetup(
  mainSocket: Socket<ServerToClientEvents, ClientToServerEvents>,
  obs: ObsController
) {
  ipcMain.handle(
    "obs/connect",
    (_event, ip: string, port: string, password: string) => {
      console.log("Connecting to OBS");
      obs.connect("ws://", ip, port, password);
    }
  );

  ipcMain.handle("overlay/update", (_event, newData: TournamentState) => {
    console.log("overlay/update");
    // console.log(newData);
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

  ipcMain.handle("obs/play-game-start-scenes", () =>
    obs.playScenes("game-start")
  );

  ipcMain.handle("obs/play-game-end-scenes", () => obs.playScenes("game-end"));

  ipcMain.handle("obs/play-set-end-scenes", () => obs.playScenes("set-end"));
}
