import { Tournament } from "@app/common";

export type ObsScene = {
  scene: string;
  start: number;
};

export type ServerToClientEvents = {
  //   noArg: () => void;
  //   withAck: (data: unknown, callback: (param?: unknown) => void) => void;
  sendDataToClients: (data: Tournament) => void;
};

export type ClientToServerEvents = {
  // withAck: (data: unknown, callback: (param?: unknown) => void) => void
  sendDataToServer: (data: Tournament) => void;
  overlayUpdateSuccess: () => void;
};

export type InterServerEvents = {
  ping: () => void;
};

// https://socket.io/docs/v4/server-socket-instance/#socketdata
export type SocketData = {
  name: string;
};
