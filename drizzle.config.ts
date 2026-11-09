import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// Load local secrets for CLI use (`vercel env pull .env.local` creates this file).
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // Migrations use the direct (unpooled) connection; the app uses the pooled DATABASE_URL.
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
});
