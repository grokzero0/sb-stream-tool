import { Tournament } from "@app/common";
import {
  FrameEntryType,
  GameStartType,
  PostFrameUpdateType,
  SlippiGame,
} from "@slippi/slippi-js/node";

export type SlippiSettingsData = {
  gameDataController: SlippiGame;
  state: {
    // perhaps extended upon in the future to include punishes, for example, etc
    settings: GameStartType | undefined;
    gameEnded: boolean;
  };
};

export type TeamAggregate = {
  totalStocks: number;
  totalPercent: number;
  players: PostFrameUpdateType[];
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
