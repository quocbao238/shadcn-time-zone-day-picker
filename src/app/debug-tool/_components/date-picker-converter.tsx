"use client";
import { useTimezoneStore } from "@/hooks/use-timezone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useId, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  RangeDayType,
  TRangePicker,
} from "@/components/timezone-day-picker/_data/schema";
import {
  getNewDate,
  getTzRangeByType,
} from "@/components/timezone-day-picker/_data/helpers";
import { endOfDay, getUnixTime, isValid, parse } from "date-fns";
import { Input } from "@/components/ui/input";

const EpochRange = ({
  rangeDate,
  type,
}: {
  rangeDate: TRangePicker;
  type: RangeDayType;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-row gap-4 ">
        <div className="space-y-2">
          <p className="font-bold text-base">{`Start of ${type}`}</p>
          <Separator />
          <p className="text-muted-foreground">
            Tz Time:{" "}
            <span className="text-primary font-bold">
              {rangeDate.from.toString()}
            </span>
          </p>

          <p className="text-muted-foreground">
            UTC Time:{" "}
            <span className="text-primary font-bold">
              {rangeDate.from.toUTCString()}
            </span>
          </p>
          <p className="text-muted-foreground">
            ISO Time:{" "}
            <span className="text-primary font-bold">
              {rangeDate.from.toISOString()}
            </span>
          </p>
          <p className="text-muted-foreground">
            Unix:{" "}
            <span className="text-primary font-bold">
              {getUnixTime(rangeDate.from)}
            </span>
          </p>
        </div>
        <Separator orientation="vertical" />

        <div className="space-y-2">
          <p className="font-bold text-base">{`End of ${type}`}</p>
          <Separator />
          <p className="text-muted-foreground">
            Tz Time:{" "}
            <span className="text-primary font-bold">
              {rangeDate.to.toString()}
            </span>
          </p>

          <p className="text-muted-foreground">
            UTC Time:{" "}
            <span className="text-primary font-bold">
              {rangeDate.to.toUTCString()}
            </span>
          </p>
          <p className="text-muted-foreground">
            ISO Time:{" "}
            <span className="text-primary font-bold">
              {rangeDate.to.toISOString()}
            </span>
          </p>
          <p className="text-muted-foreground">
            Unix:{" "}
            <span className="text-primary font-bold">
              {getUnixTime(rangeDate.to)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default function DatePickerConverter() {
  const { timeZone } = useTimezoneStore();
  const inputId = useId();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [rangeType, setRangeType] = useState<RangeDayType>("day");
  const [rangeDate, setRangeDate] = useState<TRangePicker>(
    getTzRangeByType({
      type: rangeType,
      timeZone,
      date: selectedDate ?? new Date(),
    })
  );

  // Hold the month in state to control the calendar when the input changes
  const [month, setMonth] = useState(new Date());
  // Hold the input value in state
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (selectedDate)
      setRangeDate(
        getTzRangeByType({
          type: rangeType,
          timeZone,
          date: selectedDate,
        })
      );
  }, [selectedDate, rangeType, timeZone]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // keep the input value in sync
    const parsedDate = parse(e.target.value, "MM/dd/yyyy", new Date());

    if (isValid(parsedDate)) {
      setSelectedDate(parsedDate);
      setMonth(parsedDate);
    } else {
      setSelectedDate(undefined);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Epoch dates for the start and end of the year/month/day
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex flex-col gap-4">
            <Input
              style={{ fontSize: "inherit" }}
              id={inputId}
              type="text"
              value={inputValue}
              placeholder="MM/dd/yyyy"
              onChange={handleInputChange}
            />
            <Calendar
              mode="single"
              timeZone={timeZone}
              selected={selectedDate}
              disabled={[
                {
                  after: endOfDay(getNewDate(timeZone)),
                },
              ]}
              onDayClick={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </div>
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-row w-full">
              <Select
                value={rangeType}
                onValueChange={(value: "day" | "month" | "year") =>
                  setRangeType(value)
                }
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
  );
}
