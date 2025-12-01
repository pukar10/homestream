// server/trpc/routers/user.ts

import { router, publicProcedure } from "../index";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const userSelect = {
  id: true,
  email: true,
  createdAt: true,
} as const;

export const userRouter = router({
  /**
   * Get a list of users.
   * 
   * Right now this is "public" (no auth), but later you can
   * switch this to a protectedProcedure when you add auth.
   */
  list: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prismaClientShared.user.findMany({
      select: userSelect,
      orderBy: { createdAt: "desc" },
    });

    return users;
  }),

  /**
   * Get a single user by id.
   *
   * 1) Validate input.id with zod
   * 2) Fetch user from Postgres via Prisma
   * 3) Throw NOT_FOUND if no user
   * 4) Return safe fields only
   */
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(), // you can tighten this (e.g. .cuid()) if your id uses cuid()
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prismaClientShared.user.findUnique({
        where: { id: input.id },
        select: userSelect,
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user;
    }),
});
