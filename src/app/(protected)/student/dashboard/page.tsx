export default function StudentDashboardPage() {
  return (
    <section className="mx-auto max-w-[1600px]">
      <div className="glass-panel p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
          Student Workspace
        </p>

        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          Welcome to your academic space
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Your courses, enrollment, attendance, results and
          payments will appear here through the university API.
        </p>
      </div>
    </section>
  );
}