'use client'
import RangePicker from '@/components/timezone-day-picker'
import { TimezoneSelector } from '@/components/timezone-day-picker/_components/time-zone-selector'
import { fullQuickOptions } from '@/components/timezone-day-picker/_data/schema'
import { Checkbox } from '@/components/ui/checkbox'
import { TimeZoneCard } from '../components/time-zone-card'
import { useTimezoneStore } from '@/hooks/use-timezone'
import FullScreenLoading from '@/components/full-screen-loading'
import { useEffect } from 'react'
import { getDateRangeByQuickOption } from '@/components/timezone-day-picker/_data/helpers'
import { CalendarRange, Globe, Monitor, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function Page() {
  const {
    hydrated,
    timeZone,
    checked,
    date,
    setTimeZone,
    setChecked,
    setDate,
    quickOptions,
  } = useTimezoneStore()

  useEffect(() => {
    if (hydrated) {
      // Sync checked state: if timeZone is set, checked should be false
      if (timeZone && checked) {
        setChecked(false)
      }
      setDate(getDateRangeByQuickOption(quickOptions, undefined, timeZone))
    }
    // Only run when hydrated or quickOptions change, not timeZone
    // timeZone changes are handled in the TimezoneSelector onChange handler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, quickOptions])

  if (!hydrated) {
    return <FullScreenLoading />
  }

  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <CalendarRange className="size-10 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Date Range Picker
            </h1>
            <p className="text-muted-foreground">
              Select a date range with timezone support
            </p>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <Card className="border-2">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1 w-full lg:w-auto">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Quick Date Range
              </label>
              <RangePicker
                initQuickOptions={fullQuickOptions}
                value={date}
                onChange={setDate}
                timeZone={timeZone}
              />
            </div>

            <div className="flex-1 w-full lg:w-auto">
              <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Select Timezone
              </label>
              <TimezoneSelector
                disabled={checked}
                value={timeZone}
                onChange={(value) => {
                  setTimeZone(value)
                  // When a specific timezone is selected, uncheck "Use Computer Timezone"
                  if (checked) {
                    setChecked(false)
                  }
                  setDate(
                    getDateRangeByQuickOption(quickOptions, undefined, value)
                  )
                }}
                showUSModeSwitch={true}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
            <Checkbox
              checked={checked}
              id="checkbox"
              onCheckedChange={(value: boolean) => {
                setChecked(value)
                if (value) {
                  setTimeZone(undefined)
                  setDate(
                    getDateRangeByQuickOption(
                      quickOptions,
                      undefined,
                      undefined
                    )
                  )
                }
              }}
            />
            <label
              htmlFor="checkbox"
              className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <span>Use Computer Timezone</span>
              <span className="text-xs text-muted-foreground font-normal">
                ({localTimezone})
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Date Range Cards with Flow */}
      <div className="space-y-6">
        {/* Flow Header */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-sm font-medium text-primary">
              Date Range Flow
            </span>
          </div>
        </div>

        {/* Cards with Connector */}
        <div className="relative">
          {/* Desktop Layout with Connector */}
          <div className="hidden md:flex items-stretch gap-6">
            {/* From Card */}
            <div className="flex-1">
              <TimeZoneCard title="From" currentDate={date.from} />
            </div>

            {/* Connector */}
            <div className="flex items-center justify-center px-2">
              <div className="flex items-center gap-0">
                <div className="h-1 w-6 bg-gradient-to-r from-primary/60 to-primary/40 rounded-full"></div>
                <div className="p-2.5 rounded-full bg-background border-2 border-primary shadow-md shadow-primary/20 flex-shrink-0">
                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
                <div className="h-1 w-6 bg-gradient-to-l from-primary/60 to-primary/40 rounded-full"></div>
              </div>
            </div>

            {/* To Card */}
            <div className="flex-1">
              <TimeZoneCard
                title="To"
                currentDate={date.to}
                timeZone={timeZone}
              />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="flex flex-col md:hidden gap-6">
            <TimeZoneCard title="From" currentDate={date.from} />

            {/* Mobile Arrow Connector */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-0.5 bg-gradient-to-b from-primary/60 to-primary/30"></div>
                <div className="p-2.5 rounded-full bg-background border-2 border-primary shadow-md flex-shrink-0">
                  <ArrowRight className="h-5 w-5 text-primary rotate-90" />
                </div>
                <div className="h-6 w-0.5 bg-gradient-to-t from-primary/60 to-primary/30"></div>
              </div>
            </div>

            <TimeZoneCard
              title="To"
              currentDate={date.to}
              timeZone={timeZone}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
