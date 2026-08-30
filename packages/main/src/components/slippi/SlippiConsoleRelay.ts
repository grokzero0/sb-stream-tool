import { BrowserWindow } from "electron";
import { SlippiRelay } from "./SlippiRelay.js";
import { ConsoleConnection } from "@slippi/slippi-js/node";

export class SlippiConsoleRelay implements SlippiRelay {
  private browserWindow: BrowserWindow;
  private ip: string;
  private port: number;
  private connection: ConsoleConnection;

  constructor(ip: string, port: number, browserWindow: BrowserWindow) {
    this.browserWindow = browserWindow;
    this.ip = ip;
    this.port = port;
    this.connection = new ConsoleConnection();
  }

  async setBrowserWindow(browserWindow: BrowserWindow) {
    this.browserWindow = browserWindow;
    console.log(this.browserWindow)
  }

  async start() {
    console.log("start");
    this.connection
      .connect(this.ip, this.port, true)
      .then(() => {
        console.log(`Connected to Wii IP ${this.ip}:${this.port}`);
      })
      .catch((reason) => console.log(`Error, ${reason}`));
  }

  async stop() {
    this.connection.disconnect();
  }
}
