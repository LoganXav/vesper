import { books } from "@/database/schema/book";
import { chats } from "@/database/schema/chat";
import { documents } from "@/database/schema/document";
import { JSONContent } from "@tiptap/react";
import { InferSelectModel } from "drizzle-orm";

export type ChatMessage = {
  id: string;
  status: "used" | "dismissed" | "default";
  role: "user" | "model";
  content: string;
  preview?: { data: string } | null;
};

export type Chunk = {
  id: string;
  type: "paragraph" | "math" | "list" | "code" | "heading";
  content: string;
};

export type Chat = InferSelectModel<typeof chats>;

export type InitialContent = JSONContent | null;

export type Book = InferSelectModel<typeof books>;

export type Document = InferSelectModel<typeof documents>;
