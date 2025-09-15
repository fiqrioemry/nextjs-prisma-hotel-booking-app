"use client";

import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Controller, useFormContext } from "react-hook-form";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";
import React from "react";

interface ArrayTextFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

export function ArrayTextField({
  name,
  label,
  placeholder,
  helperText,
  disabled,
  className,
}: ArrayTextFieldProps) {
  const { control, formState } = useFormContext();
  const [inputValue, setInputValue] = React.useState("");

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field }) => {
        const values: string[] = field.value ?? [];

        function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
          if (e.key === "Enter" && inputValue.trim() !== "") {
            e.preventDefault();
            if (!values.includes(inputValue.trim())) {
              field.onChange([...values, inputValue.trim()]);
            }
            setInputValue("");
          }
        }

        function handleRemove(item: string) {
          field.onChange(values.filter((v) => v !== item));
        }

        return (
          <FieldWrapper
            name={name}
            label={label}
            helperText={helperText}
            error={formState.errors?.[name]?.message as string}
            className={className}
          >
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              {/* Badges */}
              {values.map((item, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="flex items-center gap-1 px-2 py-1"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}

              {/* Input */}
              <Input
                type="text"
                value={inputValue}
                placeholder={placeholder}
                disabled={disabled}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 border-none shadow-none focus-visible:ring-0 min-w-[100px]"
              />
            </div>
          </FieldWrapper>
        );
      }}
    />
  );
}
