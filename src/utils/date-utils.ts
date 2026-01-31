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

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}m`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y`;
}
