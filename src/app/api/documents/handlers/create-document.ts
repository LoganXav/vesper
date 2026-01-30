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
    const document = await database
      .insert(documents)
      .values({ title, userId, isDefault: false });
    return document;
  } catch (error) {
    throw error;
  }
};
