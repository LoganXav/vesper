"use client";

import { useState, useMemo, ReactElement } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetDocumentsQuery } from "@/queries/document";
import { useRouter } from "next/navigation";
import { Routes } from "@/config/route-enums";
import { FileIcon, FilePlusCornerIcon, SearchIcon, XIcon } from "lucide-react";
import type { Document } from "@/types";
import { groupDocumentsByDate } from "@/utils/date-utils";

interface DocumentSearchDialogProps {
  children: ReactElement;
}

const documentItemClass =
  "flex h-auto w-full justify-start gap-2 rounded-none px-3 py-2 hover:bg-accent/50 hover:text-foreground";

function DocumentSection({
  title,
  documents,
  onSelect,
}: {
  title: string;
  documents: Document[];
  onSelect: (id: string) => void;
}) {
  if (documents.length === 0) return null;

  return (
    <div className="mb-2">
      <p className="px-3 py-1 text-xs font-medium text-muted-foreground">
        {title}
      </p>
      {documents.map((doc) => (
        <Button
          key={doc.id}
          variant="ghost"
          onClick={() => onSelect(doc.id)}
          className={documentItemClass}
        >
          <FileIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{doc.title}</span>
        </Button>
      ))}
    </div>
  );
}

export const DocumentSearchDialog = ({
  children,
}: DocumentSearchDialogProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const { data, isLoading } = useGetDocumentsQuery();
  const documents = data?.data ?? [];

  const { today, previous7Days } = useMemo(() => {
    const filtered = searchQuery.trim()
      ? documents.filter((doc) =>
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : documents;
    return groupDocumentsByDate(filtered);
  }, [documents, searchQuery]);

  const selectDocument = (documentId: string) => {
    router.push(Routes.HOME + documentId);
    setOpen(false);
  };

  const createNewDocument = () => {
    router.push(Routes.HOME);
    setOpen(false);
  };

  const isEmpty = today.length === 0 && previous7Days.length === 0;
  const emptyMessage = searchQuery
    ? "No documents match your search."
    : "No documents yet.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:min-w-2xl">
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery("")}
              className="size-8 shrink-0 rounded-sm"
              aria-label="Clear search"
            >
              <XIcon className="size-4" />
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          onClick={createNewDocument}
          className={documentItemClass}
        >
          <FilePlusCornerIcon className="size-4 shrink-0" />
          <span>New Document</span>
        </Button>

        <div className="flex-1 overflow-y-auto overscroll-contain py-2">
          {isLoading ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Loading documents...
            </p>
          ) : isEmpty ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          ) : (
            <>
              <DocumentSection
                title="Today"
                documents={today}
                onSelect={selectDocument}
              />
              <DocumentSection
                title="Previous 7 Days"
                documents={previous7Days}
                onSelect={selectDocument}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
