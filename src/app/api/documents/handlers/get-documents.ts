import { database } from "@/database/connection";
import { documents } from "@/database/schema/document";
import { eq, desc } from "drizzle-orm";

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
