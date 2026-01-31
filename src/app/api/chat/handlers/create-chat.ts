import { database } from "@/database/connection";
import { chats } from "@/database/schema/chat";
import { ChatMessage } from "@/types";

export const createChatHandler = async ({
  userId,
  title,
}: {
  userId: string;
  title?: string;
}) => {
  try {
    const chatTitle = title || "New Chat";
    const initialMessages: ChatMessage[] = [];

    const [chat] = await database
      .insert(chats)
      .values({
        userId,
        title: chatTitle,
        messages: initialMessages,
      })
      .returning();

    return chat;
  } catch (error) {
    throw error;
  }
};
