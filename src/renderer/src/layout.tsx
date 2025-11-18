import { JSX } from 'react'

function Layout({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="p-1">{children}</div>
}

export default Layout
