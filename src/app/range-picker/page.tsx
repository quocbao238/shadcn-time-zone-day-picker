"use client";
import RangePicker from "@/components/timezone-day-picker";
import { TimezoneSelector } from "@/components/timezone-day-picker/_components/time-zone-selector";
import { fullQuickOptions } from "@/components/timezone-day-picker/_data/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { TimeZoneCard } from "../components/time-zone-card";
import { useTimezoneStore } from "@/hooks/use-timezone";
import FullScreenLoading from "@/components/full-screen-loading";
import { useEffect } from "react";
import { getDateRangeByQuickOption } from "@/components/timezone-day-picker/_data/helpers";

export default function Page() {
  const {
    hydrated,
    timeZone,
    checked,
    date,
    setTimeZone,
    setChecked,
    setDate,
    quickOptions,
  } = useTimezoneStore();

  useEffect(() => {
    setDate(getDateRangeByQuickOption(quickOptions, undefined, timeZone));
  }, []);

  if (!hydrated) {
    return <FullScreenLoading />;
  }

  return (
    <div className="p-6 flex flex-col gap-4">
      {!hydrated && <FullScreenLoading />}
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
          onChange={(value) => {
            setTimeZone(value);
            setDate(getDateRangeByQuickOption(quickOptions, undefined, value));
          }}
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
        <TimeZoneCard title="To" currentDate={date.to} timeZone={timeZone} />
      </div>
    </div>
  );
}
