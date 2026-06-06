import Link from "next/link"

import { SignInForm } from "../_components/auth-forms"

export default function Page() {
  return (
    <div className="mx-auto grid min-h-svh w-full max-w-7xl place-items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-8 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/5">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Sign In</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Welcome back to the cockpit.</h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Sign in to access your dashboard, logbook, crew scheduling, and live operations tools.
          </p>
          <SignInForm />
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link href="/forgot-password" className="text-sky-700 underline-offset-4 hover:underline dark:text-sky-300">
              Forgot password
            </Link>
            <Link href="/sign-up" className="text-sky-700 underline-offset-4 hover:underline dark:text-sky-300">
              Sign up
            </Link>
          </div>
        </section>
        <aside className="rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(15,118,110,0.7))] p-8 text-white shadow-[0_35px_80px_-40px_rgba(15,23,42,0.7)] dark:border-white/10">
          <div className="text-xs uppercase tracking-[0.28em] text-cyan-200">Secure access</div>
          <div className="mt-4 text-3xl font-semibold">Built for authenticated members and role-based operations.</div>
          <ul className="mt-8 grid gap-3 text-sm leading-7 text-white/78">
            <li>• Secure cookie-based sessions</li>
            <li>• Staff and admin role separation</li>
            <li>• Audit logging for sensitive actions</li>
            <li>• Dashboard routes protected at the layout boundary</li>
          </ul>
        </aside>
      </div>
    </div>
  )
}
