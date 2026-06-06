export default function Page() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
      <section className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-8 dark:border-white/10 dark:bg-white/5">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Contact</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Start a conversation with the group.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Use the form below for membership questions, partnership requests, or operational follow-up.
        </p>
        <form className="mt-8 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-slate-300/80 bg-white px-4 py-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-white" placeholder="Name" />
            <input className="rounded-2xl border border-slate-300/80 bg-white px-4 py-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-white" placeholder="Email" />
          </div>
          <input className="rounded-2xl border border-slate-300/80 bg-white px-4 py-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-white" placeholder="Subject" />
          <textarea className="min-h-40 rounded-[1.5rem] border border-slate-300/80 bg-white px-4 py-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-white" placeholder="Message" />
          <button className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
            Send Message
          </button>
        </form>
      </section>
      <aside className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-8 dark:border-white/10 dark:bg-white/5">
        <div className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Information</div>
        <div className="mt-6 grid gap-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <p>Email: support@potomacaviation.example</p>
          <p>Operations: ops@potomacaviation.example</p>
          <p>Admin: admin@potomacaviation.example</p>
          <p>Response window: 24 to 48 business hours</p>
        </div>
      </aside>
    </div>
  )
}
