
import { defineConfig } from "drizzle-kit";

const url = process.env.PRODUCTION_DATABASE_URL;

if (!url) {
  throw new Error(
    "PRODUCTION_DATABASE_URL is missing. Migration aborted."
  );
}

const target = new URL(url);

if (
  !["postgres:", "postgresql:"].includes(target.protocol) ||
  !target.hostname.endsWith(".neon.tech") ||
  target.hostname.includes("-pooler")
) {
  throw new Error(
    "A direct Neon PostgreSQL connection is required."
  );
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
