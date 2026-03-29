import { NextResponse } from "next/server";

import { getSnapshot } from "@/lib/minecraft-store";

export async function GET() {
  return NextResponse.json(getSnapshot().players, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
