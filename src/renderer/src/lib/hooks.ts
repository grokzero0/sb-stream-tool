import { useContext } from 'react'
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
  window.electronAPI.navigation((location) => {
    navigate(`/${location}`)
  })
}

export const useSlippiDataHandler = (): void => {
  // const { setValue } = useFormContext()

  window.electronAPI.slippiGameDataReceived((data) => {
    console.log(data.players)
  })
}

export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
