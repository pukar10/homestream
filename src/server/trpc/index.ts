import { initTRPC } from '@trpc/server';
import type { Context } from '../context';

// Context for each request will have type Context
const t = initTRPC.context<Context>().create();

// Exporting router and publicProcedure for use in the application
export const router = t.router;
export const publicProcedure = t.procedure;
