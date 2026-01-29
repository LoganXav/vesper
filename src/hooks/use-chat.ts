"use client";

import { useState } from "react";
import { ChatMessage } from "@/types/index";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  async function sendMessage({
    message,
    context,
  }: {
    message: string;
    context?: string;
  }) {
    if (!message.trim()) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      content: message,
      status: "default",
    };

    const assistantId = String(Date.now() + 1);
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "Thinking...",
      preview: null,
      status: "default",
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsSending(true);
  }

  return { messages, setMessages, sendMessage, isSending };
}
