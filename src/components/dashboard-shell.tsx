import Link from "next/link";
import type { ReactNode } from "react";
import {
  Activity,
  Bell,
  Blocks,
  Gauge,
  LayoutDashboard,
  Radio,
  Search,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    id: "dashboard",
  },
  {
    href: "/status",
    label: "Status",
    icon: Activity,
    id: "status",
  },
  {
    href: "/admin",
    label: "Admin Guide",
    icon: Settings,
    id: "admin",
  },
] as const;

export function DashboardShell({
  active,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  active: "dashboard" | "status" | "admin";
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen px-2 py-2 text-white sm:px-4 lg:px-5">
      <div className="mx-auto grid min-h-[calc(100vh-1rem)] w-full max-w-[1800px] overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#0a0813]/95 shadow-[0_30px_120px_rgba(0,0,0,0.45)] lg:grid-cols-[296px_1fr]">
        <aside className="border-b border-white/8 bg-[linear-gradient(180deg,rgba(13,10,24,0.98),rgba(9,8,18,0.98))] p-6 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#c4b5fd,#8b5cf6)] text-[#140f24] shadow-[0_12px_30px_rgba(139,92,246,0.35)]">
              <Blocks className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-white">Blockwatch</p>
              <p className="text-xs uppercase tracking-[0.24em] text-violet-200/55">Minecraft Ops</p>
            </div>
          </div>

          <nav className="mt-10 space-y-2.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === active;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-medium transition ${
                    isActive
                      ? "border-white/12 bg-white/8 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                      : "border-transparent text-slate-400 hover:border-white/8 hover:bg-white/4 hover:text-slate-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-12 space-y-3 rounded-[1.7rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Live services</p>
            <div className="flex items-center justify-between rounded-2xl bg-[#141022] px-3 py-2">
              <span className="flex items-center gap-2 text-sm text-slate-200">
                <Radio className="h-4 w-4 text-emerald-300" />
                Live stream
              </span>
              <span className="rounded-full bg-emerald-400/14 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                active
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-[#141022] px-3 py-2">
              <span className="flex items-center gap-2 text-sm text-slate-200">
                <Gauge className="h-4 w-4 text-violet-300" />
                Snapshot API
              </span>
              <span className="rounded-full bg-violet-400/14 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200">
                ready
              </span>
            </div>
          </div>

          <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(196,181,253,0.18),transparent_30%),linear-gradient(180deg,rgba(28,20,49,0.96),rgba(15,11,29,0.96))] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <ShieldCheck className="h-4 w-4 text-violet-200" />
              Secure bridge
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Token-protected snapshot push from Paper into a live control-room UI.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.16),transparent_24%),linear-gradient(180deg,rgba(9,8,18,0.96),rgba(7,6,14,0.98))]">
          <header className="border-b border-white/8 px-6 py-5 sm:px-7">
            <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-center 2xl:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-violet-200/55">{eyebrow}</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl xl:text-[2.8rem]">{title}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 sm:text-[15px]">{subtitle}</p>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="flex min-w-[280px] items-center gap-3 rounded-full border border-white/10 bg-white/4 px-5 py-3 text-sm text-slate-400 xl:min-w-[360px]">
                  <Search className="h-4 w-4" />
                  <span>Server snapshots, players, routes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-3 text-sm text-slate-300 xl:flex">
                    <Radio className="h-4 w-4 text-emerald-300" />
                    <span>Live stream active</span>
                  </div>
                  <button
                    aria-label="Notifications"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/4 text-slate-200"
                  >
                    <Bell className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/4 px-3 py-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#a78bfa,#f0abfc)] text-sm font-semibold text-[#140f24]">
                      MC
                    </div>
                    <div className="pr-1">
                      <p className="text-sm font-semibold text-white">KML Ops</p>
                      <p className="text-xs text-slate-400">Realtime dashboard</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <section className="flex-1 overflow-hidden px-6 py-6 sm:px-7">
            <div className="h-full overflow-auto pr-1">{children}</div>
          </section>
        </div>
      </div>
    </main>
  );
}

export function HighlightPanel({
  title,
  description,
  cta,
  meta,
}: {
  title: string;
  description: string;
  cta: string;
  meta: ReactNode;
}) {
  return (
    <section className="grid gap-7 rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(166,139,250,0.24),rgba(18,13,31,0.96)_45%,rgba(8,7,14,0.98))] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] xl:grid-cols-[1.12fr_0.88fr]">
      <div className="space-y-5">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white xl:text-[2.4rem]">{title}</h2>
        <p className="max-w-2xl text-sm leading-8 text-slate-300 sm:text-[15px]">{description}</p>
        <button className="rounded-full bg-[linear-gradient(135deg,#d8ccff,#a78bfa)] px-5 py-3.5 text-sm font-semibold text-[#171126] shadow-[0_14px_34px_rgba(167,139,250,0.28)] transition hover:scale-[1.01]">
          {cta}
        </button>
      </div>
      <div className="rounded-[1.8rem] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02))] p-5">
        {meta}
      </div>
    </section>
  );
}

export function DashboardTable({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#110d1d]/92 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#c4b5fd,#8b5cf6)] text-[#140f24]">
          <Users className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Live roster</p>
        </div>
      </div>
      {children}
    </section>
  );
}
