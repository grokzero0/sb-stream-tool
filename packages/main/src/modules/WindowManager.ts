import type { AppModule } from "../AppModule.js";
import { ModuleContext } from "../ModuleContext.js";
import { BrowserWindow, Menu } from "electron";
import type { AppInitConfig } from "../AppInitConfig.js";
import { Socket, io } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./Socketio/types.js";
import { ObsController } from "../ObsController.js";
import { buildMenu } from "../menu.js";
import { ipcSetup } from "../ipc.js";
import { ToastMessageCommunicator } from "../ToastMessageCommunication.js";
import path, { join } from "node:path";
import { FileReaderWriter } from "../FileReaderWriter.js";

class WindowManager implements AppModule {
  readonly #preload: { path: string };
  readonly #renderer: { path: string } | URL;
  readonly #openDevTools;
  private obs: ObsController;
  private dataFileManager: FileReaderWriter;
  private mainSocket: Socket<ServerToClientEvents, ClientToServerEvents>;
  private game: string;

  constructor({
    initConfig,
    openDevTools = false,
  }: {
    initConfig: AppInitConfig;
    openDevTools?: boolean;
  }) {
    this.#preload = initConfig.preload;
    this.#renderer = initConfig.renderer;
    this.#openDevTools = openDevTools;
    this.obs = new ObsController();
    this.dataFileManager = new FileReaderWriter();
    this.obs.initEvents();
    this.mainSocket = io("http://localhost:20242");
    this.game = "melee";
  }

  async enable({ app }: ModuleContext): Promise<void> {
    await app.whenReady();
    ipcSetup(this.mainSocket, this.obs, this.dataFileManager);
    await this.restoreOrCreateWindow(true);
    app.on("second-instance", () => this.restoreOrCreateWindow(true));
    app.on("activate", () => this.restoreOrCreateWindow(true));
  }

  async createWindow(): Promise<BrowserWindow> {
    console.log(import.meta.filename);
    const browserWindow = new BrowserWindow({
      show: false, // Use the 'ready-to-show' event to show the instantiated BrowserWindow.
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false, // Sandbox disabled because the demo of preload script depend on the Node.js api
        webviewTag: false, // The webview tag is not recommended. Consider alternatives like an iframe or Electron's BrowserView. @see https://www.electronjs.org/docs/latest/api/webview-tag#warning
        preload: this.#preload.path,
      },
      icon: join(import.meta.dirname, "..", "src", "assets", "icon.ico"),
    });

    // observer model putting to good use ig
    const toast = new ToastMessageCommunicator(browserWindow);
    this.obs.attach(toast);
    this.dataFileManager.attach(toast);

    const menu = buildMenu(browserWindow, this.obs);
    Menu.setApplicationMenu(menu);

    if (this.#renderer instanceof URL) {
      await browserWindow.loadURL(this.#renderer.href);
    } else {
      await browserWindow.loadFile(this.#renderer.path);
    }

    return browserWindow;
  }

  async restoreOrCreateWindow(show = false) {
    let window = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());

    if (window === undefined) {
      window = await this.createWindow();
    }

    if (!show) {
      return window;
    }

    if (window.isMinimized()) {
      window.restore();
    }

    window?.show();

    if (this.#openDevTools) {
      window?.webContents.openDevTools();
    }

    window.focus();

    return window;
  }
}

export function createWindowManagerModule(
  ...args: ConstructorParameters<typeof WindowManager>
) {
  return new WindowManager(...args);
}
