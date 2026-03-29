"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useEffect, useState } from "react";

import type { PlayerSnapshot, ServerSnapshot } from "@/lib/minecraft-types";

const worldLabel = {
  overworld: "Overworld",
  nether: "Nether",
  end: "The End",
} as const;

const worldTone = {
  overworld:
    "border-emerald-300/50 bg-emerald-400/10 text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.18)]",
  nether:
    "border-rose-300/50 bg-rose-400/10 text-rose-100 shadow-[0_0_30px_rgba(244,63,94,0.18)]",
  end: "border-violet-300/50 bg-violet-400/10 text-violet-100 shadow-[0_0_30px_rgba(167,139,250,0.18)]",
} as const;

const weatherTone = {
  clear: "Clear",
  rain: "Rain",
  thunder: "Thunderstorm",
} as const;

const endpointList = [
  "GET /api/minecraft/snapshot",
  "GET /api/minecraft/players",
  "SSE /api/minecraft/live",
  "POST /api/minecraft/snapshot",
];

function formatPosition(position: PlayerSnapshot["position"]) {
  return `${position.x} ${position.y} ${position.z}`;
}

export function MinecraftDashboard({
  initialSnapshot,
}: {
  initialSnapshot: ServerSnapshot;
}) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);

  useEffect(() => {
    const eventSource = new EventSource("/api/minecraft/live");

    const handleSnapshot = (event: MessageEvent<string>) => {
      try {
        const nextSnapshot = JSON.parse(event.data) as ServerSnapshot;
        startTransition(() => {
          setSnapshot(nextSnapshot);
        });
      } catch {
        // Ignore malformed events and keep the last valid snapshot.
      }
    };

    eventSource.addEventListener("snapshot", handleSnapshot as EventListener);

    return () => {
      eventSource.removeEventListener("snapshot", handleSnapshot as EventListener);
      eventSource.close();
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#07111a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_28%),radial-gradient(circle_at_85%_15%,_rgba(59,130,246,0.18),_transparent_24%),linear-gradient(180deg,_rgba(4,10,16,0.95),_rgba(7,17,26,1))]" />
      <div className="absolute inset-x-0 top-0 h-56 bg-[linear-gradient(180deg,rgba(110,231,183,0.14),transparent)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 backdrop-blur-xl">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.4fr_0.9fr] lg:px-8">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-emerald-100">
                Minecraft Server Dashboard
              </div>

              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                  Live map-room for time, weather, and every player in your Java
                  server.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  This dashboard reads live snapshots from the API route, so the
                  UI is ready to mirror a Paper or Spigot server as soon as the
                  plugin starts posting data.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/admin"
                    className="inline-flex items-center rounded-full border border-cyan-300/35 bg-cyan-300/12 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/18"
                  >
                    Open admin setup guide
                  </Link>
                  <Link
                    href="/status"
                    className="inline-flex items-center rounded-full border border-emerald-300/35 bg-emerald-300/12 px-4 py-2 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-300/18"
                  >
                    Open status page
                  </Link>
                  <a
                    href="#plugin-payload"
                    className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                  >
                    View payload contract
                  </a>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Server" value={snapshot.serverName} hint="Java / Paper ready" />
                <StatCard label="World Day" value={`Day ${snapshot.day}`} hint={`Time ${snapshot.time}`} />
                <StatCard
                  label="Weather"
                  value={weatherTone[snapshot.weather]}
                  hint={`TPS ${snapshot.tps.toFixed(1)} stable`}
                />
                <StatCard
                  label="Players"
                  value={`${snapshot.onlinePlayers}/${snapshot.maxPlayers}`}
                  hint={`Difficulty ${snapshot.difficulty}`}
                />
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-cyan-200/15 bg-slate-950/55 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/70">
                    Latest Snapshot
                  </p>
                  <p className="mt-2 text-3xl font-black text-white">{snapshot.time}</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Updated {new Date(snapshot.updatedAt).toLocaleString("en-GB")}
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-200/20 bg-cyan-200/8 px-4 py-3 text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/65">Sync Mode</p>
                  <p className="mt-1 text-sm font-semibold text-cyan-50">Plugin push + live stream</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {endpointList.map((endpoint) => (
                  <div
                    key={endpoint}
                    className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-4 py-3"
                  >
                    <span className="font-mono text-xs text-slate-200 sm:text-sm">{endpoint}</span>
                    <span className="rounded-full bg-white/8 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                      ready
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] sm:p-5">
            <div className="flex flex-col gap-2 border-b border-white/8 px-2 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Active Players
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">Online player telemetry</h2>
              </div>
              <p className="text-sm text-slate-400">
                Head, name, world, biome, location, health, food, ping
              </p>
            </div>

            <div className="mt-4 grid gap-3">
              {snapshot.players.map((player) => (
                <article
                  key={player.uuid}
                  className="grid gap-4 rounded-[1.5rem] border border-white/8 bg-white/4 p-4 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <Image
                        src={`https://mc-heads.net/avatar/${player.uuid}/96`}
                        alt={`${player.name} avatar`}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-2xl border border-white/10 bg-slate-900/80"
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-bold text-white">{player.name}</h3>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${worldTone[player.world]}`}
                          >
                            {worldLabel[player.world]}
                          </span>
                        </div>
                        <p className="mt-2 font-mono text-xs text-slate-400">{player.uuid}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-300 sm:min-w-72">
                      <MiniStat label="Health" value={`${player.health}/20`} />
                      <MiniStat label="Food" value={`${player.food}/20`} />
                      <MiniStat label="Ping" value={`${player.ping} ms`} />
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <InfoTile label="Position x y z" value={formatPosition(player.position)} />
                    <InfoTile label="Biome" value={player.biome} />
                    <InfoTile label="Facing" value={player.facing} />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <aside
              id="plugin-payload"
              className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.92))] p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                Plugin Payload
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">JSON contract for snapshot push</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                The plugin can push the latest snapshot every 1 to 2 seconds,
                or only when a player changes world, enters a new biome, or the
                weather changes.
              </p>

              <pre className="mt-5 overflow-x-auto rounded-[1.5rem] border border-white/8 bg-black/30 p-4 text-xs leading-6 text-cyan-100">
{`{
  "serverName": "Blockwatch Realm",
  "updatedAt": "2026-03-29T18:25:00+07:00",
  "day": 128,
  "time": "08:42",
  "weather": "clear",
  "tps": 19.9,
  "onlinePlayers": 4,
  "maxPlayers": 20,
  "difficulty": "hard",
  "players": [
    {
      "uuid": "8667ba71-b85a-4004-af54-457a9734eed7",
      "name": "Steve",
      "world": "overworld",
      "biome": "plains",
      "position": { "x": 124, "y": 65, "z": -42 }
    }
  ]
}`}
              </pre>
            </aside>

            <aside className="rounded-[2rem] border border-emerald-300/15 bg-emerald-300/6 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100/70">
                Next Step
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">Paper or Spigot plugin flow</h2>
              <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
                <li>1. Collect online players from Bukkit scheduler every 20 to 40 ticks.</li>
                <li>2. Resolve world, biome, xyz, health, food, ping, and server weather.</li>
                <li>3. Push JSON to your Next.js API route or broadcast over WebSocket.</li>
                <li>4. Render live data in this page and replace the mock snapshot.</li>
              </ol>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{hint}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-slate-900/75 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-slate-900/60 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 font-mono text-sm text-slate-100">{value}</p>
    </div>
  );
}
