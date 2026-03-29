"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";

export function AutoDiscordRedirect({ callbackUrl }: { callbackUrl: string }) {
  useEffect(() => {
    void signIn("discord", { callbackUrl });
  }, [callbackUrl]);

  return (
    <p className="text-sm leading-7 text-violet-100/80">
      Redirecting to Discord sign-in...
    </p>
  );
}
