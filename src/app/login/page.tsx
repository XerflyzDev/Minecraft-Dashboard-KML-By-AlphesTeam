import Link from "next/link";
import { LogIn } from "lucide-react";
import { getServerSession } from "next-auth";

import { DashboardShell, HighlightPanel } from "@/components/dashboard-shell";
import { isDiscordAuthConfigured } from "@/lib/auth-env";
import { authOptions } from "@/lib/auth-options";

import { LoginButton } from "./sign-in-button";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  const authConfigured = isDiscordAuthConfigured();

  return (
    <DashboardShell
      active="dashboard"
      eyebrow="Secure access"
      title="Discord login for the Minecraft dashboard"
      subtitle="Sign in with Discord to access the dashboard, status board, and admin guide. Snapshot APIs remain token-protected for the Paper bridge."
    >
      <div className="mx-auto grid max-w-5xl gap-6">
        <HighlightPanel
          title={session?.user ? "You are already signed in" : "Connect your Discord account to continue"}
          description={
            authConfigured
              ? "The website is ready for Discord OAuth. After sign-in, protected routes will unlock while the plugin keeps using its bearer token for server-to-server updates."
              : "Discord OAuth is not fully configured yet. Add AUTH_SECRET, DISCORD_CLIENT_ID, and DISCORD_CLIENT_SECRET to enable sign-in."
          }
          cta={session?.user ? "Go to dashboard" : "Discord access"}
          meta={
            <div className="grid gap-4">
              <Metric label="Session status" value={session?.user ? "Authenticated" : "Signed out"} />
              <Metric label="Auth config" value={authConfigured ? "Ready" : "Missing env"} />
              <Metric label="Protected routes" value="/, /admin, /status" />
            </div>
          }
        />

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[1.9rem] border border-white/10 bg-[#110d1d]/92 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Discord sign-in</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Access the protected dashboard</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
              Use a Discord account to sign in. This protects the operator-facing UI while keeping the Paper plugin
              on its own bearer-token flow.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LoginButton disabled={!authConfigured || Boolean(session?.user)} />
              <Link
                href={session?.user ? "/" : "/admin"}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/8"
              >
                <LogIn className="h-4 w-4" />
                <span>{session?.user ? "Open dashboard" : "Open setup guide"}</span>
              </Link>
            </div>
          </section>

          <section className="rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Required env</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Configure these variables before deploy</h2>
            <div className="mt-4 space-y-3">
              <EnvItem name="AUTH_SECRET" description="Random secret used to sign the Auth.js session." />
              <EnvItem name="DISCORD_CLIENT_ID" description="OAuth client id from your Discord application." />
              <EnvItem
                name="DISCORD_CLIENT_SECRET"
                description="OAuth client secret from your Discord application."
              />
              <EnvItem name="MINECRAFT_DASHBOARD_TOKEN" description="Bearer token still used by the Paper bridge." />
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-[#110d1d]/88 px-4 py-4">
      <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function EnvItem({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-[#100c19] px-4 py-4">
      <p className="font-mono text-sm text-white">{name}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}
