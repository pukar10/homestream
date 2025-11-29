// app/api/trpc/route.ts
import { appRouter } from "@/server/routers/_app";
import { createContext } from "@/server/trpcContext";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: ({ req }) => createContext({ req: req as any }),
  });
};

export { handler as GET, handler as POST };
