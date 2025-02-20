import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shadcn Timezone Range Picker',
  description: 'Shadcn Timezone Range Picker use react-day-picker v9',
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
