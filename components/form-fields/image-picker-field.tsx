"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import images from "@/lib/data.json";
import { Controller, useFormContext } from "react-hook-form";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";

interface ImagePickerFieldProps {
  name: string;
  label?: string;
  helperText?: string;
  className?: string;
}

export function ImagePickerField({
  name,
  label,
  helperText,
  className,
}: ImagePickerFieldProps) {
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.images.map((url) => (
              <button
                key={url}
                type="button"
                className={cn(
                  "relative aspect-video rounded-md overflow-hidden border-2",
                  field.value === url
                    ? "border-primary ring-2 ring-primary"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => field.onChange(url)}
              >
                <Image
                  src={url}
                  alt="thumbnail option"
                  width={300}
                  height={200}
                  className="object-cover w-full h-full rounded-md"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="/placeholder.png"
                />
              </button>
            ))}
          </div>
        </FieldWrapper>
      )}
    />
  );
}
