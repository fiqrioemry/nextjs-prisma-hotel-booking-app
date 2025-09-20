"use client";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import React, { useState, useCallback } from "react";
import { useEdgeStoreUpload } from "@/hooks/use-uploader";
import { Controller, useFormContext } from "react-hook-form";
import { FileText, X, Upload, Loader2, CheckCircle } from "lucide-react";
import Image from "next/image";

type FileType = "image" | "video" | "documents";
type UploadMode = "preview" | "direct";

interface FileWithMeta {
  id?: string;
  url?: string;
  file?: File;
  preview?: string;
  name?: string;
  size?: number;
  type?: string;
  isUploading?: boolean;
  progress?: number;
  error?: string;
}

interface FileEdgeUploadProps {
  name: string;
  label?: string;
  fileType: FileType;
  maxSize?: number;
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
  mode?: UploadMode; // 👈 new
}

const defaultAccept: Record<FileType, Record<string, string[]>> = {
  image: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg"] },
  video: { "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"] },
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

export function FileEdgeUpload({
  name,
  label,
  fileType,
  maxSize = 5 * 1024 * 1024,
  maxFiles = 1,
  className,
  disabled,
  mode = "preview",
}: FileEdgeUploadProps) {
  const { control, setValue, formState } = useFormContext();
  const [isDragging, setIsDragging] = useState(false);
  const { uploadSingle, uploadMultiple } = useEdgeStoreUpload();

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

            //  validasi maxSize
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

            let mapped: FileWithMeta[] = validFiles.map((file) => ({
              file,
              preview:
                fileType !== "documents"
                  ? URL.createObjectURL(file)
                  : undefined,
              name: file.name,
              size: file.size,
              type: file.type,
              isUploading: mode === "direct",
              progress: mode === "direct" ? 0 : undefined,
            }));

            if (fileType === "video") {
              mapped = [mapped[0]];
            }

            if (mode === "preview") {
              // simpan file untuk diupload nanti saat submit
              setValue(name, mapped.slice(0, maxFiles), {
                shouldDirty: true,
                shouldValidate: true,
              });
            } else {
              // langsung upload streaming
              if (fileType === "image" || fileType === "documents") {
                const { files: uploaded } = await uploadMultiple(
                  validFiles,
                  (progress, i) => {
                    mapped[i].progress = progress;
                    setValue(name, [...mapped], { shouldValidate: true });
                  }
                );
                mapped = uploaded.map((u, i) => ({
                  url: u.url,
                  name: u.name,
                  size: u.size,
                  type: u.type,
                  isUploading: false,
                  progress: 100,
                }));
              } else {
                const file = validFiles[0];
                const result = await uploadSingle(file, (progress) => {
                  mapped[0].progress = progress;
                  setValue(name, [...mapped], { shouldValidate: true });
                });
                mapped = [
                  {
                    url: result.url,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    isUploading: false,
                    progress: 100,
                  },
                ];
              }

              setValue(name, mapped, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }
          },
          [
            fileType,
            maxFiles,
            maxSize,
            mode,
            setValue,
            uploadMultiple,
            uploadSingle,
          ]
        );

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          onDrop: handleDrop,
          accept: acceptConfig,
          multiple: fileType === "image" || fileType === "documents",
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

            {/* Dropzone */}
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

            {/* Preview */}
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
                        {f.isUploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                            <span className="text-white text-sm ml-2">
                              {f.progress}%
                            </span>
                          </div>
                        )}

                        {f.progress === 100 && f.url && (
                          <CheckCircle className="absolute top-2 left-2 h-5 w-5 text-green-500" />
                        )}
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
                    {files[0].isUploading && (
                      <Progress value={files[0].progress} className="h-2" />
                    )}
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
                        {f.isUploading && (
                          <Progress
                            value={f.progress}
                            className="h-2 flex-1 ml-2"
                          />
                        )}
                        {f.progress === 100 && f.url && (
                          <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                        )}
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
