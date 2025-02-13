import { useEffect, useState } from "react";
import {
  differenceInDays,
  endOfDay,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TRangePicker } from "../_data/schema";
import { CalendarIcon } from "lucide-react";
import { formatTzDate, getNewDate } from "../_data/helpers";

export const DateRangePicker = ({
  value,
  onChange,
  timeZone,
}: {
  value: TRangePicker | undefined;
  onChange: (value: { from: Date; to: Date }) => void;
  timeZone?: string;
}) => {
  const [date, setDate] = useState<TRangePicker | undefined>(value);

  useEffect(() => {
    if (!value) return;
    setDate(value);
  }, [value]);

  const handleDateChange = (value: Date) => {
    if (date) {
      const isCurrentSameDay = isSameDay(date.from, date.to);

      const isDiffWithCurrentFrom = differenceInDays(value, date.from);
      const isDiffWithCurrentTo = differenceInDays(value, date.to);

      if (isCurrentSameDay) {
        const isSelectedAfterCurrent = isAfter(value, date.from);
        const isSelectedBeforeCurrent = isBefore(value, date.from);
        if (isSelectedAfterCurrent) {
          setDate({ ...date, to: endOfDay(value) });
        }
        if (isSelectedBeforeCurrent) {
          setDate({ ...date, from: startOfDay(value) });
        }
        return;
      }

      if (isDiffWithCurrentFrom || isDiffWithCurrentTo) {
        setDate({ ...date, from: startOfDay(value), to: endOfDay(value) });
        return;
      }
    }
  };

  useEffect(() => {
    if (!date?.from || !date?.to) return;
    onChange(date);
  }, [onChange, date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "w-[260px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {date?.from ? (
            date.to ? (
              <>
                {formatTzDate(date.from)} - {formatTzDate(date.to)}
              </>
            ) : (
              formatTzDate(date.from)
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          timeZone={timeZone}
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          disabled={[
            {
              after: endOfDay(getNewDate(timeZone)),
            },
          ]}
          onDayClick={(day) => handleDateChange(day)}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};
