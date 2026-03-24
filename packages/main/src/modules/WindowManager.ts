import type { AppModule } from "../AppModule.js";
import { ModuleContext } from "../ModuleContext.js";
import { BrowserWindow, Menu } from "electron";
import type { AppInitConfig } from "../AppInitConfig.js";
import { join } from "path";
import { buildMenu } from "../Menu.js";
import { ObsController } from "../components/ObsController.js";
import { FileReaderWriter } from "../components/FileReaderWriter.js";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../types.js";
import { SocketioServer } from "../components/SocketioServer.js";
import { ToastMessageCommunicator } from "../components/ToastMessageCommunication.js";
import { ipcSetup } from "../Ipc.js";

class WindowManager implements AppModule {
  readonly #preload: { path: string };
  readonly #renderer: { path: string } | URL;
  readonly #openDevTools;

  private obs: ObsController;
  private dataFileManager: FileReaderWriter;
  private websocketServer: SocketioServer;
  private mainSocket: Socket<ServerToClientEvents, ClientToServerEvents>;

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
    this.websocketServer = new SocketioServer();
    this.mainSocket = io("http://localhost:20242");
  }

  async enable({ app }: ModuleContext): Promise<void> {
    await this.dataFileManager.createDirs();
    this.websocketServer.enable();
    this.obs.initEvents();

    await app.whenReady();

    ipcSetup(this.mainSocket, this.obs, this.dataFileManager);

    await this.restoreOrCreateWindow(true);
    app.on("second-instance", () => this.restoreOrCreateWindow(true));
    app.on("activate", () => this.restoreOrCreateWindow(true));
  }

  async createWindow(): Promise<BrowserWindow> {
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
