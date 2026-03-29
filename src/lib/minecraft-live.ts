import type { ServerSnapshot } from "@/lib/minecraft-types";

type SnapshotSubscriber = (snapshot: ServerSnapshot) => void;

declare global {
  var __minecraftSubscribers: Set<SnapshotSubscriber> | undefined;
}

function getSubscribers() {
  if (!globalThis.__minecraftSubscribers) {
    globalThis.__minecraftSubscribers = new Set<SnapshotSubscriber>();
  }

  return globalThis.__minecraftSubscribers;
}

export function subscribeToSnapshots(subscriber: SnapshotSubscriber) {
  const subscribers = getSubscribers();
  subscribers.add(subscriber);

  return () => {
    subscribers.delete(subscriber);
  };
}

export function broadcastSnapshot(snapshot: ServerSnapshot) {
  for (const subscriber of getSubscribers()) {
    subscriber(snapshot);
  }
}
