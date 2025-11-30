import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Makes globalThis.prisma type-safe
declare global {
  var prisma: PrismaClient | undefined;
}

// Creates pg connection pool & and wrap with Prisma's Postgres adapter
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool);

// Create or reuse a single PrismaClient instance
const prismaClient =
  globalThis.prisma ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

// In dev, store the client in globalThis to survive hot-reloads
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prismaClient;
}

// Export the shared client for the rest of the app to use
export const prisma = prismaClient;
