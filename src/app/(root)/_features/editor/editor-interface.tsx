"use client";

import "@/styles/editor.css";
import { useEffect, useRef, useState } from "react";
import { Editor, JSONContent } from "@tiptap/react";
import { EditorInterfaceControls } from "./editor-interface-controls";

import { Markdown } from "tiptap-markdown";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Math, { migrateMathStrings } from "@tiptap/extension-mathematics";

import { FileCheckIcon, GripVerticalIcon, FileClockIcon } from "lucide-react";
import { EditorContent } from "@/components/ui/editor";
import DragHandle from "@tiptap/extension-drag-handle-react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { Input } from "@/components/ui/input";

const EditorInterface = ({ documentId }: { documentId: string }) => {
  const [editor, setEditor] = useState<Editor | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const [isEditable, setIsEditable] = useState(true);

  const [initialContent, setInitialContent] = useState<null | JSONContent>(
    null,
  );
  const [isSaved, setIsSaved] = useState(false);
  const [charsCount, setCharsCount] = useState<number | undefined>(undefined);

  const debouncedUpdates = useDebouncedCallback((editor: Editor) => {
    const json = editor.getJSON();
    setCharsCount(editor.storage.characterCount.words());

    window.localStorage.setItem("vesper-html-content", editor.getHTML());
    window.localStorage.setItem(
      "vesper-structured-content",
      JSON.stringify(json),
    );
    const markdownStorage = (editor.storage as any).markdown as
      | { getMarkdown: () => string }
      | undefined;
    if (markdownStorage) {
      window.localStorage.setItem(
        "vesper-markdown",
        markdownStorage.getMarkdown(),
      );
    }

    setIsSaved(true);
  }, 1500);

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  const extensions = [
    StarterKit.configure({ codeBlock: false }),
    Placeholder.configure({
      placeholder: "Start creating your notes. Press '/' for quick commands.",
    }),
    Math.configure({
      blockOptions: {
        onClick: (node, pos) => {
          const newCalc = prompt(
            "Enter new block math expression:",
            node.attrs.latex,
          );
          if (newCalc && editorRef.current) {
            editorRef.current
              .chain()
              .setNodeSelection(pos)
              .updateBlockMath({ latex: newCalc })
              .focus()
              .run();
          }
        },
      },
      inlineOptions: {
        onClick: (node, pos) => {
          const newCalc = prompt(
            "Enter new inline math expression:",
            node.attrs.latex,
          );
          if (newCalc && editorRef.current) {
            editorRef.current
              .chain()
              .setNodeSelection(pos)
              .updateInlineMath({ latex: newCalc })
              .focus()
              .run();
          }
        },
      },
    }),
    CharacterCount,
    Markdown.configure({
      html: true,
      transformCopiedText: true,
    }),
  ];

  useEffect(() => {
    const content = window.localStorage.getItem("vesper-structured-content");

    if (content) {
      setInitialContent(JSON.parse(content));
    } else {
      setInitialContent({});
    }
  }, []);

  if (!initialContent) return null;

  return (
    <div className="group relative min-h-full xl:px-6 pt-0 w-full">
      <div className="sticky top-3 flex items-center  max-w-max gap-3 left-10 border-l pl-3 z-50 2xl:opacity-0 2xl:-translate-y-2 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
        <Input className="p-0 border-none h-auto outline-none focus-visible:border-none focus-visible:ring-0 rounded-none max-w-max backdrop-blur-lg rounded-r-full" />
      </div>
      <div className="sticky mr-2 sm:mr-4 top-[10px] right-5 z-10 mb-5 flex justify-end gap-2 2xl:opacity-0 2xl:-translate-y-2 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
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
        <DragHandle editor={editor}>
          <GripVerticalIcon strokeWidth={1} />
        </DragHandle>
      )}

      <EditorContent
        className="tiptap text-foreground pt-8 xl:px-12"
        immediatelyRender={false}
        editable={true}
        onCreate={({ editor }) => {
          migrateMathStrings(editor);
          setEditor(editor);
        }}
        onUpdate={({ editor }) => {
          debouncedUpdates(editor);
          setIsSaved(false);
        }}
        onDestroy={() => {
          setEditor(null);
        }}
        initialContent={initialContent}
        extensions={extensions}
      />
    </div>
  );
};

export default EditorInterface;
