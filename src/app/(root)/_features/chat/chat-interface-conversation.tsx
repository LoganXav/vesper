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

  const formattedMessages = useMemo(
    () => formatChatMessages(messages),
    [messages],
  );

  return (
    <div className="flex flex-col gap-6 pb-64">
      {formattedMessages.map((msg) => (
        <Card
          key={msg.id}
          className={cn(
            "relative w-fit max-w-[85%] min-w-0 px-1 py-0 rounded-2xl transition-all duration-200 break-words border-none",
            msg.role === "user"
              ? "ml-auto bg-secondary text-secondary-foreground rounded-br-md"
              : "mr-auto bg-transparent text-foreground rounded-bl-md",
          )}
        >
          <CardContent className="py-2 px-2">
            <div className="prose prose-invert max-w-none text-xs leading-relaxed prose-p:my-0 prose-li:my-0 prose-ul:pl-0 prose-ol:pl-0">
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
                  // onApply={() => handleApplyEdits(msg)}
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
