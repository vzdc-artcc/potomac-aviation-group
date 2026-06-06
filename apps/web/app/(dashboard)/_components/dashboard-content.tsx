import Link from "next/link"
import type { ComponentType } from "react"
import {
  Activity,
  Airplay,
  BadgeCheck,
  BookMarked,
  BriefcaseBusiness,
  CloudSun,
  Compass,
  Globe2,
  ListChecks,
  MapPinned,
  Plane,
  Radar,
  ShieldCheck,
  Trophy,
  Waves,
} from "lucide-react"

import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

export type DashboardPageKey =
  | "welcome-back"
  | "notams"
  | "challenge-of-the-month"
  | "leaderboards"
  | "flight-log"
  | "career-progress"
  | "achievements"
  | "schedule"
  | "briefing"
  | "route-builder"
  | "trip-generator"
  | "flight-planning"
  | "live-map"
  | "weather"
  | "vatsim-atc"
  | "aircraft"
  | "airports"
  | "routes"
  | "database-weather"

export const dashboardNav = [
  {
    label: "Home",
    icon: Globe2,
    items: [
      { href: "/home/welcome-back", label: "Welcome Back" },
      { href: "/home/notams", label: "NOTAMs" },
      { href: "/home/challenge-of-the-month", label: "Challenge of the Month" },
      { href: "/home/leaderboards", label: "Leaderboards" },
    ],
  },
  {
    label: "My Logbook",
    icon: BookMarked,
    items: [
      { href: "/my-logbook/flight-log", label: "Flight Log" },
      { href: "/my-logbook/career-progress", label: "My Career Progress" },
      { href: "/my-logbook/achievements", label: "Achievements" },
    ],
  },
  {
    label: "Crew Scheduling",
    icon: BriefcaseBusiness,
    items: [
      { href: "/crew-scheduling/schedule", label: "Schedule" },
      { href: "/crew-scheduling/briefing", label: "Briefing Page" },
      { href: "/crew-scheduling/route-builder", label: "Route Builder" },
      { href: "/crew-scheduling/trip-generator", label: "Trip Generator" },
      { href: "/crew-scheduling/flight-planning", label: "Flight Planning" },
    ],
  },
  {
    label: "Live Operations",
    icon: Activity,
    items: [
      { href: "/live-operations/live-map", label: "Live Map" },
      { href: "/live-operations/weather", label: "Weather" },
      { href: "/live-operations/vatsim-atc", label: "VATSIM ATC" },
    ],
  },
  {
    label: "Databases",
    icon: Radar,
    items: [
      { href: "/databases/aircraft", label: "Aircraft" },
      { href: "/databases/airports", label: "Airports" },
      { href: "/databases/routes", label: "Routes" },
      { href: "/databases/weather", label: "Weather" },
    ],
  },
] as const

const pageConfigs: Record<
  DashboardPageKey,
  {
    category: string
    title: string
    description: string
    icon: ComponentType<{ className?: string }>
    metrics: { label: string; value: string }[]
    panels: { title: string; body?: string; items?: string[] }[]
    cta?: { href: string; label: string }
  }
