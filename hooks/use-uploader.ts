import { useCallback } from "react";
import { useEdgeStore } from "@/context/edge-store-provider";

export function useEdgeStoreUpload() {
  const { edgestore } = useEdgeStore();

  const uploadSingle = useCallback(
    async (
      file: File,
      onProgress?: (progress: number) => void
    ): Promise<{
      url: string;
      meta: { name: string; size: number; type: string };
    }> => {
      try {
        const result = await edgestore.documents.upload({
          file,
          onProgressChange: onProgress,
        });
        return {
          url: result.url,
          meta: {
            name: file.name,
            size: file.size,
            type: file.type,
          },
        };
      } catch (error) {
        console.error("Upload error:", error);
        throw new Error(`Gagal mengupload ${file.name}`);
      }
    },
    [edgestore]
  );

  const uploadMultiple = useCallback(
    async (
      files: File[],
      onProgress?: (progress: number, fileIndex: number) => void
    ): Promise<{
      files: { url: string; name: string; size: number; type: string }[];
    }> => {
      const uploaded: {
        url: string;
        name: string;
        size: number;
        type: string;
      }[] = [];

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const { url, meta } = await uploadSingle(file, (progress) => {
            onProgress?.(progress, i);
          });
          uploaded.push({ url, ...meta });
        }

        return { files: uploaded };
      } catch (error) {
        console.error("Upload multiple error:", error);
        throw error;
      }
    },
    [uploadSingle]
  );

  return { uploadSingle, uploadMultiple };
}
