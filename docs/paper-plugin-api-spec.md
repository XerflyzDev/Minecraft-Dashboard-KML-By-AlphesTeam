# Minecraft Dashboard Plugin API Spec

This document defines the payload and transport contract for a Paper or Spigot plugin that sends live server data to the Next.js dashboard.

## Goal

Expose one server snapshot that includes:

- In-game day
- In-game time
- Weather
- Online player count
- TPS
- Difficulty
- Every online player name
- Player UUID
- World
- Biome
- X Y Z coordinates
- Facing direction
- Health
- Food
- Ping

## Recommended architecture

1. Paper or Spigot plugin collects live data on a repeating scheduler.
2. Plugin sends the latest snapshot to the web app over HTTP.
3. Web app stores the latest snapshot in memory, Redis, SQLite, or a JSON file.
4. Dashboard page reads the latest snapshot and broadcasts changes through WebSocket if needed.

## Recommended poll interval

- Every `20 ticks` for fast updates
- Every `40 ticks` for lighter server load

## HTTP push endpoint

`POST /api/minecraft/snapshot`

### Headers

```http
Content-Type: application/json
Authorization: Bearer <plugin-secret>
```

### Request body

```json
{
  "serverName": "Blockwatch Realm",
  "updatedAt": "2026-03-29T18:25:00+07:00",
  "day": 128,
  "time": "08:42",
  "weather": "clear",
  "tps": 19.9,
  "onlinePlayers": 4,
  "maxPlayers": 20,
  "difficulty": "hard",
  "players": [
    {
      "uuid": "8667ba71-b85a-4004-af54-457a9734eed7",
      "name": "Steve",
      "world": "overworld",
      "biome": "plains",
      "position": {
        "x": 124,
        "y": 65,
        "z": -42
      },
      "facing": "south",
      "health": 20,
      "food": 18,
      "ping": 38
    }
  ]
}
```

### Success response

```json
{
  "ok": true,
  "receivedAt": "2026-03-29T18:25:01+07:00"
}
```

## Dashboard read endpoints

### `GET /api/minecraft/snapshot`

Returns the latest full snapshot.

### `GET /api/minecraft/players`

Returns only the `players` array if the frontend wants a lighter request.

## WebSocket event

Endpoint suggestion:

`/ws/minecraft/live`

Event suggestion:

`minecraft:snapshot`

Payload is the same JSON structure as the HTTP push body.

## Type contract

```ts
type MinecraftWorld = "overworld" | "nether" | "end";

type PlayerSnapshot = {
  uuid: string;
  name: string;
  world: MinecraftWorld;
  biome: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  facing: string;
  health: number;
  food: number;
  ping: number;
};

type ServerSnapshot = {
  serverName: string;
  updatedAt: string;
  day: number;
  time: string;
  weather: "clear" | "rain" | "thunder";
  tps: number;
  onlinePlayers: number;
  maxPlayers: number;
  difficulty: string;
  players: PlayerSnapshot[];
};
```

## Mapping notes for Bukkit API

- `serverName`: from config or plugin config
- `updatedAt`: current timestamp in ISO 8601 format
- `day`: compute from world full time
- `time`: format world time into a readable in-game clock
- `weather`: map `hasStorm()` and `isThundering()`
- `tps`: Paper exposes TPS directly more easily than Spigot
- `onlinePlayers`: `Bukkit.getOnlinePlayers().size()`
- `maxPlayers`: `Bukkit.getMaxPlayers()`
- `difficulty`: primary world difficulty
- `world`: map Bukkit world environment to `overworld`, `nether`, or `end`
- `biome`: player current biome from block location
- `position`: player location block or precise coordinates
- `facing`: derive from yaw or cardinal direction helper
- `ping`: available directly on Paper more conveniently

## Security

- Protect the push endpoint with a shared bearer token
- Reject requests with missing or invalid authorization
- Optionally allow only your server IP
- Rate limit non-authorized requests

## Suggested plugin config

```yaml
dashboard:
  enabled: true
  endpoint: "https://your-domain.com/api/minecraft/snapshot"
  bearerToken: "replace-this-secret"
  intervalTicks: 20
```

## Minimum viable plugin responsibilities

1. Collect online player snapshots.
2. Collect world-level status once per interval.
3. Serialize to JSON.
4. POST to the dashboard endpoint.
5. Log failures without crashing the server thread.
