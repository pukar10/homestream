// server/trpc/routers/appRouter.ts
import { router } from "../index";
// import { authRouter } from "./auth";
// import { userRouter } from "./user";

export const appRouter = router({
//   auth: authRouter,
//   user: userRouter,
});

// Export type definition of the API
export type AppRouter = typeof appRouter;

