import { TournamentState } from '../../../types/tournament.js';
// import {sha256sum} from './nodeCrypto.js';
// import {versions} from './versions.js';
import {ipcRenderer} from 'electron';

function send(channel: string, ...args: any[]) {
  return ipcRenderer.invoke(channel, ...args);
}

function asyncSend(channel: string, ...args: any[]) {
  return ipcRenderer.send(channel, ...args);
}

function navigation(callback: (location: string) => void) {
  return ipcRenderer.on("navigation", (_event, location) => callback(location));
}

function updateOverlay(data: TournamentState) {
  return ipcRenderer.invoke("overlay/update", data)
} 

export { send, asyncSend, navigation, updateOverlay };
