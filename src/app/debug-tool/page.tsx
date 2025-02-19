"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { TZDate } from "react-day-picker";
import { TimeInfo } from "../components/time-zone-card";
import { useTimezoneStore } from "@/hooks/use-timezone";
import { Input } from "@/components/ui/input";
import FullScreenLoading from "@/components/full-screen-loading";
import { TimezoneSelector } from "@/components/timezone-day-picker/_components/time-zone-selector";
import { fromUnixTime } from "date-fns";
import { getTzDateByUnixTime } from "@/components/timezone-day-picker/_data/helpers";

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
      </div>
    </div>
  );
}

const UnixTimeConverter = () => {
  const { timeZone } = useTimezoneStore();
  const [unixTime, setUnixTime] = useState(1739775687);
  const date = fromUnixTime(unixTime);
  const tzDate = getTzDateByUnixTime(unixTime, timeZone);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Unix Timestamp Converter{" "}
          <span className="text-base font-normal text-muted-foreground">
            (Ex: 1739775687)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <p className="font-semibold">Input:</p>
          <Input
            type="number"
            value={unixTime}
            onChange={(e) => {
              if (e.target.value === "") return setUnixTime(0);
              return setUnixTime(parseInt(e.target.value));
            }}
          />
        </div>
        <div>
          <div>
            <p className="font-semibold">Local Time:</p>
            <TimeInfo time={date} />
          </div>
          {timeZone && (
            <div>
              <p className="font-semibold">{timeZone} Time:</p>
              <TimeInfo time={tzDate} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ISO8601Converter = () => {
  const { timeZone } = useTimezoneStore();
  const [dateString, setDateString] = useState("2025-02-12T11:00:00.000Z");
  const [isValidDate, setIsValidDate] = useState(true);

  // Validate and create date objects
  const date = useMemo(() => {
    try {
      const parsedDate = new Date(dateString);
      if (isNaN(parsedDate.getTime())) {
        setIsValidDate(false);
        return null;
      }
      setIsValidDate(true);
      return parsedDate;
    } catch {
      setIsValidDate(false);
      return null;
    }
  }, [dateString]);

  const tzDate = useMemo(() => {
    if (!date || !timeZone) return null;
    try {
      return new TZDate(date, timeZone);
    } catch {
      return null;
    }
  }, [date, timeZone]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          ISO 8601 Converter{" "}
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
            className={!isValidDate ? "border-red-500" : ""}
          />
          {!isValidDate && (
            <p className="text-sm text-red-500">
              Please enter a valid ISO 8601 date
            </p>
          )}
        </div>

        <div>
          <p className="font-semibold">Local Time:</p>
          {date ? (
            <TimeInfo time={date} />
          ) : (
            <p className="text-muted-foreground">Invalid date format</p>
          )}
        </div>

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
  );
};
