const divisions = [
  {
    code: "PCT",
    name: "Potomac Air Charters",
    description: "Premium charter-style operations, route coordination, and a polished member-facing experience.",
  },
  {
    code: "PXC",
    name: "Potomac Air Cargo",
    description: "Freight-oriented workflows, schedule awareness, and mission planning for cargo operations.",
  },
  {
    code: "PXT",
    name: "Potomac Air Connection",
    description: "Community connections, operational visibility, and cross-division member coordination.",
  },
]

export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Divisions</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Three operating identities, one shared platform.</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {divisions.map((division) => (
          <article key={division.code} className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 dark:border-white/10 dark:bg-white/5">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700 dark:text-sky-300">{division.code}</div>
            <h2 className="mt-3 text-2xl font-semibold">{division.name}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{division.description}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
