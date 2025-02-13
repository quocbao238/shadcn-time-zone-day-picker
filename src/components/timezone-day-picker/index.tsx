"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import {
  getDateRangeByQuickOption,
  getQuickOptionByRanges,
  QuickDateRangeOptions,
} from "./_data/helpers";
import { PropsRangePicker, QuickOptions, TQuickOption } from "./_data/schema";
import { DateRangePicker } from "./_components/date-range-picker";

const RangePicker = ({
  value,
  onChange,
  initQuickOptions,
  tStartOfWeek,
  timeZone,
}: PropsRangePicker) => {
  const [listOptions, setListOptions] = useState<TQuickOption[]>(
    QuickDateRangeOptions(tStartOfWeek, timeZone)
  );
  const [quickFilter, setQuickFilter] = useState<QuickOptions>(
    getQuickOptionByRanges(value, tStartOfWeek, timeZone)
  );

  useEffect(() => {
    if (initQuickOptions) {
      const clearList: TQuickOption[] = listOptions.filter((option) =>
        [...initQuickOptions, QuickOptions.CUSTOM].includes(option.value)
      );
      setListOptions(clearList);
    }
  }, [initQuickOptions]);

  useEffect(() => {
    if (!value) return;
    const filter = getQuickOptionByRanges(value, tStartOfWeek, timeZone);
    if (!filter) return;
    if (initQuickOptions && !initQuickOptions.includes(filter)) {
      setQuickFilter(QuickOptions.CUSTOM);
      return;
    }
    setQuickFilter(filter);
  }, [value]);

  return (
    <div className="flex gap-2">
      <Select
        value={quickFilter.toString()}
        onValueChange={(value: QuickOptions) =>
          onChange(getDateRangeByQuickOption(value, tStartOfWeek, timeZone))
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Quick filter">
            {quickFilter.toString()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Quick filter</SelectLabel>
            {Object.entries(listOptions).map(([index, value]) => {
              if (value.value === QuickOptions.CUSTOM) return null;
              return (
                <SelectItem key={index} value={value.value}>
                  {value.value}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      <DateRangePicker timeZone={timeZone} value={value} onChange={onChange} />
    </div>
  );
};

export default RangePicker;
