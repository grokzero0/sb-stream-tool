import { useContext, useEffect } from 'react'
import { useLocation } from 'wouter'
import { type UseFieldArrayReturn } from 'react-hook-form'
import { PlayerFormFieldArrayContext, ThemeProviderContext } from './contexts'
import { ThemeProviderState } from './types/theme'

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
  // const { setValue } = useFormContext()

  useEffect(() => {
    window.electronAPI.onNewSlippiGameData((data) => {
      console.log(data.players)
    })
    return () => window.electronAPI.clearAllListeners('slippi:new-game-start-data')
  }, [])
}

export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
