"use client";

import "@/styles/editor.css";
import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "@/store/editor-store";
import { Editor, generateJSON, JSONContent } from "@tiptap/react";
import { migrateMathStrings } from "@tiptap/extension-mathematics";
import { EditorInterfaceControls } from "./editor-interface-controls";
import { EditorInterfaceControlsMobile } from "./editor-interface-controls-mobile";

import { InitialContent } from "@/types";
import { Input } from "@/components/ui/input";
import { EditorContent } from "@/components/ui/editor";
import { markdownToHtml } from "@/utils/markdown-utils";
import DragHandle from "@tiptap/extension-drag-handle-react";
import { useEditorExtensions } from "@/hooks/use-editor-extensions";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { FileCheckIcon, GripVerticalIcon, FileClockIcon } from "lucide-react";
import {
  useGetDocumentQuery,
  useUpdateDocumentMutation,
  useCreateDocumentMutation,
} from "@/queries/document";
import { toast } from "sonner";
import { config } from "@/config";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { OfflineDocumentDraft } from "@/types";


const isOfflineDocument = (id: string) => id === config.offlineDocumentId;

const EditorInterface = ({ documentId }: { documentId: string }) => {
  const [editor, setEditor] = useState<Editor | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const [isEditable, setIsEditable] = useState(true);
  const hasMigratedRef = useRef(false);

  const setEditorGlobal = useEditorStore((s) => s.setEditor);
  const { data: session } = useSession();
  const router = useRouter();

  const { data: documentData, isLoading: isDocumentLoading } =
    useGetDocumentQuery({
      documentId,
    });

  const [title, setTitle] = useState("");
  const { updateDocumentMutate } = useUpdateDocumentMutation();
  const { createDocumentMutate } = useCreateDocumentMutation();

  useEffect(() => {
    if (documentData?.data?.title) {
      setTitle(documentData.data.title);
    }
  }, [documentData?.data?.title]);

  const extensions = useEditorExtensions(editorRef);

  const [initialContent, setInitialContent] = useState<InitialContent>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [charsCount, setCharsCount] = useState<number | undefined>(undefined);

  const debouncedEditorUpdate = useDebouncedCallback((editor: Editor) => {
    const json = editor.getJSON();
    setCharsCount(editor.storage.characterCount.words());

    const markdownStorage = (editor.storage as any).markdown as
      | { getMarkdown: () => string }
      | undefined;
    const markdown = markdownStorage?.getMarkdown();

    if (isOfflineDocument(documentId)) {
      const draft: OfflineDocumentDraft = {
        json,
        markdown,
        title: title || "Untitled Document",
        updatedAt: Date.now(),
      };
      window.localStorage.setItem(
        config.localStorageOfflineDocumentDraftKey,
        JSON.stringify(draft),
      );
      setIsSaved(true);
      return;
    }

    const draft = {
      documentId,
      json,
      html: editor.getHTML(),
      markdown,
      updatedAt: Date.now(),
    };

    window.localStorage.setItem(
      config.localStorageDraftKey,
      JSON.stringify(draft),
    );
    updateDocumentMutate(
      {
        documentId,
        content: markdown,
      },
      {
        onSuccess: () => setIsSaved(true),
        onError: (error) => {
          toast.error(
            "Could not save. Check your internet connection or contact support.",
          );
          console.error(error);
        },
      },
    );
  }, 1500);

  const debouncedTitleUpdate = useDebouncedCallback((newTitle: string) => {
    if (isOfflineDocument(documentId)) {
      const raw = window.localStorage.getItem(
        config.localStorageOfflineDocumentDraftKey,
      );
      const draft: OfflineDocumentDraft = raw
        ? { ...JSON.parse(raw), title: newTitle, updatedAt: Date.now() }
        : { json: { type: "doc", content: [] }, title: newTitle, updatedAt: Date.now() };
      window.localStorage.setItem(
        config.localStorageOfflineDocumentDraftKey,
        JSON.stringify(draft),
      );
      setIsSaved(true);
      return;
    }

    updateDocumentMutate(
      {
        documentId,
        title: newTitle,
      },
      {
        onSuccess: () => setIsSaved(true),
        onError: () => toast.error("Could not update title."),
      },
    );
  }, 1000);

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    if (!isOfflineDocument(documentId)) return;

    const raw = window.localStorage.getItem(config.localStorageOfflineDocumentDraftKey);
    if (raw) {
      try {
        const draft = JSON.parse(raw) as OfflineDocumentDraft;
        setInitialContent(draft.json ?? { type: "doc", content: [] });
        setTitle(draft.title ?? "Untitled");
      } catch {
        setInitialContent({ type: "doc", content: [] });
      }
    } else {
      setInitialContent({ type: "doc", content: [] });
    }
  }, [documentId]);

  useEffect(() => {
    if (isOfflineDocument(documentId) || !documentData?.data) return;

    const serverDocumentMarkdown = documentData.data.content || "";
    const serverUpdatedAt = documentData.data.updatedAt
      ? new Date(documentData.data.updatedAt).getTime()
      : 0;

    const localStorageDraft = window.localStorage.getItem(
      config.localStorageDraftKey,
    );

    if (localStorageDraft) {
      const draft = JSON.parse(localStorageDraft) as {
        documentId: string;
        json: JSONContent;
        updatedAt: number;
      };

      const isSameDocument = draft.documentId === documentId;
      const isNewerThanServerContent = draft.updatedAt > serverUpdatedAt;

      if (isSameDocument && isNewerThanServerContent) {
        setInitialContent(draft.json);
        return;
      }
    }

    const html = markdownToHtml(serverDocumentMarkdown);
    const json = generateJSON(html, extensions);

    setInitialContent(json);
  }, [documentData?.data, documentId]);

  // Clear per-document draft when switching to a different document (not for local)
  useEffect(() => {
    if (isOfflineDocument(documentId)) return;

    const localStorageDraft = window.localStorage.getItem(
      config.localStorageDraftKey,
    );
    if (!localStorageDraft) return;

    try {
      const draft = JSON.parse(localStorageDraft);
      if (draft.documentId !== documentId) {
        window.localStorage.removeItem(config.localStorageDraftKey);
      }
    } catch {
      window.localStorage.removeItem(config.localStorageDraftKey);
    }
  }, [documentId]);

  // When user authenticates while on local draft: create document and redirect
  useEffect(() => {
    if (
      !session?.user ||
      !isOfflineDocument(documentId) ||
      hasMigratedRef.current
    )
      return;

    const raw = window.localStorage.getItem(config.localStorageOfflineDocumentDraftKey);
    if (!raw) return;

    let draft: OfflineDocumentDraft;
    try {
      draft = JSON.parse(raw);
    } catch {
      return;
    }

    const hasContent =
      (draft.markdown && draft.markdown.trim() !== "") ||
      (draft.json?.content && draft.json.content.length > 0);

    if (!hasContent) return;

    hasMigratedRef.current = true;

    createDocumentMutate(
      { title: draft.title?.trim() || "Untitled Document" },
      {
        onSuccess: (result: { data?: { id: string } }) => {
          const newId = result?.data?.id;
          if (!newId) return;

          const docTitle = draft.title?.trim() || "Untitled";
          updateDocumentMutate(
            {
              documentId: newId,
              title: docTitle,
              content: draft.markdown ?? "",
            },
            {
              onSuccess: () => {
                window.localStorage.removeItem(
                  config.localStorageOfflineDocumentDraftKey,
                );
                router.replace("/" + newId);
              },
              onError: () => {
                hasMigratedRef.current = false;
                toast.error("Document created but content could not be saved.");
              },
            },
          );
        },
        onError: () => {
          hasMigratedRef.current = false;
          toast.error("Could not create document.");
        },
      },
    );
  }, [session?.user, documentId, createDocumentMutate, updateDocumentMutate, router]);

  const handleUpdateTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setIsSaved(false);
    debouncedTitleUpdate(newTitle);
  };

  const isEditorReady =
    initialContent !== null &&
    (isOfflineDocument(documentId) || !isDocumentLoading);

  if (!isEditorReady) return null;

  return (
    <div className="group relative min-h-full xl:px-6 pt-0 w-full">
      <div className="hidden xl:flex sticky top-3 items-center max-w-max gap-3 left-10 border-l pl-3 z-40 2xl:opacity-0 2xl:-translate-y-2 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
        <Input
          value={title}
          onChange={(e) => {
            handleUpdateTitle(e);
          }}
          className="p-0 border-none h-auto outline-none overflow-hidden text-ellipsis focus-visible:border-none focus-visible:ring-0 rounded-none max-w-max"
        />
      </div>

      <div className="hidden md:flex sticky mr-2 sm:mr-4 top-[10px] right-5 z-49 mb-0 flex justify-end gap-2 2xl:opacity-0 2xl:-translate-y-2 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
        {charsCount !== undefined && charsCount !== null && charsCount > 0 && (
          <div className="h-6 rounded-xl bg-secondary border border-border  px-2 py-1 text-xs text-secondary-foreground">
            {charsCount} Words
          </div>
        )}
        <div className="rounded-full bg-secondary border border-border flex items-center justify-center gap-1 px-2 py-1 text-xs text-secondary-foreground w-8 h-8">
          {isSaved ? <FileCheckIcon size={16} /> : <FileClockIcon size={16} />}
        </div>
        {editor && (
            <EditorInterfaceControls
              editor={editor}
              isEditable={isEditable}
              setIsEditable={setIsEditable}
            />
        )}
      </div>

      {editor && (
        <EditorInterfaceControlsMobile
          editor={editor}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
        />
      )}

      <div className="sticky top-0 left-0 right-0 h-18 z-30 pointer-events-none cloud-fade-top-bg" />

      {editor && (
        <DragHandle editor={editor}>
          <GripVerticalIcon strokeWidth={1} />
        </DragHandle>
      )}

      <EditorContent
        className="tiptap text-foreground pt-0 xl:px-12"
        immediatelyRender={false}
        editable={true}
        onCreate={({ editor }) => {
          migrateMathStrings(editor);
          setEditor(editor);
          setEditorGlobal(editor);
        }}
        onUpdate={({ editor }) => {
          debouncedEditorUpdate(editor);
          setIsSaved(false);
        }}
        onDestroy={() => {
          setEditor(null);
          setEditorGlobal(null);
        }}
        initialContent={initialContent}
        extensions={extensions}
      />
    </div>
  );
};

export default EditorInterface;
