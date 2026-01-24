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

import { GripVerticalIcon } from "lucide-react";
import { EditorContent } from "@/components/ui/editor";
import DragHandle from "@tiptap/extension-drag-handle-react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

const EditorInterface = () => {
  const [editor, setEditor] = useState<Editor | null>(null);
  const editorRef = useRef<Editor | null>(null);

  const [isEditable, setIsEditable] = useState(true);

  const [initialContent, setInitialContent] = useState<null | JSONContent>(
    null
  );
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState<number>(0);

  const debouncedUpdates = useDebouncedCallback((editor: Editor) => {
    const json = editor.getJSON();
    setCharsCount(editor.storage.characterCount.words());

    window.localStorage.setItem("vesper-html-content", editor.getHTML());
    window.localStorage.setItem(
      "vesper-structured-content",
      JSON.stringify(json)
    );
    window.localStorage.setItem(
      "vesper-markdown",
      editor.storage.markdown.getMarkdown()
    );

    setSaveStatus("Saved");
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
            node.attrs.latex
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
            node.attrs.latex
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
    <>
      <div className="p-0 lg:px-10 relative">
        <div className="fixed z-30 right-3 top-1/2 -translate-y-1/2">
          {editor && (
            <EditorInterfaceControls
              editor={editor}
              isEditable={isEditable}
              setIsEditable={setIsEditable}
            />
          )}
        </div>

        <div className="flex justify-end sticky right-5 top-[1px] z-10 mb-5 gap-2">
          <div className="rounded-xl bg-secondary text-secondary-foreground px-2 py-1 text-xs">
            {saveStatus}
          </div>
          {charsCount > 0 && (
            <div className="rounded-xl bg-secondary text-secondary-foreground px-2 py-1 text-xs">
              {charsCount} Words
            </div>
          )}
        </div>

        {editor && (
          <DragHandle editor={editor}>
            <GripVerticalIcon strokeWidth={1} />
          </DragHandle>
        )}

        <EditorContent
          className="tiptap text-foreground"
          immediatelyRender={false}
          editable={true}
          onCreate={({ editor }) => {
            migrateMathStrings(editor);
            setEditor(editor);
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
            setSaveStatus("Unsaved");
          }}
          onDestroy={() => {
            setEditor(null);
          }}
          initialContent={initialContent}
          extensions={extensions}
        ></EditorContent>
      </div>
    </>
  );
};

export default EditorInterface;
