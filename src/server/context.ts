// server/context.ts

import { prismaClientShared } from "./prismaClientShared";

export async function createContext() {
  return { prismaClientShared };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
