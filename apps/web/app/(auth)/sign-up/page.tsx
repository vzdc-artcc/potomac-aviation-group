import Link from "next/link"

import { SignUpForm } from "../_components/auth-forms"

export default function Page() {
  return (
    <div className="mx-auto grid min-h-svh w-full max-w-7xl place-items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-8 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/5">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Sign Up</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Create your member profile.</h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Register once, then use the same account across the dashboard, logbook, scheduling, and operations features.
          </p>
          <SignUpForm />
          <div className="mt-6 text-sm">
            <Link href="/sign-in" className="text-sky-700 underline-offset-4 hover:underline dark:text-sky-300">
              Sign in
            </Link>
          </div>
        </section>
        <aside className="rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(135deg,rgba(2,6,23,0.94),rgba(14,165,233,0.46))] p-8 text-white shadow-[0_35px_80px_-40px_rgba(15,23,42,0.7)] dark:border-white/10">
          <div className="text-xs uppercase tracking-[0.28em] text-cyan-200">Member onboarding</div>
          <div className="mt-4 text-3xl font-semibold">A simple account flow with strong defaults.</div>
          <p className="mt-4 text-sm leading-7 text-white/78">
            Password visibility toggles, explicit email capture, and API-backed session cookies are built into the first pass.
          </p>
        </aside>
      </div>
    </div>
  )
}
