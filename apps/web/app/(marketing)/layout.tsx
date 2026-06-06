import type { ReactNode } from "react"

import { SiteFooter, SiteHeader } from "./_components/site-chrome"

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate min-h-svh overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(30,41,59,0.14),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(15,118,110,0.16),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] text-slate-950 dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.55),_transparent_30%),linear-gradient(180deg,_#07111f_0%,_#0f172a_100%)] dark:text-slate-50">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[linear-gradient(135deg,rgba(15,23,42,0.18),rgba(14,116,144,0.12),transparent)] blur-3xl dark:bg-[linear-gradient(135deg,rgba(2,6,23,0.9),rgba(14,116,144,0.24),transparent)]" />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
