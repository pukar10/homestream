// src/lib/trpc.ts

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/src/server/trpc/routers/_appRouter";

// This creates a typed tRPC "namespace" for React
export const trpc = createTRPCReact<AppRouter>();
