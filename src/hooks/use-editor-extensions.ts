"use client";

import { RefObject } from "react";
import { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Math from "@tiptap/extension-mathematics";
import CharacterCount from "@tiptap/extension-character-count";
import { Markdown } from "tiptap-markdown";

export const useEditorExtensions = (editorRef: RefObject<Editor | null>) => {
  const extensions = [
    StarterKit.configure({ codeBlock: false }),
    Placeholder.configure({
      placeholder: "Start creating your notes...",
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

  return extensions;
};
