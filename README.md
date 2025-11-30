# 🌊 HomeStream

Modern TypeScript full-stack with tRPC + Prisma + Postgres, using async request/response between frontend and backend

Traffic for `app.pukarsubedi.com` goes through a Cloudflare tunnel to a Caddy reverse proxy which forwards traffic to a compute VM hosted in my Homelab running the NextJS server on port 3000.

```yaml
# Stack
* Docker compose
* Postgres
* Prisma (ORM and db migration tool)
* tRPC

# Flow
Frontend → tRPC client function → tRPC appRouter → server procedure (Prisma/Postgres) -> returns to tRPC appRouter → returns to tRPC client → returns to Frontend
```

* appRouter creates a context (user, session, etc) object that gets sent with each request to server procedure.
<br><br>

## 👨‍💻 Local Dev

```bash
# Start App (prod)
docker compose up -d 

# Only NextJS web server (dev)
npm run dev

# Only Postgres DB
docker compose up -d db

# Stop App
docker compose down
```

Project should now be running on `app.pukarsubedi.com`
<br><br>

### Prisma

_ORM & migration tool_

_Schema:_ Apply new migration to bring current schema in line with `schema.prisma`, record change as `init_auth`
```bash
npx prisma migrate dev --name init_auth
```

_Data:_ Regenerate Prisma Client code from `schema.prisma` so your application can use the latest typed API to access the database.
```bash
npx prisma generate

# Now you can use PrismaClient to change data in the DB. example:
import { PrismaClient } from "src/generated/prisma/client";
```

#### Singleton PrismaClient

Create a single shared PrismaClient _cached_ to `globalThis` so hot-reloading does not keep creating new clients and postgres connections. Only Dev.
```ts
import { PrismaClient } from "@prisma/client";

/*
1. Tell TypeScript that in Node's global scope, we might store prisma as either PrismaClient or undefined. 
Makes globalThis.prisma type-safe
*/
declare global {
  var prisma: PrismaClient | undefined;
}

// 2. Create a single PrismaClient instance, or reuse the existing one in dev
const prismaClient =
  globalThis.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

// 3. In development, store the client on `globalThis` so it survives hot reloads
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prismaClient;
}

// 4. Export the shared client for the rest of the app to use
export const prisma = prismaClient;
```
<br><br>

## ✅ Milestones

- [x] 0 - traffic from `app.pukarsubedi.com` to NextJS server
    - [ ] - Cloudflare tunnel
    - [ ] - Caddy reverse proxy
    - [ ] - Compute VM in homelab
- [x] 1 - Dockerize NextJS and deploy application via docker compose
    - [ ] - Dockerfile
    - [ ] - docker-compose.yaml
    - [ ] - .dockerignore
- [ ] 2 - Setup authentication 
    - [ ] - postgres + _auth library_ + data migration
    - [ ] - Add tRPC to NextJS app, return user
<br><br>

## 🔍 Learn More

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
<br><br>

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
