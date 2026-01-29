"use client";

import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";

interface LibraryUploadDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface BookMetadata {
  title: string;
  author: string;
}

export function LibraryUploadDrawer({
  open,
  onOpenChange,
}: LibraryUploadDrawerProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [metadata, setMetadata] = React.useState<Map<string, BookMetadata>>(
    new Map(),
  );

  const updateMetadata = React.useCallback(
    (file: File, field: "title" | "author", value: string) => {
      setMetadata((prev) => {
        const newMap = new Map(prev);
        const current = newMap.get(file.name) || { title: "", author: "" };
        newMap.set(file.name, { ...current, [field]: value });
        return newMap;
      });
    },
    [],
  );

  const getFileMetadata = React.useCallback(
    (file: File): BookMetadata => {
      return metadata.get(file.name) || { title: "", author: "" };
    },
    [metadata],
  );

  const onUpload = React.useCallback(
    async (
      files: File[],
      {
        onProgress,
        onSuccess,
        onError,
      }: {
        onProgress: (file: File, progress: number) => void;
        onSuccess: (file: File) => void;
        onError: (file: File, error: Error) => void;
      },
    ) => {
      try {
        // Process each file individually
        const uploadPromises = files.map(async (file) => {
          try {
            // Simulate file upload with progress
            const totalChunks = 10;
            let uploadedChunks = 0;

            // Simulate chunk upload with delays
            for (let i = 0; i < totalChunks; i++) {
              // Simulate network delay (100-300ms per chunk)
              await new Promise((resolve) =>
                setTimeout(resolve, Math.random() * 200 + 100),
              );

              // Update progress for this specific file
              uploadedChunks++;
              const progress = (uploadedChunks / totalChunks) * 100;
              onProgress(file, progress);
            }

            // Simulate server processing delay
            await new Promise((resolve) => setTimeout(resolve, 500));
            onSuccess(file);
          } catch (error) {
            onError(
              file,
              error instanceof Error ? error : new Error("Upload failed"),
            );
          }
        });

        // Wait for all uploads to complete
        await Promise.all(uploadPromises);
      } catch (error) {
        // This handles any error that might occur outside the individual upload processes
        console.error("Unexpected error during upload:", error);
      }
    },
    [],
  );

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full">
        <DrawerHeader>
          <DrawerTitle>Upload Books</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 p-4">
          <FileUpload
            value={files}
            onValueChange={setFiles}
            maxFiles={10}
            maxSize={5 * 1024 * 1024}
            className="w-full overflow-hidden rounded-lg"
            onUpload={onUpload}
            onFileReject={onFileReject}
            multiple
          >
            <FileUploadDropzone className="bg-secondary">
              <div className="flex flex-col items-center gap-1 text-center">
                <div className="flex items-center justify-center rounded-full border border-border p-2.5">
                  <Upload className="size-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-sm">Drag & drop files here</p>
                <p className="text-muted-foreground text-xs">
                  Or click to browse (max 10 files, up to 5MB each)
                </p>
              </div>
              <FileUploadTrigger asChild>
                <Button variant="default" size="sm" className="mt-2 w-fit">
                  Browse files
                </Button>
              </FileUploadTrigger>
            </FileUploadDropzone>
            <FileUploadList
              orientation="vertical"
              className="overflow-y-auto max-h-[calc(100vh-300px)] overflow-x-hidden mt-4 scrollbar-thin pb-24"
            >
              {files.map((file, index) => {
                const fileMetadata = getFileMetadata(file);
                return (
                  <FileUploadItem
                    key={index}
                    value={file}
                    className="p-0 border-none"
                  >
                    <div className="flex items-start gap-3 p-2 w-full">
                      <FileUploadItemPreview className="size-20 shrink-0">
                        <FileUploadItemProgress variant="fill" />
                      </FileUploadItemPreview>
                      <div className="flex-1 flex flex-col gap-2 min-w-0">
                        <Input
                          placeholder="Book title"
                          value={fileMetadata.title}
                          onChange={(e) =>
                            updateMetadata(file, "title", e.target.value)
                          }
                          className="h-8 text-sm"
                        />
                        <Input
                          placeholder="Author"
                          value={fileMetadata.author}
                          onChange={(e) =>
                            updateMetadata(file, "author", e.target.value)
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                      <FileUploadItemDelete asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="size-6 shrink-0"
                        >
                          <X className="size-3" />
                        </Button>
                      </FileUploadItemDelete>
                    </div>
                    <FileUploadItemMetadata className="sr-only" />
                  </FileUploadItem>
                );
              })}
            </FileUploadList>
          </FileUpload>
        </div>
        <DrawerFooter className="sticky bottom-0 grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            className="w-full"
            onClick={() =>
              onUpload(files, {
                onProgress: (file, progress) => {
                  console.log(`${file.name} is ${progress}% uploaded`);
                },
                onSuccess: (file) => {
                  console.log(`${file.name} uploaded successfully`);
                },
                onError: (file, error) => {
                  console.error(`${file.name} upload failed:`, error);
                },
              })
            }
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
