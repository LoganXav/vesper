"use client";

import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types";
import ReactMarkdown from "react-markdown";
import { Dispatch, SetStateAction } from "react";

export default function ChatInterfaceConversation({
  messages,
}: {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 pb-32">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn(
            "relative w-fit max-w-[85%] px-4 py-2 rounded-2xl transition-all duration-200",
            msg.role === "user"
              ? "ml-auto bg-primary text-primary-foreground rounded-br-md"
              : "mr-auto bg-muted text-foreground rounded-bl-md"
          )}
        >
          <div className="prose prose-sm max-w-none leading-relaxed prose-p:my-0 prose-li:my-0 prose-ul:pl-4 prose-ol:pl-4 text-sm">
            <ReactMarkdown>{msg.content.replace(/\n/g, "  \n")}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}
