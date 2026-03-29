import Link from "next/link";

import { getDashboardHealth } from "@/lib/minecraft-status";
import { getSnapshot } from "@/lib/minecraft-store";

function formatAge(seconds: number) {
  if (seconds < 0) {
    return "unknown";
  }

  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

export default function StatusPage() {
  const health = getDashboardHealth();
  const snapshot = getSnapshot();

  const tone =
    health.status === "live"
      ? "border-emerald-300/25 bg-emerald-300/8 text-emerald-50"
      : health.status === "stale"
        ? "border-amber-300/25 bg-amber-300/8 text-amber-50"
        : "border-slate-300/15 bg-slate-300/6 text-slate-100";

  return (
    <main className="min-h-screen bg-[#07111a] text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.94))] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100">
                System Status
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Dashboard health and snapshot freshness
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Use this page to confirm whether the dashboard is receiving live
                data, how old the latest snapshot is, and which endpoints are
                serving the current state.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
              >
                Back to dashboard
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/16"
              >
                Open admin guide
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-4">
          <StatusCard label="Health" value={health.status.toUpperCase()} hint="Derived from snapshot age" tone={tone} />
          <StatusCard label="Last update" value={health.lastUpdateAt ? new Date(health.lastUpdateAt).toLocaleString("en-GB") : "None"} hint="Timestamp from latest snapshot" tone={tone} />
          <StatusCard label="Snapshot age" value={formatAge(health.snapshotAgeSeconds)} hint="Older than 15s becomes stale" tone={tone} />
          <StatusCard label="Players online" value={`${health.onlinePlayers}`} hint={health.serverName} tone={tone} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Endpoints
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">Health check targets</h2>
            <div className="mt-4 grid gap-3">
              <EndpointTile path="/api/minecraft/status" description="Machine-readable health state for external monitors." />
              <EndpointTile path={health.snapshotEndpoint} description="Full latest snapshot that feeds the UI." />
              <EndpointTile path={health.liveStreamEndpoint} description="Server-Sent Events stream for live dashboard updates." />
              <EndpointTile path="/api/minecraft/players" description="Player list only, useful for lightweight checks." />
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Current snapshot
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">Latest server values</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <ValueTile label="Server" value={snapshot.serverName} />
              <ValueTile label="Time" value={`Day ${snapshot.day} • ${snapshot.time}`} />
              <ValueTile label="Weather" value={snapshot.weather} />
              <ValueTile label="TPS" value={snapshot.tps.toFixed(1)} />
              <ValueTile label="Difficulty" value={snapshot.difficulty} />
              <ValueTile label="Players" value={`${snapshot.onlinePlayers}/${snapshot.maxPlayers}`} />
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              What to watch
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">Quick diagnosis guide</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
              <li className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                `LIVE` means the most recent snapshot is newer than 15 seconds.
              </li>
              <li className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                `STALE` usually means the Paper plugin stopped posting, the endpoint is wrong, or the token no longer matches.
              </li>
              <li className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                `IDLE` means the stored timestamp is missing or invalid.
              </li>
              <li className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                If `/api/minecraft/status` is live but the homepage does not move, inspect the SSE connection at `/api/minecraft/live`.
              </li>
            </ul>
          </article>

          <article className="rounded-[2rem] border border-violet-300/15 bg-violet-300/6 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-100/70">
              Payload preview
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">Latest raw coordinates</h2>
            <div className="mt-4 space-y-3">
              {snapshot.players.map((player) => (
                <div
                  key={player.uuid}
                  className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-200"
                >
                  <div className="font-semibold text-white">{player.name}</div>
                  <div>{player.world} • {player.biome}</div>
                  <div className="font-mono text-slate-300">
                    {player.position.x} {player.position.y} {player.position.z}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

function StatusCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone: string;
}) {
  return (
    <div className={`rounded-[1.5rem] border p-4 ${tone}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-70">{label}</p>
      <p className="mt-3 text-2xl font-black">{value}</p>
      <p className="mt-2 text-sm opacity-80">{hint}</p>
    </div>
  );
}

function EndpointTile({ path, description }: { path: string; description: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
      <p className="font-mono text-sm text-white">{path}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
    </div>
  );
}

function ValueTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
