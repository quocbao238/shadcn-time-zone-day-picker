'use client'

import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { useTimezoneStore } from '@/hooks/use-timezone'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RangeDayType } from '@/components/timezone-day-picker/_data/schema'
import {
  getNewDate,
  getTzRangeByType,
} from '@/components/timezone-day-picker/_data/helpers'
import { formatDate, isValid, parse } from 'date-fns'
import { useMask } from '@react-input/mask'
import { EpochRange } from './epoch-range'
import { TZDate } from 'react-day-picker'
import { Calendar as CalendarIcon, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DateState {
  selected?: Date
  month?: Date
  valid: boolean
  input: string
}

export default function DatePickerConverter() {
  const { timeZone } = useTimezoneStore()
  const inputId = useId()

  // Consolidated date-related state
  const [dateState, setDateState] = useState<DateState>({
    selected: new Date(),
    month: new Date(),
    valid: true,
    input: '',
  })

  const [rangeType, setRangeType] = useState<RangeDayType>('day')
  const [key, setKey] = useState(0)

  // Memoized range date calculation
  const rangeDate = useMemo(
    () =>
      getTzRangeByType({
        type: rangeType,
        timeZone,
        date: dateState.selected ?? new Date(),
      }),
    [rangeType, timeZone, dateState.selected]
  )

  // Input mask configuration
  const maskInput = useMemo(
    () => ({
      mask: '__/__/____',
      replacement: { _: /\d/ },
    }),
    []
  )

  const inputRef = useMask(maskInput)

  // Validate date string
  const validateDate = useCallback(
    (date: string): boolean => {
      if (date.length === 10) {
        const parsedDate = parse(date, 'MM/dd/yyyy', getNewDate(timeZone))
        return isValid(parsedDate)
      }
      return false
    },
    [timeZone]
  )

  // Handle input changes
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/_/g, '')
      const isValid = validateDate(value)

      setDateState((prev) => ({
        ...prev,
        input: value,
        valid: isValid,
        selected:
          value.length === 10 && isValid
            ? new TZDate(parse(value, 'MM/dd/yyyy', new Date()), timeZone)
            : prev.selected,
      }))
    },
    [timeZone, validateDate]
  )

  // Handle date selection from calendar
  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (!date) return
    setDateState((prev) => ({
      ...prev,
      selected: date,
      month: date,
      input: formatDate(date, 'MM/dd/yyyy'),
      valid: true,
    }))
    setKey((prev) => prev + 1)
  }, [])

  // Update state when timezone changes
  useEffect(() => {
    if (dateState.selected) {
      setDateState((prev) => ({
        ...prev,
        input: formatDate(prev.selected!, 'MM/dd/yyyy'),
      }))
      setKey((prev) => prev + 1)
    }
  }, [timeZone])

  return (
    <Card className="w-full border-2 hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <span>Date Range Epoch Converter</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Get epoch timestamps for start and end of day/month/year
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex flex-col gap-2">
              <label htmlFor={inputId} className="text-sm font-medium">
                Select Date
              </label>
              <Input
                ref={inputRef}
                id={inputId}
                type="text"
                value={dateState.input}
                placeholder="MM/DD/YYYY"
                onChange={handleInputChange}
                className={cn(
                  'font-mono text-sm',
                  !dateState.valid &&
                    'border-destructive focus-visible:ring-destructive'
                )}
              />
              {!dateState.valid && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Invalid date format (use MM/DD/YYYY)
                </p>
              )}
            </div>
            <Calendar
              key={key}
              mode="single"
              timeZone={timeZone}
              selected={dateState.selected}
              month={dateState.month}
              onMonthChange={(month) =>
                setDateState((prev) => ({ ...prev, month }))
              }
              onSelect={handleDateSelect}
              className="rounded-md border w-full"
            />
          </div>
          <Separator orientation="vertical" className="hidden xl:block" />
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Range Type</label>
              <Select
                value={rangeType}
                onValueChange={(v) => setRangeType(v as RangeDayType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select range type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <EpochRange rangeDate={rangeDate} type={rangeType} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
