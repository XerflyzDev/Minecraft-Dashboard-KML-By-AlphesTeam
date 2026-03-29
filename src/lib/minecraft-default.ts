import type { ServerSnapshot } from "@/lib/minecraft-types";

export function createEmptySnapshot(): ServerSnapshot {
  return {
    serverName: "Waiting for Paper bridge",
    updatedAt: "",
    day: 0,
    time: "--:--",
    weather: "clear",
    onlinePlayers: 0,
    maxPlayers: 0,
    tps: 0,
    difficulty: "unknown",
    players: [],
  };
}
