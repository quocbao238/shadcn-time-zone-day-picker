import { TimeInfo } from '@/app/components/time-zone-card'
import { getTzDateByUnixTime } from '@/components/timezone-day-picker/_data/helpers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useTimezoneStore } from '@/hooks/use-timezone'
import { fromUnixTime } from 'date-fns'
import { useState } from 'react'
import { Clock } from 'lucide-react'

export const UnixTimeConverter = () => {
  const { timeZone } = useTimezoneStore()
  const [unixTime, setUnixTime] = useState(1739775687)
  const date = fromUnixTime(unixTime)
  const tzDate = getTzDateByUnixTime(unixTime, timeZone)

  return (
    <Card className="w-full border-2 hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <span>Unix Timestamp Converter</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Convert Unix timestamp (seconds since epoch, e.g., 1739775687)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Unix Timestamp (seconds)</label>
          <Input
            type="number"
            value={unixTime}
            onChange={(e) => {
              if (e.target.value === '') return setUnixTime(0)
              return setUnixTime(parseInt(e.target.value))
            }}
            className="font-mono text-sm"
            placeholder="1739775687"
          />
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-sm font-semibold text-primary mb-3">Local Time</p>
            <TimeInfo time={date} />
          </div>
          
          {timeZone && (
            <>
              <Separator />
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm font-semibold text-primary mb-3">
                  {timeZone} Time
                </p>
                <TimeInfo time={tzDate} />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
