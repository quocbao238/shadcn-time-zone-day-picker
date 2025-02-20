import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  fromUnixTime,
  getUnixTime,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
} from 'date-fns'
import { TZDate } from 'react-day-picker'
import {
  MONDAY,
  QuickOptions,
  RangeDayType,
  startOfWeekSchema,
  TQuickOption,
  TRangePicker,
  TStartOfWeek,
} from './schema'

const INDEX_LAST_7_DAYS = 4

export const QuickDateRangeOptions = (
  tStartOfWeek?: TStartOfWeek,
  timeZone?: string
): TQuickOption[] => {
  const today = getNewDate(timeZone)

  tStartOfWeek = tStartOfWeek ?? MONDAY
  if (startOfWeekSchema.safeParse(tStartOfWeek).error) {
    throw new Error('tStartOfWeek should be {SUNDAY} or {MONDAY} as Day type')
  }

  return [
    {
      value: QuickOptions.TODAY,
      ranges: {
        from: startOfDay(today),
        to: endOfDay(today),
      },
    },
    {
      value: QuickOptions.YESTERDAY,
      ranges: {
        from: startOfDay(subDays(today, 1)),
        to: endOfDay(subDays(today, 1)),
      },
    },
    {
      value: QuickOptions.THIS_WEEK,
      ranges: {
        from: startOfWeek(today, { weekStartsOn: tStartOfWeek }), // Assuming week starts on Sunday
        to: endOfDay(today),
      },
    },
    {
      value: QuickOptions.LAST_WEEK,
      ranges: {
        from: startOfDay(
          startOfWeek(subDays(today, 7), { weekStartsOn: tStartOfWeek })
        ),
        to: endOfDay(
          endOfWeek(subDays(today, 7), { weekStartsOn: tStartOfWeek })
        ),
      },
    },
    {
      value: QuickOptions.LAST_7_DAYS,
      ranges: {
        from: startOfDay(subDays(today, 6)),
        to: endOfDay(today),
      },
    },
    {
      value: QuickOptions.THIS_MONTH,
      ranges: {
        from: startOfMonth(today),
        to: endOfDay(today),
      },
    },
    {
      value: QuickOptions.LAST_MONTH,
      ranges: {
        from: startOfDay(startOfMonth(subMonths(today, 1))),
        to: endOfDay(endOfMonth(subMonths(today, 1))),
      },
    },
    {
      value: QuickOptions.LAST_30_DAYS,
      ranges: {
        from: startOfDay(subDays(today, 29)),
        to: endOfDay(today),
      },
    },
    {
      value: QuickOptions.LAST_3_MONTHS,
      ranges: {
        from: startOfDay(subMonths(today, 3)),
        to: endOfDay(today),
      },
    },
    {
      value: QuickOptions.LAST_6_MONTHS,
      ranges: {
        from: startOfDay(subMonths(today, 6)),
        to: endOfDay(today),
      },
    },
    {
      value: QuickOptions.THIS_YEAR,
      ranges: {
        from: startOfYear(today),
        to: endOfDay(today),
      },
    },
    {
      value: QuickOptions.LAST_YEAR,
      ranges: {
        from: startOfDay(startOfYear(subMonths(today, 12))),
        to: endOfDay(endOfYear(subMonths(today, 12))),
      },
    },
    {
      value: QuickOptions.LAST_12_MONTHS,
      ranges: {
        from: startOfDay(subMonths(today, 12)),
        to: endOfDay(today),
      },
    },
    {
      value: QuickOptions.CUSTOM,
      ranges: {
        from: new Date(0), // Placeholder for custom range logic
        to: getNewDate(timeZone),
      },
    },
  ]
}

/// value: QuickOptions
/// weekConfig defaults to WEEK_CONFIG_FROM_MONDAY
export const getDateRangeByQuickOption = (
  value: QuickOptions,
  tStartOfWeek?: TStartOfWeek,
  timeZone?: string
): TRangePicker => {
  const quickDateRanges = QuickDateRangeOptions(tStartOfWeek, timeZone)
  return (
    quickDateRanges.find((option) => option.value === value) ??
    quickDateRanges[INDEX_LAST_7_DAYS]
  ).ranges
}