> = {
  "welcome-back": {
    category: "Home",
    title: "Welcome Back",
    description: "A quick scan of current ops, recent activity, and what needs attention next.",
    icon: ShieldCheck,
    metrics: [
      { label: "Open flights", value: "14" },
      { label: "Unread notices", value: "3" },
      { label: "Monthly rank", value: "#8" },
      { label: "Duty hours", value: "42.5" },
    ],
    panels: [
      { title: "Today at a glance", body: "Dispatch is green, weather is stable, and the next briefing window opens in 35 minutes." },
      { title: "Next actions", items: ["Review NOTAMs for the primary hub.", "Confirm route assignments for tomorrow.", "Check the challenge of the month progress."] },
    ],
    cta: { href: "/crew-scheduling/schedule", label: "Open Schedule" },
  },
  notams: {
    category: "Home",
    title: "NOTAMs",
    description: "Operational notices, advisories, and constraints that affect flight planning.",
    icon: ListChecks,
    metrics: [
      { label: "Active notices", value: "6" },
      { label: "Critical", value: "1" },
      { label: "Reviewed", value: "82%" },
      { label: "Last sync", value: "2m ago" },
    ],
    panels: [
      { title: "Current notices", items: ["Runway maintenance at KJFK east complex.", "Temporary restrictions for night ops in the northeast corridor.", "Fuel uplift advisory for long-haul cargo routes."] },
      { title: "Suggested response", body: "Use the briefing page before departure to confirm aircraft, routing, and weather alignment." },
    ],
  },
  "challenge-of-the-month": {
    category: "Home",
    title: "Challenge of the Month",
    description: "A seasonal goal that keeps the community active and gives members a common objective.",
    icon: Trophy,
    metrics: [
      { label: "Progress", value: "68%" },
      { label: "Members competing", value: "124" },
      { label: "Days left", value: "11" },
      { label: "Reward tier", value: "Gold" },
    ],
    panels: [
      { title: "Challenge brief", body: "Complete three cross-country legs using approved aircraft and submit all flights through the logbook." },
      { title: "Milestones", items: ["1 completed long-haul leg", "2 reviewed dispatch briefings", "3 verified log entries"] },
    ],
  },
  leaderboards: {
    category: "Home",
    title: "Leaderboards",
    description: "A snapshot of community performance across flights, hours, and challenge points.",
    icon: BadgeCheck,
    metrics: [
      { label: "Top pilot", value: "A. Reed" },
      { label: "Top hours", value: "184.2" },
      { label: "Top streak", value: "19 days" },
      { label: "Challenges won", value: "7" },
    ],
    panels: [
      { title: "Leaderboard entries", items: ["1. A. Reed - 184.2 hrs", "2. J. Blake - 171.8 hrs", "3. T. Quinn - 162.4 hrs"] },
      { title: "Competition note", body: "The board updates when the backend logbook and challenge systems are connected to the API." },
    ],
  },
  "flight-log": {
    category: "My Logbook",
    title: "Flight Log",
    description: "Track recent sorties, aircraft, routes, and any notes you want to keep with each flight.",
    icon: Plane,
    metrics: [
      { label: "Flights logged", value: "142" },
      { label: "This month", value: "11" },
      { label: "Hours", value: "92.8" },
      { label: "Recent entry", value: "KATL - KDEN" },
    ],
    panels: [
      { title: "Recent flights", items: ["KATL → KDEN in B738", "KJFK → KMIA in A321", "KORD → KSEA in B752"] },
      { title: "Logbook note", body: "This view will connect to the logbook API and persist entries once the backend CRUD module is finished." },
    ],
    cta: { href: "/api/v1/logbook", label: "View API Shape" },
  },
  "career-progress": {
    category: "My Logbook",
    title: "Career Progress",
    description: "A roadmap of rank, activity, and progress toward the next milestone.",
    icon: Compass,
    metrics: [
      { label: "Rank", value: "Senior Member" },
      { label: "XP", value: "8,420" },
      { label: "Next badge", value: "1,180" },
      { label: "Completion", value: "78%" },
    ],
    panels: [
      { title: "Milestone path", items: ["Complete 10 more logged flights.", "Pass the operations assessment.", "Submit one cross-division route plan."] },
      { title: "Status", body: "Career progression is meant to feel clear and motivating, not buried in an opaque admin panel." },
    ],
  },
  achievements: {
    category: "My Logbook",
    title: "Achievements",
    description: "Badges and milestones earned through reliable, consistent flying.",
    icon: BadgeCheck,
    metrics: [
      { label: "Badges", value: "18" },
      { label: "Rare", value: "4" },
      { label: "Completion", value: "63%" },
      { label: "Most recent", value: "Night Ops" },
    ],
    panels: [
      { title: "Unlocked", items: ["Night Ops", "Perfect Briefing", "Crosswind Ready"] },
      { title: "Locked", items: ["Cargo Captain", "Oceanic Veteran", "Dispatch Regular"] },
    ],
  },
  schedule: {
    category: "Crew Scheduling",
    title: "Schedule",
    description: "Browse roster availability, upcoming legs, and the current roster balance.",
    icon: Airplay,
    metrics: [
      { label: "Covered flights", value: "28" },
      { label: "Open slots", value: "5" },
      { label: "Crew on duty", value: "12" },
      { label: "Next turnover", value: "06:00Z" },
    ],
    panels: [
      { title: "Roster overview", items: ["Morning line staffed.", "Evening cargo rotation available.", "One charter slot awaiting assignment."] },
      { title: "Staff note", body: "Scheduling will eventually coordinate directly with the backend and role-aware staff views." },
    ],
  },
  briefing: {
    category: "Crew Scheduling",
    title: "Briefing Page",
    description: "Mission brief, weather context, aircraft notes, and operational reminders in one place.",
    icon: CloudSun,
    metrics: [
      { label: "Briefing status", value: "Ready" },
      { label: "Weather risk", value: "Low" },
      { label: "Route complexity", value: "Moderate" },
      { label: "Fuel note", value: "Standard" },
    ],
    panels: [
      { title: "Operational brief", body: "Use this screen to get a concise preflight summary before heading to the route builder or flight planning tools." },
      { title: "Checklist", items: ["Review weather layers", "Validate aircraft performance", "Confirm alternate airport"] },
    ],
  },
  "route-builder": {
    category: "Crew Scheduling",
    title: "Route Builder",
    description: "Prototype route selection and sequencing for operations planning.",
    icon: MapPinned,
    metrics: [
      { label: "Waypoints", value: "5" },
      { label: "Legs", value: "2" },
      { label: "Distance", value: "1,420nm" },
      { label: "Estimated time", value: "3h 22m" },
    ],
    panels: [
      { title: "Builder state", body: "This will become a hands-on route composer tied to airports and database search." },
      { title: "Route notes", items: ["Add departure and arrival airports.", "Insert alternates and timing constraints.", "Export to trip generator."] },
    ],
  },
  "trip-generator": {
    category: "Crew Scheduling",
    title: "Trip Generator",
    description: "Create planned trip packets from route, aircraft, and crew requirements.",
    icon: BriefcaseBusiness,
    metrics: [
      { label: "Trips created", value: "34" },
      { label: "Saved templates", value: "8" },
      { label: "Dispatch ready", value: "24" },
      { label: "Auto notes", value: "On" },
    ],
    panels: [
      { title: "Packet output", items: ["Trip summary", "Fuel assumptions", "Crew call time", "Operational constraints"] },
      { title: "Generator note", body: "Trip generation is designed to bridge crew scheduling and flight planning without duplicate data entry." },
    ],
  },
  "flight-planning": {
    category: "Crew Scheduling",
    title: "Flight Planning",
    description: "The final planning workspace before launch, covering timing, weather, and dispatch review.",
    icon: Plane,
    metrics: [
      { label: "Plan score", value: "91" },
      { label: "Delays", value: "0" },
      { label: "Dispatch status", value: "Approved" },
      { label: "Weather variance", value: "Low" },
    ],
    panels: [
      { title: "Planning steps", items: ["Load aircraft profile", "Check enroute weather", "Validate alternate fuel"] },
      { title: "Execution note", body: "When the backend is connected, this page will reflect live operational data and persisted flight plans." },
    ],
  },
  "live-map": {
    category: "Live Operations",
    title: "Live Map",
    description: "Geographic awareness for the fleet with flights, airports, and event layers.",
    icon: MapPinned,
    metrics: [
      { label: "Tracked flights", value: "23" },
      { label: "Visible airports", value: "112" },
      { label: "Map layers", value: "4" },
      { label: "Refresh", value: "15s" },
    ],
    panels: [
      { title: "Map summary", body: "This is a placeholder for the interactive live map that will later show aircraft positions and route overlays." },
      { title: "Display layers", items: ["Fleet positions", "Weather cells", "Airport highlights"] },
    ],
  },
  weather: {
    category: "Live Operations",
    title: "Weather",
    description: "Operational weather context, trend awareness, and advisory information.",
    icon: CloudSun,
    metrics: [
      { label: "Ceiling", value: "High" },
      { label: "Visibility", value: "10+ mi" },
      { label: "Wind", value: "12kt" },
      { label: "Trend", value: "Stable" },
    ],
    panels: [
      { title: "Weather briefing", body: "Weather summaries will eventually be sourced from live data and modeled into decision-support views." },
      { title: "Operational impacts", items: ["Mild crosswind on northbound departures.", "No convective activity expected.", "Alternate planning remains standard."] },
    ],
  },
  "vatsim-atc": {
    category: "Live Operations",
    title: "VATSIM ATC",
    description: "See virtual air traffic control coverage and supported frequencies.",
    icon: Radar,
    metrics: [
      { label: "Active controllers", value: "41" },
      { label: "Coverage", value: "High" },
      { label: "Best window", value: "18:00Z" },
      { label: "Network", value: "Online" },
    ],
    panels: [
      { title: "Coverage note", body: "This panel will be wired to live network data when the operations integration lands." },
      { title: "Controller snapshot", items: ["Enroute coverage on primary corridors", "Tower at major hubs", "Approach support available"] },
    ],
  },
  aircraft: {
    category: "Databases",
    title: "Aircraft",
    description: "A searchable aircraft catalog with performance notes and fleet assignments.",
    icon: Plane,
    metrics: [
      { label: "Records", value: "84" },
      { label: "Fleet types", value: "14" },
      { label: "Active", value: "61" },
      { label: "Updated", value: "Today" },
    ],
    panels: [
      { title: "Database preview", items: ["B738 - active", "A321 - active", "B752 - standby"] },
      { title: "Future scope", body: "The backend will expose structured records instead of static placeholders once the fleet database is populated." },
    ],
  },
  airports: {
    category: "Databases",
    title: "Airports",
    description: "Airfield records, runways, and operational notes for route planning.",
    icon: Globe2,
    metrics: [
      { label: "Airports", value: "412" },
      { label: "Featured", value: "24" },
      { label: "Charts", value: "Ready" },
      { label: "Notes", value: "68" },
    ],
    panels: [
      { title: "Airport hints", items: ["KJFK - main hub", "KATL - southern gateway", "KDEN - high-altitude ops"] },
      { title: "Catalog note", body: "These records will support flight planning, live operations, and the route builder." },
    ],
  },
  routes: {
    category: "Databases",
    title: "Routes",
    description: "Curated routes that can be reused in scheduling, planning, and community challenges.",
    icon: Compass,
    metrics: [
      { label: "Routes", value: "128" },
      { label: "Favorites", value: "34" },
      { label: "Long-haul", value: "51" },
      { label: "Saved", value: "21" },
    ],
    panels: [
      { title: "Route samples", items: ["KJFK → KDEN", "KLAX → KORD", "KSEA → KATL"] },
      { title: "Purpose", body: "Route records give the dashboard a consistent operational source of truth." },
    ],
  },
  "database-weather": {
    category: "Databases",
    title: "Weather",
    description: "Stored weather snapshots and recurring operational patterns.",
    icon: Waves,
    metrics: [
      { label: "Snapshots", value: "312" },
      { label: "Fresh today", value: "42" },
      { label: "Alerts", value: "2" },
      { label: "Trend", value: "Calm" },
    ],
    panels: [
      { title: "Stored outputs", items: ["Morning snapshot", "Route-day trend", "Hub departure summary"] },
      { title: "Database role", body: "Weather records will help the platform compare live operations with historical conditions." },
    ],
  },
}

