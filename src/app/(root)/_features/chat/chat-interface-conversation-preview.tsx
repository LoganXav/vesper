"use client";

import katex from "katex";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { ForwardIcon, XIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { markdownToHtml } from "@/utils/markdown-utils";

interface ChatInterfaceConversationPreviewProps {
  data?: string | null;
  status: "used" | "dismissed" | "default";
  onApply?: () => void;
  onDismiss?: () => void;
}

export default function ChatInterfaceConversationPreview({
  data,
  status,
  onApply,
  onDismiss,
}: ChatInterfaceConversationPreviewProps) {
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!previewRef.current) return;
    if (!data) {
      previewRef.current.innerHTML = "";
      return;
    }

    const html = markdownToHtml(String(data));
    previewRef.current.innerHTML = html;

    // render math
    const nodes = previewRef.current.querySelectorAll<HTMLElement>(
      '[data-type="inline-math"], [data-type="block-math"]',
    );
    nodes.forEach((node) => {
      const latex = node.getAttribute("data-latex") || "";
      const displayMode = node.getAttribute("data-type") === "block-math";
      try {
        katex.render(latex, node, { displayMode, throwOnError: false });
      } catch {
        node.textContent = latex;
      }
    });
  }, [data]);

  const apply = () => {
    if (!data) return;
    onApply?.();
  };

  return (
    <div className="space-y-3">
      <Card className="bg-secondary border border-border rounded-lg py-3">
        <CardHeader className="px-3 text-xs text-muted-foreground border-b border-border uppercase tracking-wider">
          Preview
        </CardHeader>

        <CardContent
          className={cn(
            "px-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-track-transparent pointer-events-none",
            status === "used" && "bg-green-900/10",
            status === "dismissed" && "bg-red-900/10",
          )}
        >
          <div
            ref={previewRef}
            className="
              prose prose-invert max-w-none text-xs leading-relaxed text-foreground
              prose-headings:font-semibold prose-headings:text-neutral-100 prose-headings:tracking-tight
              prose-h1:text-lg prose-h2:text-sm prose-h3:text-xs
              prose-h1:leading-0 prose-h2:leading-0 prose-hr:my-2 prose-hr:border-neutral-800
              prose-p:text-neutral-300 prose-strong:text-neutral-100 prose-em:text-neutral-300
              prose-ul:list-disc prose-ul:pl-3 prose-li:marker:text-neutral-500
              prose-blockquote:border-l-2 prose-blockquote:border-neutral-700 prose-blockquote:pl-4 prose-blockquote:text-neutral-400
              prose-code:bg-neutral-800 prose-code:text-neutral-100 prose-code:px-1 prose-code:rounded-sm
              prose-pre:bg-neutral-900 prose-pre:p-2 prose-pre:rounded-md prose-pre:text-neutral-200
              prose-a:text-blue-400 hover:prose-a:text-blue-300 transition-colors
            "
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 items-center">
        <Button
          variant="ghost"
          disabled={status === "used" || status === "dismissed"}
          size="sm"
          onClick={onDismiss}
          className="h-6 px-2 text-[11px] rounded-sm"
        >
          <XIcon className="size-3" />
          Dismiss
        </Button>

        <Button
          size="sm"
          onClick={apply}
          disabled={status === "used" || status === "dismissed"}
          className="h-6 px-2 text-[11px] rounded-sm"
        >
          <ForwardIcon className="size-3" />
          Apply
        </Button>
      </div>
    </div>
  );
}
