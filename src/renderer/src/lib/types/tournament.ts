import { PlayerInfo } from 'src/common/types'

export type SetEntry = {
  stream: string
  matchName: string
  status: number
  groups: {
    name: string
    players: PlayerInfo[] // always gonna be of size 2
  }[]
}

export type SetTableEntry = {
  stream: string
  matchName: string
  firstGroupName: string
  secondGroupName: string
}
