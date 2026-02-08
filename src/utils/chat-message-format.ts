import { ChatMessage, ChatMessageEdit } from "@/types";

/**
 * Parses and formats a chat message to extract editing mode data
 * Handles JSON responses with edits and formats them for preview
 */
export function formatChatMessage(message: ChatMessage): ChatMessage {
  // If message already has preview and edits, return as-is (already formatted)
  if (message.preview && message.edits) {
    return message;
  }

  // Only process model/assistant messages
  if (message.role !== "model") {
    return message;
  }

  let text = message.content.trim();

  // Skip if content is empty or just whitespace
  if (!text) {
    return message;
  }

  // Remove ```json fences if they exist
  if (text.startsWith("```json")) {
    text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  }
  // Also handle ``` without json
  if (text.startsWith("```") && text.endsWith("```")) {
    text = text.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  // Try to parse as JSON
  let data: { summary?: string; edits?: ChatMessageEdit[] } | null = null;




  try {
    data = JSON.parse(text);
  } catch {
    // If parsing fails, treat as plain text
    return message;
  }

  console.log({ text, data });


  // Check if it's an editing mode response
  if (data && (data.summary !== undefined || data.edits)) {
    let mergedContent = "";

    data?.edits?.forEach((item) => {
      if (item.content) {
        mergedContent += item.content + "\n\n";
      }
    });

    // Return formatted message with preview
    return {
      ...message,
      content: data.summary || message.content,
      preview: {
        data: mergedContent || "This action will modify the document.",
      },
      edits: data.edits,
    };
  }

  // Not an editing response, return as-is
  return message;
}

/**
 * Formats an array of chat messages
 */
export function formatChatMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.map(formatChatMessage);
}
