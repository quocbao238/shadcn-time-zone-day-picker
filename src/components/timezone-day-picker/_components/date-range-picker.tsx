import { useEffect, useState, useRef } from 'react'
import {
  differenceInDays,
  endOfDay,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
} from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { TRangePicker } from '../_data/schema'
import { CalendarIcon } from 'lucide-react'
import { formatTzDate, getNewDate } from '../_data/helpers'

export const DateRangePicker = ({
  value,
  onChange,
  timeZone,
}: {
  value: TRangePicker | undefined
  onChange: (value: { from: Date; to: Date }) => void
  timeZone?: string
}) => {
  const [date, setDate] = useState<TRangePicker | undefined>(value)
  const lastOnChangeRef = useRef<TRangePicker | undefined>(value)
  const prevValueRef = useRef<TRangePicker | undefined>(value)

  useEffect(() => {
    // Only update if the value prop actually changed (compare timestamps)
    if (!value) {
      if (prevValueRef.current !== value) {
        prevValueRef.current = value
        setDate(value)
        lastOnChangeRef.current = value
      }
      return
    }
    
    const prevValue = prevValueRef.current
    if (
      !prevValue ||
      !prevValue.from ||
      !prevValue.to ||
      !(prevValue.from instanceof Date) ||
      !(prevValue.to instanceof Date) ||
      prevValue.from.getTime() !== value.from.getTime() ||
      prevValue.to.getTime() !== value.to.getTime()
    ) {
      prevValueRef.current = value
      setDate(value)
      // Update the ref to track what we received from parent
      lastOnChangeRef.current = value
    }
  }, [value])

  const handleDateChange = (value: Date) => {
    if (date) {
      const isCurrentSameDay = isSameDay(date.from, date.to)

      const isDiffWithCurrentFrom = differenceInDays(value, date.from)
      const isDiffWithCurrentTo = differenceInDays(value, date.to)

      if (isCurrentSameDay) {
        const isSelectedAfterCurrent = isAfter(value, date.from)
        const isSelectedBeforeCurrent = isBefore(value, date.from)
        if (isSelectedAfterCurrent) {
          setDate({ ...date, to: endOfDay(value) })
        }
        if (isSelectedBeforeCurrent) {
          setDate({ ...date, from: startOfDay(value) })
        }
        return
      }

      if (isDiffWithCurrentFrom || isDiffWithCurrentTo) {
        setDate({ ...date, from: startOfDay(value), to: endOfDay(value) })
        return
      }
    }
  }

  useEffect(() => {
    if (!date?.from || !date?.to) return
    // Only call onChange if date actually changed from what we last sent
    // This prevents infinite loops when parent updates value prop
    const lastSent = lastOnChangeRef.current
    if (
      !lastSent ||
      !lastSent.from ||
      !lastSent.to ||
      !(lastSent.from instanceof Date) ||
      !(lastSent.to instanceof Date) ||
      lastSent.from.getTime() !== date.from.getTime() ||
      lastSent.to.getTime() !== date.to.getTime()
    ) {
      lastOnChangeRef.current = date
      onChange(date)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={'outline'}
          className={cn(
            'w-[260px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {date?.from ? (
            date.to ? (
              <>
                {formatTzDate(date.from)} - {formatTzDate(date.to)}
              </>
            ) : (
              formatTzDate(date.from)
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          timeZone={timeZone}
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          disabled={[
            {
              after: endOfDay(getNewDate(timeZone)),
            },
          ]}
          onDayClick={(day) => handleDateChange(day)}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
