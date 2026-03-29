import { mockSnapshot } from "@/lib/minecraft-mock";
import type { ServerSnapshot } from "@/lib/minecraft-types";

declare global {
  var __minecraftSnapshot: ServerSnapshot | undefined;
}

export function getSnapshot() {
  if (!globalThis.__minecraftSnapshot) {
    globalThis.__minecraftSnapshot = mockSnapshot;
  }

  return globalThis.__minecraftSnapshot;
}

export function setSnapshot(snapshot: ServerSnapshot) {
  globalThis.__minecraftSnapshot = snapshot;
}
