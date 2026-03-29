import { createEmptySnapshot } from "@/lib/minecraft-default";
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

function createInitialState(): DashboardState {
  return {
    snapshot: createEmptySnapshot(),
    hasReceivedSnapshot: false,
    lastPostAt: null,
    postCount: 0,
  };
}

export function getDashboardState() {
  if (!globalThis.__minecraftDashboardState) {
    globalThis.__minecraftDashboardState = createInitialState();
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
}
