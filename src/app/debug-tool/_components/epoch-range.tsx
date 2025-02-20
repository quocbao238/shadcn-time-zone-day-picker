import {
  RangeDayType,
  TRangePicker,
} from "@/components/timezone-day-picker/_data/schema";
import { Separator } from "@/components/ui/separator";
import { getUnixTime } from "date-fns";

export const EpochRange = ({
  rangeDate,
  type,
}: {
  rangeDate: TRangePicker;
  type: RangeDayType;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-row gap-4 ">
        <div className="space-y-2">
          <p className="font-bold text-base">{`Start of ${type}`}</p>
          <Separator />
          <p className="text-muted-foreground">
            Tz Time:{" "}
            <span className="text-primary font-bold">
              {rangeDate.from.toString()}
            </span>
          </p>

          <p className="text-muted-foreground">
            UTC Time:{" "}
            <span className="text-primary font-bold">
              {rangeDate.from.toUTCString()}
            </span>
          </p>
          <p className="text-muted-foreground">
            ISO Time:{" "}
            <span className="text-primary font-bold">
              {rangeDate.from.toISOString()}
            </span>
          </p>
          <p className="text-muted-foreground">
            Unix:{" "}
            <span className="text-primary font-bold">
              {getUnixTime(rangeDate.from)}
            </span>
          </p>
        </div>
        <Separator orientation="vertical" />

        <div className="space-y-2">
          <p className="font-bold text-base">{`End of ${type}`}</p>
          <Separator />
          <p className="text-muted-foreground">
            Tz Time:{" "}
            <span className="text-primary font-bold">
              {rangeDate.to.toString()}
            </span>
          </p>

          <p className="text-muted-foreground">
            UTC Time:{" "}
            <span className="text-primary font-bold">
              {rangeDate.to.toUTCString()}
            </span>
          </p>
          <p className="text-muted-foreground">
            ISO Time:{" "}
            <span className="text-primary font-bold">
              {rangeDate.to.toISOString()}
            </span>
          </p>
          <p className="text-muted-foreground">
            Unix:{" "}
            <span className="text-primary font-bold">
              {getUnixTime(rangeDate.to)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
