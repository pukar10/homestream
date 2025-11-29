import { PrismaClient } from "../generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Store prisma as either PrismaClient or undefined. Makes globalThis.prisma type-safe.
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a pg connection pool using your DATABASE_URL
//    This URL should be set in .env (for dev) and in your deployment env.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Wrap the pg pool with Prisma's Postgres adapter
const adapter = new PrismaPg(pool);

// Create or reuse a single PrismaClient instance
const prismaClient =
  globalThis.prisma ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

// In dev, store the client on globalThis to survive hot-reloads
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prismaClient;
}

// Export the shared client for the rest of the app to use
export const prisma = prismaClient;
