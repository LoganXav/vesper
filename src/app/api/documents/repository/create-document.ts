import { database } from "@/database/connection";
import { documents } from "@/database/schema/document";

export const createDocumentHandler = async ({
  title,
  userId,
}: {
  title: string;
  userId: string;
}) => {
  try {
    const [created] = await database
      .insert(documents)
      .values({ title, userId, isDefault: false })
      .returning();
    return created;
  } catch (error) {
    throw error;
  }
};
