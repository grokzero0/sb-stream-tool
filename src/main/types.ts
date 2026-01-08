import { TournamentState } from '../common/types'

export type ObsScene = {
  scene: string
  start: number
}

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
