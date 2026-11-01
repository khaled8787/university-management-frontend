"use client";

import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
  Fingerprint,
  Network,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    number: "01",
    label: "THE BEGINNING",
    title: "Discover",
    subtitle: "Find your direction.",
    description:
      "Explore the NEXUS ecosystem and discover the academic resources and opportunities available to your university community.",
    icon: Compass,
    accent: "text-cyan-300",
    border: "group-hover:border-cyan-300/40",
    glow: "bg-cyan-400",
    gradient: "from-cyan-300 to-blue-500",
  },
  {
    number: "02",
    label: "YOUR IDENTITY",
    title: "Connect",
    subtitle: "Enter your space.",
    description:
      "Access the platform through your account and use the workspace designed around your university role and responsibilities.",
    icon: Fingerprint,
    accent: "text-violet-300",
    border: "group-hover:border-violet-300/40",
    glow: "bg-violet-400",
    gradient: "from-violet-300 to-fuchsia-500",
  },
  {
    number: "03",
    label: "THE EXPERIENCE",
    title: "Manage",
    subtitle: "Everything in sync.",
    description:
      "Navigate the available tools, explore academic information, and manage the activities supported by your access permissions.",
    icon: Network,
    accent: "text-sky-300",
    border: "group-hover:border-sky-300/40",
    glow: "bg-sky-400",
    gradient: "from-sky-300 to-indigo-500",
  },
  {
    number: "04",
    label: "WHAT COMES NEXT",
    title: "Progress",
    subtitle: "Move forward.",
    description:
      "Stay connected to your academic journey and make the most of the resources and workflows available through NEXUS.",
    icon: Sparkles,
    accent: "text-emerald-300",
    border: "group-hover:border-emerald-300/40",
    glow: "bg-emerald-400",
    gradient: "from-emerald-300 to-teal-500",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden bg-[#070b16] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-16"
    >
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-[15%] top-[20%] h-72 w-72 rounded-full bg-cyan-500/[0.055] blur-[120px]" />
        <div className="absolute right-[10%] top-[45%] h-96 w-96 rounded-full bg-violet-500/[0.065] blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[700px] -translate-x-1/2 rounded-full bg-blue-500/[0.04] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          }}
        />
      </div>

      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-4 py-2 text-xs font-medium tracking-[0.2em] text-cyan-200 uppercase">
            <Sparkles size={14} />
            A simpler way forward
          </div>

          <h2 className="text-4xl font-semibold leading-[1.1] tracking-[-0.05em] sm:text-5xl lg:text-7xl">
            From connection
            <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              to possibility.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
            A clear path through your university experience. Discover your
            space, connect with what matters, and keep moving forward.
          </p>
        </motion.div>

        {/* Journey overview */}
        <div className="mb-12 flex items-center justify-between gap-4 border-y border-white/[0.07] py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035]">
              <Network size={17} className="text-cyan-300" />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-200">
                The NEXUS journey
              </p>
              <p className="mt-1 text-[10px] tracking-wide text-slate-500">
                FOUR STEPS · ONE CONNECTED EXPERIENCE
              </p>
            </div>
          </div>

          <span className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-slate-500 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
            THE PROCESS
          </span>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Desktop connection line */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[31px] hidden h-px bg-white/[0.09] lg:block"
          />

          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute left-0 right-0 top-[31px] hidden h-px origin-left bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400 lg:block"
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.article
                  key={step.number}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.12,
                    ease: "easeOut",
                  }}
                  className={`group relative rounded-2xl border border-white/[0.08] bg-[#0a1020]/85 p-5 transition-colors duration-500 hover:bg-[#0d1527] sm:p-6 ${step.border}`}
                >
                  {/* Step marker */}
                  <div className="relative z-10 mb-8 flex items-center justify-between lg:mb-10">
                    <div
                      className={`flex h-[62px] w-[62px] items-center justify-center rounded-2xl border border-white/10 bg-[#0c1425] transition-all duration-500 group-hover:scale-105 group-hover:border-white/20`}
                    >
                      <div
                        className={`absolute h-10 w-10 rounded-full ${step.glow} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30`}
                      />

                      <Icon
                        size={25}
                        strokeWidth={1.5}
                        className={`relative ${step.accent}`}
                      />
                    </div>

                    <span className="font-mono text-sm tracking-widest text-slate-600">
                      /{step.number}
                    </span>

                    <div
                      className={`absolute -right-1 top-0 h-2 w-2 rounded-full ${step.glow} opacity-0 shadow-[0_0_14px_currentColor] transition-opacity duration-300 group-hover:opacity-100 lg:hidden`}
                    />
                  </div>

                  <p
                    className={`text-[10px] font-medium tracking-[0.18em] ${step.accent} uppercase`}
                  >
                    {step.label}
                  </p>

                  <h3 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-slate-300">
                    {step.subtitle}
                  </p>

                  <p className="mt-5 min-h-[112px] text-sm leading-7 text-slate-400">
                    {step.description}
                  </p>

                  {/* Progress footer */}
                  <div className="mt-7 border-t border-white/[0.07] pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] tracking-[0.15em] text-slate-600 uppercase">
                        Step {step.number}
                      </span>

                      <ArrowUpRight
                        size={16}
                        className={`text-slate-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${step.accent}`}
                      />
                    </div>

                    <div className="mt-4 h-[2px] overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                          duration: 0.8,
                          delay: 0.25 + index * 0.12,
                        }}
                        className={`h-full bg-gradient-to-r ${step.gradient} opacity-80`}
                      />
                    </div>
                  </div>

                  {/* Mobile connector */}
                  {index < steps.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-[25px] left-1/2 z-20 flex -translate-x-1/2 items-center justify-center lg:hidden"
                    >
                      <ArrowDown
                        size={15}
                        className="text-slate-600"
                      />
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* Closing panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
          className="relative mt-12 overflow-hidden rounded-3xl border border-white/[0.09] bg-gradient-to-br from-white/[0.045] to-white/[0.015] p-6 sm:mt-16 sm:p-9"
        >
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-28 h-64 w-64 rounded-full bg-cyan-400/[0.08] blur-[90px]"
          />

          <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06]">
                <Check size={22} className="text-cyan-300" />
              </div>

              <div>
                <p className="text-xs font-medium tracking-[0.16em] text-cyan-200 uppercase">
                  One connected experience
                </p>

                <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                  Your university, moving forward.
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                  NEXUS brings the university experience into one organized
                  digital environment, with access shaped by each user&apos;s
                  role.
                </p>
              </div>
            </div>

            <a
              href="#portals"
              className="group inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-200 transition-all duration-300 hover:border-cyan-300/30 hover:bg-cyan-300/[0.06] hover:text-cyan-200 md:self-center"
            >
              Explore portals
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </div>
        </motion.div>

        {/* Bottom signature */}
        <div className="mt-10 flex items-center justify-center gap-3 text-center">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-slate-700" />
          <p className="text-[10px] tracking-[0.2em] text-slate-600 uppercase">
            Designed for a more connected campus
          </p>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-slate-700" />
        </div>
      </div>
    </section>
  );
}
