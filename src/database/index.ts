import postgres from "postgres";
import { config } from "@/config";
import * as schema from "@/database/schema";
import { drizzle } from "drizzle-orm/postgres-js";

const client = postgres(config.databaseUrl, { prepare: false });

export const database = drizzle(client, { schema });
