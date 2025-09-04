import { TournamentState } from "../../../../../types/tournament.js"

// declare your socket.io events here
export interface ServerToClientEvents {
  noArg: () => void
  withAck: (data: unknown, callback: (param?: unknown) => void) => void
  newData: (data: TournamentState) => void
}

export interface ClientToServerEvents {
  // withAck: (data: unknown, callback: (param?: unknown) => void) => void
  sendDataToServer: (data: TournamentState) => void
}

export interface InterServerEvents {
  ping: () => void
}

// https://socket.io/docs/v4/server-socket-instance/#socketdata
export interface SocketData {
  name: string
}