import { getDateRangeByQuickOption } from '@/components/timezone-day-picker/_data/helpers'
import {
  QuickOptions,
  TRangePicker,
} from '@/components/timezone-day-picker/_data/schema'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TimezoneState {
  hydrated?: boolean
  timeZone: string | undefined
  checked: boolean
  quickOptions: QuickOptions
  date: TRangePicker
}

export interface TimezoneActions {
  setHasHydrated: (hydrated: boolean) => void
  setTimeZone: (timeZone: string | undefined) => void
  setChecked: (checked: boolean) => void
  setDate: (date: TRangePicker) => void
  setQuickOptions: (quickOptions: QuickOptions) => void
}

const initialState: TimezoneState = {
  timeZone: 'America/Chicago',
  checked: false,
  hydrated: false,
  quickOptions: QuickOptions.LAST_7_DAYS,
  date: getDateRangeByQuickOption(
    QuickOptions.TODAY,
    undefined,
    'America/Chicago'
  ),
}

export const useTimezoneStore = create<TimezoneState & TimezoneActions>()(
  persist(
    (set) => ({
      ...initialState,
      setTimeZone: (timeZone) => set({ timeZone }),
      setChecked: (checked) => set({ checked }),
      setDate: (date) => set({ date }),
      setHasHydrated: (hydrated) => set({ hydrated }),
      setQuickOptions: (quickOptions) => set({ quickOptions }),
    }),
    {
      name: 'timezone',
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true)
      },
    }
  )
)
