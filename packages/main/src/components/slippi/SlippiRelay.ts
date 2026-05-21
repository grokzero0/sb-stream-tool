import { BrowserWindow } from "electron";

export interface SlippiRelay {
  setBrowserWindow: (browserWindow: BrowserWindow) => Promise<void>;
  stop: (quiet: boolean) => Promise<void>;
  // setup: (...args: any) => Promise<void>;
  start: () => Promise<void>;
}
