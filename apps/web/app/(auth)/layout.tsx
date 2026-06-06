import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate min-h-svh overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.18),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(2,6,23,0.16),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#e2e8f0_100%)] text-slate-950 dark:bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.72),_transparent_34%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] dark:text-slate-50">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,transparent,rgba(255,255,255,0.35),transparent)] opacity-30 dark:opacity-10" />
      {children}
    </div>
  )
}
