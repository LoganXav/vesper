"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import remarkMath from "remark-math";
import { ChatMessage } from "@/types";
import rehypeKatex from "rehype-katex";
import ReactMarkdown from "react-markdown";
import type { Dispatch, SetStateAction } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ChatInterfaceConversationPreview from "./chat-interface-conversation-preview";
import { formatChatMessages } from "@/utils/chat-message-format";
import { useEditorStore } from "@/store/editor-store";
import { applyEditsToMarkdown } from "@/utils/markdown-utils";
import { migrateMathStrings } from "@tiptap/extension-mathematics";
import { config } from "@/config";

export default function ChatInterfaceConversation({
  messages,
  setMessages,
}: {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}) {
  if (!messages.length) {
    return null;
  }

  // subscribes only to getEditor
  const editor = useEditorStore((s) => s.getEditor());

  const formattedMessages = useMemo(
    () => formatChatMessages(messages),
    [messages],
  );

  const handleApplyEdits = (msg: ChatMessage) => {
    const edits = msg.edits;
    if (!editor || !edits) return;

    const currentMarkdown =
      window.localStorage.getItem(config.localStorageDraftKey) ?? "{}";

    const currentMarkdownContent = JSON.parse(currentMarkdown).markdown ?? "";

    const updatedMarkdown = applyEditsToMarkdown(currentMarkdownContent, edits);

    editor.commands.setContent(updatedMarkdown);

    migrateMathStrings(editor);

    setMessages((prev) =>
      prev.map((m) =>
        m.id === msg.id
          ? {
              ...m,
              status: "used",
            }
          : m,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-64 pt-10">
      {formattedMessages.map((msg) => (
        <Card
          key={msg.id}
          className={cn(
            "relative w-fit max-w-[85%] min-w-0 px-1 py-0 rounded-2xl transition-all duration-200 break-words border-none",
            msg.role === "user"
              ? "ml-auto bg-secondary text-secondary-foreground rounded-br-sm"
              : "mr-auto bg-muted text-foreground rounded-bl-sm",
          )}
        >
          <CardContent className="py-2 px-2">
            <div className="prose prose-invert max-w-none text-sm leading-relaxed prose-p:my-0 prose-li:my-0 prose-ul:pl-0 prose-ol:pl-0">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {msg.content.replace(/\n/g, "  \n")}
              </ReactMarkdown>
            </div>

            {msg.preview && (
              <div className="mt-4">
                <ChatInterfaceConversationPreview
                  data={msg.preview.data}
                  status={msg.status}
                  onApply={() => handleApplyEdits(msg)}
                  onDismiss={() =>
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === msg.id ? { ...m, status: "dismissed" } : m,
                      ),
                    )
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
