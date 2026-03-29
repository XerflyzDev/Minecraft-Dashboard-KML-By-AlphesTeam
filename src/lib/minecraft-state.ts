import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { createEmptySnapshot } from "@/lib/minecraft-default";
import { isServerSnapshot } from "@/lib/minecraft-types";
import type { ServerSnapshot } from "@/lib/minecraft-types";

export type DashboardState = {
  snapshot: ServerSnapshot;
  hasReceivedSnapshot: boolean;
  lastPostAt: string | null;
  postCount: number;
};

declare global {
  var __minecraftDashboardState: DashboardState | undefined;
}

const DATA_DIR = path.join(process.cwd(), "data");
const STATE_FILE = path.join(DATA_DIR, "dashboard-state.json");

function createInitialState(): DashboardState {
  return {
    snapshot: createEmptySnapshot(),
    hasReceivedSnapshot: false,
    lastPostAt: null,
    postCount: 0,
  };
}

function isPersistedState(value: unknown): value is DashboardState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    isServerSnapshot(candidate.snapshot) &&
    typeof candidate.hasReceivedSnapshot === "boolean" &&
    (typeof candidate.lastPostAt === "string" || candidate.lastPostAt === null) &&
    typeof candidate.postCount === "number"
  );
}

function loadStateFromDisk() {
  if (!existsSync(STATE_FILE)) {
    return createInitialState();
  }

  try {
    const raw = readFileSync(STATE_FILE, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (isPersistedState(parsed)) {
      return parsed;
    }
  } catch {
    // Fall back to an empty in-memory state if the file is unreadable.
  }

  return createInitialState();
}

function persistState(state: DashboardState) {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf8");
}

export function getDashboardState() {
  if (!globalThis.__minecraftDashboardState) {
    globalThis.__minecraftDashboardState = loadStateFromDisk();
  }

  return globalThis.__minecraftDashboardState;
}

export function getSnapshot() {
  return getDashboardState().snapshot;
}

export function setSnapshot(snapshot: ServerSnapshot) {
  const state = getDashboardState();
  state.snapshot = snapshot;
  state.hasReceivedSnapshot = true;
  state.lastPostAt = new Date().toISOString();
  state.postCount += 1;
  persistState(state);
}
