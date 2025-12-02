// src/server/trpc/routers/_appRouter.ts

import { router } from "../index";
import { authRouter } from "./authRouter";
import { userRouter } from "./userRouter";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
});

// Export type definition of the API
export type AppRouter = typeof appRouter;

