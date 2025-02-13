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
} from "date-fns";
import { TZDate } from "react-day-picker";
import { z } from "zod";
import {
  MONDAY,
  QuickOptions,
  startOfWeekSchema,
  TQuickOption,
  TRangePicker,
  TStartOfWeek,
} from "./schema";

const INDEX_LAST_7_DAYS = 4;

export const QuickDateRangeOptions = (
  tStartOfWeek?: TStartOfWeek,
  timeZone?: string
): TQuickOption[] => {
  const today = getNewDate(timeZone);

  tStartOfWeek = tStartOfWeek ?? MONDAY;
  if (startOfWeekSchema.safeParse(tStartOfWeek).error) {
    throw new Error("tStartOfWeek should be {SUNDAY} or {MONDAY} as Day type");
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
  ];
};

/// value: QuickOptions
/// weekConfig defaults to WEEK_CONFIG_FROM_MONDAY
export const getDateRangeByQuickOption = (
  value: QuickOptions,
  tStartOfWeek?: TStartOfWeek,
  timeZone?: string
): TRangePicker => {
  const quickDateRanges = QuickDateRangeOptions(tStartOfWeek, timeZone);
  return (
    quickDateRanges.find((option) => option.value === value) ??
    quickDateRanges[INDEX_LAST_7_DAYS]
  ).ranges;
};

export const getRangeUnixTime = (
  value: QuickOptions,
  tStartOfWeek?: TStartOfWeek
) => {
  const quickDateRanges = QuickDateRangeOptions(tStartOfWeek);
  const values = (
    quickDateRanges.find((option) => option.value === value) ??
    quickDateRanges[INDEX_LAST_7_DAYS]
  ).ranges;

  const from = getUnixTime(values.from);
  const to = getUnixTime(values.to);

  return { from, to };
};

export const getQuickOptionByUnixTime = (
  from: number,
  to: number,
  tStartOfWeek?: TStartOfWeek,
  timeZone?: string
): QuickOptions => {
  const ranges = {
    from: fromUnixTime(from),
    to: fromUnixTime(to),
  };

  return (
    QuickDateRangeOptions(tStartOfWeek, timeZone).find(
      (option) =>
        isSameDay(option.ranges.from, ranges.from) &&
        isSameDay(option.ranges.to, ranges.to)
    )?.value ?? QuickOptions.CUSTOM
  );
};

export const getQuickOptionByRanges = (
  ranges: TRangePicker | undefined,
  tStartOfWeek?: TStartOfWeek,
  timeZone?: string
): QuickOptions => {
  if (!ranges) return QuickOptions.CUSTOM;
  return (
    QuickDateRangeOptions(tStartOfWeek, timeZone).find((option) => {
      return (
        isSameDay(option.ranges.from, ranges.from) &&
        isSameDay(option.ranges.to, ranges.to)
      );
    })?.value ?? QuickOptions.CUSTOM
  );
};

export function getDefaultsVariableSchema<Schema extends z.AnyZodObject>(
  schema: Schema
) {
  return Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault)
        return [key, value._def.defaultValue()];
      return [key, undefined];
    })
  );
}

export const formatTzTime = (date: Date, timeZone?: string) =>
  date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone,
  });

export const formatTzDate = (date: Date, timeZone?: string) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    day: "numeric",
    timeZone,
  });

export const getNewDate = (timeZone?: string) => {
  return timeZone ? new TZDate(new Date(), timeZone) : new Date();
};
