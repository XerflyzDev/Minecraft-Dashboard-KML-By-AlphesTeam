export type MinecraftWorld = "overworld" | "nether" | "end";

export type PlayerSnapshot = {
  uuid: string;
  name: string;
  health: number;
  food: number;
  ping: number;
  biome: string;
  world: MinecraftWorld;
  position: {
    x: number;
    y: number;
    z: number;
  };
  facing: string;
};

export type ServerSnapshot = {
  serverName: string;
  updatedAt: string;
  day: number;
  time: string;
  weather: "clear" | "rain" | "thunder";
  onlinePlayers: number;
  maxPlayers: number;
  tps: number;
  difficulty: string;
  players: PlayerSnapshot[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isWorld(value: unknown): value is MinecraftWorld {
  return value === "overworld" || value === "nether" || value === "end";
}

function isWeather(value: unknown): value is ServerSnapshot["weather"] {
  return value === "clear" || value === "rain" || value === "thunder";
}

function isPosition(value: unknown): value is PlayerSnapshot["position"] {
  return (
    isRecord(value) &&
    typeof value.x === "number" &&
    typeof value.y === "number" &&
    typeof value.z === "number"
  );
}

function isPlayerSnapshot(value: unknown): value is PlayerSnapshot {
  return (
    isRecord(value) &&
    typeof value.uuid === "string" &&
    typeof value.name === "string" &&
    typeof value.health === "number" &&
    typeof value.food === "number" &&
    typeof value.ping === "number" &&
    typeof value.biome === "string" &&
    isWorld(value.world) &&
    isPosition(value.position) &&
    typeof value.facing === "string"
  );
}

export function isServerSnapshot(value: unknown): value is ServerSnapshot {
  return (
    isRecord(value) &&
    typeof value.serverName === "string" &&
    typeof value.updatedAt === "string" &&
    typeof value.day === "number" &&
    typeof value.time === "string" &&
    isWeather(value.weather) &&
    typeof value.onlinePlayers === "number" &&
    typeof value.maxPlayers === "number" &&
    typeof value.tps === "number" &&
    typeof value.difficulty === "string" &&
    Array.isArray(value.players) &&
    value.players.every(isPlayerSnapshot)
  );
}
