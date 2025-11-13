import { useRef, useState, useCallback } from 'react'
import { useSize } from '@radix-ui/react-use-size'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { timezones, getOffsetByLabel } from '../_data/timezone'
import { usTimezones } from '../_data/us-timezones'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useTimezoneStore } from '@/hooks/use-timezone'

export const TimezoneSelector = ({
  value,
  onChange,
  disabled = false,
  showUSModeSwitch = false,
}: {
  disabled?: boolean
  value?: string
  onChange: (value: string) => void
  showUSModeSwitch?: boolean
}) => {
  const buttonRef = useRef(null)
  const buttonSize = useSize(buttonRef.current)
  const [open, setOpen] = useState(false)
  const usMode = useTimezoneStore((state) => state.usMode)
  const setUsMode = useTimezoneStore((state) => state.setUsMode)
  const isModeChangingRef = useRef(false)
  const onChangeRef = useRef(onChange)
  const valueRef = useRef(value)

  // Keep refs up to date
  onChangeRef.current = onChange
  valueRef.current = value

  // Handle mode change - reset value if current timezone is not in the new list
  const handleModeChange = useCallback((newMode: boolean) => {
    // Prevent multiple simultaneous mode changes
    if (isModeChangingRef.current) return
    isModeChangingRef.current = true

    setUsMode(newMode)
    
    // Use setTimeout to defer the onChange call after the state update completes
    setTimeout(() => {
      const currentValue = valueRef.current
      if (currentValue) {
        if (newMode) {
          // Switching to US mode - check if current value is a US timezone
          const isUSTimezone = usTimezones.some(
            (tz) => tz.value.toLowerCase() === currentValue.toLowerCase()
          )
          if (!isUSTimezone) {
            // Reset to first US timezone if current is not US
            onChangeRef.current(usTimezones[0].value)
          }
        } else {
          // Switching to full mode - check if current value exists in full list
          const existsInFullList = timezones.some(
            (tz) => tz.label.toLowerCase() === currentValue.toLowerCase()
          )
          if (!existsInFullList) {
            // Reset to first timezone if current doesn't exist
            onChangeRef.current(timezones[0].label)
          }
        }
      }
      isModeChangingRef.current = false
    }, 0)
  }, [])

  // Get current timezone list based on mode
  const currentTimezones = usMode
    ? usTimezones.map((tz) => ({ label: tz.value }))
    : timezones

  const selectedTimezone = currentTimezones.find(
    (timezone) => timezone.label.toLowerCase() === value?.toLowerCase()
  )

  // For US mode, find the US timezone object
  const selectedUsTimezone = usMode
    ? usTimezones.find((tz) => tz.value.toLowerCase() === value?.toLowerCase())
    : null

  const selectedOffset = value ? getOffsetByLabel(value) : undefined
  return (
    <Popover open={open} onOpenChange={(open) => setOpen(open)}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          className={cn(!value && 'text-muted-foreground', 'min-w-[300px]')}
          ref={buttonRef}
        >
          <div className="flex w-full items-center justify-between text-start">
            <div className="block flex-1">
              {value
                ? usMode && selectedUsTimezone
                  ? `${selectedUsTimezone.label} - ${selectedUsTimezone.labelDetail} (${selectedOffset ?? ''})`
                  : `${selectedTimezone?.label} (${selectedOffset ?? ''})`
                : 'Select Timezone'}
            </div>
            <ChevronsUpDown className="size-3 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(`p-0`)}
        align="start"
        style={{
          width: buttonSize?.width,
        }}
      >
        <Command>
          {showUSModeSwitch && (
            <div className="flex items-center justify-between px-3 py-2 border-b">
              <Label htmlFor="us-mode" className="text-sm font-medium cursor-pointer">
                US Timezones Only
              </Label>
              <Switch
                id="us-mode"
                checked={usMode}
                onCheckedChange={handleModeChange}
              />
            </div>
          )}
          <CommandInput placeholder="Search timezone..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              {usMode ? 'No US timezones found.' : 'No timezones found.'}
            </CommandEmpty>
            <CommandGroup>
              {usMode
                ? usTimezones.map((timezone) => {
                    const offset = getOffsetByLabel(timezone.value)
                    return (
                      <CommandItem
                        value={`${timezone.label} ${timezone.labelDetail} ${timezone.value}`}
                        key={timezone.value}
                        onSelect={() => {
                          setOpen(false)
                          onChange(timezone.value)
                        }}
                        className={cn('flex items-center justify-between', {
                          'bg-muted font-medium text-accent-foreground':
                            timezone.value.toLowerCase() ===
                            (value ?? '').toLowerCase(),
                        })}
                      >
                        <div className="flex flex-col">
                          <span>
                            ({offset ?? ''}) {timezone.label} -{' '}
                            {timezone.labelDetail}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {timezone.value}
                          </span>
                        </div>
                        <Check
                          className={cn(
                            'size-4',
                            timezone.value.toLowerCase() ===
                              (value ?? '').toLowerCase()
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    )
                  })
                : timezones.map((timezone) => {
                    const offset = getOffsetByLabel(timezone.label)
                    return (
                      <CommandItem
                        value={timezone.label}
                        key={timezone.label}
                        onSelect={(item) => {
                          setOpen(false)
                          const selectedTimezone = timezones.find(
                            (timezone) =>
                              timezone.label.toLowerCase() === item.toLowerCase()
                          )?.label
                          if (!selectedTimezone) return null
                          onChange(selectedTimezone)
                        }}
                        className={cn('flex items-center justify-between', {
                          'bg-muted font-medium text-accent-foreground':
                            timezone.label.toLowerCase() ===
                            (value ?? '').toLowerCase(),
                        })}
                      >
                        ({offset ?? ''}) {timezone.label}
                        <Check
                          className={cn(
                            'size-4',
                            timezone.label.toLowerCase() ===
                              (value ?? '').toLowerCase()
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    )
                  })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
