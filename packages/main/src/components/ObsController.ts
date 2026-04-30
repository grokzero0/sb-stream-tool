import { OBSWebSocket } from "obs-websocket-js";
import { EventStream } from "./observer.js";
import { ObsScene, ObsSceneType } from "@app/common";

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
        }, scene.start * 1000),
      );
    }
  }

  async update(newScenes: ObsScene[]) {
    this.stop();
    this.sceneTimeoutIds = [];
    this.scenes = newScenes;
  }
}

export class ObsController extends EventStream {
  private static socket: OBSWebSocket = new OBSWebSocket();
  private static gameStartScenes: SceneCollection = new SceneCollection(
    this.socket,
  );
  private static gameEndScenes: SceneCollection = new SceneCollection(
    this.socket,
  );
  private static setEndScenes: SceneCollection = new SceneCollection(
    this.socket,
  );

  // constructor() {
  //   super();
  //   this.socket = new OBSWebSocket();
  //   this.gameStartScenes = new SceneCollection(this.socket);
  //   this.setEndScenes = new SceneCollection(this.socket);
  //   this.gameEndScenes = new SceneCollection(this.socket);
  // }
  static async initEvents() {
    this.socket.on("ConnectionError", (error) => {
      console.log("Connection Error");
      this.notify("OBS Connection Error", `Connection Error: ${error}`);
    });

    this.socket.on("ConnectionOpened", () => {
      console.log("Connection Opened");
      this.notify("OBS Connection Success", "Connection Opened");
    });

    this.socket.on("CurrentProgramSceneChanged", (scene) => {
      console.log(`Scene Changed to ${scene.sceneName}`);
      this.notify("OBS Scene Change", `Scene Changed to ${scene.sceneName}`);
    });
  }

  static async connect(
    protocol: string,
    url: string,
    port: string,
    password: string,
  ) {
    this.notify(
      "OBS Websocket connection",
      `Connecting to ${protocol}${url}:${port}`,
    );
    await this.socket
      .connect(`${protocol}${url}:${port}`, password)
      .then(() => {
        this.notify(
          "OBS Websocket connection",
          `Connected to ${protocol}${url}:${port}`,
        );
        console.log("Connected");
      })
      .catch((reason) => console.log(`Error: ${reason}`));
  }

  static async playScenes(sceneCollection: ObsSceneType) {
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

  static async stopScenes(sceneCollection: ObsSceneType) {
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

  static async updateScenes(
    newGameStartScenes: ObsScene[],
    newGameEndScenes: ObsScene[],
    newSetEndScenes: ObsScene[],
  ) {
    this.gameStartScenes.update(newGameStartScenes);
    this.gameEndScenes.update(newGameEndScenes);
    this.setEndScenes.update(newSetEndScenes);
    this.notify("OBS scenes", "OBS scenes added!");
  }
}
