const staff = [
  {
    name: "Captain Avery Reed",
    role: "Director of Operations",
    bio: "Coordinates member workflow, dispatch policies, and the operational roadmap for the platform.",
  },
  {
    name: "Jordan Blake",
    role: "Community Lead",
    bio: "Focuses on onboarding, member communications, and the tone of the public brand.",
  },
  {
    name: "Taylor Quinn",
    role: "Systems Administrator",
    bio: "Owns account security, dashboard permissions, and API reliability.",
  },
]

export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Staff</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Profiles that make the organization feel real.</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {staff.map((member) => (
          <article key={member.name} className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 dark:border-white/10 dark:bg-white/5">
            <div className="h-24 rounded-2xl bg-[linear-gradient(135deg,rgba(15,23,42,0.15),rgba(14,165,233,0.28),rgba(255,255,255,0.15))]" />
            <h2 className="mt-5 text-xl font-semibold">{member.name}</h2>
            <div className="mt-1 text-sm text-sky-700 dark:text-sky-300">{member.role}</div>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{member.bio}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
