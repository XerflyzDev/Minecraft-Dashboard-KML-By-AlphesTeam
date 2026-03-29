import { NextResponse } from "next/server";

import { getDashboardHealth } from "@/lib/minecraft-status";

export async function GET() {
  return NextResponse.json(getDashboardHealth(), {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
