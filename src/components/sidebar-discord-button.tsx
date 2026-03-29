"use client";

import Image from "next/image";
import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

function DiscordMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M20.317 4.369A19.791 19.791 0 0 0 15.885 3c-.191.328-.405.77-.554 1.116a18.27 18.27 0 0 0-5.487 0A11.64 11.64 0 0 0 9.288 3a19.736 19.736 0 0 0-4.434 1.37C2.049 8.58 1.289 12.686 1.669 16.735A19.9 19.9 0 0 0 7.327 19.6a14.65 14.65 0 0 0 1.214-1.96 12.955 12.955 0 0 1-1.91-.92c.16-.117.316-.24.467-.367 3.69 1.736 7.702 1.736 11.348 0 .153.127.309.25.468.367-.61.35-1.25.66-1.912.92.35.683.756 1.34 1.214 1.96a19.84 19.84 0 0 0 5.66-2.864c.455-4.695-.779-8.763-3.559-12.367ZM9.67 14.545c-1.11 0-2.025-1.02-2.025-2.273 0-1.252.893-2.272 2.025-2.272 1.14 0 2.045 1.03 2.025 2.272 0 1.252-.894 2.273-2.025 2.273Zm4.66 0c-1.11 0-2.024-1.02-2.024-2.273 0-1.252.893-2.272 2.024-2.272 1.141 0 2.046 1.03 2.026 2.272 0 1.252-.885 2.273-2.026 2.273Z" />
    </svg>
  );
}

export function SidebarDiscordButton({
  authConfigured,
}: {
  authConfigured: boolean;
}) {
  const { data: session, status } = useSession();

  const resolveCallbackUrl = () => {
    if (typeof window === "undefined") {
      return "/";
    }

    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get("from");

    if (pathname === "/login" && from?.startsWith("/") && !from.startsWith("//")) {
      return from;
    }

    return "/";
  };

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
        onClick={() => signIn("discord", { callbackUrl: resolveCallbackUrl() })}
        className="mt-6 flex w-full items-center gap-3 rounded-[1.2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(229,223,255,0.9))] px-4 py-3.5 text-left shadow-[0_12px_28px_rgba(0,0,0,0.16)] transition hover:-translate-y-[1px] hover:shadow-[0_16px_34px_rgba(0,0,0,0.2)]"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5865F2] text-white shadow-[0_8px_18px_rgba(88,101,242,0.35)]">
          <DiscordMark />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#23263a]">
            Continue with Discord
          </p>
        </div>
        <LogIn className="h-4 w-4 shrink-0 text-[#4d536d]" />
      </button>
    );
  }

  return (
    <div className="mt-6 rounded-[1.55rem] border border-emerald-300/16 bg-emerald-400/8 px-4 py-4">
      <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-100/75">
        Discord access
      </p>
      <div className="mt-3 flex items-center gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[linear-gradient(135deg,#a78bfa,#f0abfc)]">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "Discord user"}
              fill
              sizes="44px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#140f24]">
              DC
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {session.user.name ?? "Discord user"}
          </p>
          <p className="truncate text-xs text-emerald-100/75">Connected and ready</p>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
      >
        <LogOut className="h-4 w-4" />
        <span>Sign out</span>
      </button>
    </div>
  );
}
