// src/server/routers/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
// later you'll add authRouter, etc.

export const appRouter = router({
  example: exampleRouter,
  // auth: authRouter,
  // other: otherRouter,
});

// Export type for client
export type AppRouter = typeof appRouter;
