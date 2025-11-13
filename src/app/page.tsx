'use client'

import { useEffect, useState } from 'react'
import { TZDate } from 'react-day-picker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTimezoneStore } from '@/hooks/use-timezone'
import { TimezoneSelector } from '@/components/timezone-day-picker/_components/time-zone-selector'
import { TimeZoneCard } from './components/time-zone-card'
import FullScreenLoading from '@/components/full-screen-loading'
import { Clock, Globe, ArrowRightLeft } from 'lucide-react'

export default function Page() {
  const { timeZone, checked, setTimeZone, hydrated } = useTimezoneStore()

  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <TimeNow
        timeZone={timeZone}
        checked={checked}
        setTimeZone={setTimeZone}
        hydrated={hydrated}
      />
    </div>
  )
}

const TimeNow = ({
  timeZone,
  checked,
  setTimeZone,
  hydrated,
}: {
  timeZone?: string
  checked: boolean
  setTimeZone: (timeZone: string) => void
  hydrated?: boolean
}) => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const nowTz = new TZDate(new Date(), timeZone)
  return (
    <div className="flex flex-col gap-6">
      {!hydrated && <FullScreenLoading />}

      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Clock className="size-10 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Time Difference
            </h1>
            <p className="text-muted-foreground">
              Compare time between your local timezone and selected timezone
            </p>
          </div>
        </div>
      </div>

      {/* Timezone Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Select Timezone
        </label>
        <TimezoneSelector
          disabled={checked}
          value={timeZone}
          onChange={setTimeZone}
        />
      </div>

      {/* Time Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <TimeZoneCard title="Local Time" currentDate={now} />
        <TimeZoneCard
          title={timeZone ?? 'Local Time'}
          currentDate={nowTz}
          timeZone={timeZone}
        />
      </div>

      {/* Time Difference Card */}
      <div className="w-full">
        <TimeDiff tzDate={nowTz} localTime={now} timeZone={timeZone} />
      </div>
    </div>
  )
}

const TimeDiff = ({
  tzDate,
  localTime,
  timeZone,
}: {
  tzDate: Date
  localTime: Date
  timeZone?: string
}) => {
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  // Calculate difference
  const targetOffset = tzDate.getTimezoneOffset()
  const localOffset = localTime.getTimezoneOffset()
  // Calculate exact difference (keeping sign)
  const diffMinutes = localOffset - targetOffset
  const sign = diffMinutes >= 0 ? '+' : '-'

  // Convert to hours and minutes
  const absHours = Math.floor(Math.abs(diffMinutes) / 60)
  const absMinutes = Math.abs(diffMinutes) % 60

  const timeString = [
    absHours > 0 ? `${absHours} hours` : null,
    absMinutes > 0 ? `${absMinutes} minutes` : null,
  ]
    .filter(Boolean)
    .join(' and ')

  return (
    <Card className="w-full border-2 hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-primary" />
          <span>Time Difference</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Compare the time difference between timezones
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!timeZone ? (
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-muted-foreground">
              Please select a timezone to compare
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/20">
                  <ArrowRightLeft className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Difference</p>
                  <p className="text-3xl font-bold text-primary">
                    {sign}
                    {timeString || '0 minutes'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm leading-relaxed">
                The time in{' '}
                <span className="font-semibold text-foreground">
                  {timeZone}
                </span>{' '}
                is currently{' '}
                <span className="font-semibold text-primary">
                  {timeString || '0 minutes'}
                </span>
                {diffMinutes > 0
                  ? ' ahead of '
                  : diffMinutes < 0
                    ? ' behind '
                    : ' the same as '}
                the time in{' '}
                <span className="font-semibold text-foreground">
                  {localTimezone}
                </span>
                .
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
