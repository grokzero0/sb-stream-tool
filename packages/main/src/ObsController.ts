import OBSWebSocket from "obs-websocket-js";
import { ObsScene } from "../../../types/obs.js";
import { Messenger, Notifier } from "./ToastMessageCommunicator.js";

class SceneCollection {
  private scenes: ObsScene[];
  private sceneTimeoutIds: NodeJS.Timeout[];
  private socket: OBSWebSocket;

  constructor(socket: OBSWebSocket) {
    this.sceneTimeoutIds = [];
    this.scenes = [];
    this.socket = socket;
  }

  async stop() {
    for (const id of this.sceneTimeoutIds) {
      clearTimeout(id);
    }
  }

  async play() {
    this.stop();
    for (const scene of this.scenes) {
      this.sceneTimeoutIds.push(
        setTimeout(() => {
          this.socket
            .call("SetCurrentProgramScene", {
              sceneName: scene.scene,
            })
            .catch((err) => {
              console.log(`Error: ${err}`);
            });
        }, scene.start * 1000)
      );
    }
  }

  async update(newScenes: ObsScene[]) {
    this.stop();
    this.sceneTimeoutIds = [];
    this.scenes = newScenes;
  }
}

export class ObsController implements Notifier {
  private socket: OBSWebSocket;
  private gameStartScenes: SceneCollection;
  private gameEndScenes: SceneCollection;
  private setEndScenes: SceneCollection;
  private messengers: Messenger[];

  constructor() {
    this.socket = new OBSWebSocket();
    this.gameStartScenes = new SceneCollection(this.socket);
    this.setEndScenes = new SceneCollection(this.socket);
    this.gameEndScenes = new SceneCollection(this.socket);
    this.messengers = [];
  }

  attach(messenger: Messenger): void {
    this.messengers.push(messenger);
  }

  detach(messenger: Messenger): void {
    const messengerIndex = this.messengers.indexOf(messenger);
    if (messengerIndex === -1) {
      return console.log(`No messenger found at index ${messengerIndex}`);
    }
    this.messengers.splice(messengerIndex, 1);
    console.log(`Detached a messenger at index ${messengerIndex}`);
  }

  notify(message?: string, description?: string): void {
    for (const messenger of this.messengers) {
      messenger.send(message, description);
    }
  }

  // while you could put this in the constructor, i personally don't like it, just a design choice
  async initEvents() {
    this.socket.on("ConnectionError", () => {
      console.log("Connection Error");
      this.notify("OBS Connection Error", "Connection Error");
    });

    this.socket.on("ConnectionOpened", () => {
      console.log("Connection Opened");
      this.notify("OBS Connection Success", "Connection Opened");
    });

    this.socket.on("CurrentProgramSceneChanged", (scene) => {
      console.log(`Scene Changed to ${scene.sceneName}`);
      this.notify(`OBS Scene Change", "Scene Changed to ${scene.sceneName}`);
    });
  }

  async connect(
    protocol: string,
    url: string,
    port: string,
    password: string
  ): Promise<void> {
    console.log(`Connecting to ${protocol}${url}:${port}`);
    this.notify("OBS Connection", `Connecting to ${protocol}${url}:${port}`);
    await this.socket
      .connect(`${protocol}${url}:${port}`, password)
      .then(() => {
        console.log("Connected");
      })
      .catch((reason) => {
        console.log(`Error: ${reason}`);
      });
  }

  async playScenes(sceneCollection: "game-start" | "game-end" | "set-end") {
    switch (sceneCollection) {
      case "game-start":
        this.gameStartScenes.play();
        break;
      case "game-end":
        this.gameEndScenes.play();
        break;
      case "set-end":
        this.setEndScenes.play();
        break;
      default:
        throw new Error(`Scene collection not found: ${sceneCollection}`);
    }
  }

  async stopScenes(sceneCollection: "game-start" | "game-end" | "set-end") {
    switch (sceneCollection) {
      case "game-start":
        this.gameStartScenes.stop();
        break;
      case "game-end":
        this.gameEndScenes.stop();
        break;
      case "set-end":
        this.setEndScenes.stop();
        break;
      default:
        throw new Error(`Scene collection not found: ${sceneCollection}`);
    }
  }

  async updateScenes(
    newGameStartScenes: ObsScene[],
    newGameEndScenes: ObsScene[],
    newSetEndScenes: ObsScene[]
  ) {
    this.gameStartScenes.update(newGameStartScenes);
    this.gameEndScenes.update(newGameEndScenes);
    this.setEndScenes.update(newSetEndScenes);
  }
}
