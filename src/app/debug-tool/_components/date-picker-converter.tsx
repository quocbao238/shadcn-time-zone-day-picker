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
import { formatDate, isValid, parse } from "date-fns";
import { Input } from "@/components/ui/input";
import { useMask } from "@react-input/mask";
import { EpochRange } from "./epoch-range";

export default function DatePickerConverter() {
  const { timeZone } = useTimezoneStore();
  const inputId = useId();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [month, setMonth] = useState<Date | undefined>(selectedDate);
  const [key, setKey] = useState(0);
  const [validDate, setValidDate] = useState<boolean>(true);
  const [rangeType, setRangeType] = useState<RangeDayType>("day");
  const [rangeDate, setRangeDate] = useState<TRangePicker>(
    getTzRangeByType({
      type: rangeType,
      timeZone,
      date: selectedDate ?? new Date(),
    })
  );
  const [inputValue, setInputValue] = useState<string>("");

  const maskInput = {
    mask: "__/__/____",
    replacement: { _: /\d/ },
  };
  const inputRef = useMask(maskInput);

  useEffect(() => {
    if (selectedDate) {
      setRangeDate(
        getTzRangeByType({
          type: rangeType,
          timeZone,
          date: selectedDate,
        })
      );
      setInputValue(formatDate(selectedDate, "MM/dd/yyyy"));
      setMonth(selectedDate); // Update month when date changes
      setKey((prev) => prev + 1);
    }
  }, [selectedDate, rangeType, timeZone]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/_/g, ""); // Remove mask characters
    setInputValue(value);
    setValidDate(validateDate(value));
    if (value.length === 10) {
      const parsedDate = parse(value, "MM/dd/yyyy", getNewDate(timeZone));
      if (isValid(parsedDate)) {
        setSelectedDate(parsedDate);
      }
    } else {
      console.log("herre");

      setSelectedDate(undefined);
    }
  };

  const validateDate = (date: string): boolean => {
    if (date.length === 10) {
      const parsedDate = parse(date, "MM/dd/yyyy", getNewDate(timeZone));
      return isValid(parsedDate);
    }
    return false;
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
              ref={inputRef}
              style={{ fontSize: "inherit" }}
              id={inputId}
              type="text"
              value={inputValue}
              placeholder="MM/DD/YYYY"
              onChange={handleInputChange}
              className="font-mono" // Use monospace font for better mask alignment
            />
            {!validDate && (
              <p className="text-red-500 text-sm">Invalid date format</p>
            )}
            <Calendar
              key={key}
              mode="single"
              timeZone={timeZone}
              selected={selectedDate}
              month={month}
              onMonthChange={setMonth}
              onDayClick={(date) => {
                return date && setSelectedDate(date);
              }}
              className="rounded-md border w-full"
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
