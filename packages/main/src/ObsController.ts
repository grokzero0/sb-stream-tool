import OBSWebSocket from "obs-websocket-js";
// import { AppModule } from "src/AppModule.js";
// import { ModuleContext } from "src/ModuleContext.js";
export type ObsScene = {
  scene: string;
  start: number;
};
export class ObsController {
  private readonly socket: OBSWebSocket;
  private gameStartScenes: ObsScene[];
  private gameEndScenes: ObsScene[];
  private setEndScenes: ObsScene[];

  private gameStartScenesTimeoutIds: NodeJS.Timeout[];
  private gameEndScenesTimeoutIds: NodeJS.Timeout[];
  private setEndScenesTimeoutIds: NodeJS.Timeout[];

  constructor() {
    this.socket = new OBSWebSocket();
    this.gameStartScenes = [];
    this.gameEndScenes = [];
    this.setEndScenes = [];
    this.gameStartScenesTimeoutIds = [];
    this.gameEndScenesTimeoutIds = [];
    this.setEndScenesTimeoutIds = [];

    this.socket.on("ConnectionError", () => {
      console.log("Connection Error");
    });

    this.socket.on("ConnectionOpened", () => {
      console.log("Connection Opened");
    });

    this.socket.on("CurrentProgramSceneChanged", (scene) => {
      console.log(`Scene Changed to ${scene.sceneName}`);
    });
  }

  async playGameStartScenes(): Promise<void> {
    console.log('playGameStartScenes')
    this.stopScenes("gameStart");
    for (const scene of this.gameStartScenes) {
      this.gameStartScenesTimeoutIds.push(
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

  async playGameEndScenes(): Promise<void> {
    console.log('playGameEndScenes')
    this.stopScenes("gameEnd");
    for (const scene of this.gameEndScenes) {
      this.gameEndScenesTimeoutIds.push(
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

  async playSetEndScenes(): Promise<void> {
    console.log('playSetEndScenes')
    this.stopScenes("setEnd");
    for (const scene of this.setEndScenes) {
      this.setEndScenesTimeoutIds.push(
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

  async connect(
    protocol: string,
    url: string,
    port: string,
    password: string
  ): Promise<void> {
    console.log(`Connecting to ${protocol}${url}:${port}`);
    await this.socket
      .connect(`${protocol}${url}:${port}`, password)
      .then(() => {
        console.log("Connected");
      })
      .catch((reason) => {
        console.log(`Error: ${reason}`);
      });
  }

  async stopScenes(scenes: "gameStart" | "gameEnd" | "setEnd") {
    if (scenes === "gameStart") {
      for (const id of this.gameStartScenesTimeoutIds) {
        clearTimeout(id);
      }
    } else if (scenes === "gameEnd") {
      for (const id of this.gameEndScenesTimeoutIds) {
        clearTimeout(id);
      }
    } else {
      for (const id of this.setEndScenesTimeoutIds) {
        clearTimeout(id);
      }
    }
  }
  async updateScenes(
    newGameStartScenes: ObsScene[],
    newGameEndScenes: ObsScene[],
    newSetEndScenes: ObsScene[]
  ) {
    this.stopScenes("gameStart");
    this.stopScenes("gameEnd");
    this.stopScenes("setEnd");
    this.gameStartScenes = newGameStartScenes;
    this.gameEndScenes = newGameEndScenes;
    this.setEndScenes = newSetEndScenes;
  }

  // enable({ app }: ModuleContext): Promise<void> | void {
  //     console.log(app)
  // }
}
