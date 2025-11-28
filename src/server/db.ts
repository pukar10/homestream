import { PrismaClient } from "../generated/client";

// Store prisma as either PrismaClient or undefined. Makes globalThis.prisma type-safe.
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a single PrismaClient instance, or reuse the existing one in dev
const prismaClient =
  globalThis.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

// In development, store the client on `globalThis` so it survives hot reloads
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prismaClient;
}

// Export the shared client for the rest of the app to use
export const prisma = prismaClient;