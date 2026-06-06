import Link from "next/link"
import { ArrowRight, CheckCircle2, ChevronRight, Shield, Sparkles, Users } from "lucide-react"

import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

const stats = [
  { label: "Members", value: "2,400+" },
  { label: "Flights logged", value: "18,900+" },
  { label: "Dispatch uptime", value: "99.98%" },
  { label: "Active divisions", value: "3" },
]

const features = [
  {
    icon: Users,
    title: "Community-first operations",
    body: "Aviation social tools, shared schedules, and live operational updates keep members coordinated.",
  },
  {
    icon: Shield,
    title: "Role-aware access",
    body: "Members, staff, and admins get the right tools without exposing operational or administrative workflows.",
  },
  {
    icon: Sparkles,
    title: "Polished experience",
    body: "Marketing pages, onboarding, and the dashboard share one product identity while serving different goals.",
  },
]

const faqs = [
  {
    q: "What is Potomac Aviation Group Technology?",
    a: "It is the web platform for the Potomac Aviation community, combining public pages, member onboarding, and an operational dashboard.",
  },
  {
    q: "How do members sign in?",
    a: "Members can create an account from the sign-up page and then use the secure sign-in flow backed by the API.",
  },
  {
    q: "Is the dashboard separate from the marketing site?",
    a: "Yes. The dashboard uses a protected layout and role-aware navigation so authenticated users get a focused workspace.",
  },
]

export default function Page() {
  return (
    <>
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:px-8 lg:pt-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            Current Membership Number 0214
          </div>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
            Aviation operations with a sharper digital cockpit.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-300">
            Potomac Aviation Group Technology brings together public brand pages, member onboarding, dispatch tooling,
            flight logs, live operations, and admin controls in one cohesive platform.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/sign-up" className={buttonVariants({ size: "lg" })}>
              Get Started
              <ArrowRight className="ml-1.5 size-4" />
            </Link>
            <Link
              href="/about"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-slate-300/80 bg-white/80 text-slate-950 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white"
              )}
            >
              Learn More
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_15px_40px_-25px_rgba(15,23,42,0.45)] backdrop-blur dark:border-white/10 dark:bg-white/5"
              >
                <div className="text-3xl font-semibold tracking-tight">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.24),_transparent_36%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(15,118,110,0.58))] shadow-[0_35px_80px_-35px_rgba(15,23,42,0.8)]" />
          <div className="rounded-[2rem] border border-white/10 p-6 text-white backdrop-blur-xl">
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>Live operations</span>
              <span>Zulu 14:22</span>
            </div>
            <div className="mt-6 rounded-3xl bg-white/10 p-5">
              <div className="text-xs uppercase tracking-[0.3em] text-cyan-200">Dispatch board</div>
              <div className="mt-2 text-2xl font-semibold">Every flight, every crew, every system in view.</div>
              <p className="mt-3 text-sm leading-6 text-white/75">
                The dashboard shell is built for fast scanning, clear routing, and accountable operations.
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm text-cyan-200">
                <CheckCircle2 className="size-4" />
                Operational messaging and audit trails enabled
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <Icon className="size-5 text-cyan-200" />
                    <div className="mt-3 text-sm font-semibold">{feature.title}</div>
                    <p className="mt-2 text-sm leading-6 text-white/70">{feature.body}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <article
                key={feature.title}
                className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.35)] backdrop-blur dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <Icon className="size-5" />
                </div>
                <h2 className="mt-5 text-xl font-semibold">{feature.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{feature.body}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-8 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                Community
              </div>
              <h2 className="mt-3 text-3xl font-semibold">A place for members who actually fly.</h2>
            </div>
            <Link href="/divisions" className="hidden items-center gap-1 text-sm font-medium text-sky-700 md:inline-flex dark:text-sky-300">
              Explore divisions <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {[
              "Weekly dispatch notes keep everyone aligned on events and operations.",
              "Leaderboards and seasonal challenges keep the community engaged.",
              "The dashboard will expand into flight planning, weather, and live operations tooling.",
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">FAQ</div>
            <h2 className="mt-3 text-3xl font-semibold">A few quick answers.</h2>
          </div>
          <div className="lg:col-span-2 grid gap-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-6 shadow-[0_16px_40px_-35px_rgba(15,23,42,0.35)] backdrop-blur dark:border-white/10 dark:bg-white/5"
              >
                <summary className="cursor-pointer list-none text-lg font-semibold text-slate-950 dark:text-white">
                  {faq.q}
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
