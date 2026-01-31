import { database } from "@/database/connection";
import { chats } from "@/database/schema/chat";
import { eq, and } from "drizzle-orm";

export const deleteChatHandler = async ({
  chatId,
  userId,
}: {
  chatId: string;
  userId: string;
}) => {
  try {
    await database
      .delete(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)));

    return { success: true };
  } catch (error) {
    throw error;
  }
};
