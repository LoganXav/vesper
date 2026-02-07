"use client";

import { useState, useMemo, ReactElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useCreateDocumentMutation,
  useGetDocumentsQuery,
} from "@/queries/document";
import { useRouter } from "next/navigation";
import { Routes } from "@/config/route-enums";
import { FileIcon, FilePlusCornerIcon, SearchIcon, XIcon } from "lucide-react";
import type { Document } from "@/types";
import { groupDocumentsByDate } from "@/utils/date-utils";
import { toast } from "sonner";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Session } from "next-auth";

interface DocumentSearchDialogProps {
  children: ReactElement;
  session: Session | null;
}

const documentItemClass =
  "flex h-auto w-full justify-start gap-2 rounded-md px-3 py-2 hover:bg-accent/50 hover:text-foreground";

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
          <FileIcon className="size-4 shrink-0" />
          <span className="truncate">{doc.title}</span>
        </Button>
      ))}
    </div>
  );
}

export const DocumentSearchDialog = ({
  children,
  session,
}: DocumentSearchDialogProps) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { createDocumentMutate, createDocumentPending } =
    useCreateDocumentMutation();

  const handleCreateDocument = () => {
    createDocumentMutate(
      { title: "Untitled Document" },
      {
        onSuccess: () => {
          setOpen(false);
          router.push(Routes.HOME);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  const { data, isLoading } = useGetDocumentsQuery(!!session?.user);
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

  const isEmpty = today.length === 0 && previous7Days.length === 0;
  const emptyMessage = searchQuery
    ? "No documents match your search."
    : "No documents yet.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-[55vh] flex-col gap-0 overflow-hidden p-0 sm:min-w-2xl scrollbar-thin">
        <VisuallyHidden>
          <DialogTitle></DialogTitle>
        </VisuallyHidden>
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
        </div>

        <div className="p-2">
          <Button
            variant="ghost"
            onClick={handleCreateDocument}
            className={documentItemClass}
            disabled={createDocumentPending}
          >
            <FilePlusCornerIcon className="size-4 shrink-0" />
            <span>New Document</span>
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain p-2">
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
