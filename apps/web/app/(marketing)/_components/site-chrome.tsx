import Link from "next/link"
import { ArrowRight, PlaneTakeoff } from "lucide-react"

import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

const navItems = [
  { href: "/about", label: "About" },
  { href: "/divisions", label: "Divisions" },
  { href: "/staff", label: "Staff" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/20 dark:bg-white dark:text-slate-950">
            <PlaneTakeoff className="size-5" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-[0.32em] uppercase text-slate-500 dark:text-slate-400">
              Potomac Aviation
            </div>
            <div className="text-base font-semibold">Group Technology</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden sm:inline-flex text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
            )}
          >
            Sign in
          </Link>
          <Link href="/sign-up" className={buttonVariants({ size: "sm" })}>
            Get Started
            <ArrowRight className="ml-1.5 size-4" />
          </Link>
        </div>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/70 py-8 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 text-sm text-slate-600 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between dark:text-slate-300">
        <p>Potomac Aviation Group Technology.</p>
        <p>Built for operations, community, and growth.</p>
      </div>
    </footer>
  )
}
