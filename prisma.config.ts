import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma CLI doesn't load Next.js env files automatically — load both.
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true }); // .env.local wins

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // DIRECT_URL bypasses PgBouncer — required for DDL (migrations/push).
    // Falls back to DATABASE_URL if only one URL is provided.
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
