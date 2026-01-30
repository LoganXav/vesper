import { Document } from "@/types";

export const groupDocumentsByDate = (documents: Document[]) => {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfSevenDaysAgo = new Date(startOfToday);
  startOfSevenDaysAgo.setDate(startOfSevenDaysAgo.getDate() - 7);

  const today: Document[] = [];
  const previous7Days: Document[] = [];

  for (const doc of documents) {
    const date = doc.updatedAt
      ? new Date(doc.updatedAt)
      : new Date(doc.createdAt ?? 0);
    if (date >= startOfToday) {
      today.push(doc);
    } else if (date >= startOfSevenDaysAgo) {
      previous7Days.push(doc);
    }
  }

  return { today, previous7Days };
};
