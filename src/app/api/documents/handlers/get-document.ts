import { database } from "@/database/connection";
import { documents } from "@/database/schema/document";
import { eq, desc, and } from "drizzle-orm";

export const getDocumentsHandler = async ({ userId }: { userId: string }) => {
  try {
    const documentsList = await database
      .select()
      .from(documents)
      .where(eq(documents.userId, userId))
      .orderBy(desc(documents.updatedAt));

    return documentsList;
  } catch (error) {
    throw error;
  }
};

export const getDocumentHandler = async ({
  documentId,
  userId,
}: {
  documentId: string;
  userId: string;
}) => {
  try {
    const document = await database
      .select()
      .from(documents)
      .where(and(eq(documents.id, documentId), eq(documents.userId, userId)))
      .limit(1);

    return document?.[0];
  } catch (error) {
    throw error;
  }
};

export const getMostRecentDocumentHandler = async ({
  userId,
}: {
  userId: string;
}) => {
  try {
    const mostRecentDocument = await database
      .select()
      .from(documents)
      .where(eq(documents.userId, userId))
      .orderBy(desc(documents.updatedAt))
      .limit(1);

    return mostRecentDocument?.[0];
  } catch (error) {
    throw error;
  }
};
