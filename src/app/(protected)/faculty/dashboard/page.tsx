export default function FacultyDashboardPage() {
  return (
    <section className="mx-auto max-w-[1600px]">
      <div className="glass-panel p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
          Faculty Workspace
        </p>

        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          Your academic command center
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Courses, attendance, students and results will be
          connected to the real university API in upcoming parts.
        </p>
      </div>
    </section>
  );
}