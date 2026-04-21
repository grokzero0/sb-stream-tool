// import { sha256sum } from "./nodeCrypto.js";
// import { versions } from "./versions.js";
import { SlippiGameData, Tournament } from "@app/common";
import { ipcRenderer } from "electron";

function send(channel: string, ...args: any[]) {
  return ipcRenderer.invoke(channel, ...args);
}

function navigation(callback: (location: string) => void) {
  ipcRenderer.on("navigation", (_event, location) => callback(location));
}

function toastMessage(
  callback: (message?: string, description?: string) => void,
) {
  ipcRenderer.on("toast-message", (_event, message, description) =>
    callback(message, description),
  );
}

function updateOverlay(data: Tournament) {
  return ipcRenderer.invoke("overlay/update", data);
}

function clearAllListeners(channel: string) {
  ipcRenderer.removeAllListeners(channel);
}

function onNewSlippiGameData(callback: (data: SlippiGameData) => void) {
  ipcRenderer.on("slippi:new-game-start-data", (_event, data) =>
    callback(data),
  );
}

function onNewSlippiGameEndData(
  callback: (winner: { isTeams: boolean; winner: number }) => void,
) {
  ipcRenderer.on("slippi:new-game-end-data", (_event, winner) =>
    callback(winner),
  );
}

// function autoStopSlippiRelay() {
//   return ipcRenderer.invoke("slippi:autoStopReadingFolder");
// }

export {
  send,
  updateOverlay,
  navigation,
  toastMessage,
  onNewSlippiGameData,
  onNewSlippiGameEndData,
  clearAllListeners,
};
