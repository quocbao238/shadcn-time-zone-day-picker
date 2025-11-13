import {
  formatTzDate,
  formatTzTime,
} from '@/components/timezone-day-picker/_data/helpers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getUnixTime } from 'date-fns'
import { Clock } from 'lucide-react'

export function TimeZoneCard({
  title,
  currentDate,
  timeZone,
}: {
  title: string
  currentDate: Date
  timeZone?: string
}) {
  if (
    !currentDate ||
    !(currentDate instanceof Date) ||
    isNaN(currentDate.getTime())
  ) {
    return '-'
  }

  return (
    <Card className="w-full border-2 hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="text-5xl font-bold tracking-tight">
            {formatTzTime(currentDate, timeZone)}
          </div>
          <div className="text-lg text-muted-foreground">
            {formatTzDate(currentDate, timeZone)}
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <TimeInfo time={currentDate} />
        </div>
      </CardContent>
    </Card>
  )
}

export const TimeInfo = ({ time }: { time: Date }) => {
  if (!time) return null
  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-2">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Full Date String</p>
          <p className="text-sm font-mono break-all">{time.toString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">UTC Time</p>
          <p className="text-sm font-mono break-all">{time.toUTCString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Unix Timestamp</p>
          <code className="inline-block px-2 py-1 rounded bg-muted border text-sm font-mono font-semibold text-primary">
            {getUnixTime(time)}
          </code>
        </div>
      </div>
    </div>
  )
}
