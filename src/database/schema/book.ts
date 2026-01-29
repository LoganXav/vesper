import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";

export const books = pgTable("book", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  author: text("author").notNull(),
  storagePath: text("storagePath").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});
