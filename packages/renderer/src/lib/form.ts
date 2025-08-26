import type { PlayerState, TeamState } from './types/tournament'
export const TournamentDefaultValues = {
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
          info: {
            teamName: '',
            playerTag: '',
            pronouns: '',
            twitter: '',
          },
          character: 'Random',
          altCostume: 'Default',
          port: 'Red' as 'Red' | 'Blue' | 'Green' | 'Yellow'
        }
      ]
    },
    {
      name: '',
      score: 0,
      inLosers: false,
      players: [
        {

          info: {
            teamName: '',
            playerTag: '',
            pronouns: '',
            twitter: '',
          },
          character: 'Random',
          altCostume: 'Default',
          port: 'Blue' as 'Red' | 'Blue' | 'Green' | 'Yellow'
        }
      ]
    }
  ],
  commentators: [{ name: '', pronouns: '', twitter: '' }]
}

export const getPlayerState = (
  players: {
    info: {
      teamName: string,
      playerTag: string,
      pronouns: string,
      twitter: string,
    },
    character: string
    altCostume: string
    port: 'Red' | 'Blue' | 'Green' | 'Yellow'
  }[]
): PlayerState[] => {
  const p = [] as PlayerState[]
  for (const player of players) {
    p.push({
      playerInfo: {
        teamName: player.info.teamName,
        playerTag: player.info.playerTag,
        pronouns: player.info.pronouns,
        twitter: player.info.twitter
      },
      gameInfo: {
        character: player.character,
        altCostume: player.altCostume,
        port: player.port
      }
    })
  }

  return p
}

export const getTeamState = (teams: typeof TournamentDefaultValues.teams): TeamState[] => {
  const t = [] as TeamState[]
  for (const team of teams) {
    t.push({
      name: team.name,
      score: team.score,
      inLosers: team.inLosers,
      players: getPlayerState(team.players)
    })
  }
  return t
}