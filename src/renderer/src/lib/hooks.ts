import { useContext, useEffect } from 'react'
import { useLocation } from 'wouter'
import { useFormContext, type UseFieldArrayReturn } from 'react-hook-form'
import { PlayerFormFieldArrayContext, ThemeProviderContext } from './contexts'
import { ThemeProviderState } from './types/theme'
import { portToColor } from './utils'

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

export const useSlippiDataHandler = (): void => {
  const { setValue, getValues } = useFormContext()

  useEffect(() => {
    window.electronAPI.onNewSlippiGameData((data) => {
      console.log(data.players)
      // setValue(`team`)
      for (let i = 0; i < getValues('teams').length; i++) {
        for (let j = 0; j < getValues(`teams.${i}.players`).length; j++) {
          console.log(`${i}, ${j}`)
          setValue(`teams.${i}.players.${j}.gameInfo`, {
            character: data.players[i][j].character,
            altCostume: data.players[i][j].color,
            port: portToColor[data.players[i][j].port]
          })
        }
      }
    })
    return () => window.electronAPI.clearAllListeners('slippi:new-game-start-data')
  }, [getValues, setValue])
}

export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
