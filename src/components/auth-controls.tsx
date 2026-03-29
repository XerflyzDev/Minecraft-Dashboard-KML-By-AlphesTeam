"use client";

import { useSession } from "next-auth/react";

export function AuthControls({
  authConfigured,
}: {
  authConfigured: boolean;
}) {
  const { data: session, status } = useSession();

  if (!authConfigured) {
    return (
      <div className="rounded-full border border-amber-300/16 bg-amber-400/8 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">
        Discord auth not configured
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="rounded-full border border-white/10 bg-white/4 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
        Checking Discord session
      </div>
    );
  }

  return (
    <div
      className={`rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] ${
        session?.user
          ? "border border-emerald-300/16 bg-emerald-400/8 text-emerald-100"
          : "border border-violet-300/16 bg-violet-400/8 text-violet-100"
      }`}
    >
      {session?.user ? "Discord connected" : "Discord login available"}
    </div>
  );
}
