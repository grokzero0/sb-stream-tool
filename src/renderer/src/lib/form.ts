import { TeamState, TournamentState } from 'src/common/types'

export const TournamentDefaultValues: TournamentState = {
  name: '',
  bestOf: 1,
  roundFormat: 'Friendlies',
  customRoundFormat: undefined,
  roundNumber: 0,
  setFormat: 'Singles',
  teams: [
    {
      name: '',
      score: 0,
      inLosers: false,
      players: [
        {
          playerInfo: {
            teamName: '',
            playerTag: '',
            pronouns: '',
            twitter: ''
          },
          gameInfo: {
            character: 'Random',
            altCostume: 'Default',
            port: 'Red' as 'Red' | 'Blue' | 'Green' | 'Yellow'
          }
        }
      ]
    },
    {
      name: '',
      score: 0,
      inLosers: false,
      players: [
        {
          playerInfo: {
            teamName: '',
            playerTag: '',
            pronouns: '',
            twitter: ''
          },
          gameInfo: {
            character: 'Random',
            altCostume: 'Default',
            port: 'Blue' as 'Red' | 'Blue' | 'Green' | 'Yellow'
          }
        }
      ]
    }
  ],
  commentators: [{ name: '', pronouns: '', twitter: '' }]
}

export const getTeamState = (teams: TournamentState['teams']): TeamState[] => {
  const t = [] as TeamState[]
  for (const team of teams) {
    t.push({
      name: team.name,
      score: team.score,
      inLosers: team.inLosers,
      players: team.players
    })
  }
  return t
}
