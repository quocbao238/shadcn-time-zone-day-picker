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
        <SidebarProvider>
          <AppSidebar />
          <div className="flex flex-col w-full relative">
            <div className="px-6 py-4 sticky top-0 bg-background shadow-sm">
              <div className="flex flex-row justify-between gap-4">
                <SidebarTrigger className="h-8 w-8 rounded-md border" />
                <div className="w-full h-8 flex justify-center items-center">
                  <p className="text-primary font-bold  md:hidden">
                    Shadcn Timezone Day Picker
                  </p>
                </div>
                <div className="w-8" />
              </div>
            </div>
            {children}
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
