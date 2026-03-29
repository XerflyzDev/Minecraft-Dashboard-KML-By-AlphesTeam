import Link from "next/link";

const envExample = `MINECRAFT_DASHBOARD_TOKEN=change-me`;

const pluginConfig = `dashboard:
  enabled: true
  endpoint: "http://localhost:3000/api/minecraft/snapshot"
  bearerToken: "change-me"
  serverName: "My Minecraft Server"
  intervalTicks: 20`;

const curlExample = `curl -X POST http://localhost:3000/api/minecraft/snapshot ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer change-me" ^
  -d "{\\"serverName\\":\\"Test Server\\",\\"updatedAt\\":\\"2026-03-29T18:25:00+07:00\\",\\"day\\":1,\\"time\\":\\"08:00\\",\\"weather\\":\\"clear\\",\\"tps\\":20,\\"onlinePlayers\\":0,\\"maxPlayers\\":20,\\"difficulty\\":\\"hard\\",\\"players\\":[]}"`;

const checklist = [
  "Create .env.local from .env.example and set the same token used by the plugin.",
  "Start the web app with npm run dev or deploy it first if the plugin will post to production.",
  "Point the plugin endpoint to /api/minecraft/snapshot on your dashboard domain.",
  "Keep the bearer token identical on both sides or POST requests will return 401.",
  "Open /api/minecraft/snapshot in the browser to confirm the latest stored snapshot.",
  "Keep the dashboard page open to verify that /api/minecraft/live updates the UI instantly after each POST.",
];

const verifySteps = [
  "Run the web app and open /admin for the setup reference.",
  "Update paper-plugin/src/main/resources/config.yml or the generated plugin config in your server.",
  "Drop the built jar into the Paper plugins folder and restart the server.",
  "Watch the Paper console for warnings from MinecraftDashboardBridge.",
  "Refresh the dashboard homepage and confirm the mock data is replaced by your live server state.",
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#07111a] text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.14),transparent_22%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.94))] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-100">
                Admin Setup Guide
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Token and plugin setup for the Minecraft dashboard
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Use this page to wire the Next.js dashboard and the Paper plugin
                together with the same endpoint and bearer token.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            >
              Back to dashboard
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Step 1
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">Set the dashboard token</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Create a local env file in the web project root and set the token
              that the plugin must send in its Authorization header.
            </p>
            <CodeBlock code={envExample} />
          </article>

          <article className="rounded-[2rem] border border-emerald-300/15 bg-emerald-300/6 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100/70">
              Step 2
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">Match the plugin config</h2>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              Keep `bearerToken` identical to the dashboard token and point
              `endpoint` to your deployed site or local dev server.
            </p>
            <CodeBlock code={pluginConfig} />
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Verify POST
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">Test the API before loading the plugin</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Send a sample snapshot manually once. If this works, the Paper
              bridge is usually straightforward.
            </p>
            <CodeBlock code={curlExample} />
          </article>

          <article className="rounded-[2rem] border border-cyan-300/15 bg-cyan-300/6 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100/70">
              Checklist
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">What to confirm</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
              {checklist.map((item) => (
                <li key={item} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Useful paths
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">Project references</h2>
            <div className="mt-4 grid gap-3">
              <PathTile path=".env.example" description="Starter env variable template for the dashboard token." />
              <PathTile
                path="paper-plugin/src/main/resources/config.yml"
                description="Plugin endpoint, token, and push interval."
              />
              <PathTile
                path="src/app/api/minecraft/snapshot/route.ts"
                description="GET and POST route that stores and returns the latest snapshot."
              />
              <PathTile
                path="src/app/api/minecraft/live/route.ts"
                description="SSE live stream that pushes new snapshots into the open dashboard page."
              />
              <PathTile
                path="docs/paper-plugin-api-spec.md"
                description="Payload contract shared by the dashboard and plugin."
              />
            </div>
          </article>

          <article className="rounded-[2rem] border border-violet-300/15 bg-violet-300/6 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-100/70">
              First run
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">Suggested bring-up sequence</h2>
            <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
              {verifySteps.map((step, index) => (
                <li key={step} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                  {index + 1}. {step}
                </li>
              ))}
            </ol>
          </article>
        </section>
      </div>
    </main>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-5 overflow-x-auto rounded-[1.5rem] border border-white/8 bg-black/30 p-4 text-xs leading-6 text-cyan-100">
      {code}
    </pre>
  );
}

function PathTile({
  path,
  description,
}: {
  path: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
      <p className="font-mono text-sm text-white">{path}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
    </div>
  );
}
