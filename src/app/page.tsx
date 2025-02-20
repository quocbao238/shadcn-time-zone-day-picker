'use client'

import { useEffect, useState } from 'react'
import { TZDate } from 'react-day-picker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTimezoneStore } from '@/hooks/use-timezone'
import { TimezoneSelector } from '@/components/timezone-day-picker/_components/time-zone-selector'
import { TimeZoneCard } from './components/time-zone-card'
import FullScreenLoading from '@/components/full-screen-loading'

export default function Page() {
  const { timeZone, checked, setTimeZone, hydrated } = useTimezoneStore()

  return (
    <div className="p-6 w-full">
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
    <div className="flex flex-col gap-4">
      {!hydrated && <FullScreenLoading />}
      <TimezoneSelector
        disabled={checked}
        value={timeZone}
        onChange={setTimeZone}
      />
      <div className="grid  gird-1 md:grid-cols-2 gap-4 w-full">
        <TimeZoneCard title="Local Time" currentDate={now} />
        <TimeZoneCard
          title={timeZone ?? 'Local Time'}
          currentDate={nowTz}
          timeZone={timeZone}
        />
      </div>
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Time Difference</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 w-fit">
        {!timeZone && <p>Timezone not selected</p>}
        {timeZone && (
          <p className="font-bold text-2xl">
            {sign}
            {timeString}
          </p>
        )}
        {timeZone && (
          <p>
            The time in {timeZone} is currently {timeString}
            {diffMinutes > 0 ? ' ahead of ' : ' behind '}
            the time in {localTimezone}.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
