import { TimeInfo } from '@/app/components/time-zone-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useTimezoneStore } from '@/hooks/use-timezone'
import { useMemo, useState } from 'react'
import { TZDate } from 'react-day-picker'

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          ISO 8601 Converter{' '}
          <span className="text-base font-normal text-muted-foreground">
            (Ex: 2025-02-12T11:00:00.000Z)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <p className="font-semibold">Input:</p>
          <Input
            type="text"
            value={dateString}
            onChange={(e) => setDateString(e.target.value)}
            className={!isValidDate ? 'border-red-500' : ''}
          />
          {!isValidDate && (
            <p className="text-sm text-red-500">
              Please enter a valid ISO 8601 date
            </p>
          )}
        </div>

        <Separator />

        <div>
          <p className="font-semibold text-primary">Local Time:</p>
          {date ? (
            <TimeInfo time={date} />
          ) : (
            <p className="text-muted-foreground">Invalid date format</p>
          )}
        </div>

        <Separator />

        {timeZone && (
          <div>
            <p className="font-semibold">{timeZone} Time:</p>
            {tzDate ? (
              <TimeInfo time={tzDate} />
            ) : (
              <p className="text-muted-foreground">Invalid date format</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
