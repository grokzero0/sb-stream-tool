import { BrowserWindow } from "electron";
import { EventSink } from "./observer.js";

// sends message from main process to renderer's toaster component
export class ToastMessageCommunicator implements EventSink {
  private browserWindow: BrowserWindow;

  constructor(browserWindow: BrowserWindow) {
    this.browserWindow = browserWindow;
  }

  update(message?: string, description?: string) {
    this.browserWindow.webContents.send("toast-message", message, description);
  }
}
