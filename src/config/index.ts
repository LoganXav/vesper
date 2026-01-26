export const config = {
  isProduction: process.env.NODE_ENV === "production",
  authSecret: process.env.AUTH_SECRET!,

  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://vesper:vesper@localhost:5432/vesper",

  authDrizzleDatabaseUrl: process.env.AUTH_DRIZZLE_URL!,

  googleClientId: process.env.AUTH_GOOGLE_ID!,
  googleClientSecret: process.env.AUTH_GOOGLE_SECRET!,
};
