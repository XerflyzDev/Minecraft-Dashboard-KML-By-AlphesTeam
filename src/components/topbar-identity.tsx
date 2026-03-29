"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";

export function TopbarIdentity() {
  const { data: session } = useSession();
  const name = session?.user?.name ?? "KML Ops";
  const subtitle = session?.user ? "Discord connected" : "Realtime dashboard";
  const image = session?.user?.image ?? null;

  return (
    <div className="flex min-w-0 max-w-full items-center gap-3 rounded-full border border-white/10 bg-white/4 px-3 py-2">
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#a78bfa,#f0abfc)] text-sm font-semibold text-[#140f24]">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          "MC"
        )}
      </div>
      <div className="min-w-0 pr-1">
        <p className="truncate text-sm font-semibold text-white">{name}</p>
        <p className="truncate text-xs text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}
