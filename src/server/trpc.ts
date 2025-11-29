// src/server/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./trpcContext";

// 1. Initialize tRPC with our Context type and a transformer
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// 2. Base router + procedures
export const router = t.router;
export const publicProcedure = t.procedure;

// 3. Middleware for auth
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      // ctx.user is now non-null here
      user: ctx.user,
    },
  });
});

// 4. Protected procedure that requires auth
export const protectedProcedure = t.procedure.use(isAuthed);
