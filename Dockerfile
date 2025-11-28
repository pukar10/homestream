# 1) Builder stage --------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
RUN npm ci

# Copy the rest of the app
COPY . .

# Build Next.js app
RUN npm run build

# 2) Runner stage --------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# Copy built app + public assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

# Next.js default start script
CMD ["npm", "start"]
