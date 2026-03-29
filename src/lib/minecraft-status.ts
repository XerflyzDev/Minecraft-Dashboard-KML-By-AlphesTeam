import { getSnapshot } from "@/lib/minecraft-store";

export type DashboardHealth = {
  status: "live" | "stale" | "idle";
  snapshotAgeSeconds: number;
  lastUpdateAt: string | null;
  serverName: string;
  onlinePlayers: number;
  liveStreamEndpoint: string;
  snapshotEndpoint: string;
};

const STALE_AFTER_SECONDS = 15;

export function getDashboardHealth(): DashboardHealth {
  const snapshot = getSnapshot();
  const updatedAt = new Date(snapshot.updatedAt);
  const isValidTimestamp = !Number.isNaN(updatedAt.getTime());
  const snapshotAgeSeconds = isValidTimestamp
    ? Math.max(0, Math.floor((Date.now() - updatedAt.getTime()) / 1000))
    : Number.POSITIVE_INFINITY;

  const status: DashboardHealth["status"] = !isValidTimestamp
    ? "idle"
    : snapshotAgeSeconds > STALE_AFTER_SECONDS
      ? "stale"
      : "live";

  return {
    status,
    snapshotAgeSeconds: Number.isFinite(snapshotAgeSeconds) ? snapshotAgeSeconds : -1,
    lastUpdateAt: isValidTimestamp ? snapshot.updatedAt : null,
    serverName: snapshot.serverName,
    onlinePlayers: snapshot.onlinePlayers,
    liveStreamEndpoint: "/api/minecraft/live",
    snapshotEndpoint: "/api/minecraft/snapshot",
  };
}
