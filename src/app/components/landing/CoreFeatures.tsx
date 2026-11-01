"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  GraduationCap,
  Layers3,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";

const features = [
  {
    number: "01",
    title: "Academic Intelligence",
    description:
      "Bring courses, departments, academic records, and learning resources together in one connected experience.",
    icon: BookOpen,
    accent: "from-cyan-400 to-blue-500",
    glow: "group-hover:shadow-cyan-500/10",
    size: "md:col-span-2",
  },
  {
    number: "02",
    title: "Student Ecosystem",
    description:
      "Give students a dedicated space to access their academic journey and essential university services.",
    icon: GraduationCap,
    accent: "from-violet-400 to-fuchsia-500",
    glow: "group-hover:shadow-violet-500/10",
    size: "",
  },
  {
    number: "03",
    title: "Faculty Workspace",
    description:
      "A focused workspace designed to support teaching workflows, course management, and academic collaboration.",
    icon: Users,
    accent: "from-emerald-400 to-teal-500",
    glow: "group-hover:shadow-emerald-500/10",
    size: "",
  },
  {
    number: "04",
    title: "Smart Administration",
    description:
      "Organize university operations through structured information, role-based access, and connected workflows.",
    icon: Layers3,
    accent: "from-orange-400 to-rose-500",
    glow: "group-hover:shadow-orange-500/10",
    size: "",
  },
  {
    number: "05",
    title: "Academic Scheduling",
    description:
      "Keep important academic dates, schedules, and campus activities easier to discover and manage.",
    icon: CalendarDays,
    accent: "from-sky-400 to-indigo-500",
    glow: "group-hover:shadow-sky-500/10",
    size: "",
  },
  {
    number: "06",
    title: "Insights & Progress",
    description:
      "Build a clearer view of academic progress and institutional information with data-driven dashboards.",
    icon: ChartNoAxesCombined,
    accent: "from-pink-400 to-purple-500",
    glow: "group-hover:shadow-pink-500/10",
    size: "md:col-span-2",
  },
];

export default function CoreFeatures() {
  return (
    <section
      id="features"
      className="relative isolate overflow-hidden bg-[#070b16] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-16"
    >
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-blue-600/[0.09] blur-[140px]" />
        <div className="absolute -right-32 top-[38%] h-80 w-80 rounded-full bg-violet-600/[0.09] blur-[120px]" />
        <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-cyan-500/[0.07] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 18%, black 78%, transparent)",
          }}
        />
      </div>

      <div className="mx-auto max-w-[1440px]">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto mb-16 max-w-3xl text-center sm:mb-20"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-4 py-2 text-xs font-medium tracking-[0.2em] text-cyan-200 uppercase">
            <Sparkles size={14} />
            Built for what&apos;s next
          </div>

          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            More than a system.
            <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              A smarter campus.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
            Everything your university needs to move forward—connected through
            one seamless digital experience, designed around people, progress,
            and possibility.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.number}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                whileHover={{ y: -6 }}
                className={`group relative isolate min-h-[270px] overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition-colors duration-500 hover:border-white/[0.16] hover:bg-white/[0.045] sm:p-7 ${feature.size} ${feature.glow} hover:shadow-2xl`}
              >
                {/* Hover glow */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-16 -top-16 -z-10 h-48 w-48 rounded-full bg-gradient-to-br ${feature.accent} opacity-0 blur-[75px] transition-opacity duration-700 group-hover:opacity-20`}
                />

                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br ${feature.accent} bg-clip-padding shadow-lg shadow-black/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-4deg]`}
                  >
                    <Icon size={21} strokeWidth={1.7} />
                  </div>

                  <span className="font-mono text-xs tracking-widest text-slate-600 transition-colors group-hover:text-slate-400">
                    / {feature.number}
                  </span>
                </div>

                <div className="mt-8">
                  <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-100 sm:text-xl">
                    {feature.title}
                    <ArrowUpRight
                      size={17}
                      className="shrink-0 text-slate-600 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-cyan-300"
                    />
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom accent */}
                <div
                  className={`absolute bottom-0 left-6 right-6 h-px origin-left scale-x-0 bg-gradient-to-r ${feature.accent} opacity-80 transition-transform duration-500 group-hover:scale-x-100 sm:left-7 sm:right-7`}
                />
              </motion.article>
            );
          })}
        </div>

        {/* Closing statement */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-4"
        >
          <div className="flex -space-x-1">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.7)]" />
            <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.5)]" />
            <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.5)]" />
          </div>

          <p className="text-xs tracking-wide text-slate-500 sm:text-sm">
            One connected vision. Multiple possibilities. A better campus.
          </p>
        </motion.div>

        {/* Trust note */}
        <div className="mt-16 flex flex-col items-center justify-center gap-3 border-t border-white/[0.07] pt-8 text-center sm:flex-row sm:gap-5">
          <ShieldCheck size={17} className="text-cyan-300/80" />
          <p className="text-xs leading-6 text-slate-500 sm:text-sm">
            Designed around connected workflows, clear access, and a
            student-first digital experience.
          </p>
          <WalletCards
            size={17}
            className="hidden text-slate-600 sm:block"
          />
        </div>
      </div>
    </section>
  );
}
