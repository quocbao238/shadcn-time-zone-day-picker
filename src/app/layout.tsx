import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { AppBar } from '@/components/app-bar'
import { Metadata } from 'next'
import { TimezoneHydration } from '@/components/timezone-hydration'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Shadcn Timezone Difference',
  description: 'A timezone day picker for Shadcn',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={false}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TimezoneHydration />
        <SidebarProvider>
          <AppSidebar />
          <div className="flex flex-col w-full relative">{children}</div>
        </SidebarProvider>
      </body>
    </html>
  )
}
