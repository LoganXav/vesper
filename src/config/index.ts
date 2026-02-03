export const config = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
  isProduction: process.env.NODE_ENV === "production",
  authSecret: process.env.AUTH_SECRET!,

  databaseUrl:
    process.env.AUTH_DRIZZLE_URL ||
    "postgresql://vesper:vesper@localhost:5432/vesper",

  authDrizzleDatabaseUrl: process.env.AUTH_DRIZZLE_URL!,

  googleClientId: process.env.AUTH_GOOGLE_ID!,
  googleClientSecret: process.env.AUTH_GOOGLE_SECRET!,

  googleGeminiApiKey: process.env.GOOGLE_GEMINI_API_KEY!,

  localStorageDraftKey: "vesper:active-draft",
};
