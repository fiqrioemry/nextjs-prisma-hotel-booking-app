// fields/PhoneNumberField.tsx
"use client";
import { X, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useFormContext } from "react-hook-form";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";
import { useState, useEffect } from "react";

interface PhoneNumberFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  reset?: boolean;
  maxLength?: number; // maximum length of the phone number
  countryCode?: string; // default country code
  showIcon?: boolean;
}

export function PhoneNumberField({
  name,
  label = "Nomor Telepon",
  placeholder = "08123456789",
  helperText,
  disabled,
  className,
  reset,
  maxLength = 20,
  showIcon = true,
}: PhoneNumberFieldProps) {
  const { control, formState } = useFormContext();
  const [displayValue, setDisplayValue] = useState("");

  // Format nomor telepon Indonesia
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, "");

    // Handle Indonesian phone numbers
    if (cleaned.startsWith("62")) {
      // If starts with 62, keep as is
      return cleaned;
    } else if (cleaned.startsWith("0")) {
      // If starts with 0, replace with 62
      return "62" + cleaned.slice(1);
    } else if (cleaned.length > 0) {
      // If doesn't start with 0 or 62, add 62
      return "62" + cleaned;
    }

    return cleaned;
  };

  // Format for display (with separators)
  const formatForDisplay = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");

    if (cleaned.startsWith("62")) {
      const withoutCountryCode = cleaned.slice(2);
      if (withoutCountryCode.length === 0) return "+62 ";
      if (withoutCountryCode.length <= 3) return `+62 ${withoutCountryCode}`;
      if (withoutCountryCode.length <= 7)
        return `+62 ${withoutCountryCode.slice(
          0,
          3
        )}-${withoutCountryCode.slice(3)}`;
      return `+62 ${withoutCountryCode.slice(0, 3)}-${withoutCountryCode.slice(
        3,
        7
      )}-${withoutCountryCode.slice(7, 11)}`;
    } else if (cleaned.startsWith("0")) {
      if (cleaned.length <= 4) return cleaned;
      if (cleaned.length <= 8)
        return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(
        8,
        12
      )}`;
    }

    return cleaned;
  };

  // Validate phone number
  const validatePhoneNumber = (value: string): boolean => {
    const cleaned = value.replace(/\D/g, "");

    // Indonesian phone numbers should be 10-13 digits after country code
    if (cleaned.startsWith("62")) {
      const withoutCountryCode = cleaned.slice(2);
      return withoutCountryCode.length >= 8 && withoutCountryCode.length <= 12;
    } else if (cleaned.startsWith("0")) {
      return cleaned.length >= 10 && cleaned.length <= 14;
    }

    return false;
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value) => {
          if (!value) return true; // Let required validation handle empty values
          return (
            validatePhoneNumber(value) || "Format nomor telepon tidak valid"
          );
        },
      }}
      render={({ field }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const inputValue = e.target.value;
          const formatted = formatPhoneNumber(inputValue);
          const displayFormatted = formatForDisplay(inputValue);

          setDisplayValue(displayFormatted);
          field.onChange(formatted);
        };

        const handleReset = () => {
          setDisplayValue("");
          field.onChange("");
        };

        // Update display value when field value changes (for initial values)
        useEffect(() => {
          if (field.value) {
            const displayFormatted = formatForDisplay(field.value);
            setDisplayValue(displayFormatted);
          }
        }, [field.value]);

        return (
          <FieldWrapper
            name={name}
            label={label}
            helperText={helperText}
            error={formState.errors?.[name]?.message as string}
            className={className}
          >
            <div className="relative">
              {showIcon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <Input
                id={name}
                type="tel"
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                className={showIcon ? "pl-10" : ""}
                maxLength={maxLength}
              />
              {reset && field.value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  tabIndex={-1}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </FieldWrapper>
        );
      }}
    />
  );
}
