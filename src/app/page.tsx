"use client";
import { useEffect, useState } from "react";
import { getUnixTime } from "date-fns";
import { TZDate } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fullQuickOptions,
  QuickOptions,
  TRangePicker,
} from "@/components/timezone-day-picker/_data/schema";
import {
  formatTzDate,
  formatTzTime,
  getDateRangeByQuickOption,
} from "@/components/timezone-day-picker/_data/helpers";
import { Separator } from "@/components/ui/separator";
import RangePicker from "@/components/timezone-day-picker";
import { TimezoneSelector } from "@/components/timezone-day-picker/_components/time-zone-selector";

import { Checkbox } from "@/components/ui/checkbox";
export default function Page() {
  const [timeZone, setTimeZone] = useState<string | undefined>(
    "America/Chicago"
  );
  const [checked, setChecked] = useState(false);
  const initRangeDate = getDateRangeByQuickOption(
    QuickOptions.TODAY,
    undefined,
    timeZone
  );
  const [date, setDate] = useState<TRangePicker>(initRangeDate);

  useEffect(() => {
    setDate(getDateRangeByQuickOption(QuickOptions.TODAY, undefined, timeZone));
  }, [timeZone]);

  return (
    <div className="flex h-full w-full flex-col items-start justify-center space-y-4 p-4">
      <div className="space-y-6 w-full">
        <TimeNow timeZone={timeZone} />
        <div className="flex flex-wrap w-full gap-4">
          <RangePicker
            initQuickOptions={fullQuickOptions}
            value={date}
            onChange={setDate}
            timeZone={timeZone}
          />
          <TimezoneSelector
            disabled={checked}
            value={timeZone}
            onChange={setTimeZone}
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={checked}
              id="checkbox"
              onCheckedChange={(value: boolean) => {
                setChecked(value);
                if (value) {
                  setTimeZone(undefined);
                }
              }}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Use Computer Timezone (
              {Intl.DateTimeFormat().resolvedOptions().timeZone})
            </label>
          </div>
        </div>
        <div className="flex flex-row gap-6">
          <TimeZoneCard title="From" currentDate={date.from} />
          <TimeZoneCard
            title={"To"}
            currentDate={date.to}
            timeZone={timeZone}
          />
        </div>
      </div>
    </div>
  );
}

const TimeNow = ({ timeZone }: { timeZone?: string }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const nowTz = new TZDate(new Date(), timeZone);
  return (
    <div className="flex flex-wrap gap-6 w-full">
      <TimeZoneCard title="Local Time" currentDate={now} />
      <TimeZoneCard
        title={timeZone ?? "Local Time"}
        currentDate={nowTz}
        timeZone={timeZone}
      />
      <div className="w-full">
        <TimeDiff tzDate={nowTz} localTime={now} timeZone={timeZone} />
      </div>
    </div>
  );
};

const TimeInfo = ({ time }: { time: Date }) => (
  <div className="flex flex-col gap-1">
    <div className="space-y-1">
      <p className="font-medium text-primary">{time.toString()}</p>
      <p className="text-sm text-muted-foreground">{time.toUTCString()}</p>
      <p className="text-sm text-muted-foreground">
        Unix:{" "}
        <code className="rounded bg-muted px-2 py-1">{getUnixTime(time)}</code>
      </p>
    </div>
  </div>
);

function TimeZoneCard({
  title,
  currentDate,
  timeZone,
}: {
  title: string;
  currentDate: Date;
  timeZone?: string;
}) {
  return (
    <Card className="w-full md:w-[45%]">
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
  );
}

const TimeDiff = ({
  tzDate,
  localTime,
  timeZone,
}: {
  tzDate: Date;
  localTime: Date;
  timeZone?: string;
}) => {
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Calculate difference

  const targetOffset = tzDate.getTimezoneOffset();
  const localOffset = localTime.getTimezoneOffset();
  // Calculate exact difference (keeping sign)
  const diffMinutes = localOffset - targetOffset;
  const sign = diffMinutes >= 0 ? "+" : "-";

  // Convert to hours and minutes
  const absHours = Math.floor(Math.abs(diffMinutes) / 60);
  const absMinutes = Math.abs(diffMinutes) % 60;

  const timeString = [
    absHours > 0 ? `${absHours} hours` : null,
    absMinutes > 0 ? `${absMinutes} minutes` : null,
  ]
    .filter(Boolean)
    .join(" and ");

  return (
    <Card className="w-full md:w-[45%]">
      <CardHeader>
        <CardTitle>Time Difference</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 w-fit">
        <p className="font-bold text-2xl">
          {sign}
          {timeString}
        </p>
        <p>
          The time in {timeZone} is currently {timeString}
          {diffMinutes > 0 ? " ahead of " : " behind "}
          the time in {localTimezone}.
        </p>
      </CardContent>
    </Card>
  );
};
