import { database } from "@/database/connection";
import { documents } from "@/database/schema/document";
import { eq } from "drizzle-orm";

export const getDocumentsHandler = async ({ userId }: { userId: string }) => {
  try {
    const documentsList = await database
      .select()
      .from(documents)
      .where(eq(documents.userId, userId));

    return documentsList;
  } catch (error) {
    throw error;
  }
};
