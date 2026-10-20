import { drizzle } from "drizzle-orm/neon-http";

// Retrieve the database connection string
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing");
}

// Create the database connection
export const db = drizzle(databaseUrl);