export function DashboardPage({
  pageKey,
  breadcrumbs,
}: {
  pageKey: DashboardPageKey
  breadcrumbs: string
}) {
  const page = pageConfigs[pageKey]
  const Icon = page.icon

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="text-sm text-slate-500 dark:text-slate-400">{breadcrumbs}</div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <Icon className="size-5" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{page.title}</h1>
        </div>
        <p className="max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">{page.description}</p>
      </div>
      {page.cta ? (
        <div>
          <Link href={page.cta.href} className={cn(buttonVariants({ variant: "outline" }), "border-slate-300/80 bg-white/80 dark:border-white/10 dark:bg-white/5")}>
            {page.cta.label}
          </Link>
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-4">
        {page.metrics.map((metric) => (
          <div key={metric.label} className="rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-5 dark:border-white/10 dark:bg-white/5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{metric.label}</div>
            <div className="mt-3 text-2xl font-semibold">{metric.value}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {page.panels.map((panel) => (
          <article key={panel.title} className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-xl font-semibold">{panel.title}</h2>
            {panel.body ? <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{panel.body}</p> : null}
            {panel.items ? (
              <ul className="mt-4 grid gap-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {panel.items.map((item) => (
                  <li key={item} className="rounded-2xl border border-slate-200/70 bg-slate-50/75 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  )
}
