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
import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
  format,
  isValid,
  parseISO,
  formatISO,
  isBefore,
  startOfDay,
  addDays,
} from "date-fns";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";

type DateFieldProps = {
  name: string;
  label?: string;
  helperText?: string;
  className?: string;
  minDateFrom?: string; // ⬅️ minimum date custom (misalnya untuk endDate)
};

export function DateField({
  name,
  label,
  helperText,
  className,
  minDateFrom,
}: DateFieldProps) {
  const { control, formState, setValue } = useFormContext();

  // ⬅️ perhatikan startDate kalau field sekarang adalah endDate
  const startDateValue = useWatch({ name: "startDate" });

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

        // Tentukan minimum date
        const today = startOfDay(new Date());

        let minDate = today;
        if (name === "endDate" && startDateValue) {
          const parsedStart = startOfDay(parseISO(startDateValue));
          minDate = addDays(parsedStart, 1); // endDate minimal +1 hari
          // ⬅️ auto set endDate kalau invalid
          if (selected && selected <= parsedStart) {
            const newEnd = addDays(parsedStart, 1);
            setValue("endDate", toStore(newEnd), { shouldValidate: true });
          }
        } else if (minDateFrom) {
          minDate = startOfDay(parseISO(minDateFrom));
        }

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
                  disabled={(date) => isBefore(startOfDay(date), minDate)}
                />
              </PopoverContent>
            </Popover>
          </FieldWrapper>
        );
      }}
    />
  );
}
