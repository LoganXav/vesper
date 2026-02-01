"use client";

import { useState } from "react";
import { ChatMessage } from "@/types";
import { formatChatMessage } from "@/utils/chat-message-format";

export function useChat({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  async function sendMessage({
    message,
    documentId,
  }: {
    message: string;
    documentId?: string;
  }) {
    if (!message.trim()) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      content: message,
      status: "default",
    };

    const modelId = String(Date.now() + 1);
    const modelMsg: ChatMessage = {
      id: modelId,
      role: "model",
      content: "Thinking...",
      preview: null,
      status: "default",
    };

    setMessages((prev) => [...prev, userMsg, modelMsg]);
    setIsSending(true);

    try {
      const res = await fetch(`/api/chat/${chatId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, documentId }),
      });

      if (!res.ok) throw new Error(await res.text());

      // Read full body as text
      const text = await res.text();

      // Use the formatting utility to handle JSON parsing and preview extraction
      const formattedMessage = formatChatMessage({
        ...modelMsg,
        content: text.trim(),
      });

      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== modelId) return m;
          return {
            ...formattedMessage,
            isStreaming: false,
          };
        }),
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("sendMessage error:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.role === "model"
            ? {
                ...m,
                content: `Error: ${err.message || String(err)}`,
                isStreaming: false,
              }
            : m,
        ),
      );
    } finally {
      setIsSending(false);
    }
  }

  return { messages, setMessages, sendMessage, isSending };
}
