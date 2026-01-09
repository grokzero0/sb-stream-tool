import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SetEntry, SetFormat } from './types/tournament'
import { EventSetsQuery, StreamQueueOnTournamentQuery } from './queries.generated'
import { UseFieldArrayReturn } from 'react-hook-form'
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export const portToColor: Record<number, string> = {
  1: 'Red',
  2: 'Blue',
  3: 'Green',
  4: 'Yellow'
}

export const sleep = (ms: number): Promise<unknown> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export function filterLiveSets(data: StreamQueueOnTournamentQuery): SetEntry[] {
  const filteredSets = [] as SetEntry[]
  if (!data.tournament?.streamQueue) {
    return []
  }
  for (const stream of data.tournament.streamQueue) {
    if (stream?.sets) {
      for (const set of stream.sets) {
        const groupInfo = [] as SetEntry['groups']
        if (set?.slots) {
          for (const slot of set.slots) {
            if (slot?.entrant?.participants) {
              groupInfo.push({
                name: slot.entrant.name ?? '',
                players: slot.entrant.participants?.map((participant) => {
                  return {
                    teamName: participant?.prefix ?? '',
                    playerTag: participant?.gamerTag ?? '',
                    pronouns: participant?.user?.genderPronoun ?? '',
                    twitter: participant?.user?.authorizations?.[0]?.externalUsername ?? ''
                  }
                })
              })
            }
          }
          if (groupInfo.length > 0) {
            filteredSets.push({
              stream: set.stream?.streamName ?? '',
              matchName: set.fullRoundText ?? 'Custom Round Name',
              status: set.state ?? -1,
              groups: groupInfo
            })
          }
        }
      }
    }
  }
  return filteredSets
}
export function filterSets(data: EventSetsQuery): SetEntry[] {
  const filteredSets = [] as SetEntry[]
  if (
    (!data.event?.sets?.nodes && data?.event?.sets?.nodes === null) ||
    data.event?.sets?.nodes === undefined
  ) {
    return []
  }

  for (const node of data.event.sets.nodes) {
    if (node?.state && node.slots) {
      const groupInfo = [] as SetEntry['groups']
      for (const slot of node.slots) {
        if (slot?.entrant?.participants) {
          groupInfo.push({
            name: slot.entrant.name ?? '',
            players: slot.entrant.participants?.map((participant) => {
              return {
                teamName: participant?.prefix ?? '',
                playerTag: participant?.gamerTag ?? '',
                pronouns: participant?.user?.genderPronoun ?? '',
                twitter: participant?.user?.authorizations?.[0]?.externalUsername ?? ''
              }
            })
          })
        }
      }
      // no point including a set where there's literally no available information about the players
      // tbf this is probably redundant because of the null-case handling
      if (groupInfo.length > 0) {
        filteredSets.push({
          stream: node.stream?.streamName ?? '',
          matchName: node.fullRoundText ?? 'Custom Round Name',
          status: node.state,
          groups: groupInfo
        })
      }
    }
  }

  return filteredSets
}

const colors = ['Red', 'Blue', 'Green', 'Yellow']
// // updates the player form for doubles or singles
// export function updatePlayerForm(
//   setFormat: SetFormat,
//   currentSetFormat: SetFormat,
//   teams: UseFieldArrayReturn[]
// ): void {
//   if (setFormat !== currentSetFormat) {
//     changeSetFormat(setFormat, teams)
//   }
// }

export function getSetFormat(
  numPlayersInForm: number | undefined,
  numPlayersInSet: number | undefined
): SetFormat {
  const numPlayersToSetFormat: Record<number, SetFormat> = {
    1: 'Singles',
    2: 'Doubles'
  }
  if (!numPlayersInForm || !numPlayersInSet || numPlayersInForm > numPlayersInSet) {
    return 'Singles'
  }
  if (numPlayersInForm === numPlayersInSet) {
    return numPlayersToSetFormat[numPlayersInSet]
  }
  return 'Doubles'
}
export function changeSetFormat(setFormat: string, teams: UseFieldArrayReturn[]): void {
  switch (setFormat) {
    case 'Singles':
      for (let i = 0; i < teams.length; i++) {
        teams[i].remove(1)
      }
      break
    case 'Doubles':
      for (let i = 0; i < teams.length; i++) {
        if (teams[i].fields.length < 2) {
          teams[i].append({
            playerInfo: {
              teamName: '',
              playerTag: '',
              pronouns: '',
              twitter: ''
            },
            gameInfo: {
              character: 'Random',
              altCostume: 'Default',
              port: colors[2 + i]
            }
          })
        }
      }
      break
    default:
      throw new Error(`Set format ${setFormat} does not exist!`)
  }
}
