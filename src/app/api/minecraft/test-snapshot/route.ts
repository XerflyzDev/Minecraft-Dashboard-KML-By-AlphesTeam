import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import { isDiscordAuthConfigured } from "@/lib/auth-env";
import { broadcastSnapshot } from "@/lib/minecraft-live";
import { setSnapshot } from "@/lib/minecraft-store";
import { createTestSnapshot } from "@/lib/test-snapshot";

export async function POST() {
  if (isDiscordAuthConfigured()) {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          ok: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }
  }

  const snapshot = createTestSnapshot();
  setSnapshot(snapshot);
  broadcastSnapshot(snapshot);

  return NextResponse.json({
    ok: true,
    mode: "test-snapshot",
    snapshot,
  });
}
