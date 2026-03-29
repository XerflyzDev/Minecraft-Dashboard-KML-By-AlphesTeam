import type { ServerSnapshot } from "@/lib/minecraft-types";

export function createTestSnapshot(): ServerSnapshot {
  return {
    serverName: "Blockwatch Test Realm",
    updatedAt: new Date().toISOString(),
    day: 214,
    time: "18:36",
    weather: "rain",
    tps: 19.8,
    onlinePlayers: 2,
    maxPlayers: 20,
    difficulty: "hard",
    bridge: {
      queueSize: 0,
      lastPushStatus: "manual-test",
      lastPushAt: new Date().toISOString(),
      lastError: null,
      totalPushCount: 1,
      retryCount: 0,
    },
    players: [
      {
        uuid: "8667ba71-b85a-4004-af54-457a9734eed7",
        name: "Steve",
        health: 20,
        food: 18,
        ping: 42,
        biome: "plains",
        world: "overworld",
        position: { x: 124, y: 65, z: -42 },
        facing: "south",
      },
      {
        uuid: "ec561538-f3fd-461d-aff5-086b22154bce",
        name: "Alex",
        health: 16,
        food: 20,
        ping: 57,
        biome: "warped_forest",
        world: "nether",
        position: { x: -18, y: 74, z: 203 },
        facing: "east",
      },
    ],
  };
}
