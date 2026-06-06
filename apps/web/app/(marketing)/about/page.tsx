import { Globe2, Landmark, Users2 } from "lucide-react"

const leadership = [
  { name: "Executive Team", title: "Strategy, safety, and growth", body: "Sets the long-term direction and product priorities." },
  { name: "Operations Lead", title: "Dispatch and live operations", body: "Keeps scheduling, live map, and weather workflows aligned." },
  { name: "Community Lead", title: "Members and onboarding", body: "Owns the member experience, staff profiles, and public messaging." },
]

export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">About</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Built for disciplined aviation communities.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Potomac Aviation Group Technology exists to give the community a clear public face and a serious internal operating system.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Globe2, title: "Mission", body: "Connect the public brand with a dependable member experience." },
            { icon: Landmark, title: "History", body: "Grow from an aviation concept into a credible digital platform." },
            { icon: Users2, title: "Leadership", body: "Combine community stewardship with operational accountability." },
          ].map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-5 dark:border-white/10 dark:bg-white/5">
                <Icon className="size-5 text-sky-700 dark:text-sky-300" />
                <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 dark:border-white/10 dark:bg-white/5">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Mission Statement</div>
          <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-200">
            To create a reliable, elegant, and scalable aviation platform that supports members, staff, and administrators without losing the sense of community that defines the group.
          </p>
        </article>
        <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 lg:col-span-2 dark:border-white/10 dark:bg-white/5">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">History</div>
          <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-200">
            The platform starts as a clean foundation: public pages, sign-up flows, live dashboard infrastructure, and an API designed for authentication, auditability, and future operational modules.
          </p>
        </article>
      </section>

      <section>
        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Leadership</div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {leadership.map((person) => (
            <article key={person.name} className="rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-6 dark:border-white/10 dark:bg-white/5">
              <div className="text-lg font-semibold">{person.name}</div>
              <div className="mt-1 text-sm text-sky-700 dark:text-sky-300">{person.title}</div>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{person.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 dark:border-white/10 dark:bg-white/5">
        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Contact Info</div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">Email: support@potomacaviation.example</p>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">Operations: ops@potomacaviation.example</p>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">HQ: Washington, D.C. region</p>
        </div>
      </section>
    </div>
  )
}
