"use client";

import { LogIn, LogOut, ShieldCheck } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export function SidebarDiscordButton({
  authConfigured,
}: {
  authConfigured: boolean;
}) {
  const { data: session, status } = useSession();

  if (!authConfigured) {
    return (
      <div className="mt-6 rounded-[1.55rem] border border-amber-300/16 bg-amber-400/8 px-4 py-4">
        <p className="text-[10px] uppercase tracking-[0.22em] text-amber-100/75">
          Discord access
        </p>
        <p className="mt-2 text-sm font-semibold text-white">Not configured yet</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Add Discord env vars in Vercel to enable operator sign-in.
        </p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="mt-6 rounded-[1.55rem] border border-white/8 bg-white/4 px-4 py-4">
        <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
          Discord access
        </p>
        <p className="mt-2 text-sm font-semibold text-white">Checking session...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <button
        onClick={() => signIn("discord", { callbackUrl: "/" })}
        className="mt-6 flex w-full items-center justify-between rounded-[1.55rem] border border-violet-300/18 bg-[linear-gradient(135deg,rgba(196,181,253,0.18),rgba(139,92,246,0.12))] px-4 py-4 text-left transition hover:border-violet-200/28 hover:bg-[linear-gradient(135deg,rgba(196,181,253,0.24),rgba(139,92,246,0.18))]"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-violet-100/70">
            Discord access
          </p>
          <p className="mt-2 text-sm font-semibold text-white">Login with Discord</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Sign in to open the dashboard, status, and admin tools.
          </p>
        </div>
        <LogIn className="h-4 w-4 shrink-0 text-violet-100" />
      </button>
    );
  }

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="mt-6 flex w-full items-center justify-between rounded-[1.55rem] border border-emerald-300/16 bg-emerald-400/8 px-4 py-4 text-left transition hover:bg-emerald-400/12"
    >
      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-100/75">
          Discord access
        </p>
        <p className="mt-2 text-sm font-semibold text-white">Connected</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {session.user.name ? `${session.user.name} is signed in.` : "Session active."}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-emerald-100">
        <ShieldCheck className="h-4 w-4" />
        <LogOut className="h-4 w-4" />
      </div>
    </button>
  );
}
