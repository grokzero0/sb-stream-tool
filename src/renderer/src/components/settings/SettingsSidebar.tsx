import { Gamepad2, Video, Webhook } from 'lucide-react'
import { JSX } from 'react'
import { Link, useLocation } from 'wouter'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '../ui/sidebar'

const items = [
  {
    title: 'OBS',
    url: '/obs',
    icon: Video
  },
  {
    title: 'start.gg',
    url: '/startgg',
    icon: Webhook
  },
  {
    title: 'Slippi',
    url: '/slippi',
    icon: Gamepad2
  }
]

function SettingsSidebar(): JSX.Element {
  const [location] = useLocation()
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item.url === '/obs' ? (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location === item.url || location === '/'}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location === item.url}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
export default SettingsSidebar
