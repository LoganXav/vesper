"use client";

import { useState, useCallback } from "react";
import { ChatMessage } from "@/types/index";

export interface UseChatOptions {
  chatId?: string;
  initialMessages?: ChatMessage[];
}

export function useChat(options: UseChatOptions = {}) {
  const { chatId, initialMessages = [] } = options;
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useCallback(
    async ({
      message,
      documentId,
    }: {
      message: string;
      context?: string;
      documentId?: string;
    }) => {
      if (!message.trim()) return;
      if (!chatId) {
        console.error("Chat ID is required for sending messages");
        return;
      }

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
        content: "",
        preview: null,
        status: "default",
      };

      // Add user message immediately
      setMessages((prev) => [...prev, userMsg]);
      // Add empty assistant message for streaming
      setMessages((prev) => [...prev, assistantMsg]);
      setIsSending(true);

      try {
        const response = await fetch(`/api/chat/${chatId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            stream: true,
            documentId, // Pass documentId in request body
          }),
        });

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedContent += chunk;

          // Update the assistant message with accumulated content
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content: accumulatedContent }
                : msg,
            ),
          );
        }

        // Try to parse JSON if it looks like editing mode response
        try {
          const parsed = JSON.parse(accumulatedContent);
          if (parsed.edits && Array.isArray(parsed.edits)) {
            // This is an editing mode response
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? {
                      ...msg,
                      content: accumulatedContent,
                      preview: { data: JSON.stringify(parsed, null, 2) },
                    }
                  : msg,
              ),
            );
          }
        } catch {
          // Not JSON, treat as normal response
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  content: "Sorry, I encountered an error. Please try again.",
                  status: "default",
                }
              : msg,
          ),
        );
      } finally {
        setIsSending(false);
      }
    },
    [chatId],
  );

  return { messages, setMessages, sendMessage, isSending };
}
