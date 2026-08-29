import { BrowserWindow } from "electron";
import { EventSink } from "./EventStream.js";
import { ObsConnectionStatus } from "@app/common";

export class ObsMessageCommunicator implements EventSink {
  private browserWindow: BrowserWindow;
  constructor(browserWindow: BrowserWindow) {
    this.browserWindow = browserWindow;
  }

  update(status: ObsConnectionStatus): void {
    this.browserWindow.webContents.send("obs:connection-status-change", status);
  }
}
