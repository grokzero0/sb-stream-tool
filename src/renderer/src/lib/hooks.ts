import { useContext, useEffect } from 'react'
import { useLocation } from 'wouter'
import { useFormContext, type UseFieldArrayReturn } from 'react-hook-form'
import { PlayerFormFieldArrayContext, ThemeProviderContext } from './contexts'
import { ThemeProviderState } from './types/theme'
import { changeSetFormat, portToColor } from './utils'
import { useSettingsStore } from './zustand-store/store'
import { SlippiPlayer } from 'src/common/types'

export const usePlayerFormFieldArrayContext = (): UseFieldArrayReturn[] => {
  const context = useContext(PlayerFormFieldArrayContext)

  if (context === undefined || context.length == 0) {
    throw new Error(
      'usePlayerFormFieldArrayContext must be used within a PlayerFormFieldArrayProvider'
    )
  }

  return context
}

export const useNavigationHandler = (): void => {
  const [, navigate] = useLocation()
  useEffect(() => {
    window.electronAPI.navigation((location) => {
      navigate(`/${location}`)
    })
    return () => window.electronAPI.clearAllListeners('navigation')
  }, [navigate])
}

function findTeamWinner(players: SlippiPlayer[][], winner: number): number {
  for (let i = 0; i < players.length; i++) {
    for (const player of players[i]) {
      if (player.playerId === winner) {
        return i
      }
    }
  }
  return -1
}

export const useTeamArrayMethods = (): {
  swapTeamData: (firstIndex: number, secondIndex: number) => void
  swapGameData: (firstIndex: number, secondIndex: number) => void
} => {
  const { setValue, getValues } = useFormContext()

  const swapTeamData = (firstIndex: number, secondIndex: number): void => {
    const arr = [
      getValues([
        `teams.${firstIndex}.name`,
        `teams.${firstIndex}.score`,
        `teams.${firstIndex}.inLosers`
      ]),
      getValues([
        `teams.${secondIndex}.name`,
        `teams.${secondIndex}.score`,
        `teams.${secondIndex}.inLosers`
      ])
    ]
    const first = arr[0]
    arr[0] = arr[1]
    arr[1] = first
    setValue(`teams.${firstIndex}.name`, arr[0][0])
    setValue(`teams.${firstIndex}.score`, arr[0][1])
    setValue(`teams.${firstIndex}.inLosers`, arr[0][2])

    setValue(`teams.${secondIndex}.name`, arr[1][0])
    setValue(`teams.${secondIndex}.score`, arr[1][1])
    setValue(`teams.${secondIndex}.inLosers`, arr[1][2])
  }

  const swapGameData = (firstIndex: number, secondIndex: number): void => {
    if (
      getValues(`teams.${firstIndex}.players`).length !==
      getValues(`teams.${secondIndex}.players`).length
    ) {
      console.log(
        `${getValues(`teams.${firstIndex}.players`).length}, ${getValues(`teams.${secondIndex}.players`)}`
      )
      return
    }

    for (let i = 0; i < getValues(`teams.${firstIndex}.players`).length; i++) {
      const first = getValues(`teams.${firstIndex}.players.${i}.gameInfo`)
      setValue(
        `teams.${firstIndex}.players.${i}.gameInfo`,
        getValues(`teams.${secondIndex}.players.${i}.gameInfo`)
      )
      setValue(`teams.${secondIndex}.players.${i}.gameInfo`, first)
    }
  }

  return { swapTeamData, swapGameData }
}

export const useSlippiDataHandler = (): void => {
  const { setValue, getValues } = useFormContext()
  const teams = usePlayerFormFieldArrayContext()
  const players = useSettingsStore((state) => state.players)
  const setPlayers = useSettingsStore((state) => state.setPlayers)
  useEffect(() => {
    window.electronAPI.onNewSlippiGameData((data) => {
      setPlayers(data.players)
      if (data.isTeams) {
        changeSetFormat('Doubles', teams)
        setValue('setFormat', 'Doubles')
      } else {
        changeSetFormat('Singles', teams)
        setValue('setFormat', 'Singles')
      }
      for (let i = 0; i < getValues('teams').length; i++) {
        for (let j = 0; j < getValues(`teams.${i}.players`).length; j++) {
          setValue(`teams.${i}.players.${j}.gameInfo`, {
            character: data.players[i][j].character,
            altCostume: data.players[i][j].color,
            port: portToColor[data.players[i][j].port]
          })
        }
      }
    })
    window.electronAPI.send('obs/play-game-start-scenes')
    return () => window.electronAPI.clearAllListeners('slippi:new-game-start-data')
  }, [getValues, setPlayers, setValue, teams])
  useEffect(() => {
    window.electronAPI.onNewSlippiGameEndData((winner) => {
      const teamWinner = findTeamWinner(players, winner)
      const bestOf = getValues('bestOf')
      const scoreToBeat = bestOf % 2 === 0 ? bestOf / 2 + 1 : Math.ceil(bestOf / 2)
      if (teamWinner !== -1) {
        const newScore = getValues(`teams.${teamWinner}.score`) + 1
        setValue(`teams.${teamWinner}.score`, newScore)
        if (newScore >= scoreToBeat) {
          window.electronAPI.send('obs/play-set-end-scenes')
        } else {
          window.electronAPI.send('obs/play-game-end-scenes')
        }
      }
    })
    return () => window.electronAPI.clearAllListeners('slippi:new-game-end-data')
  }, [getValues, players, setValue])
}

export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
