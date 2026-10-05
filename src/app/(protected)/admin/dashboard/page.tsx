export default function AdminDashboardPage() {
  return (
    <section className="mx-auto max-w-[1600px]">
      <div className="glass-panel overflow-hidden p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
          System Control
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Welcome to NEXUS
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Your university management command center is ready.
          Analytics, students, faculty, courses, attendance and
          results will appear here.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            "Students",
            "Faculty",
            "Courses",
            "Departments",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5"
            >
              <p className="text-xs text-slate-600">{item}</p>

              <p className="mt-3 text-3xl font-bold text-white">
                —
              </p>

              <p className="mt-2 text-[10px] uppercase tracking-wider text-cyan-300/50">
                Awaiting live data
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}