"use client";
import { useTimezoneStore } from "@/hooks/use-timezone";
import FullScreenLoading from "@/components/full-screen-loading";
import { TimezoneSelector } from "@/components/timezone-day-picker/_components/time-zone-selector";
import { UnixTimeConverter } from "./_components/unix-time-converter";
import { ISO8601Converter } from "./_components/iso8061-converter";
import DatePickerConverter from "./_components/date-picker-converter";

export default function Page() {
  const { timeZone, hydrated, setTimeZone } = useTimezoneStore();

  return (
    <div className="flex flex-col gap-4 p-6 w-full">
      {!hydrated && <FullScreenLoading />}
      <TimezoneSelector
        disabled={false}
        value={timeZone}
        onChange={setTimeZone}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <ISO8601Converter />
        <UnixTimeConverter />
        <DatePickerConverter />
      </div>
    </div>
  );
}
