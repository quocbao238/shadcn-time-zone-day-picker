'use client'

import { useEffect, useMemo, useState } from 'react'
import { TZDate } from 'react-day-picker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTimezoneStore } from '@/hooks/use-timezone'
import { TimezoneSelector } from '@/components/timezone-day-picker/_components/time-zone-selector'
import { TimeZoneCard } from './components/time-zone-card'
import FullScreenLoading from '@/components/full-screen-loading'

// Custom hook for live time updates
function useCurrentTime(interval = 1000) {
  const [now, setNow] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), interval)
    return () => clearInterval(timer)
  }, [interval])
  
  return now
}

// Utility function to calculate time difference
function calculateTimeDifference(localTime: Date, targetTime: Date) {
  const localOffset = localTime.getTimezoneOffset()
  const targetOffset = targetTime.getTimezoneOffset()
  const diffMinutes = localOffset - targetOffset
  
  return {
    diffMinutes,
    sign: diffMinutes >= 0 ? '+' : '-',
    hours: Math.floor(Math.abs(diffMinutes) / 60),
    minutes: Math.abs(diffMinutes) % 60,
    isAhead: diffMinutes > 0
  }
}

// Time difference display component
function TimeDifferenceDisplay({ timeZone, localTime, tzDate }: { 
  timeZone?: string; 
  localTime: Date; 
  tzDate: Date;
}) {
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const diff = useMemo(() => 
    calculateTimeDifference(localTime, tzDate), 
    [localTime, tzDate]
  )
  
  // Format the time difference string
  const timeString = useMemo(() => {
    const parts = [
      diff.hours > 0 ? `${diff.hours} ${diff.hours === 1 ? 'hour' : 'hours'}` : null,
      diff.minutes > 0 ? `${diff.minutes} ${diff.minutes === 1 ? 'minute' : 'minutes'}` : null,
    ].filter(Boolean)
    
    return parts.length > 0 ? parts.join(' and ') : '0 hours'
  }, [diff])

  if (!timeZone) return <p>Select a timezone to compare</p>
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Time Difference</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-bold text-2xl">
          {diff.sign}{timeString}
        </p>
        <p>
          The time in <span className="font-medium">{timeZone}</span> is currently {timeString}
          {diff.isAhead ? ' ahead of ' : ' behind '}
          the time in <span className="font-medium">{localTimezone}</span>.
        </p>
      </CardContent>
    </Card>
  )
}

// Main time comparison component
function TimeComparison() {
  const { timeZone, checked, setTimeZone, hydrated } = useTimezoneStore()
  const currentTime = useCurrentTime()
  
  const tzDate = useMemo(() => 
    new TZDate(currentTime, timeZone), 
    [timeZone, currentTime]
  )

  if (!hydrated) return <FullScreenLoading />
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Compare Timezones
        </h2>
        <p className="text-muted-foreground">
          Select a timezone to compare with your local time.
        </p>
      </div>
      
      <TimezoneSelector
        disabled={checked}
        value={timeZone}
        onChange={setTimeZone}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <TimeZoneCard 
          title="Local Time" 
          currentDate={currentTime} 
        />
        <TimeZoneCard
          title={timeZone ?? 'Local Time'}
          currentDate={tzDate}
          timeZone={timeZone}
        />
      </div>
      
      <TimeDifferenceDisplay 
        timeZone={timeZone} 
        localTime={currentTime} 
        tzDate={tzDate} 
      />
    </div>
  )
}

// Page component
export default function Page() {
  return (
    <div className="container max-w-5xl mx-auto p-6">
      <TimeComparison />
    </div>
  )
}