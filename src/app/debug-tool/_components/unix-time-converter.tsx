import { TimeInfo } from "@/app/components/time-zone-card";
import { getTzDateByUnixTime } from "@/components/timezone-day-picker/_data/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTimezoneStore } from "@/hooks/use-timezone";
import { fromUnixTime } from "date-fns";
import { useState } from "react";

export const UnixTimeConverter = () => {
  const { timeZone } = useTimezoneStore();
  const [unixTime, setUnixTime] = useState(1739775687);
  const date = fromUnixTime(unixTime);
  const tzDate = getTzDateByUnixTime(unixTime, timeZone);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Unix Timestamp Converter{" "}
          <span className="text-base font-normal text-muted-foreground">
            (Ex: 1739775687)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <p className="font-semibold">Input:</p>
          <Input
            type="number"
            value={unixTime}
            onChange={(e) => {
              if (e.target.value === "") return setUnixTime(0);
              return setUnixTime(parseInt(e.target.value));
            }}
          />
        </div>
        <Separator />
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Local Time:</p>
            <TimeInfo time={date} />
          </div>
          <Separator />
          {timeZone && (
            <div>
              <p className="font-semibold">{timeZone} Time:</p>
              <TimeInfo time={tzDate} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
