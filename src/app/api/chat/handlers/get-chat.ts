import { database } from "@/database/connection";
import { chats } from "@/database/schema/chat";
import { eq, and, desc } from "drizzle-orm";

export const getChatHandler = async ({
  chatId,
  userId,
}: {
  chatId: string;
  userId: string;
}) => {
  try {
    const chat = await database
      .select()
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)))
      .limit(1);

    return chat?.[0];
  } catch (error) {
    throw error;
  }
};

export const getChatsHandler = async ({ userId }: { userId: string }) => {
  try {
    const chatsList = await database
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.updatedAt));

    return chatsList;
  } catch (error) {
    throw error;
  }
};
