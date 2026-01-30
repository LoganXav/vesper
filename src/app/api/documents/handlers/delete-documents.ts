import { database } from "@/database/connection";
import { documents } from "@/database/schema/document";
import { HttpError } from "@/lib/error";
import { eq, and } from "drizzle-orm";

export const deleteDocumentHandler = async ({
  documentId,
  userId,
}: {
  documentId: string;
  userId: string;
}) => {
  try {
    const deletedDocument = await database
      .delete(documents)
      .where(and(eq(documents.id, documentId), eq(documents.userId, userId)))
      .returning();

    if (deletedDocument.length === 0) {
      throw new HttpError("Document not found", 404);
    }

    return deletedDocument[0];
  } catch (error) {
    throw error;
  }
};
