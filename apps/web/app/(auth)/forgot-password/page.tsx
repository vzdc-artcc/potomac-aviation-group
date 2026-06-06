import Link from "next/link"

import { PasswordResetForm } from "../_components/auth-forms"

export default function Page() {
  return (
    <div className="mx-auto grid min-h-svh w-full max-w-3xl place-items-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="w-full rounded-[2rem] border border-slate-200/80 bg-white/85 p-8 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/5">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Forgot password</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Request a reset link.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          We&apos;ll send a reset token for the account associated with your email address.
        </p>
        <PasswordResetForm title="Forgot your password" buttonLabel="Send Reset Link" helpText="If the account exists, a reset message will be generated." />
        <div className="mt-6 text-sm">
          <Link href="/sign-in" className="text-sky-700 underline-offset-4 hover:underline dark:text-sky-300">
            Back to sign in
          </Link>
        </div>
      </section>
    </div>
  )
}
