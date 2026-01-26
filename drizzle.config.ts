import { config } from "@/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/database/schema",
  out: "./src/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: config.databaseUrl,
  },
});
