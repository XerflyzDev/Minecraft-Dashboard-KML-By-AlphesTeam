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

export type BridgeMetrics = {
  queueSize: number;
  lastPushStatus: string;
  lastPushAt: string | null;
  lastError: string | null;
  totalPushCount: number;
  retryCount: number;
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
  bridge?: BridgeMetrics;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asRecord(value: unknown) {
  return isRecord(value) ? value : null;
}

function asFiniteNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function normalizeWorld(value: unknown): MinecraftWorld {
  if (value === "overworld" || value === "normal") {
    return "overworld";
  }

  if (value === "nether" || value === "the_nether") {
    return "nether";
  }

  if (value === "end" || value === "the_end") {
    return "end";
  }

  return "overworld";
}

function normalizeWeather(value: unknown): ServerSnapshot["weather"] {
  const normalized = typeof value === "string" ? value.toLowerCase() : "";

  if (normalized === "thunder" || normalized === "thunderstorm") {
    return "thunder";
  }

  if (normalized === "rain" || normalized === "storm") {
    return "rain";
  }

  return "clear";
}

function normalizePosition(value: unknown): PlayerSnapshot["position"] {
  const candidate = asRecord(value);

  return {
    x: asFiniteNumber(candidate?.x, 0),
    y: asFiniteNumber(candidate?.y, 0),
    z: asFiniteNumber(candidate?.z, 0),
  };
}

function normalizeBridgeMetrics(value: unknown): BridgeMetrics | undefined {
  const candidate = asRecord(value);
  if (!candidate) {
    return undefined;
  }

  return {
    queueSize: asFiniteNumber(candidate.queueSize, 0),
    lastPushStatus: asString(candidate.lastPushStatus, "unknown"),
    lastPushAt:
      typeof candidate.lastPushAt === "string" ? candidate.lastPushAt : null,
    lastError:
      typeof candidate.lastError === "string" ? candidate.lastError : null,
    totalPushCount: asFiniteNumber(candidate.totalPushCount, 0),
    retryCount: asFiniteNumber(candidate.retryCount, 0),
  };
}

function normalizePlayerSnapshot(value: unknown): PlayerSnapshot | null {
  const candidate = asRecord(value);
  if (!candidate) {
    return null;
  }

  const name = asString(candidate.name);
  if (!name) {
    return null;
  }

  return {
    uuid: asString(candidate.uuid, `unknown-${name.toLowerCase()}`),
    name,
    health: asFiniteNumber(candidate.health, 0),
    food: asFiniteNumber(candidate.food, 0),
    ping: asFiniteNumber(candidate.ping, -1),
    biome: asString(candidate.biome, "unknown"),
    world: normalizeWorld(candidate.world),
    position: normalizePosition(candidate.position),
    facing: asString(candidate.facing, "south"),
  };
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

function isBridgeMetrics(value: unknown): value is BridgeMetrics {
  return (
    isRecord(value) &&
    typeof value.queueSize === "number" &&
    typeof value.lastPushStatus === "string" &&
    (typeof value.lastPushAt === "string" || value.lastPushAt === null) &&
    (typeof value.lastError === "string" || value.lastError === null) &&
    typeof value.totalPushCount === "number" &&
    typeof value.retryCount === "number"
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
    value.players.every(isPlayerSnapshot) &&
    (value.bridge === undefined || isBridgeMetrics(value.bridge))
  );
}

export function normalizeServerSnapshot(value: unknown): ServerSnapshot | null {
  const candidate = asRecord(value);
  if (!candidate) {
    return null;
  }

  const serverName = asString(candidate.serverName);
  if (!serverName) {
    return null;
  }

  const players = Array.isArray(candidate.players)
    ? candidate.players
        .map(normalizePlayerSnapshot)
        .filter((player): player is PlayerSnapshot => player !== null)
    : [];

  return {
    serverName,
    updatedAt: asString(candidate.updatedAt, new Date().toISOString()),
    day: asFiniteNumber(candidate.day, 0),
    time: asString(candidate.time, "--:--"),
    weather: normalizeWeather(candidate.weather),
    onlinePlayers: asFiniteNumber(candidate.onlinePlayers, players.length),
    maxPlayers: asFiniteNumber(candidate.maxPlayers, Math.max(players.length, 1)),
    tps: asFiniteNumber(candidate.tps, 0),
    difficulty: asString(candidate.difficulty, "unknown"),
    players,
    bridge: normalizeBridgeMetrics(candidate.bridge),
  };
}
