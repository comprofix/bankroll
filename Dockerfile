# --- deps: install all dependencies (dev deps needed for the build) ---
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- builder: compile the production build ---
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time-only placeholder: nothing at build time queries the database,
# but src/db/index.ts throws if DATABASE_URL is unset at module load, which
# would otherwise fail the build. Not a real secret, so plain ENV is fine.
# SESSION_SECRET is deliberately NOT set here: it's only read inside a
# function body (src/lib/auth.ts), never at module load, so the build
# doesn't need it — and unlike DATABASE_URL, it's an actual secret, which is
# exactly what Docker's SecretsUsedInArgOrEnv check warns about (ARG/ENV
# values get baked into the image's layer history). Real values come from
# the environment at runtime only.
ENV DATABASE_URL="postgres://build:build@localhost:5432/build"

RUN npm run build

# --- runner: self-contained — serves the app AND can run db:migrate/db:seed
# directly, no external Node toolchain required. Installs production
# dependencies fresh (tsx and dotenv included — see package.json) rather
# than reusing Next's "standalone" trace output, since that only traces
# what the Next.js server itself needs at request time, not the separate
# migrate/seed scripts, which aren't part of the app's route tree. ---
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY drizzle ./drizzle
COPY src/db ./src/db

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["npm", "run", "start"]
