"use client";

import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Compass,
  Fingerprint,
  Layers3,
  Network,
  Orbit,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

const principles = [
  {
    number: "01",
    title: "One connected ecosystem",
    description:
      "Bring academic information, university resources, and supported workflows into a more unified digital environment.",
    icon: Network,
    accent: "text-cyan-300",
  },
  {
    number: "02",
    title: "Built around every role",
    description:
      "Create a clearer experience for students, faculty, and administrators through role-aware access and dedicated workspaces.",
    icon: Fingerprint,
    accent: "text-violet-300",
  },
  {
    number: "03",
    title: "Clarity over complexity",
    description:
      "Make important information easier to discover with a considered interface, consistent structure, and focused navigation.",
    icon: Compass,
    accent: "text-emerald-300",
  },
];

const orbitNodes = [
  {
    label: "STUDENTS",
    position: "left-0 top-[18%]",
    color: "border-cyan-300/25 text-cyan-200",
  },
  {
    label: "FACULTY",
    position: "right-0 top-[24%]",
    color: "border-violet-300/25 text-violet-200",
  },
  {
    label: "ACADEMICS",
    position: "bottom-[12%] left-1/2 -translate-x-1/2",
    color: "border-emerald-300/25 text-emerald-200",
  },
];

export default function WhyNexus() {
  return (
    <section
      id="why-nexus"
      className="relative isolate overflow-hidden bg-[#070b16] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-16"
    >
      {/* Atmospheric background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-32 top-[15%] h-96 w-96 rounded-full bg-cyan-500/[0.055] blur-[140px]" />
        <div className="absolute -right-24 top-[40%] h-[420px] w-[420px] rounded-full bg-violet-500/[0.065] blur-[150px]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-blue-500/[0.04] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(148,163,184,0.45) 0.7px, transparent 0.7px)",
            backgroundSize: "24px 24px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          }}
        />
      </div>

      <div className="mx-auto max-w-[1440px]">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex items-center justify-between gap-4 border-b border-white/[0.08] pb-5"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035]">
              <Sparkles size={17} className="text-cyan-300" />
            </span>
            <span className="text-xs font-medium tracking-[0.2em] text-slate-300 uppercase">
              The NEXUS difference
            </span>
          </div>

          <span className="hidden font-mono text-[10px] tracking-[0.18em] text-slate-600 sm:block">
            A NEW PERSPECTIVE / 01—03
          </span>
        </motion.div>

        {/* Main editorial layout */}
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left: headline and story */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="mb-5 text-xs font-medium tracking-[0.22em] text-cyan-200 uppercase">
              Not just another platform
            </p>

            <h2 className="text-5xl font-semibold leading-[1.03] tracking-[-0.065em] sm:text-6xl lg:text-[76px]">
              University life,
              <span className="mt-2 block text-slate-500">
                reconnected.
              </span>
              <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Reimagined.
              </span>
            </h2>

            <p className="mt-8 max-w-xl text-sm leading-8 text-slate-400 sm:text-base">
              A university is more than departments, courses, and records.
              It is a community of people, ideas, and ambitions. NEXUS is
              designed to bring those experiences closer together through a
              more connected digital environment.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="/features"
                className="group inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold text-[#070b16] transition-all duration-300 hover:bg-cyan-500"
              >
                Explore the platform
                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={15} className="text-cyan-300" />
                Designed with access in mind
              </span>
            </div>

            {/* Small editorial signature */}
            <div className="mt-12 flex items-center gap-4 border-t border-white/[0.08] pt-6">
              <div className="h-10 w-1 rounded-full bg-gradient-to-b from-cyan-300 to-violet-400" />

              <div>
                <p className="text-sm font-medium text-slate-200">
                  One vision. Multiple perspectives.
                </p>
                <p className="mt-1 text-xs leading-6 text-slate-500">
                  A shared digital space for the university community.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: orbital ecosystem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[560px]"
          >
            <div className="relative aspect-square max-h-[560px]">
              {/* Outer orbital ring */}
              <motion.div
                aria-hidden="true"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 55,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-[5%] rounded-full border border-dashed border-white/[0.12]"
              >
                <span className="absolute left-[14%] top-[12%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
                <span className="absolute bottom-[14%] right-[12%] h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_16px_rgba(196,181,253,0.9)]" />
              </motion.div>

              {/* Middle ring */}
              <motion.div
                aria-hidden="true"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 38,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-[17%] rounded-full border border-cyan-300/[0.16]"
              >
                <span className="absolute -right-1 top-1/2 h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_14px_rgba(196,181,253,0.8)]" />
              </motion.div>

              {/* Central glow */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-400/[0.13] via-blue-500/[0.08] to-violet-500/[0.13] blur-2xl"
              />

              {/* Center platform */}
              <div className="absolute left-1/2 top-1/2 z-10 flex h-[35%] w-[35%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[30px] border border-white/[0.13] bg-[#0c1425]/95 shadow-[0_0_90px_rgba(34,211,238,0.08)] backdrop-blur-xl sm:rounded-[36px]">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.07] sm:h-14 sm:w-14">
                  <Orbit
                    size={28}
                    strokeWidth={1.35}
                    className="text-cyan-200"
                  />
                </div>

                <span className="text-xl font-semibold tracking-[0.12em] sm:text-2xl">
                  NEXUS
                </span>

                <span className="mt-2 text-center text-[8px] tracking-[0.18em] text-slate-500 uppercase sm:text-[10px]">
                  Connected campus
                </span>

                <span className="mt-4 flex items-center gap-1.5 text-[9px] text-cyan-200/80 sm:text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  ONE ECOSYSTEM
                </span>
              </div>

              {/* Satellite nodes */}
              {orbitNodes.map((node, index) => (
                <motion.div
                  key={node.label}
                  animate={{
                    y: [0, index === 1 ? -7 : 7, 0],
                  }}
                  transition={{
                    duration: 4 + index,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.35,
                  }}
                  className={`absolute z-20 ${node.position} flex items-center gap-2 rounded-full border bg-[#0b1120]/95 px-3 py-2.5 shadow-xl backdrop-blur-xl sm:px-4 ${node.color}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  <span className="whitespace-nowrap text-[9px] font-medium tracking-[0.12em] sm:text-[10px]">
                    {node.label}
                  </span>
                </motion.div>
              ))}

              {/* Supporting mini panels */}
              <div className="absolute left-[1%] top-[43%] z-20 hidden rounded-xl border border-white/10 bg-[#0b1120]/95 p-3 shadow-xl backdrop-blur-xl sm:block">
                <Layers3 size={17} className="text-cyan-300" />
              </div>

              <div className="absolute right-[2%] top-[52%] z-20 hidden rounded-xl border border-white/10 bg-[#0b1120]/95 p-3 shadow-xl backdrop-blur-xl sm:block">
                <Workflow size={17} className="text-violet-300" />
              </div>

              {/* Bottom annotation */}
              <div className="absolute bottom-[1%] left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/[0.08] bg-[#0b1120]/90 px-4 py-2.5 text-[9px] tracking-[0.13em] text-slate-400 uppercase backdrop-blur-xl sm:text-[10px]">
                <Sparkles size={13} className="text-cyan-300" />
                Connected by design
              </div>
            </div>

            <p className="mt-5 text-center text-[10px] leading-6 text-slate-600">
              A conceptual representation of the NEXUS ecosystem.
            </p>
          </motion.div>
        </div>

        {/* Principles */}
        <div className="mt-24 border-t border-white/[0.08] pt-10 sm:mt-32 sm:pt-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-violet-200 uppercase">
                Our design principles
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                Purpose in every detail.
              </h3>
            </div>

            <p className="max-w-sm text-sm leading-7 text-slate-500">
              Thoughtful design choices that help make the digital university
              experience feel more coherent.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 divide-y divide-white/[0.08] border-y border-white/[0.08] md:grid-cols-3 md:divide-x md:divide-y-0">
            {principles.map((principle, index) => {
              const Icon = principle.icon;

              return (
                <motion.article
                  key={principle.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.1,
                  }}
                  className="group relative px-2 py-7 sm:px-6 sm:py-8 md:px-7 lg:px-8"
                >
                  <div className="mb-7 flex items-center justify-between">
                    <span className="font-mono text-xs tracking-widest text-slate-600">
                      / {principle.number}
                    </span>

                    <Icon
                      size={21}
                      strokeWidth={1.5}
                      className={`transition-transform duration-300 group-hover:scale-110 ${principle.accent}`}
                    />
                  </div>

                  <h4 className="text-lg font-semibold tracking-tight text-slate-100">
                    {principle.title}
                  </h4>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {principle.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-xs text-slate-600 transition-colors group-hover:text-slate-300">
                    <span>Designed with intention</span>
                    <ArrowDownRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                    />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* Closing statement */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
          className="mt-14 flex flex-col items-start justify-between gap-5 rounded-2xl border border-white/[0.08] bg-gradient-to-r from-cyan-300/[0.045] via-white/[0.015] to-violet-400/[0.045] p-6 sm:flex-row sm:items-center sm:p-8"
        >
          <div>
            <p className="text-xs tracking-[0.16em] text-slate-500 uppercase">
              The idea behind NEXUS
            </p>
            <p className="mt-3 text-xl font-medium leading-snug tracking-tight text-slate-200 sm:text-2xl">
              Less fragmentation. More connection.
            </p>
          </div>

          <a
            href="#how-it-works"
            className="group inline-flex items-center gap-3 text-sm font-medium text-cyan-200 transition-colors hover:text-white"
          >
            See how it works
            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
