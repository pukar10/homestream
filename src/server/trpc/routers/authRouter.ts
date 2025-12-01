// server/trpc/routers/auth.ts

import { router, publicProcedure, protectedProcedure } from "../index";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

const userSelect = {
    id: true,
    email: true,
    createdAt: true,
} as const;

export const authRouter = router({
    // Simple health check – useful to verify that the router is wired correctly.
    health: publicProcedure.query(() => {
        return { status: "ok" };
    }),
    
    //Register a new user with email + password.
    register: publicProcedure
        .input(
            z.object({
                email: z.email(),
                password: z.string().min(8, "Password must be at least 8 characters"),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { email, password } = input;

            // 1) Does a user with this email already exist?
            const existing = await ctx.prismaClientShared.user.findUnique({
                where: { email },
            });

            if (existing) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Email is already registered",
                });
            }

            // 2) Hash the password
            const passwordHash = await bcrypt.hash(password, 12);

            // 3) Create the user
            const user = await ctx.prismaClientShared.user.create({
                data: {
                    email,
                    passwordHash,
                },
                select: userSelect, // return only safe fields
            });

            return user;
        }),

    /**
     * Login with email + password.
     *
     * 1) Validate input
     * 2) Find user by email
     * 3) Compare password with stored hash
     * 4) Return safe user data if valid
     *
     * (no real session yet, just checks credentials)
     */
    login: publicProcedure
        .input(
            z.object({
                email: z.email(),
                password: z.string().min(1, "Password is required"),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { email, password } = input;

            // 1) Find user
            const user = await ctx.prismaClientShared.user.findUnique({
                where: { email },
            });

            if (!user || !user.passwordHash) {
                // Don't reveal which part is wrong
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid email or password",
                });
            }

            // 2) Compare password
            const valid = await bcrypt.compare(password, user.passwordHash);
            if (!valid) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid email or password",
                });
            }

            // Right now we just return the safe user
            // Later create a session / cookie / JWT here.
            const { passwordHash, ...safeUser } = user;
            return safeUser;
        }),

    me: protectedProcedure.query(async ({ ctx }) => {
        if(!ctx.user) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return ctx.user;
    }),
});
