"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  GraduationCap,
  Orbit,
  Sparkles,
  Zap,
  Network
} from "lucide-react";

export default function FinalCTA() {
  return (
    <section
      id="get-started"
      className="relative isolate overflow-hidden bg-[#070b16] px-5 pb-24 pt-16 text-white sm:px-8 sm:pb-32 sm:pt-20 lg:px-16"
    >
      {/* Cinematic background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-1/2 top-[35%] h-[500px] w-[850px] -translate-x-1/2 rounded-full bg-cyan-500/[0.08] blur-[150px]" />

        <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-blue-600/[0.07] blur-[130px]" />

        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-violet-600/[0.08] blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at center, black 5%, transparent 75%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-[1440px]">
        {/* Main CTA panel */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative isolate overflow-hidden rounded-[28px] border border-white/[0.12] bg-[#0a1020]/85 sm:rounded-[40px]"
        >
          {/* Panel glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-cyan-400/[0.07] via-transparent to-violet-500/[0.09]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-cyan-400/[0.10] blur-[100px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-24 -z-10 h-80 w-80 rounded-full bg-violet-500/[0.10] blur-[100px]"
          />

          {/* Top status line */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] px-6 py-5 sm:px-10 sm:py-6 lg:px-14">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.06]">
                <GraduationCap size={18} className="text-cyan-200" />
              </div>

              <span className="text-xs font-semibold tracking-[0.16em] text-slate-300 uppercase">
                NEXUS University System
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]" />
              <span className="text-[10px] tracking-[0.12em] text-slate-400 uppercase">
                The future starts here
              </span>
            </div>
          </div>

          {/* CTA content */}
          <div className="grid grid-cols-1 items-center gap-12 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:px-14 lg:py-20">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-4 py-2 text-xs font-medium tracking-[0.16em] text-violet-200 uppercase"
              >
                <Sparkles size={14} />
                A new chapter in campus life
              </motion.div>

              <h2 className="max-w-3xl text-4xl font-semibold leading-[1.06] tracking-[-0.06em] sm:text-6xl lg:text-7xl xl:text-[82px]">
                Your campus.
                <span className="mt-2 block text-slate-400">
                  One connection.
                </span>
                <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  Infinite potential.
                </span>
              </h2>

              <p className="mt-7 max-w-xl text-sm leading-8 text-slate-400 sm:text-base">
                Step into a more connected university experience. Discover
                the tools, academic resources, and dedicated spaces designed
                to bring your university community closer together.
              </p>

              {/* CTA buttons */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="#portals"
                  className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400 px-6 py-3.5 text-sm font-semibold text-[#07101c] shadow-[0_0_35px_rgba(34,211,238,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(34,211,238,0.22)]"
                >
                  Explore your portal
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>

                <a
                  href="#features"
                  className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.025] px-6 py-3.5 text-sm font-medium text-slate-200 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06]"
                >
                  Discover NEXUS
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-300" />
                  One connected experience
                </span>

                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-300" />
                  Role-aware platform
                </span>
              </div>
            </div>

            {/* Orbital visual */}
            <div className="relative mx-auto flex aspect-square w-full max-w-[400px] items-center justify-center">
              <motion.div
                aria-hidden="true"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 35,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-[5%] rounded-full border border-dashed border-white/[0.13]"
              >
                <span className="absolute left-[15%] top-[13%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
                <span className="absolute bottom-[15%] right-[10%] h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_18px_rgba(196,181,253,0.9)]" />
              </motion.div>

              <motion.div
                aria-hidden="true"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-[19%] rounded-full border border-cyan-300/[0.17]"
              >
                <span className="absolute -right-1 top-1/2 h-2 w-2 rounded-full bg-blue-300" />
              </motion.div>

              <div
                aria-hidden="true"
                className="absolute inset-[25%] rounded-full bg-gradient-to-br from-cyan-400/[0.14] via-blue-500/[0.08] to-violet-500/[0.14] blur-2xl"
              />

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 flex h-[45%] w-[45%] flex-col items-center justify-center rounded-[30px] border border-white/[0.14] bg-[#0b1325]/95 shadow-[0_0_100px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:rounded-[36px]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/[0.12] to-violet-400/[0.12]">
                  <Orbit size={35} strokeWidth={1.25} className="text-cyan-200" />
                </div>

                <span className="mt-4 text-2xl font-semibold tracking-[0.12em]">
                  NEXUS
                </span>

                <span className="mt-2 text-[9px] tracking-[0.18em] text-slate-500 uppercase">
                  Beyond boundaries
                </span>
              </motion.div>

              {/* Floating markers */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-[1%] top-[30%] flex items-center gap-2 rounded-xl border border-cyan-300/15 bg-[#0b1325]/95 px-3 py-2.5 shadow-xl backdrop-blur-xl"
              >
                <GraduationCap size={16} className="text-cyan-300" />
                <span className="text-[9px] tracking-wider text-slate-300 uppercase">
                  Learn
                </span>
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute right-0 top-[35%] flex items-center gap-2 rounded-xl border border-violet-300/15 bg-[#0b1325]/95 px-3 py-2.5 shadow-xl backdrop-blur-xl"
              >
                <Network size={15} className="text-violet-300" />
                <span className="text-[9px] tracking-wider text-slate-300 uppercase">
                  Connect
                </span>
              </motion.div>

              <div className="absolute bottom-[9%] left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/[0.08] bg-[#0b1325]/95 px-4 py-2.5 shadow-xl backdrop-blur-xl">
                <Zap size={13} className="text-emerald-300" />
                <span className="text-[9px] tracking-[0.12em] text-slate-400 uppercase">
                  Built for possibility
                </span>
              </div>
            </div>
          </div>

          {/* Panel bottom signature */}
          <div className="flex flex-col gap-3 border-t border-white/[0.08] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14">
            <p className="text-xs text-slate-500">
              A connected digital experience for the university community.
            </p>

            <span className="font-mono text-[10px] tracking-[0.16em] text-slate-600">
              LEARN · CONNECT · PROGRESS
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
