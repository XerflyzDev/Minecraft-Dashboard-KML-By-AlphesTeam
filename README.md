# Minecraft Dashboard KML By AlphesTeam

Realtime Minecraft Java server dashboard built with Next.js.

## Includes

- Dashboard landing page for server status
- Player cards with avatar, world, biome, xyz, health, food, and ping
- Paper or Spigot plugin API contract
- Ready-to-extend layout for snapshot API and WebSocket updates

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

## Environment

Create `.env.local` from `.env.example` if you want the POST endpoint to require a shared bearer token.

## Paper plugin

The Java plugin skeleton lives in `paper-plugin/`.

```bash
cd paper-plugin
mvn package
```

## Next step

Implement:

- `POST /api/minecraft/snapshot`
- `GET /api/minecraft/snapshot`
- optional WebSocket broadcast at `/ws/minecraft/live`
