import postgres from "postgres";
import { config } from "@/config";
import * as schema from "@/database/schema";
import { drizzle } from "drizzle-orm/postgres-js";

const pool = postgres(config.databaseUrl, { max: 1 });

export const database = drizzle(pool);
