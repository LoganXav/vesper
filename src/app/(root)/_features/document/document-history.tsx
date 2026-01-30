"use client";

import { FileIcon } from "lucide-react";
import { useGetDocumentsQuery } from "@/queries/document";
import { LoadingContent } from "@/components/wrappers/loading-content";
import { useRouter, usePathname } from "next/navigation";
import { Routes } from "@/config/route-enums";
import { cn } from "@/lib/utils";
import { getActiveDocumentPathId } from "@/utils/route-utils";

export const DocumentHistory = () => {
  const router = useRouter();
  const pathname = usePathname();
  const documentsQueryResult = useGetDocumentsQuery({ params: {} });
  const documents = documentsQueryResult?.data?.data;

  const activeDocumentId = getActiveDocumentPathId(pathname);

  return (
    <LoadingContent
      data={documentsQueryResult?.data}
      loading={documentsQueryResult?.isLoading}
      error={documentsQueryResult?.error}
      emptyMessage="You haven't created any documents yet."
    >
      <div className="flex flex-col gap-1">
        {documents?.map((document) => {
          const isActive = activeDocumentId === document.id;

          return (
            <div
              key={document.id}
              className={cn(
                "flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors cursor-pointer",
                isActive && "bg-accent text-accent-foreground font-medium",
              )}
              onClick={() => {
                router.push(Routes.HOME + document.id);
              }}
            >
              <FileIcon className="size-4" />
              <h2 className="line-clamp-1 text-ellipsis overflow-hidden">
                {document.title}
              </h2>
            </div>
          );
        })}
      </div>
    </LoadingContent>
  );
};
