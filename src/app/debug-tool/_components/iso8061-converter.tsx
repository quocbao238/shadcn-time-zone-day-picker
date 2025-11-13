import { TimeInfo } from '@/app/components/time-zone-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useTimezoneStore } from '@/hooks/use-timezone'
import { useMemo, useState } from 'react'
import { TZDate } from 'react-day-picker'
import { Code2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export const ISO8601Converter = () => {
  const { timeZone } = useTimezoneStore()
  const [dateString, setDateString] = useState('2025-02-12T11:00:00.000Z')
  const [isValidDate, setIsValidDate] = useState(true)

  // Validate and create date objects
  const date = useMemo(() => {
    try {
      const parsedDate = new Date(dateString)
      if (isNaN(parsedDate.getTime())) {
        setIsValidDate(false)
        return null
      }
      setIsValidDate(true)
      return parsedDate
    } catch {
      setIsValidDate(false)
      return null
    }
  }, [dateString])

  const tzDate = useMemo(() => {
    if (!date || !timeZone) return null
    try {
      return new TZDate(date, timeZone)
    } catch {
      return null
    }
  }, [date, timeZone])

  return (
    <Card className="w-full border-2 hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          <span>ISO 8601 Converter</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Convert ISO 8601 format (e.g., 2025-02-12T11:00:00.000Z)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Input ISO 8601 String</label>
          <div className="relative">
            <Input
              type="text"
              value={dateString}
              onChange={(e) => setDateString(e.target.value)}
              className={cn(
                'font-mono text-sm',
                !isValidDate && 'border-destructive focus-visible:ring-destructive'
              )}
              placeholder="2025-02-12T11:00:00.000Z"
            />
            {!isValidDate && (
              <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>Please enter a valid ISO 8601 date format</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-sm font-semibold text-primary mb-3">Local Time</p>
            {date ? (
              <TimeInfo time={date} />
            ) : (
              <p className="text-sm text-muted-foreground">Invalid date format</p>
            )}
          </div>

          {timeZone && (
            <>
              <Separator />
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm font-semibold text-primary mb-3">
                  {timeZone} Time
                </p>
                {tzDate ? (
                  <TimeInfo time={tzDate} />
                ) : (
                  <p className="text-sm text-muted-foreground">Invalid date format</p>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