export const getRangeUnixTime = (
  value: QuickOptions,
  tStartOfWeek?: TStartOfWeek
) => {
  const quickDateRanges = QuickDateRangeOptions(tStartOfWeek)
  const values = (
    quickDateRanges.find((option) => option.value === value) ??
    quickDateRanges[INDEX_LAST_7_DAYS]
  ).ranges

  const from = getUnixTime(values.from)
  const to = getUnixTime(values.to)

  return { from, to }
}

export const getQuickOptionByUnixTime = (
  from: number,
  to: number,
  tStartOfWeek?: TStartOfWeek,
  timeZone?: string
): QuickOptions => {
  const ranges = {
    from: fromUnixTime(from),
    to: fromUnixTime(to),
  }

  return (
    QuickDateRangeOptions(tStartOfWeek, timeZone).find(
      (option) =>
        isSameDay(option.ranges.from, ranges.from) &&
        isSameDay(option.ranges.to, ranges.to)
    )?.value ?? QuickOptions.CUSTOM
  )
}

export const getQuickOptionByRanges = (
  ranges: TRangePicker | undefined,
  tStartOfWeek?: TStartOfWeek,
  timeZone?: string
): QuickOptions => {
  if (!ranges) return QuickOptions.CUSTOM
  return (
    QuickDateRangeOptions(tStartOfWeek, timeZone).find((option) => {
      return (
        isSameDay(option.ranges.from, ranges.from) &&
        isSameDay(option.ranges.to, ranges.to)
      )
    })?.value ?? QuickOptions.CUSTOM
  )
}
export const formatTzTime = (date: Date, timeZone?: string) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '-'
  }
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone,
  })
}

export const formatTzDate = (date: Date, timeZone?: string) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '-'
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
    timeZone,
  })
}

export const getNewDate = (timeZone?: string) => {
  return timeZone ? new TZDate(new Date(), timeZone) : new Date()
}

export const getTzDateByUnixTime = (
  unixTime: number,
  timeZone?: string | null
) => {
  return timeZone
    ? new TZDate(fromUnixTime(unixTime), timeZone)
    : fromUnixTime(unixTime)
}

export function getGMTOffset(date: Date) {
  const offset = date.getTimezoneOffset() // Get offset in minutes
  const hours = Math.abs(Math.floor(offset / 60))
  const minutes = Math.abs(offset % 60)
  const sign = offset > 0 ? '-' : '+' // Inverted because getTimezoneOffset() returns the opposite

  return `GMT${sign}${String(hours).padStart(2, '0')}:${String(
    minutes
  ).padStart(2, '0')}`
}

export function getGMTOffsetByTimezone(timezone: string) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour12: false,
      timeZoneName: 'longOffset',
    })

    const parts = formatter.formatToParts(getNewDate(timezone))
    const offsetPart = parts.find((part) => part.type === 'timeZoneName')

    if (!offsetPart) return 'Invalid Timezone'

    let offset = offsetPart.value.replace('UTC', 'GMT')

    // Ensure offset is always in (GMT±HH:MM) format
    /*
    /([+-])(\d)$/ → This is a regular expression (regex):
    ([+-]) → Matches the + or - sign (indicating the offset direction).
    (\d)$ → Matches a single digit (a single-digit hour, like GMT+9 or GMT-5).
    "$10$2:00" → This formats the offset as GMT±0H:00:
    $1 → Inserts the + or - sign.
    0$2 → Adds a 0 before the single-digit hour.
    :00 → Adds :00 to the end.
    */

    return offset.includes(':')
      ? offset
      : offset.replace(/([+-])(\d)$/, '$10$2:00')
  } catch (error) {
    return 'Invalid Timezone'
  }
}

export function getTzRangeByType({
  type,
  date,
  timeZone,
}: {
  type: RangeDayType
  date: Date
  timeZone?: string
}): TRangePicker {
  const day = timeZone ? new TZDate(date, timeZone) : date
  if (type === 'day') {
    return {
      from: startOfDay(day),
      to: endOfDay(day),
    }
  }
  if (type === 'month') {
    return {
      from: startOfMonth(day),
      to: endOfMonth(day),
    }
  }

  if (type === 'year') {
    return {
      from: startOfYear(day),
      to: endOfYear(day),
    }
  }

  throw new Error('Invalid range type')
}
