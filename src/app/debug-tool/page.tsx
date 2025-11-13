'use client'
import { useTimezoneStore } from '@/hooks/use-timezone'
import FullScreenLoading from '@/components/full-screen-loading'
import { TimezoneSelector } from '@/components/timezone-day-picker/_components/time-zone-selector'
import { UnixTimeConverter } from './_components/unix-time-converter'
import { ISO8601Converter } from './_components/iso8061-converter'
import DatePickerConverter from './_components/date-picker-converter'
import { Wrench } from 'lucide-react'

export default function Page() {
  const { timeZone, hydrated, setTimeZone } = useTimezoneStore()

  return (
    <div className="flex flex-col gap-6 p-6 w-full  ">
      {!hydrated && <FullScreenLoading />}

      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wrench className="size-10 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Debug Tools</h1>
            <p className="text-muted-foreground">
              Convert and debug timezone-related date formats
            </p>
          </div>
        </div>
      </div>

      {/* Timezone Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          Select Timezone
        </label>
        <TimezoneSelector
          disabled={false}
          value={timeZone}
          onChange={setTimeZone}
        />
      </div>

      {/* Converter Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <ISO8601Converter />
        <UnixTimeConverter />
        <div className="lg:col-span-2">
          <DatePickerConverter />
        </div>
      </div>
    </div>
  )
}
