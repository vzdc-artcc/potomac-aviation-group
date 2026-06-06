"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import type { FormEvent } from "react"

import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

const fieldClass =
  "w-full rounded-2xl border border-slate-300/80 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-white"

function PasswordField({
  label,
  name,
  placeholder,
  autoComplete,
}: {
  label: string
  name: string
  placeholder: string
  autoComplete?: string
}) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <div className="relative">
        <input
          name={name}
          type={visible ? "text" : "password"}
          className={cn(fieldClass, "pr-24")}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-0 right-2 my-auto rounded-xl px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
        >
          {visible ? "Hide" : "View"}
        </button>
      </div>
    </label>
  )
}

export function SignInForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      rememberMe: formData.get("rememberMe") === "on",
    }

    const response = await fetch("/api/v1/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })

    setLoading(false)

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null
      setError(data?.message ?? "Unable to sign in.")
      return
    }

    router.push("/home/welcome-back")
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4">
      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email address</span>
        <input name="email" type="email" className={fieldClass} placeholder="you@example.com" autoComplete="email" required />
      </label>
      <PasswordField label="Password" name="password" placeholder="Enter your password" autoComplete="current-password" />
      <label className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
        <input name="rememberMe" type="checkbox" className="size-4 rounded border-slate-300 text-slate-950" />
        Remember me
      </label>
      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      <button className={buttonVariants({ size: "lg" })} disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  )
}

export function SignUpForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const password = String(formData.get("password") ?? "")
    const confirmPassword = String(formData.get("confirmPassword") ?? "")

    if (password !== confirmPassword) {
      setLoading(false)
      setError("Passwords do not match.")
      return
    }

    const payload = {
      displayName: String(formData.get("displayName") ?? ""),
      email: String(formData.get("email") ?? ""),
      password,
    }

    const response = await fetch("/api/v1/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })

    setLoading(false)

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null
      setError(data?.message ?? "Unable to create account.")
      return
    }

    router.push("/home/welcome-back")
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4">
      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Display name</span>
        <input name="displayName" type="text" className={fieldClass} placeholder="Captain Smith" autoComplete="name" required />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email address</span>
        <input name="email" type="email" className={fieldClass} placeholder="you@example.com" autoComplete="email" required />
      </label>
      <PasswordField label="Password" name="password" placeholder="Create a password" autoComplete="new-password" />
      <PasswordField label="Confirm password" name="confirmPassword" placeholder="Confirm your password" autoComplete="new-password" />
      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      <button className={buttonVariants({ size: "lg" })} disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  )
}

export function PasswordResetForm({
  title,
  buttonLabel,
  helpText,
}: {
  title: string
  buttonLabel: string
  helpText: string
}) {
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const response = await fetch("/api/v1/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: String(formData.get("email") ?? ""),
        resetToken: String(formData.get("resetToken") ?? ""),
        password: String(formData.get("password") ?? ""),
      }),
    })

    const data = (await response.json().catch(() => null)) as { message?: string } | null
    setMessage(data?.message ?? helpText)
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4">
      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email address</span>
        <input name="email" type="email" className={fieldClass} placeholder="you@example.com" autoComplete="email" required />
      </label>
      {title === "Reset your password" ? (
        <>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Reset token</span>
            <input name="resetToken" type="text" className={fieldClass} placeholder="Token from email" required />
          </label>
          <PasswordField label="New password" name="password" placeholder="Create a new password" autoComplete="new-password" />
        </>
      ) : null}
      <button className={buttonVariants({ size: "lg" })}>{buttonLabel}</button>
      {message ? <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p> : null}
    </form>
  )
}
