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
            twitter: ''
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
            twitter: ''
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
