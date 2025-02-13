import { useRef, useState } from "react";
import { useSize } from "@radix-ui/react-use-size";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatTimezoneOffset, timezones } from "../_data/timezone";

export const TimezoneSelector = ({
  value,
  onChange,
  disabled = false,
}: {
  disabled?: boolean;
  value?: string;
  onChange: (value: string) => void;
}) => {
  const buttonRef = useRef(null);
  const buttonSize = useSize(buttonRef.current);
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={(open) => setOpen(open)}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          className={cn(!value && "text-muted-foreground", "min-w-[300px]")}
          ref={buttonRef}
        >
          <div className="flex w-full items-center justify-between text-start">
            <div className="block flex-1">
              {value
                ? timezones.find(
                    (timezone) =>
                      timezone.label.toLowerCase() === value.toLowerCase()
                  )?.label
                : "Select Merchant Timezone"}
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
          <CommandInput placeholder="Search timezone..." className="h-9" />
          <CommandList>
            <CommandEmpty>No merchant timezones found.</CommandEmpty>
            <CommandGroup>
              {timezones.map((timezone) => (
                <CommandItem
                  value={timezone.label}
                  key={timezone.label}
                  onSelect={(item) => {
                    setOpen(false);
                    const selectedTimezone = timezones.find(
                      (timezone) =>
                        timezone.label.toLowerCase() === item.toLowerCase()
                    )?.label;
                    if (!selectedTimezone) return null;
                    onChange(selectedTimezone);
                  }}
                  className={cn("flex items-center justify-between", {
                    "bg-muted font-medium text-accent-foreground":
                      timezone.label.toLowerCase() ===
                      (value ?? "").toLowerCase(),
                  })}
                >
                  ({formatTimezoneOffset(timezone.offset)}) {timezone.label}
                  <Check
                    className={cn(
                      "size-4",
                      timezone.label.toLowerCase() ===
                        (value ?? "").toLowerCase()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
