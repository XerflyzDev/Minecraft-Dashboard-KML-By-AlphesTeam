import { DashboardShell, DashboardTable, HighlightPanel } from "@/components/dashboard-shell";
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
      ? "border-emerald-300/18 bg-emerald-400/10 text-emerald-50"
      : health.status === "stale"
        ? "border-amber-300/18 bg-amber-400/10 text-amber-50"
        : "border-white/10 bg-white/6 text-slate-100";

  return (
    <DashboardShell
      active="status"
      eyebrow="Monitoring and health"
      title="Status board for freshness, endpoints, and current server values"
      subtitle="This screen is the quick diagnostic layer for the dashboard. It shows whether the newest snapshot is live, stale, or idle, and which routes should be checked next."
    >
      <div className="grid gap-6 xl:gap-7">
        <HighlightPanel
          title={`${health.serverName} is currently ${health.status}`}
          description="This page turns the latest stored snapshot into a health summary. If the age grows too high, the status flips to stale and the admin guide becomes your next stop."
          cta="Check admin guide"
          meta={
            <div className="grid gap-4 sm:grid-cols-2">
              <StatusMetric label="Health" value={health.status.toUpperCase()} tone={tone} />
              <StatusMetric label="Snapshot age" value={formatAge(health.snapshotAgeSeconds)} tone={tone} />
              <StatusMetric label="Last update" value={health.lastUpdateAt ? new Date(health.lastUpdateAt).toLocaleString("en-GB") : "None"} tone={tone} />
              <StatusMetric label="Players online" value={`${health.onlinePlayers}`} tone={tone} />
              <StatusMetric label="POST count" value={`${health.postCount}`} tone={tone} />
              <StatusMetric label="Last POST" value={health.lastPostAt ? new Date(health.lastPostAt).toLocaleString("en-GB") : "None"} tone={tone} />
            </div>
          }
        />

        <div className="grid gap-6 2xl:grid-cols-[0.92fr_1.08fr]">
          <section className="rounded-[1.9rem] border border-white/10 bg-[#110d1d]/92 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Health targets</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Routes to inspect</h2>
            <div className="mt-4 space-y-3">
              <RouteCard path="/api/minecraft/status" description="Machine-readable overall health response." />
              <RouteCard path={health.snapshotEndpoint} description="Full latest snapshot stored in memory." />
              <RouteCard path={health.liveStreamEndpoint} description="Live stream source for the main dashboard UI." />
              <RouteCard path="/api/minecraft/players" description="Lightweight player list endpoint." />
            </div>
          </section>

          <section className="rounded-[1.9rem] border border-white/10 bg-[#110d1d]/92 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Snapshot values</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Current server state</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ValueTile label="Server" value={snapshot.serverName} />
              <ValueTile label="Clock" value={`Day ${snapshot.day} | ${snapshot.time}`} />
              <ValueTile label="Weather" value={snapshot.weather} />
              <ValueTile label="TPS" value={snapshot.tps.toFixed(1)} />
              <ValueTile label="Difficulty" value={snapshot.difficulty} />
              <ValueTile label="Players" value={`${snapshot.onlinePlayers}/${snapshot.maxPlayers}`} />
            </div>
          </section>
        </div>

        <div className="grid gap-6 2xl:grid-cols-[1fr_1fr]">
          <section className="rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Diagnosis notes</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">What each state means</h2>
            <div className="mt-4 space-y-3">
              <NoteItem text="LIVE means the newest snapshot is not older than 15 seconds." />
              <NoteItem text="STALE usually means the Paper plugin stopped posting, the endpoint is wrong, or the token is mismatched." />
              <NoteItem text="IDLE means the dashboard has not received a real snapshot from the Paper bridge yet." />
              <NoteItem text="If status is live but the homepage does not update, inspect the SSE route and browser connection first." />
            </div>
          </section>

          <DashboardTable title="Latest player coordinates">
            <div className="space-y-3">
              {snapshot.players.map((player) => (
              <div
                  key={player.uuid}
                  className="grid gap-4 rounded-[1.5rem] border border-white/8 bg-[#100c19] px-4 py-4 md:grid-cols-[1fr_0.9fr_1fr]"
                >
                  <div>
                    <p className="font-semibold text-white">{player.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{player.world}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Biome</p>
                    <p className="mt-1 text-sm text-slate-200">{player.biome}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">x y z</p>
                    <p className="mt-1 font-mono text-sm text-white">
                      {player.position.x} {player.position.y} {player.position.z}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardTable>
        </div>
      </div>
    </DashboardShell>
  );
}

function StatusMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className={`rounded-[1.5rem] border px-4 py-4 ${tone}`}>
      <p className="text-[10px] uppercase tracking-[0.22em] opacity-70">{label}</p>
      <p className="mt-2 text-sm font-semibold">{value}</p>
    </div>
  );
}

function RouteCard({ path, description }: { path: string; description: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-[#100c19] px-4 py-4">
      <p className="font-mono text-sm text-white">{path}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function ValueTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-[#100c19] px-4 py-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function NoteItem({ text }: { text: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-[#100c19] px-4 py-4 text-sm leading-7 text-slate-300">
      {text}
    </div>
  );
}
