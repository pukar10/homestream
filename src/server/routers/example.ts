// src/server/routers/example.ts

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const exampleRouter = router({
  hello: publicProcedure
    .input(
      z
        .object({
          name: z.string().optional(),
        })
        .optional(),
    )
    .query(({ input }) => {
      const name = input?.name ?? "world";
      return { message: `Hello, ${name}!` };
    }),

  whoami: protectedProcedure.query(({ ctx }) => {
    // ctx.user is non-null here
    return { user: ctx.user };
  }),
});
