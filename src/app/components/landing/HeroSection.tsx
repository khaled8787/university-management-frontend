
"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Atom,
  BookOpen,
  GraduationCap,
  Orbit,
  Sparkles,
  Users,
} from "lucide-react";

const highlights = [
  {
    icon: GraduationCap,
    value: "01",
    label: "Student-centered",
  },
  {
    icon: BookOpen,
    value: "02",
    label: "Connected learning",
  },
  {
    icon: Users,
    value: "03",
    label: "One campus community",
  },
];

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="relative isolate min-h-[calc(100svh-76px)] overflow-hidden">
      <div
        aria-hidden="true"
        className="grid-background pointer-events-none absolute inset-0 -z-20"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-12 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-400/[0.07] blur-[120px] md:left-[65%] md:top-20 md:h-[600px] md:w-[600px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/3 -z-10 h-80 w-80 rounded-full bg-violet-500/[0.10] blur-[110px]"
      />

      <div className="mx-auto grid min-h-[calc(100svh-76px)] max-w-[1440px] items-center gap-8 px-5 pb-20 pt-12 sm:px-8 md:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4 lg:px-16 lg:py-16">
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 mx-auto w-full max-w-2xl lg:mx-0"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-2 text-xs font-medium tracking-wide text-cyan-100 sm:text-sm">
            <Sparkles size={15} className="text-cyan-300" />
            <span>THE NEXT CHAPTER OF CAMPUS LIFE</span>
            <span className="ml-1 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
          </div>

          <h1 className="text-[clamp(3.2rem,8vw,6.7rem)] font-semibold leading-[0.94] tracking-[-0.075em] text-white">
            Education,
            <br />
            <span className="gradient-text">reimagined.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
            One connected space for ambitious students, inspiring faculty,
            and the people shaping tomorrow. University life, without the
            complexity.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="/login"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-cyan-300 px-6 font-semibold text-slate-950 shadow-[0_0_35px_rgba(103,232,249,0.16)] transition duration-300 hover:-translate-y-1 hover:bg-cyan-200 hover:shadow-[0_0_45px_rgba(103,232,249,0.25)]"
            >
              Enter your campus
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>

            <a
              href="#experience"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-6 font-medium text-white transition duration-300 hover:border-white/20 hover:bg-white/[0.07]"
            >
              Explore the experience
              <ArrowDown size={17} className="text-cyan-300" />
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-slate-500 sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              One connected platform
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />
            <span>Built for the whole campus</span>
          </div>
        </motion.section>

        <motion.section
          aria-label="NEXUS visual experience"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
          className="relative mx-auto flex w-full max-w-[620px] items-center justify-center py-8 lg:min-h-[600px] lg:py-0"
        >
          <div className="relative aspect-square w-full max-w-[520px]">
            <div
              aria-hidden="true"
              className="absolute inset-[8%] rounded-full border border-cyan-200/[0.10]"
            />

            <motion.div
              aria-hidden="true"
              animate={
                reduceMotion ? undefined : { rotate: 360 }
              }
              transition={{
                duration: 42,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-[14%] rounded-full border border-dashed border-cyan-200/[0.20]"
            />

            <motion.div
              aria-hidden="true"
              animate={
                reduceMotion ? undefined : { rotate: -360 }
              }
              transition={{
                duration: 55,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-[21%] rounded-full border border-violet-300/[0.20]"
            />

            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-400/20 via-blue-500/10 to-violet-500/20 blur-2xl"
            />

            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : { y: [0, -12, 0], rotate: [0, 2, 0] }
              }
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-1/2 top-1/2 flex aspect-square w-[57%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-100/20 bg-gradient-to-br from-cyan-300/[0.13] via-slate-900/80 to-violet-500/[0.17] shadow-[inset_-20px_-25px_70px_rgba(0,0,0,0.6),inset_10px_10px_45px_rgba(103,232,249,0.12),0_0_100px_rgba(34,211,238,0.13)] backdrop-blur-2xl"
            >
              <div className="absolute inset-[8%] rounded-full border border-white/[0.08]" />

              <div className="relative flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/[0.07] text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.12)] sm:h-20 sm:w-20">
                  <Atom size={38} strokeWidth={1.2} />
                </div>
                <span className="text-xs font-semibold tracking-[0.35em] text-cyan-100 sm:text-sm">
                  NEXUS
                </span>
                <span className="mt-2 text-[10px] tracking-[0.18em] text-slate-500 sm:text-xs">
                  ONE CONNECTED WORLD
                </span>
              </div>

              <div className="absolute left-[8%] top-[25%] h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_18px_5px_rgba(103,232,249,0.35)]" />
              <div className="absolute bottom-[20%] right-[12%] h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_18px_5px_rgba(167,139,250,0.35)]" />
            </motion.div>

            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="glass-panel absolute left-0 top-[24%] rounded-2xl p-3.5 sm:left-2 sm:p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Your future</p>
                  <p className="mt-1 text-xs text-slate-400">Starts here</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={reduceMotion ? undefined : { y: [0, 9, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="glass-panel absolute bottom-[22%] right-0 rounded-2xl p-3.5 sm:right-1 sm:p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-300/10 text-violet-200">
                  <Orbit size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Everything</p>
                  <p className="mt-1 text-xs text-slate-400">In one universe</p>
                </div>
              </div>
            </motion.div>

            <div className="absolute right-[10%] top-[12%] h-2 w-2 rounded-full bg-cyan-200/80 shadow-[0_0_16px_4px_rgba(103,232,249,0.2)]" />
            <div className="absolute bottom-[12%] left-[18%] h-1.5 w-1.5 rounded-full bg-violet-200/80 shadow-[0_0_14px_4px_rgba(167,139,250,0.2)]" />
          </div>
        </motion.section>
      </div>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-3 px-5 pb-12 sm:grid-cols-3 sm:px-8 md:px-12 lg:px-16">
        {highlights.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.value}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition duration-300 hover:border-cyan-200/20 hover:bg-white/[0.045] sm:p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-cyan-200 transition group-hover:border-cyan-200/20 group-hover:bg-cyan-200/[0.08]">
                <Icon size={20} strokeWidth={1.6} />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] text-slate-500">
                  {item.value}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-200">
                  {item.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <section id="experience" className="sr-only">
        Discover a connected university experience with NEXUS.
      </section>
    </main>
  );
}