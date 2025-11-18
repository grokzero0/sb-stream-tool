import { JSX } from 'react'
import { useLocation } from 'wouter'

function NavigationHandler({ children }: { children: React.ReactNode }): JSX.Element {
  const [, navigate] = useLocation()
  window.electronAPI.navigation((location) => {
    navigate(`/${location}`)
  })
  return <>{children}</>
}

export default NavigationHandler
