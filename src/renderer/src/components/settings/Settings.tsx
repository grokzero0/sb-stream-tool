import { JSX } from 'react'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import SettingsSidebar from './SettingsSidebar'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { useLocation } from 'wouter'

function Settings({ children }: { children: React.ReactNode }): JSX.Element {
  const [location, navigate] = useLocation()
  console.log(location)
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex gap-2 w-full">
        <SettingsSidebar />
        <div className="w-full">
          <div className="flex justify-between items-center p-4 ">
            <SidebarTrigger type="button" />
            <Button type="button" onClick={() => navigate('~')}>
              <X />
            </Button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </SidebarProvider>
  )
}
export default Settings
