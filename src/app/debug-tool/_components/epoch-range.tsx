import {
  RangeDayType,
  TRangePicker,
} from '@/components/timezone-day-picker/_data/schema'
import { Separator } from '@/components/ui/separator'
import { getUnixTime } from 'date-fns'
import { Play, Square } from 'lucide-react'

export const EpochRange = ({
  rangeDate,
  type,
}: {
  rangeDate: TRangePicker
  type: RangeDayType
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start of Range */}
        <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/20">
              <Play className="h-4 w-4 text-primary" />
            </div>
            <p className="font-semibold text-sm capitalize">{`Start of ${type}`}</p>
          </div>
          <Separator />
          <div className="space-y-2.5 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Timezone Time</p>
              <p className="font-mono text-xs break-all text-foreground">
                {rangeDate.from.toString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">UTC Time</p>
              <p className="font-mono text-xs break-all text-foreground">
                {rangeDate.from.toUTCString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">ISO 8601</p>
              <p className="font-mono text-xs break-all text-foreground">
                {rangeDate.from.toISOString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Unix Timestamp</p>
              <code className="inline-block px-2 py-1 rounded bg-background border text-xs font-mono font-semibold text-primary">
                {getUnixTime(rangeDate.from)}
              </code>
            </div>
          </div>
        </div>

        {/* End of Range */}
        <div className="rounded-lg border bg-gradient-to-br from-destructive/5 to-destructive/10 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-destructive/20">
              <Square className="h-4 w-4 text-destructive" />
            </div>
            <p className="font-semibold text-sm capitalize">{`End of ${type}`}</p>
          </div>
          <Separator />
          <div className="space-y-2.5 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Timezone Time</p>
              <p className="font-mono text-xs break-all text-foreground">
                {rangeDate.to.toString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">UTC Time</p>
              <p className="font-mono text-xs break-all text-foreground">
                {rangeDate.to.toUTCString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">ISO 8601</p>
              <p className="font-mono text-xs break-all text-foreground">
                {rangeDate.to.toISOString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Unix Timestamp</p>
              <code className="inline-block px-2 py-1 rounded bg-background border text-xs font-mono font-semibold text-destructive">
                {getUnixTime(rangeDate.to)}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
