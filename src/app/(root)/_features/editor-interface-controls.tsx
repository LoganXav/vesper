"use client";

import katex from "katex";
import { useState } from "react";
import "katex/dist/katex.min.css";
import { Editor } from "@tiptap/core";
import {
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  FileLock2Icon,
  Redo2Icon,
  Undo2Icon,
  FilePenLineIcon,
  SigmaIcon,
} from "lucide-react";

interface Props {
  isEditable: boolean;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
  editor: Editor;
}

const mathExpressions = [
  {
    label: "Fraction",
    latex: "\\frac{a}{b}",
    info: "Represents a division of two terms.",
  },
  {
    label: "Square Root",
    latex: "\\sqrt{x}",
    info: "Square root of a number or expression.",
  },
  { label: "Exponent", latex: "x^{2}", info: "x raised to the power of 2." },
  {
    label: "Subscript",
    latex: "x_{i}",
    info: "Subscript notation, commonly for indices.",
  },
  { label: "Pi", latex: "\\pi", info: "Mathematical constant ~3.14159." },
  {
    label: "Theta",
    latex: "\\theta",
    info: "Greek letter, often used for angles.",
  },
  { label: "Sine", latex: "\\sin(x)", info: "Trigonometric sine function." },
  {
    label: "Limit",
    latex: "\\lim_{x \\to 0}",
    info: "Limit as x approaches 0.",
  },
  {
    label: "Integral",
    latex: "\\int f(x) dx",
    info: "Integral of a function over x.",
  },
  {
    label: "Summation",
    latex: "\\sum_{i=1}^{n} x_i",
    info: "Summation over an index range.",
  },
];

export const EditorInterfaceControls = ({
  isEditable,
  setIsEditable,
  editor,
}: Props) => {
  const toggleEditable = () => {
    if (!editor) return;
    editor.setEditable(!isEditable);
    setIsEditable(!isEditable);
  };

  const [mathOpen, setMathOpen] = useState(false);

  const insertMath = (latex: string) => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<span data-type="inline-math" data-latex="${latex}"></span>`
      )
      .run();
    setMathOpen(false);
  };

  const btnStyle =
    "px-1 py-1 rounded text-sm cursor-pointer hover:bg-accent flex justify-center transition-colors";

  const active = (is: boolean) => (is ? "bg-accent" : "");

  return (
    <div className="bg-secondary border border-border rounded-2xl py-1 px-1.5 toolbar gap-2 flex relative w-max">
      {/* Lock / Edit toggle */}

      <button
        type="button"
        className={`${btnStyle} ${!isEditable ? "bg-accent" : ""}`}
        onClick={toggleEditable}
      >
        {!isEditable ? (
          <FileLock2Icon size={16} />
        ) : (
          <FilePenLineIcon size={16} />
        )}
      </button>

      {/* Math palette with manual hover submenu */}
      <div
        className="relative"
        onMouseEnter={() => setMathOpen(true)}
        onMouseLeave={() => setMathOpen(false)}
      >
        <button type="button" className={`${btnStyle}`}>
          <SigmaIcon size={16} />
        </button>

        {mathOpen && (
          <div className="min-w-max absolute top-6 -left-20 bg-popover border border-border rounded-lg p-2 grid grid-cols-3 gap-4 max-h-72 overflow-y-auto z-50 scrollbar-none">
            {mathExpressions.map((expr) => (
              <div
                key={expr.label}
                className="rounded-md p-1 text-sm text-center hover:bg-accent cursor-pointer transition-colors"
                onClick={() => insertMath(expr.latex)}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: katex.renderToString(expr.latex, {
                      throwOnError: false,
                    }),
                  }}
                />
                {expr.info && (
                  <p className="text-[10px] text-muted-foreground mt-1 max-w-16">
                    {expr.info}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Text formatting */}
      <button
        type="button"
        className={`${btnStyle} ${active(editor.isActive("bold"))}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon size={16} />
      </button>

      <button
        type="button"
        className={`${btnStyle} ${active(editor.isActive("italic"))}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon size={16} />
      </button>

      <button
        type="button"
        className={`${btnStyle} ${active(
          editor.isActive("heading", { level: 1 })
        )}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1Icon size={16} />
      </button>

      <button
        type="button"
        className={`${btnStyle} ${active(
          editor.isActive("heading", { level: 2 })
        )}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2Icon size={16} />
      </button>

      <button
        type="button"
        className={`${btnStyle} ${active(
          editor.isActive("heading", { level: 3 })
        )}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3Icon size={16} />
      </button>

      <button
        type="button"
        className={`${btnStyle} ${active(editor.isActive("bulletList"))}`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListIcon size={16} />
      </button>

      <button
        type="button"
        className={`${btnStyle} ${active(editor.isActive("orderedList"))}`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrderedIcon size={16} />
      </button>

      <hr className="border-border" />

      {/* Undo/Redo */}
      <button
        type="button"
        className={btnStyle}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2Icon size={16} />
      </button>
      <button
        type="button"
        className={btnStyle}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2Icon size={16} />
      </button>
    </div>
  );
};
