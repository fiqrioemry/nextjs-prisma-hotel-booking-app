"use client";

import { toast } from "sonner";
import { useState } from "react";
import { PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Controller, useFormContext } from "react-hook-form";

interface FileFieldProps {
  name: string;
  label?: string;
  helperText?: string;
  maxSizeMB?: number;
  maxItems?: number;
  isSingle?: boolean;
  accept?: string;
}

export function FileField({
  name,
  label,
  helperText,
  maxSizeMB = 2,
  maxItems = 5,
  isSingle = false,
  accept = "image/*",
}: FileFieldProps) {
  const { control } = useFormContext();
  const [isDragging, setIsDragging] = useState(false);

  const getFileURL = (file: File | string) => {
    if (file instanceof File) return URL.createObjectURL(file);
    if (typeof file === "string") return file;
    return "";
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const handleFiles = (files: FileList | null) => {
          if (!files) return;

          const validFiles = Array.from(files).filter((file) => {
            const isValid = file.size / (1024 * 1024) <= maxSizeMB;
            if (!isValid) {
              toast.warning(`${file.name} exceeds ${maxSizeMB}MB`);
            }
            return isValid;
          });

          if (validFiles.length === 0) return;

          if (isSingle) {
            field.onChange(validFiles[0]);
          } else {
            const updated = [...(field.value || []), ...validFiles].slice(
              0,
              maxItems
            );
            field.onChange(updated);
          }
        };

        const handleRemove = (file: File | string) => {
          if (isSingle) {
            field.onChange(null);
          } else {
            const updated = (field.value || []).filter((f: any) => f !== file);
            field.onChange(updated);
          }
        };

        const handleDrop = (e: React.DragEvent) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
            e.dataTransfer.clearData();
          }
        };

        const items = isSingle
          ? field.value
            ? [field.value]
            : []
          : field.value || [];

        return (
          <div className="space-y-2">
            {label && (
              <label className="block text-sm font-medium text-foreground">
                {label}
              </label>
            )}
            {helperText && (
              <p className="text-xs text-muted-foreground">{helperText}</p>
            )}

            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`${
                isSingle
                  ? "relative w-full aspect-video flex items-center justify-center overflow-hidden"
                  : "flex flex-wrap gap-4 p-4"
              } border-2 rounded-md transition ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-border bg-muted/30"
              }`}
            >
              {items.map((item: any, idx: number) => {
                const url = getFileURL(item);
                return (
                  <div
                    key={idx}
                    className={`relative ${
                      isSingle
                        ? "w-full h-full"
                        : "w-32 h-32 border border-border"
                    } rounded-md overflow-hidden`}
                  >
                    <img
                      src={url}
                      alt="preview"
                      className="object-cover w-full h-full"
                    />
                    <Button
                      size="icon"
                      type="button"
                      variant="destructive"
                      onClick={() => handleRemove(item)}
                      className="absolute top-1 right-1 p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}

              {/* Upload Button */}
              {(!field.value || (!isSingle && items.length < maxItems)) && (
                <label
                  htmlFor={`${name}-upload`}
                  className={`flex flex-col items-center justify-center ${
                    isSingle ? "w-full aspect-video" : "w-32 h-32"
                  } border-2 border-dashed border-primary rounded-md cursor-pointer hover:bg-muted transition`}
                >
                  <PlusCircle className="text-primary mb-2" />
                  <span className="text-sm">
                    {isSingle ? "Select File" : "Add File"}
                  </span>
                </label>
              )}

              <input
                id={`${name}-upload`}
                type="file"
                accept={accept}
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = "";
                }}
                multiple={!isSingle}
                hidden
              />
            </div>

            {fieldState.error && (
              <p className="text-destructive text-xs mt-1">
                {fieldState.error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
