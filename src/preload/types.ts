export type SlippiGameData = {
  isTeams: boolean
  players: {
    character: string
    color: string
    playerId: number
    port: number
  }[][]
}

export type SlippiGameEndData = {
  winner: number
}
