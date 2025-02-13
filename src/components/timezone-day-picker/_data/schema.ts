import { Day } from "date-fns";
import { z } from "zod";

export enum QuickOptions {
  TODAY = "Today",
  YESTERDAY = "Yesterday",
  THIS_WEEK = "This Week",
  LAST_WEEK = "Last Week",
  LAST_7_DAYS = "Last 7 Days",
  THIS_MONTH = "This Month",
  LAST_MONTH = "Last Month",
  LAST_30_DAYS = "Last 30 Days",
  LAST_3_MONTHS = "Last 3 Months",
  LAST_6_MONTHS = "Last 6 Months",
  THIS_YEAR = "This Year",
  LAST_YEAR = "Last Year",
  LAST_12_MONTHS = "Last 12 Months",
  CUSTOM = "Custom",
}

export const fullQuickOptions: QuickOptions[] = [
  QuickOptions.TODAY,
  QuickOptions.YESTERDAY,
  QuickOptions.THIS_WEEK,
  QuickOptions.LAST_WEEK,
  QuickOptions.LAST_7_DAYS,
  QuickOptions.THIS_MONTH,
  QuickOptions.LAST_MONTH,
  QuickOptions.LAST_30_DAYS,
  QuickOptions.LAST_3_MONTHS,
  QuickOptions.LAST_6_MONTHS,
  QuickOptions.THIS_YEAR,
  QuickOptions.LAST_YEAR,
  QuickOptions.LAST_12_MONTHS,
  QuickOptions.CUSTOM,
];

export const SUNDAY = 0 as Day;
export const MONDAY = 1 as Day;

export const startOfWeekSchema = z
  .number()
  .int()
  .min(SUNDAY)
  .max(MONDAY)
  .transform((v) => v as Day);

const tRangePickerSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
});


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tQuickOptionSchema = z.object({
  value: z.nativeEnum(QuickOptions),
  ranges: tRangePickerSchema.required(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const propsRangePickerSchema = z.object({
  initQuickOptions: z.nativeEnum(QuickOptions).array().optional(),
  value: tRangePickerSchema.optional(),
  tStartOfWeek: startOfWeekSchema.optional(),
  onChange: z.function().args(tRangePickerSchema).returns(z.void()),
  timeZone: z.string().optional(),
});

export type PropsRangePicker = z.infer<typeof propsRangePickerSchema>;
export type TRangePicker = z.infer<typeof tRangePickerSchema>;
export type TQuickOption = z.infer<typeof tQuickOptionSchema>;
export type TStartOfWeek = z.infer<typeof startOfWeekSchema>;
