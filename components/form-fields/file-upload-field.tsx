"use client";

import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { FileText, X, Upload } from "lucide-react";
import React, { useState, useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Image from "next/image";

type FileType = "image" | "video" | "documents";

interface FileWithMeta {
  id?: string;
  url?: string;
  file?: File;
  preview?: string;
  name?: string;
  size?: number;
  type?: string;
}

interface FileUploadFieldProps {
  name: string;
  label?: string;
  fileType: FileType;
  maxSize?: number; // default 5MB
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
}

const defaultAccept: Record<FileType, Record<string, string[]>> = {
  image: {
    "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg"],
  },
  video: {
    "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"],
  },
  documents: {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "text/plain": [".txt"],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
  },
};

export function FileUploadField({
  name,
  label,
  fileType,
  maxSize = 5 * 1024 * 1024, // default 5MB
  maxFiles = 1,
  className,
  disabled,
}: FileUploadFieldProps) {
  const { control, setValue, formState } = useFormContext();
  const [isDragging, setIsDragging] = useState(false);

  const acceptConfig = defaultAccept[fileType];
  const acceptedExtensions = Object.values(acceptConfig).flat();

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const files: FileWithMeta[] = Array.isArray(field.value)
          ? field.value
          : field.value
          ? [field.value]
          : [];

        const handleDrop = useCallback(
          async (accepted: File[]) => {
            setIsDragging(false);
            if (!accepted.length) return;

            // filter oversized
            const oversized = accepted.filter((f) => f.size > maxSize);
            if (oversized.length > 0) {
              oversized.forEach((f) =>
                toast.error(
                  `File ${f.name} terlalu besar (>${formatFileSize(maxSize)})`
                )
              );
            }

            const validFiles = accepted.filter((f) => f.size <= maxSize);
            if (!validFiles.length) return;

            const mapped: FileWithMeta[] = validFiles.map((file) => ({
              file,
              preview:
                fileType !== "documents"
                  ? URL.createObjectURL(file)
                  : undefined,
              name: file.name,
              size: file.size,
              type: file.type,
            }));

            let updated: FileWithMeta[] = [];

            if (fileType === "video") {
              updated = [mapped[0]]; // hanya 1 video
            } else {
              updated = [...files, ...mapped].slice(0, maxFiles);
            }

            setValue(name, updated, {
              shouldDirty: true,
              shouldValidate: true,
            });
          },
          [files, fileType, maxFiles, name, setValue, maxSize]
        );

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          onDrop: handleDrop,
          accept: acceptConfig,
          multiple: fileType === "image" || fileType === "documents", // ✅ documents bisa bulk drop
          disabled,
          onDragEnter: () => setIsDragging(true),
          onDragLeave: () => setIsDragging(false),
        });

        const removeFile = (idx: number) => {
          const updated = files.filter((_, i) => i !== idx);
          setValue(name, updated, { shouldDirty: true, shouldValidate: true });
        };

        return (
          <div className={cn("space-y-3", className)}>
            {label && <label className="text-sm font-medium">{label}</label>}

            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer",
                isDragActive || isDragging
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground/25 hover:bg-muted/50",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm">
                  {isDragActive ? "Drop files here" : "Drag & drop or click"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {acceptedExtensions.join(", ")} • Max{" "}
                  {formatFileSize(maxSize)}
                  {fileType !== "video" && ` • Up to ${maxFiles} files`}
                </p>
              </div>
            </div>

            {files.length > 0 && (
              <>
                {fileType === "image" && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {files.map((f, i) => (
                      <div key={i} className="relative group w-full h-32">
                        <Image
                          src={f.preview || f.url!}
                          alt={f.name!}
                          fill
                          className="object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          onClick={() => removeFile(i)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {fileType === "video" && (
                  <div className="relative">
                    <video
                      src={files[0].preview || files[0].url!}
                      controls
                      className="w-full h-48 rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={() => removeFile(0)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {fileType === "documents" && (
                  <ul className="space-y-2">
                    {files.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between border rounded p-2"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm">{f.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({formatFileSize(f.size || 0)})
                          </span>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(i)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {formState.errors[name] && (
              <p className="text-xs text-destructive">
                {formState.errors[name]?.message as string}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export const UploadSchema = z.object({
  images: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, {
          message: "File terlalu besar, maksimal 2MB",
        })
        .refine(
          (file) =>
            ["image/jpeg", "image/png", "image/webp"].includes(file.type),
          {
            message: "Hanya boleh upload JPG, PNG, atau WEBP",
          }
        )
    )
    .max(5, "Maksimal 5 gambar")
    .optional(),

  video: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= 20 * 1024 * 1024, {
          message: "Video maksimal 20MB",
        })
        .refine(
          (file) =>
            ["video/mp4", "video/webm", "video/mkv"].includes(file.type),
          {
            message: "Format video tidak valid",
          }
        )
    )
    .max(1, "Hanya boleh 1 video")
    .optional(),

  documents: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: "Dokumen maksimal 5MB",
        })
        .refine(
          (file) =>
            [
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "text/plain",
            ].includes(file.type),
          {
            message: "Format dokumen tidak valid",
          }
        )
    )
    .max(5, "Maksimal 5 dokumen")
    .optional(),
});
