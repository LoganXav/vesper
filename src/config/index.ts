export const config = {
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://vesper:vesper@localhost:5432/vesper",
};
