"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { startTransition, useEffect, useState } from "react";
import { CloudRain, Flame, Gauge, MapPin, ShieldCheck, Sun, Users, Zap } from "lucide-react";

import { DashboardShell, DashboardTable, HighlightPanel } from "@/components/dashboard-shell";
import type { PlayerSnapshot, ServerSnapshot } from "@/lib/minecraft-types";

const worldLabel = {
  overworld: "Overworld",
  nether: "Nether",
  end: "The End",
} as const;

const weatherLabel = {
  clear: "Clear sky",
  rain: "Rain front",
  thunder: "Thunderstorm",
} as const;

const weatherIcon = {
  clear: Sun,
  rain: CloudRain,
  thunder: Zap,
} as const;

const worldTone = {
  overworld: "bg-emerald-400/14 text-emerald-100 border-emerald-300/18",
  nether: "bg-rose-400/14 text-rose-100 border-rose-300/18",
  end: "bg-violet-400/14 text-violet-100 border-violet-300/18",
} as const;

function formatPosition(position: PlayerSnapshot["position"]) {
  return `${position.x}  ${position.y}  ${position.z}`;
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

  const WeatherIcon = weatherIcon[snapshot.weather];

  return (
    <DashboardShell
      active="dashboard"
      eyebrow="Realtime overview"
      title="Minecraft control room for live world telemetry"
      subtitle="Track world time, weather, live players, biome transitions, and server health in one dark, focused ops dashboard."
    >
      <div className="grid gap-5">
        <HighlightPanel
          title={`${snapshot.serverName} is synced and streaming live`}
          description="This main board is fed by the Paper bridge and instantly refreshed through the live snapshot stream. Every player card below uses our own server payload and not mock content from the style reference."
          cta="Admin setup guide"
          meta={
            <div className="grid gap-3 sm:grid-cols-2">
              <MetaCard icon={<Sun className="h-4 w-4" />} label="World day" value={`Day ${snapshot.day}`} hint={`Clock ${snapshot.time}`} />
              <MetaCard
                icon={<WeatherIcon className="h-4 w-4" />}
                label="Weather"
                value={weatherLabel[snapshot.weather]}
                hint="Derived from live snapshot"
              />
              <MetaCard icon={<Users className="h-4 w-4" />} label="Players" value={`${snapshot.onlinePlayers}/${snapshot.maxPlayers}`} hint="Connected right now" />
              <MetaCard icon={<Gauge className="h-4 w-4" />} label="TPS" value={snapshot.tps.toFixed(1)} hint={`Difficulty ${snapshot.difficulty}`} />
            </div>
          }
        />

        <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="grid gap-5 md:grid-cols-3">
            <FeatureCard
              icon={<MapPin className="h-5 w-5" />}
              title="Player coordinates"
              description="Every card below shows x y z, biome, and current world in one glance."
              badge="xyz live"
            />
            <FeatureCard
              icon={<Flame className="h-5 w-5" />}
              title="Dimension visibility"
              description="Overworld, Nether, and The End are color-coded so scans stay fast during events."
              badge="world map"
            />
            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Bridge protected"
              description="Snapshot pushes are token-protected and surfaced into status and admin tooling."
              badge="secure sync"
            />
          </div>

          <section className="rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Live snapshot</p>
            <div className="mt-4 grid gap-3">
              <InlineStat label="Updated" value={new Date(snapshot.updatedAt).toLocaleString("en-GB")} />
              <InlineStat label="Live stream" value="/api/minecraft/live" />
              <InlineStat label="Snapshot route" value="/api/minecraft/snapshot" />
              <InlineStat label="Players route" value="/api/minecraft/players" />
            </div>
          </section>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.18fr_0.82fr]">
          <DashboardTable title="Online players">
            <div className="overflow-hidden rounded-[1.5rem] border border-white/8 bg-[#0f0c19]">
              <div className="grid grid-cols-[1.4fr_0.9fr_1.2fr_0.9fr] gap-3 border-b border-white/8 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                <span>Player</span>
                <span>World</span>
                <span>Position</span>
                <span>Vitals</span>
              </div>
              <div className="divide-y divide-white/6">
                {snapshot.players.map((player) => (
                  <div
                    key={player.uuid}
                    className="grid grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[1.4fr_0.9fr_1.2fr_0.9fr]"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={`https://mc-heads.net/avatar/${player.uuid}/96`}
                        alt={`${player.name} avatar`}
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-2xl border border-white/10 bg-[#171326]"
                      />
                      <div>
                        <p className="font-semibold text-white">{player.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{player.uuid}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{player.facing}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${worldTone[player.world]}`}>
                        {worldLabel[player.world]}
                      </span>
                      <p className="text-sm text-slate-300">{player.biome}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="font-mono text-sm text-white">{formatPosition(player.position)}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">x  y  z</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <VitalBadge label="HP" value={`${player.health}/20`} />
                      <VitalBadge label="Food" value={`${player.food}/20`} />
                      <VitalBadge label="Ping" value={`${player.ping}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DashboardTable>

          <section className="grid gap-5">
            <div className="rounded-[1.9rem] border border-white/10 bg-[#110d1d]/92 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Snapshot contract</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Payload fields used by this UI</h2>
              <pre className="mt-4 overflow-x-auto rounded-[1.5rem] border border-white/8 bg-black/25 p-4 text-xs leading-6 text-violet-100">
{`serverName
updatedAt
day
time
weather
tps
onlinePlayers
maxPlayers
difficulty
players[].uuid
players[].name
players[].world
players[].biome
players[].position.x
players[].position.y
players[].position.z
players[].health
players[].food
players[].ping`}
              </pre>
            </div>

            <div className="rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Ops notes</p>
              <div className="mt-4 space-y-3">
                <NoteItem text="Status page flags stale data when the newest snapshot is older than 15 seconds." />
                <NoteItem text="Admin page keeps the token, endpoint, and live stream bring-up steps in one place." />
                <NoteItem text="Paper bridge now supports immediate event pushes plus a retry queue." />
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}

function MetaCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-[1.4rem] border border-white/8 bg-[#110d1d]/88 p-4">
      <div className="flex items-center gap-2 text-violet-200">
        {icon}
        <span className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</span>
      </div>
      <p className="mt-3 text-xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{hint}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  badge,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  badge: string;
}) {
  return (
    <section className="rounded-[1.9rem] border border-white/10 bg-[radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.18),transparent_24%),linear-gradient(180deg,rgba(18,14,31,0.96),rgba(11,9,20,0.98))] p-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#c4b5fd,#8b5cf6)] text-[#140f24]">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-400">{description}</p>
      <div className="mt-5 inline-flex rounded-full border border-violet-300/16 bg-violet-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-100">
        {badge}
      </div>
    </section>
  );
}

function InlineStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#100c19] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function VitalBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#161122] px-3 py-2 text-center">
      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function NoteItem({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#100c19] px-4 py-3 text-sm leading-7 text-slate-300">
      {text}
    </div>
  );
}
