"use client";

import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

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
        Loading session
      </div>
    );
  }

  if (!session?.user) {
    return (
      <button
        onClick={() => signIn("discord")}
        className="inline-flex items-center gap-2 rounded-full border border-violet-300/18 bg-violet-400/12 px-4 py-3 text-sm font-semibold text-violet-50 transition hover:bg-violet-400/18"
      >
        <LogIn className="h-4 w-4" />
        <span>Sign in with Discord</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/8"
    >
      <LogOut className="h-4 w-4" />
      <span>Sign out</span>
    </button>
  );
}
