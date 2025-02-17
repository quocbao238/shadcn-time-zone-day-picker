import { getDateRangeByQuickOption } from "@/components/timezone-day-picker/_data/helpers";
import {
  QuickOptions,
  TRangePicker,
} from "@/components/timezone-day-picker/_data/schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TimezoneState {
  hydrated?: boolean;
  timeZone: string | undefined;
  checked: boolean;
  date: TRangePicker;
}

export interface TimezoneActions {
  setHasHydrated: (hydrated: boolean) => void;
  setTimeZone: (timeZone: string | undefined) => void;
  setChecked: (checked: boolean) => void;
  setDate: (date: TRangePicker) => void;
}

const initialState: TimezoneState = {
  timeZone: "America/Chicago",
  checked: false,
  hydrated: false,
  date: getDateRangeByQuickOption(
    QuickOptions.TODAY,
    undefined,
    "America/Chicago"
  ),
};

export const useTimezoneStore = create<TimezoneState & TimezoneActions>()(
  persist(
    (set) => ({
      ...initialState,
      setTimeZone: (timeZone) => set({ timeZone }),
      setChecked: (checked) => set({ checked }),
      setDate: (date) => set({ date }),
      setHasHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "timezone",
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    }
  )
);
