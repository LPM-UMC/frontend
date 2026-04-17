# ====== Build stage ======
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (pakai lockfile kalau ada)
COPY package*.json ./
RUN npm ci

# Copy source dan build
COPY . .
RUN npm run build


# ====== Runtime stage ======
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# Copy output hasil build Nuxt
COPY --from=builder /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
