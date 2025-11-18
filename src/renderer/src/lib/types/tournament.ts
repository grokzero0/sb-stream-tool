type PlayerInfo = {
  teamName: string
  playerTag: string
  pronouns: string
  twitter: string
}

export type PlayerState = {
  playerInfo: PlayerInfo
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

export type SetEntry = {
  stream: string
  matchName: string
  status: number
  firstGroup: {
    name: string
    players: PlayerInfo[]
  }
  secondGroup: {
    name: string
    players: PlayerInfo[]
  }
}

export type SetTableEntry = {
  stream: string
  matchName: string
  firstGroupName: string
  secondGroupName: string
}
