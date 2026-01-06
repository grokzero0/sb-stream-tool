import { useNavigationHandler, useSlippiDataHandler } from '@renderer/lib/hooks'
import { JSX } from 'react'

function Handlers({ children }: { children: React.ReactNode }): JSX.Element {
  useNavigationHandler()
  useSlippiDataHandler()

  return <>{children}</>
}

export default Handlers
