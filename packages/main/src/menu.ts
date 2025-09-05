import { BrowserWindow, Menu, shell } from "electron";
import { ObsController } from "./ObsController.js";
import { getApiKey } from "./helpers.js";

export function buildMenu(browserWindow: BrowserWindow, obs: ObsController) {
  const menu = Menu.buildFromTemplate([
    {
      label: "Game",
      submenu: [
        {
          label: "Melee",
          click: () => browserWindow.webContents.send("swap-to-game", "melee"),
          type: "radio",
        },
        {
          label: "P+",
          click: () => browserWindow.webContents.send("swap-to-game", "p+"),
          type: "radio",
        },
        {
          label: "etc",
          click: () => browserWindow.webContents.send("swap-to-game", "etc"),
          type: "radio",
        },
      ],
    },
    {
      label: "File",
      submenu: [
        {
          label: "Settings",
          click: () => browserWindow.webContents.send("navigation", "settings"),
        },
        {
          role: "quit",
        },
      ],
    },
    {
      label: "OBS",
      submenu: [
        {
          label: "Play game start scenes",
          click: () => obs.playScenes("game-start"),
          accelerator: "Control+F1",
        },
        {
          label: "Play game end scenes",
          click: () => obs.playScenes("game-end"),
          accelerator: "Control+F2",
        },
        {
          label: "Play set end scenes",
          click: () => obs.playScenes("set-end"),
          accelerator: "Control+F3",
        },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { role: "resetZoom" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [{ role: "minimize" }],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Learn More",
          click: () =>
            shell.openExternal("https://www.youtube.com/watch?v=t7W4NJjfFMg"),
          accelerator: "Control+F11",
        },
        {
          label: "Actually Learn More",
          click: () =>
            shell.openExternal("https://www.youtube.com/watch?v=pufA00QrXog"),
          accelerator: "Control+F12",
        },
        {
          label: "Test",
          click: getApiKey,
          // accelerator: "Control+F12",
        },
      ],
    },
  ]);
  return menu;
}
