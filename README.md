# Bankroll

A personal poker bankroll tracker. Log cash game and tournament sessions, see your all-time and by-venue numbers, and check the app from a phone via an Android client that connects to your own self-hosted server.

Single-user by design — there's no signup flow, no multi-tenant anything. It's built to run as one small Docker stack you own.

## Screenshots

| Home | Edit Session |
| --- | --- |
| ![Home screen — session list with all-time net total](screenshots/mainscreen.png) | ![Edit Cash Session form](screenshots/session.png) |

| Stats — profit & totals | Stats — mix, venues, best/worst |
| --- | --- |
| ![Profit-over-time chart and all-time totals table](screenshots/stats-1.png) | ![Session mix, win rate, by-venue breakdown, best/worst sessions](screenshots/stats-2.png) |

## Features

- **Cash sessions** — date/time (with overnight rollover handled automatically), blinds, starting buy-in plus any number of rebuys, cash-out, venue, notes. Net profit and $/hour computed automatically.
- **Tournament sessions** — tournament name, date, buy-in plus re-entries, finish position, payout. Net profit and ROI computed automatically.
- **Venues** — save venues once in Settings, then pick them from a dropdown on session forms. Deleting a venue never rewrites history — past sessions keep the name they were logged with.
- **Stats dashboard** — cumulative profit chart (cash vs. tournament), all-time totals (buy-in, winnings, net, hours, $/hour, ROI, win %), session mix, win rate, a by-venue breakdown, and best/worst sessions.
- **Dark mode**, following the system theme.
- **Android app** — a thin native wrapper (Capacitor) around the same web app. On first launch it asks for your server's URL rather than being built against a fixed address, so the same APK works against anyone's own deployment.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript, Server Actions for all mutations
- [Drizzle ORM](https://orm.drizzle.team) + PostgreSQL
- Hand-rolled single-user auth: bcrypt password hashing, a signed JWT session cookie
- Tailwind CSS v4
- [Capacitor](https://capacitorjs.com) for the Android client

## Running it yourself

Requires Docker.

```bash
git clone https://github.com/comprofix/bankroll.git
cd bankroll
cp .env.example .env   # fill in SESSION_SECRET, SEED_EMAIL, SEED_PASSWORD
docker compose up -d
```

That starts the app and its own Postgres instance, runs migrations, and seeds your one user account automatically. Open `http://localhost:3000` and log in with the `SEED_EMAIL`/`SEED_PASSWORD` you set.

> **This is the only way to create your account.** There's no signup page, ever — by design, for a single-user app. To change your credentials later, log in and use the in-app change-password page rather than re-seeding: seeding only creates the account if none exists yet, so it silently no-ops on every start after the first.

For local development without Docker: `npm install`, point `DATABASE_URL` at a Postgres instance, `npm run db:migrate`, `npm run db:seed`, `npm run dev`.

## Deploying

Pre-built images are published to `ghcr.io/comprofix/bankroll` on every push to `main`, and tagged `vX.Y.Z` whenever an Android release is cut (see below) so a given APK version and its matching server image line up.

`docker-compose.prod.yml` is the reference production stack — Traefik-labeled, its own isolated Postgres, no build step, just `${VAR}` substitutions for secrets (see `.env.prod.example` for what to set). Migrations and seeding run automatically on every container start — there's no manual deploy step beyond pulling the new image.

- **Via Portainer**, pulling this compose file straight from the repo: set the variables under the stack's "Environment variables" UI.
- **Manually, on any Traefik-fronted Docker host**: copy `.env.prod.example` to `.env` next to `docker-compose.prod.yml`, fill it in, and run `docker compose -f docker-compose.prod.yml up -d`. Compose reads that `.env` automatically for the substitutions — no other setup needed.

> **Traefik network name:** the compose file assumes your external Traefik network is called `proxy` (`networks.proxy.external: true`, and the `traefik.docker.network=proxy` label). If your Traefik setup uses a different network name, update both of those to match — otherwise Traefik won't be able to route to the container. This app also sits on a second, internal-only network for its own Postgres instance; the `traefik.docker.network` label is what tells Traefik which of the two networks to actually use (without it, Traefik picks ambiguously between them and you'll see intermittent gateway timeouts).

> **HTTPS is required.** The session cookie is `Secure` by default, so browsers will silently refuse to send it back over plain HTTP — login will appear to succeed, then bounce you back to `/login` on the very next navigation. Make sure whatever's in front of this (Traefik, in the reference compose file) terminates real TLS. The only exception is `COOKIE_SECURE=false`, meant strictly for local non-HTTPS testing (e.g. an Android emulator) — never set it on a real deployment.

## Android app

Download the latest signed APK from [Releases](https://github.com/comprofix/bankroll/releases) and sideload it. On first launch, it'll ask for your server's URL (e.g. `https://bankroll.example.com`) — enter the address of your own deployment and it connects from there. Nothing is hardcoded to any particular server, so the same APK works for anyone running their own instance.

New releases are cut by pushing a `vX.Y.Z` git tag, which builds and signs the APK, publishes it as a GitHub Release asset, and tags the matching Docker image — see `.github/workflows/android-release.yml`.

> **Forking this repo?** The release workflow needs its own signing key — it won't work with mine. Generate a keystore (`keytool -genkeypair -keystore release.keystore.jks -alias bankroll -keyalg RSA -keysize 2048 -validity 36500`), base64-encode it, and add it as the `ANDROID_KEYSTORE_BASE64` and `ANDROID_KEYSTORE_PASSWORD` repo secrets. Don't commit the keystore itself — CI decodes it from the secret at build time.
