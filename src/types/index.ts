import { books } from "@/database/schema/book";
import { documents } from "@/database/schema/document";
import { JSONContent } from "@tiptap/react";
import { InferSelectModel } from "drizzle-orm";

export type ChatMessage = {
  id: string;
  status: "used" | "dismissed" | "default";
  role: "user" | "assistant";
  content: string;
  preview?: { data: string } | null;
};

export type InitialContent = JSONContent | null;

export type Book = InferSelectModel<typeof books>;

export type Document = InferSelectModel<typeof documents>;
