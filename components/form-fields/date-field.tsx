// components/form-fields/DateField.tsx
"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Controller, useFormContext } from "react-hook-form";
import {
  format,
  isValid,
  parseISO,
  formatISO,
  isBefore,
  startOfDay,
} from "date-fns";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";

type DateFieldProps = {
  name: string;
  label?: string;
  helperText?: string;
  className?: string;
};

export function DateField({
  name,
  label,
  helperText,
  className,
}: DateFieldProps) {
  const { control, formState } = useFormContext();

  const toDate = (v: unknown): Date | undefined => {
    if (!v) return undefined;
    if (v instanceof Date) return isValid(v) ? v : undefined;
    if (typeof v === "string") {
      const d = parseISO(v);
      return isValid(d) ? d : undefined;
    }
    return undefined;
  };

  const toStore = (d?: Date): string | "" =>
    d && isValid(d) ? formatISO(d, { representation: "date" }) : "";

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selected = toDate(field.value);
        const display =
          selected && isValid(selected)
            ? format(selected, "PPP")
            : "Pick a date";

        return (
          <FieldWrapper
            name={name}
            label={label}
            helperText={helperText}
            error={formState.errors?.[name]?.message as string}
            className={className}
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selected && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {display}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selected}
                  onSelect={(d) => field.onChange(toStore(d))}
                  disabled={(date) =>
                    isBefore(startOfDay(date), startOfDay(new Date()))
                  }
                />
              </PopoverContent>
            </Popover>
          </FieldWrapper>
        );
      }}
    />
  );
}
