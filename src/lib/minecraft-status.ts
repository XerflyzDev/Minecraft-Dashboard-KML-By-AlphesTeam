import { getDashboardState, getSnapshot } from "@/lib/minecraft-store";

export type DashboardHealth = {
  status: "live" | "stale" | "idle";
  snapshotAgeSeconds: number;
  lastUpdateAt: string | null;
  lastPostAt: string | null;
  hasReceivedSnapshot: boolean;
  postCount: number;
  serverName: string;
  onlinePlayers: number;
  liveStreamEndpoint: string;
  snapshotEndpoint: string;
};

const STALE_AFTER_SECONDS = 15;

export function getDashboardHealth(): DashboardHealth {
  const state = getDashboardState();
  const snapshot = getSnapshot();
  const lastSeen = state.lastPostAt ?? snapshot.updatedAt;
  const updatedAt = new Date(lastSeen);
  const isValidTimestamp = !Number.isNaN(updatedAt.getTime());
  const snapshotAgeSeconds = isValidTimestamp
    ? Math.max(0, Math.floor((Date.now() - updatedAt.getTime()) / 1000))
    : Number.POSITIVE_INFINITY;

  const status: DashboardHealth["status"] = !state.hasReceivedSnapshot || !isValidTimestamp
    ? "idle"
    : snapshotAgeSeconds > STALE_AFTER_SECONDS
      ? "stale"
      : "live";

  return {
    status,
    snapshotAgeSeconds: Number.isFinite(snapshotAgeSeconds) ? snapshotAgeSeconds : -1,
    lastUpdateAt: isValidTimestamp ? snapshot.updatedAt : null,
    lastPostAt: state.lastPostAt,
    hasReceivedSnapshot: state.hasReceivedSnapshot,
    postCount: state.postCount,
    serverName: snapshot.serverName,
    onlinePlayers: snapshot.onlinePlayers,
    liveStreamEndpoint: "/api/minecraft/live",
    snapshotEndpoint: "/api/minecraft/snapshot",
  };
}
