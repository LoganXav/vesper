"use client";

import { FileIcon, Trash2Icon } from "lucide-react";
import {
  useGetDocumentsQuery,
  useDeleteDocumentMutation,
} from "@/queries/document";
import { LoadingContent } from "@/components/wrappers/loading-content";
import { useRouter, usePathname } from "next/navigation";
import { Routes } from "@/config/route-enums";
import { cn } from "@/lib/utils";
import { getActiveDocumentPathId } from "@/utils/route-utils";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/wrappers/confirmation-dialog";

export const DocumentHistory = () => {
  const router = useRouter();
  const pathname = usePathname();

  const documentsQueryResult = useGetDocumentsQuery();
  const documents = documentsQueryResult?.data?.data;

  const deleteDocumentMutation = useDeleteDocumentMutation();

  const activeDocumentId = getActiveDocumentPathId(pathname);

  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocumentMutation.mutateAsync({ documentId });
      if (activeDocumentId === documentId) {
        router.push(Routes.HOME);
      }
    } catch (error) {
      console.error("Failed to delete document:", error);
      throw error;
    }
  };

  return (
    <LoadingContent
      data={documentsQueryResult?.data}
      loading={documentsQueryResult?.isLoading}
      error={documentsQueryResult?.error}
      emptyMessage="You haven't created any documents yet."
    >
      <div className="flex flex-col gap-1 [&>*:hover_button]:opacity-100">
        {documents?.map((document) => {
          const isActive = activeDocumentId === document.id;

          return (
            <div
              key={document.id}
              className={cn(
                "flex items-center h-9 gap-2 p-2 rounded-md hover:bg-accent transition-colors cursor-pointer relative",
                isActive && "bg-accent text-accent-foreground font-medium",
              )}
            >
              <div
                className="flex flex-1 items-center gap-2 cursor-pointer"
                onClick={() => router.push(Routes.HOME + document.id)}
              >
                <FileIcon className="size-4" />
                <h2 className="line-clamp-1 flex-1">{document.title}</h2>
              </div>
              {!document.isDefault && (
                <ConfirmationDialog
                  title="Delete Document?"
                  description={`Are you sure you want to delete "${document.title}"? This action cannot be undone.`}
                  confirmText="Delete"
                  cancelText="Cancel"
                  variant="destructive"
                  onConfirm={() => handleDelete(document.id)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 transition-opacity duration-200 p-1 h-6 w-6 shrink-0 rounded-full font-light hover:text-destructive"
                    aria-label="Delete document"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </ConfirmationDialog>
              )}
            </div>
          );
        })}
      </div>
    </LoadingContent>
  );
};
