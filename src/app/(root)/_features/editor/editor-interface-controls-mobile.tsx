"use client";

import katex from "katex";
import { useState, useRef, useEffect } from "react";
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
  SlidersHorizontalIcon,
  ChevronDownIcon,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const mathExpressions = [
  { label: "Fraction", latex: "\\frac{a}{b}", info: "Division of two terms." },
  { label: "Square Root", latex: "\\sqrt{x}", info: "Square root." },
  { label: "Exponent", latex: "x^{2}", info: "x to the power of 2." },
  { label: "Subscript", latex: "x_{i}", info: "Subscript." },
  { label: "Pi", latex: "\\pi", info: "Constant π." },
  { label: "Theta", latex: "\\theta", info: "Angle θ." },
  { label: "Sine", latex: "\\sin(x)", info: "Sine function." },
  { label: "Limit", latex: "\\lim_{x \\to 0}", info: "Limit." },
  { label: "Integral", latex: "\\int f(x) dx", info: "Integral." },
  { label: "Summation", latex: "\\sum_{i=1}^{n} x_i", info: "Summation." },
];

export interface EditorInterfaceControlsMobileProps {
  isEditable: boolean;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
  editor: Editor;
}

export function EditorInterfaceControlsMobile({
  isEditable,
  setIsEditable,
  editor,
}: EditorInterfaceControlsMobileProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [mathOpen, setMathOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
      setMathOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const toggleEditable = () => {
    if (!editor) return;
    editor.setEditable(!isEditable);
    setIsEditable(!isEditable);
  };

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
    "p-2.5 rounded-lg text-sm cursor-pointer hover:bg-accent flex items-center justify-center transition-colors touch-manipulation";
  const active = (is: boolean) => (is ? "bg-accent" : "");

  if (!isMobile) return null;

  return (
    <div
      ref={containerRef}
      className="fixed top-2 right-2 z-50 flex flex-col-reverse items-center gap-2 md:hidden"
    >
      {/* Expandable tray */}
      <div
        className={cn(
          "flex flex-col gap-1 rounded-2xl border border-border bg-background/95 backdrop-blur-sm overflow-hidden transition-all duration-200 ease-out",
          open
            ? "max-h-[70vh] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 translate-y-2 pointer-events-none overflow-hidden"
        )}
      >
        <div className="p-2 flex flex-col gap-1 max-h-[68vh] overflow-y-auto scrollbar-thin">
          {/* Lock / Edit */}
          <button
            type="button"
            className={cn(btnStyle, "w-full justify-start gap-2", !isEditable && "bg-accent")}
            onClick={toggleEditable}
          >
            {!isEditable ? (
              <FileLock2Icon size={16} />
            ) : (
              <FilePenLineIcon size={16} />
            )}
            <span className="text-xs">{!isEditable ? "Unlock" : "Lock"}</span>
          </button>

          {/* Math */}
          <div className="relative">
            <button
              type="button"
              className={cn(btnStyle, "w-full justify-start gap-2")}
              onClick={() => setMathOpen((v) => !v)}
            >
              <SigmaIcon size={16} />
              <span className="text-xs">Math</span>
              <ChevronDownIcon
                size={14}
                className={cn("ml-auto transition-transform", mathOpen && "rotate-180")}
              />
            </button>
            {mathOpen && (
              <div className="mt-1 p-2 grid grid-cols-4 gap-2 max-h-48 overflow-y-auto rounded-lg bg-muted/50 border border-border">
                {mathExpressions.map((expr) => (
                  <button
                    key={expr.label}
                    type="button"
                    className="rounded-md p-1 text-center hover:bg-accent transition-colors touch-manipulation"
                    onClick={() => insertMath(expr.latex)}
                  >
                    <div
                      className="flex items-center justify-center text-xs"
                      dangerouslySetInnerHTML={{
                        __html: katex.renderToString(expr.latex, {
                          throwOnError: false,
                        }),
                      }}
                    />
                    {/* <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                      {expr.info}
                    </p> */}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border my-0.5" />

          {/* Formatting row */}
          <div className="grid grid-cols-6 gap-1">
            <button
              type="button"
              title="Bold"
              className={cn(btnStyle, active(editor.isActive("bold")))}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <BoldIcon size={16} />
            </button>
            <button
              type="button"
              title="Italic"
              className={cn(btnStyle, active(editor.isActive("italic")))}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <ItalicIcon size={16} />
            </button>
            <button
              type="button"
              title="Undo"
              className={btnStyle}
              onClick={() => editor.chain().focus().undo().run()}
            >
              <Undo2Icon size={16} />
            </button>
            <button
              type="button"
              title="Redo"
              className={btnStyle}
              onClick={() => editor.chain().focus().redo().run()}
            >
              <Redo2Icon size={16} />
            </button>

          {/* Headings & lists */}
            <button
              type="button"
              title="Heading 1"
              className={cn(btnStyle, active(editor.isActive("heading", { level: 1 })))}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              <Heading1Icon size={16} />
            </button>
            <button
              type="button"
              title="Heading 2"
              className={cn(btnStyle, active(editor.isActive("heading", { level: 2 })))}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2Icon size={16} />
            </button>
            <button
              type="button"
              title="Heading 3"
              className={cn(btnStyle, active(editor.isActive("heading", { level: 3 })))}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3Icon size={16} />
            </button>
            <button
              type="button"
              title="Bullet list"
              className={cn(btnStyle, active(editor.isActive("bulletList")))}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <ListIcon size={16} />
            </button>
            <button
              type="button"
              title="Numbered list"
              className={cn(btnStyle, active(editor.isActive("orderedList")))}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrderedIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Round toggle button */}
      <Button
        aria-label={open ? "Close editor controls" : "Open editor controls"}
        aria-expanded={open}
        size="icon"
        variant="outline"
        className={cn(
          "text-secondary-foreground rounded-full self-end flex items-center justify-center border border-border bg-secondary hover:bg-accent transition-colors touch-manipulation",
          open && "bg-accent"
        )}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <ChevronDownIcon size={16} className="rotate-180" />
        ) : (
          <SlidersHorizontalIcon size={16} />
        )}
      </Button>
    </div>
  );
}
