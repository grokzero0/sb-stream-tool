import { BrowserWindow } from "electron";

export interface Messenger {
  send(message?: string, description?: string): void;
}
export interface Notifier {
  attach(messenger: Messenger): void;

  detach(messenger: Messenger): void;

  notify(message?: string, description?: string): void;
}

export class ToastMessageCommunicator implements Messenger {
  private browserWindow: BrowserWindow;

  constructor(browserWindow: BrowserWindow) {
    this.browserWindow = browserWindow;
  }

  send(message?: string, description?: string) {
    this.browserWindow.webContents.send("toast-message", message, description);
  }
}
