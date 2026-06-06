"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import type { ComponentType, ReactNode } from "react"
import { Bell, ChevronDown, Menu, Search, Settings, LogOut, UserCircle2, Clock3, Plane } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

import { dashboardNav } from "./dashboard-content"

function ZuluClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const zulu = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now)

  const local = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now)

  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-2xl border border-slate-300/80 bg-white/85 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
        <Clock3 className="size-4" />
        <span>{zulu} Z</span>
        <ChevronDown className="size-4" />
      </summary>
      <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/80 bg-white p-4 text-sm shadow-xl dark:border-white/10 dark:bg-slate-950">
        <div className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Local time</div>
        <div className="mt-2 text-lg font-semibold">{local}</div>
      </div>
    </details>
  )
}

function UserMenu() {
  async function signOut() {
    await fetch("/api/v1/auth/signout", {
      method: "POST",
      credentials: "include",
    })
    window.location.href = "/sign-in"
  }

  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-2xl border border-slate-300/80 bg-white/85 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
        <UserCircle2 className="size-4" />
        <span className="hidden sm:inline">User</span>
        <ChevronDown className="size-4" />
      </summary>
      <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/80 bg-white p-2 text-sm shadow-xl dark:border-white/10 dark:bg-slate-950">
        <Link href="/home/welcome-back" className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/10">
          <UserCircle2 className="size-4" />
          Profile
        </Link>
        <Link href="/home/welcome-back" className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/10">
          <Settings className="size-4" />
          Settings
        </Link>
        <button onClick={signOut} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-white/10">
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </details>
  )
}

function SidebarGroup({
  label,
  icon: Icon,
  items,
  collapsed,
}: {
  label: string
  icon: ComponentType<{ className?: string }>
  items: { href: string; label: string }[]
  collapsed: boolean
}) {
  return (
    <details className="group relative rounded-2xl">
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5",
          collapsed && "justify-center px-0"
        )}
      >
        <Icon className="size-4 shrink-0" />
        <span className={cn("flex-1 text-left", collapsed && "sr-only")}>{label}</span>
        <ChevronDown className={cn("size-4 transition group-open:rotate-180", collapsed && "sr-only")} />
      </summary>
      <div
        className={cn(
          "mt-1 grid gap-1",
          collapsed &&
            "absolute left-full top-0 z-20 ml-2 w-64 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-slate-950"
        )}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </details>
  )
}

export function DashboardShell({
  children,
  userName,
}: {
  children: ReactNode
  userName: string
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-svh bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] text-slate-950 dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] dark:text-slate-50">
      <div className="flex min-h-svh">
        <aside
          className={cn(
            "group relative hidden border-r border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 lg:block",
            collapsed ? "w-[88px]" : "w-[280px]"
          )}
        >
          <div className="flex items-center gap-3 border-b border-slate-200/80 px-5 py-5 dark:border-white/10">
            <button
              onClick={() => setCollapsed((current) => !current)}
              className="inline-flex size-10 items-center justify-center rounded-2xl border border-slate-300/80 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              <Menu className="size-4" />
            </button>
            <div className={cn("min-w-0", collapsed && "sr-only")}>
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Potomac</div>
              <div className="text-lg font-semibold">Dashboard</div>
            </div>
          </div>
          <nav className="space-y-2 p-3">
            {dashboardNav.map((group) => (
              <SidebarGroup
                key={group.label}
                label={group.label}
                icon={group.icon}
                items={[...group.items]}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
            <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setCollapsed((current) => !current)}
                className="inline-flex size-10 items-center justify-center rounded-2xl border border-slate-300/80 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                <Menu className="size-4" />
              </button>
              <div className="hidden items-center gap-3 md:flex">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <Plane className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400">Potomac Aviation</div>
                  <div className="text-base font-semibold">Operations Hub</div>
                </div>
              </div>
              <label className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-300/80 bg-white px-4 py-2 text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <Search className="size-4" />
                <input className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Search flights, airports, routes..." />
              </label>
              <ZuluClock />
              <button className="inline-flex size-10 items-center justify-center rounded-2xl border border-slate-300/80 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10">
                <Bell className="size-4" />
              </button>
              <UserMenu />
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200/80 px-4 py-4 text-sm text-slate-500 sm:px-6 lg:px-8 dark:border-white/10 dark:text-slate-400">
            Signed in as {userName}
          </footer>
        </div>
      </div>
    </div>
  )
}
