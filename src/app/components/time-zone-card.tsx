import {
  formatTzDate,
  formatTzTime,
} from '@/components/timezone-day-picker/_data/helpers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getUnixTime } from 'date-fns'

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
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 w-fit">
        <div className="text-4xl font-bold">
          {formatTzTime(currentDate, timeZone)}
        </div>
        <div className="text-lg">{formatTzDate(currentDate, timeZone)}</div>
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
    <div className="flex flex-col gap-1">
      <div className="space-y-1">
        <p className="font-medium text-primary">{time.toString()}</p>
        <p className="text-sm text-muted-foreground">{time.toUTCString()}</p>
        <p className="text-sm text-muted-foreground">
          Unix:{' '}
          <code className="rounded bg-muted px-2 py-1">
            {getUnixTime(time)}
          </code>
        </p>
      </div>
    </div>
  )
}
