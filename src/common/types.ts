export type PlayerInfo = {
  teamName: string
  playerTag: string
  pronouns: string
  twitter: string
}

export type GameInfo = {
  character: string
  altCostume: string
  port: 'Red' | 'Blue' | 'Green' | 'Yellow'
}

export type SlippiGameData = {
  isTeams: boolean
  players: {
    character: string
    color: string
    playerId: number
    port: number
  }[][]
}

export interface PlayerState {
  playerInfo: PlayerInfo
  gameInfo: GameInfo
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
