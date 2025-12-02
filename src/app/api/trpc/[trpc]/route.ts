// src/app/api/trpc/route.ts

import { appRouter } from "@/src/server/trpc/routers/_appRouter";
import { createContext } from "@/src/server/context";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext({ req }),
  });

export { handler as GET, handler as POST };
