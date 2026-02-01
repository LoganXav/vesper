import { database } from "@/database/connection";
import { documents } from "@/database/schema/document";
import { and, eq } from "drizzle-orm";

export const updateDocumentHandler = async ({
  documentId,
  userId,
  title,
  content,
}: {
  documentId: string;
  userId: string;
  title: string;
  content: string;
}) => {
  try {
    await database
      .update(documents)
      .set({ content, title })
      .where(and(eq(documents.id, documentId), eq(documents.userId, userId)))
      .returning();

    return;
  } catch (error) {
    throw error;
  }
};
