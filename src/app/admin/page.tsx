import { DashboardShell, HighlightPanel } from "@/components/dashboard-shell";

const envExample = `MINECRAFT_DASHBOARD_TOKEN=change-me`;

const pluginConfig = `dashboard:
  enabled: true
  endpoint: "http://localhost:3000/api/minecraft/snapshot"
  bearerToken: "change-me"
  serverName: "My Minecraft Server"
  intervalTicks: 20
  retryIntervalTicks: 40
  maxQueueSize: 8`;

const curlExample = `curl -X POST http://localhost:3000/api/minecraft/snapshot ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer change-me" ^
  -d "{\\"serverName\\":\\"Test Server\\",\\"updatedAt\\":\\"2026-03-29T18:25:00+07:00\\",\\"day\\":1,\\"time\\":\\"08:00\\",\\"weather\\":\\"clear\\",\\"tps\\":20,\\"onlinePlayers\\":0,\\"maxPlayers\\":20,\\"difficulty\\":\\"hard\\",\\"players\\":[]}"`;

const checklist = [
  "Set the same bearer token in .env.local and the Paper plugin config.",
  "Point the plugin endpoint at /api/minecraft/snapshot on your local or deployed dashboard.",
  "Use /api/minecraft/status when you want a quick machine-readable health check.",
  "Keep the dashboard homepage open to confirm the live stream updates immediately after each POST.",
];

const paths = [
  {
    path: ".env.example",
    description: "Starter token template for local development.",
  },
  {
    path: "paper-plugin/src/main/resources/config.yml",
    description: "Plugin endpoint, retry queue, and sync interval.",
  },
  {
    path: "src/app/api/minecraft/live/route.ts",
    description: "Server-Sent Events stream for live UI updates.",
  },
  {
    path: "src/app/api/minecraft/status/route.ts",
    description: "Health endpoint for external monitoring.",
  },
];

export default function AdminPage() {
  return (
    <DashboardShell
      active="admin"
      eyebrow="Setup and security"
      title="Bridge setup guide for token, endpoint, and first sync"
      subtitle="Use this page to wire the Next.js dashboard and the Paper plugin together without guessing which token, route, or verification step comes next."
    >
      <div className="grid gap-6 xl:gap-7">
        <HighlightPanel
          title="Bring the Paper bridge online with one shared token"
          description="The visual style follows the new dark dashboard system, but the steps here are specific to this Minecraft project. Use the same bearer token on both the web app and the plugin, then verify delivery through the status route."
          cta="Use same token on both sides"
          meta={
            <div className="grid gap-4">
              <AdminMetric label="Write endpoint" value="/api/minecraft/snapshot" />
              <AdminMetric label="Live endpoint" value="/api/minecraft/live" />
              <AdminMetric label="Health endpoint" value="/api/minecraft/status" />
            </div>
          }
        />

        <div className="grid gap-6 2xl:grid-cols-[1fr_1fr]">
          <section className="rounded-[1.9rem] border border-white/10 bg-[#110d1d]/92 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Token</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Dashboard env value</h2>
            <CodeBlock code={envExample} />
          </section>

          <section className="rounded-[1.9rem] border border-white/10 bg-[#110d1d]/92 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Plugin config</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Paper bridge settings</h2>
            <CodeBlock code={pluginConfig} />
          </section>
        </div>

        <div className="grid gap-6 2xl:grid-cols-[1fr_1fr]">
          <section className="rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Manual test</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">POST one snapshot before launching the plugin</h2>
            <CodeBlock code={curlExample} />
          </section>

          <section className="rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Checklist</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">What to verify</h2>
            <div className="mt-4 space-y-3">
              {checklist.map((item) => (
                <ChecklistItem key={item} text={item} />
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-[1.9rem] border border-white/10 bg-[#110d1d]/92 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Reference paths</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Files you will touch most often</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {paths.map((item) => (
              <PathCard key={item.path} path={item.path} description={item.description} />
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-[1.5rem] border border-white/8 bg-black/25 p-5 text-xs leading-7 text-violet-100">
      {code}
    </pre>
  );
}

function AdminMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-[#110d1d]/88 px-4 py-4">
      <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 font-mono text-sm text-white">{value}</p>
    </div>
  );
}

function ChecklistItem({ text }: { text: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-[#100c19] px-4 py-4 text-sm leading-7 text-slate-300">
      {text}
    </div>
  );
}

function PathCard({
  path,
  description,
}: {
  path: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-4 py-4">
      <p className="font-mono text-sm text-white">{path}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}
