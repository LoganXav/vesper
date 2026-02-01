import { database } from "@/database/connection";
import { chats } from "@/database/schema/chat";
import { ChatMessage } from "@/types";
import { and, eq } from "drizzle-orm";

export const updateChatHandler = async ({
  chatId,
  userId,
  messages,
}: {
  chatId: string;
  userId: string;
  messages: ChatMessage[];
}) => {
  try {
    await database
      .update(chats)
      .set({ messages })
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)));
  } catch (error) {
    throw error;
  }
};
