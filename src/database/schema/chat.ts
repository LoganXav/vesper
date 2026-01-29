import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";

export const chats = pgTable("chat", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  messages: jsonb("messages").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});
