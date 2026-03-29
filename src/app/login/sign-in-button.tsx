"use client";

import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";

export function LoginButton({ disabled }: { disabled: boolean }) {
  return (
    <button
      disabled={disabled}
      onClick={() => signIn("discord", { callbackUrl: "/" })}
      className="inline-flex items-center gap-2 rounded-full border border-violet-300/18 bg-violet-400/12 px-4 py-3 text-sm font-semibold text-violet-50 transition hover:bg-violet-400/18 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <LogIn className="h-4 w-4" />
      <span>Sign in with Discord</span>
    </button>
  );
}
