import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { DashboardShell } from "./_components/dashboard-shell"

async function getCurrentUser() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()

  const response = await fetch(new URL("/api/v1/auth/me", siteUrl), {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: "no-store",
  })

  if (!response.ok) {
    return null
  }

  return (await response.json()) as { user?: { displayName?: string; email?: string } }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser()

  if (!currentUser?.user) {
    redirect("/sign-in")
  }

  return (
    <DashboardShell userName={currentUser.user.displayName ?? currentUser.user.email ?? "Member"}>
      {children}
    </DashboardShell>
  )
}
