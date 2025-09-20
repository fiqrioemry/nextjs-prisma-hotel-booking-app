// fields/SelectField.tsx
"use client";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { Controller, useFormContext } from "react-hook-form";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";

export function SelectField({
  name,
  label,
  placeholder,
  helperText,
  options = [],
  disabled,
  className,
}: {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  options?: { label: string; value: string }[];
  disabled?: boolean;
  className?: string;
}) {
  const { control, formState } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FieldWrapper
          name={name}
          label={label}
          helperText={helperText}
          error={formState.errors?.[name]?.message as string}
          className={className}
        >
          <Select
            defaultValue={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger size="sm" className="w-full" id={name}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldWrapper>
      )}
    />
  );
}
