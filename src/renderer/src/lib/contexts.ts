import { createContext } from 'react'
import type { UseFieldArrayReturn } from 'react-hook-form'
import type { ThemeProviderState } from './types/theme'

export const PlayerFormFieldArrayContext = createContext<UseFieldArrayReturn[]>([])

export const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: 'system',
  setTheme: () => null
})
