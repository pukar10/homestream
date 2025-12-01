// server/trpc/routers/auth.ts

import { router, publicProcedure } from "../index";
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

    /**
     * Register a new user with email + password.
     *
     * 1) Validate input with zod
     * 2) Check if email already exists
     * 3) Hash password
     * 4) Create user in Postgres via Prisma
     * 5) Return safe user data (no password)
     */
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
     * (Session/JWT handling would be another step on top of this.)
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

            // 3) Return safe user data (no hash)
            const { passwordHash, ...safeUser } = user;
            return safeUser;
        }),
});
