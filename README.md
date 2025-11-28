# HomeStream

Traffic for `app.pukarsubedi.com` goes through a Cloudflare tunnel to a Caddy reverse proxy which forwards traffic to a compute VM hosted in my Homelab running the NextJS server on port 3000.

## Get started

Start NextJS project

```bash
# Start NextJS container
docker run --rm -p 3000:3000 homestream

# Start entire HomeStream application
docker compose up -d
docker compose ps

# Logs
docker compose logs -f 

# Stop app
docker compose down
```

Project should now be running on `app.pukarsubedi.com`

## Milestones

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


## Learn More

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
