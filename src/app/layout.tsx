import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Metadata } from 'next'

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
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <SidebarProvider>
          <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex flex-col flex-1">
              <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center px-4">
                  <SidebarTrigger className="mr-2 h-8 w-8 rounded-md border" />

                  <div className="flex flex-1 items-center justify-between space-x-2">
                    <div>
                      <h1 className="font-bold text-lg">
                        Shadcn Timezone Day Picker
                      </h1>
                    </div>

                    <div className="flex items-center space-x-2">
                      <nav className="hidden md:flex items-center space-x-4">
                        <a
                          href="/range-picker"
                          className="text-sm font-medium transition-colors hover:text-primary"
                        >
                          Range Picker
                        </a>
                        <a
                          href="/debug-tool"
                          className="text-sm font-medium transition-colors hover:text-primary"
                        >
                          Debug Tools
                        </a>
                      </nav>
                    </div>
                  </div>
                </div>
              </header>

              <main className="flex-1 container py-6 md:py-10 px-4">
                {children}
              </main>

              <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
                  <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Shadcn Timezone Day Picker
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Built with Next.js and Shadcn UI
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
