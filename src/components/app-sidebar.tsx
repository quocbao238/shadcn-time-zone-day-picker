import { Calendar, CalendarClock, Settings, Github, Star } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Menu items.
const items = [
  {
    title: 'Time Difference',
    url: '/',
    icon: CalendarClock,
  },
  {
    title: 'DateRange Picker',
    url: '/range-picker',
    icon: Calendar,
  },
  {
    title: 'Debug Tool',
    url: '/debug-tool',
    icon: Settings,
  },
]

export function AppSidebar() {
  const githubUrl = 'https://github.com/quocbao238/shadcn-time-zone-day-picker'

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Shadcn Timezone Day Picker</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2 space-y-2">
        <div className="flex items-center justify-center gap-1.5 px-2">
          <Star className="h-3 w-3 text-muted-foreground fill-muted-foreground" />
          <p className="text-xs text-muted-foreground text-center">
            Give me a star if you like it
          </p>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'w-full flex items-center justify-center gap-2',
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  'transition-colors duration-200',
                  'group'
                )}
              >
                <Github className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm">View on GitHub</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
