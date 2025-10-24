import { SlpLiveStream, SlpRealTime } from "@vinceau/slp-realtime";
import { EventSink, EventStream } from "./observer.js";
import { BrowserWindow } from "electron";

// an slp-realtime object wrapper but with an additional notifier lol
export class SlpRealTimeWrapper implements EventStream {
  private realtime: SlpRealTime;
  private livestream: SlpLiveStream;
  private observers: EventSink[];

  private browserWindow: BrowserWindow | undefined; // needed to send data back to renderer

  constructor() {
    this.realtime = new SlpRealTime();
    this.livestream = new SlpLiveStream();
    this.observers = [];
  }

  addBrowser(browserWindow: BrowserWindow) {
    this.browserWindow = browserWindow
  }

  attach(newObserver: EventSink) {
    this.observers.push(newObserver);
  }

  detach(observer: EventSink): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log(`No observer found at index ${observerIndex}`);
    }
    this.observers.splice(observerIndex, 1);
    console.log(`Detached an observer at index ${observerIndex}`);
  }

  notify(message?: string, description?: string): void {
    for (const observer of this.observers) {
      observer.update(message, description);
    }
  }

  async connect(address: string, slpPort: number) {
    this.livestream
      .start(address, slpPort)
      .then(() => {
        this.notify("Successfully connect to the Slippi Relay");
        this.realtime.setStream(this.livestream);
      })
      .catch((reason) => this.notify(reason));
  }

  async setupListeners() {
    this.realtime.game.start$.subscribe((gameStartStats) => {
      this.notify("Game started");
      this.browserWindow?.webContents.send("slippi/game-start", gameStartStats);
    });
  }
}
