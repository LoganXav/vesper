"use client";

import { FileIcon } from "lucide-react";
import { useGetDocumentsQuery } from "@/queries/document";
import { LoadingContent } from "@/components/wrappers/loading-content";

export const DocumentHistory = () => {
  const documentsQueryResult = useGetDocumentsQuery({ params: {} });
  const documents = documentsQueryResult?.data?.data;

  return (
    <LoadingContent
      data={documentsQueryResult?.data}
      loading={documentsQueryResult?.isLoading}
      error={documentsQueryResult?.error}
      emptyMessage="You haven't created any documents yet."
    >
      <div className="flex flex-col gap-1">
        {documents?.map((document) => (
          <div
            key={document.id}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors cursor-pointer"
          >
            <FileIcon className="size-4" />
            <h2 className="line-clamp-1 text-ellipsis overflow-hidden">
              {document.title}
            </h2>
          </div>
        ))}
      </div>
    </LoadingContent>
  );
};
