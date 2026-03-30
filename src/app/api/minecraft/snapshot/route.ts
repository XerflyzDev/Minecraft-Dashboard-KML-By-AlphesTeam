import { NextResponse } from "next/server";

import { broadcastSnapshot } from "@/lib/minecraft-live";
import { getSnapshot, setSnapshot } from "@/lib/minecraft-store";
import { normalizeServerSnapshot } from "@/lib/minecraft-types";

function hasValidToken(request: Request) {
  const configuredToken = process.env.MINECRAFT_DASHBOARD_TOKEN;

  if (!configuredToken) {
    return true;
  }

  const authHeader = request.headers.get("authorization");

  return authHeader === `Bearer ${configuredToken}`;
}

export async function GET() {
  return NextResponse.json(getSnapshot(), {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

export async function POST(request: Request) {
  if (!hasValidToken(request)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized",
      },
      { status: 401 },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid JSON body",
      },
      { status: 400 },
    );
  }

  const snapshot = normalizeServerSnapshot(payload);

  if (!snapshot) {
    return NextResponse.json(
      {
        ok: false,
        error: "Payload does not match ServerSnapshot contract",
      },
      { status: 400 },
    );
  }

  setSnapshot(snapshot);
  broadcastSnapshot(snapshot);

  return NextResponse.json({
    ok: true,
    receivedAt: new Date().toISOString(),
  });
}
