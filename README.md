# Minecraft Dashboard KML By AlphesTeam

Realtime Minecraft Java server dashboard built with Next.js.

## Includes

- Dashboard landing page for server status
- Player cards with avatar, world, biome, xyz, health, food, and ping
- Paper or Spigot plugin API contract
- Dark control-room layout with live snapshot streaming
- Paper plugin with event-based pushes and retry queue

## Project structure

- `src/app/page.tsx` dashboard UI
- `src/app/layout.tsx` app metadata and root layout
- `src/app/globals.css` theme and global styles
- `docs/paper-plugin-api-spec.md` plugin payload and transport spec

## Run locally

```bash
npm install
npm run dev
```

Open:

- `/` for the live dashboard
- `/admin` for the token and plugin setup guide
- `/status` for health and freshness checks

## Environment

Create `.env.local` from `.env.example` if you want the POST endpoint to require a shared bearer token.

## Paper plugin

The Java plugin skeleton lives in `paper-plugin/`.

```bash
cd paper-plugin
mvn package
```

## Live routes

- `GET /api/minecraft/snapshot`
- `POST /api/minecraft/snapshot`
- `GET /api/minecraft/live`
- `GET /api/minecraft/status`
