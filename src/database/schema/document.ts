import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { users } from "./user";

export const documents = pgTable("document", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  content: text("content"),
  isDefault: boolean("isDefault").notNull().default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});
