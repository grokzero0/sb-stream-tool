export interface PlayerState {
  playerInfo: {
    teamName: string
    playerTag: string
    pronouns: string
    twitter: string
  }
  gameInfo: {
    character: string
    altCostume: string
    port: 'Red' | 'Blue' | 'Green' | 'Yellow'
  }
}

export interface TeamState {
  name: string
  score: number
  inLosers: boolean
  players: PlayerState[]
}

export interface CommentatorState {
  name: string
  twitter: string
  pronouns: string
}

export interface TournamentState {
  name: string
  bestOf: number
  roundFormat: string
  customRoundFormat?: string
  roundNumber?: number
  setFormat: string
  teams: TeamState[]
  commentators: CommentatorState[]
}

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
