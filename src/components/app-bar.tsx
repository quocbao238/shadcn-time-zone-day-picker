'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'

export function AppBar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        <SidebarTrigger />
      </div>
    </header>
  )
}

