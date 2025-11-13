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
  usMode: boolean
}

export interface TimezoneActions {
  setHasHydrated: (hydrated: boolean) => void
  setTimeZone: (timeZone: string | undefined) => void
  setChecked: (checked: boolean) => void
  setDate: (date: TRangePicker) => void
  setQuickOptions: (quickOptions: QuickOptions) => void
  setUsMode: (usMode: boolean) => void
}

const initialState: TimezoneState = {
  timeZone: 'America/Chicago',
  checked: false,
  hydrated: false,
  quickOptions: QuickOptions.LAST_7_DAYS,
  usMode: false,
  date: getDateRangeByQuickOption(
    QuickOptions.TODAY,
    undefined,
    'America/Chicago'
  ),
}

// Cache server snapshot to avoid infinite loop
const getCachedServerSnapshot = (() => {
  let cached: TimezoneState & TimezoneActions | null = null
  return (): TimezoneState & TimezoneActions => {
    if (!cached) {
      cached = {
        ...initialState,
        setTimeZone: () => {},
        setChecked: () => {},
        setDate: () => {},
        setHasHydrated: () => {},
        setQuickOptions: () => {},
      }
    }
    return cached
  }
})()

export const useTimezoneStore = create<TimezoneState & TimezoneActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      setTimeZone: (timeZone) => {
        // If a specific timezone is set, uncheck "Use Computer Timezone"
        if (timeZone && get().checked) {
          set({ timeZone, checked: false })
        } else {
          set({ timeZone })
        }
      },
      setChecked: (checked) => {
        // If "Use Computer Timezone" is checked, clear timeZone
        if (checked) {
          set({ checked, timeZone: undefined })
        } else {
          set({ checked })
        }
      },
      setDate: (date) => set({ date }),
      setHasHydrated: (hydrated) => set({ hydrated }),
      setQuickOptions: (quickOptions) => set({ quickOptions }),
      setUsMode: (usMode) => set({ usMode }),
    }),
    {
      name: 'timezone-storage',
      // Only persist these fields
      partialize: (state) => ({
        timeZone: state.timeZone,
        checked: state.checked,
        quickOptions: state.quickOptions,
        date: state.date,
        usMode: state.usMode,
      }),
      // Cache server snapshot to avoid infinite loop
      getServerSnapshot: getCachedServerSnapshot,
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            console.error('Error rehydrating timezone store:', error)
          }
          if (state) {
            // Sync state: if timeZone is set, checked should be false
            // This ensures consistency when rehydrating from localStorage
            if (state.timeZone && state.checked) {
              state.setChecked(false)
            }
            // Mark as hydrated after rehydration completes
            state.setHasHydrated(true)
          } else {
            // If no state, mark as hydrated anyway (first time user)
            if (typeof window !== 'undefined') {
              setTimeout(() => {
                useTimezoneStore.getState().setHasHydrated(true)
              }, 0)
            }
          }
        }
      },
    }
  )
)
