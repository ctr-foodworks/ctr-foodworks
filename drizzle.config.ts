import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load env from .env.local (Next.js convention) so the Drizzle CLI sees
// DATABASE_URL when you run db:generate / db:migrate / db:push.
config({ path: ".env.local" });

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
