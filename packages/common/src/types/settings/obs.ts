export type ObsWebsocketSettings = {
  ip: string;
  port: string;
};

export type ObsScene = {
  scene: string;
  start: number;
};

export type ObsSceneType = "game-start" | "game-end" | "set-end";

export type ObsSceneSettings = { type: ObsSceneType; scene: ObsScene }[];
