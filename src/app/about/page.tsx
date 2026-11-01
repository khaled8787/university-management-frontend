"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  GraduationCap,
  Globe2,
  Layers3,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

const values = [
  {
    icon: BrainCircuit,
    number: "01",
    title: "Innovation First",
    description:
      "We embrace modern technology to create smarter, simpler, and more effective university experiences.",
  },
  {
    icon: Users,
    number: "02",
    title: "People Over Process",
    description:
      "Every feature is designed around the real needs of students, faculty, and administrators.",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Trust & Transparency",
    description:
      "We believe reliable information, secure access, and clear processes build stronger institutions.",
  },
];

const capabilities = [
  {
    icon: GraduationCap,
    title: "Student Experience",
    description:
      "Access academic information, manage courses, and stay connected with your university journey.",
  },
  {
    icon: BookOpen,
    title: "Academic Management",
    description:
      "Bring courses, academic records, and essential learning information into one organized platform.",
  },
  {
    icon: Layers3,
    title: "Connected Operations",
    description:
      "Help university teams coordinate everyday academic and administrative activities efficiently.",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b14] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 top-20 h-[420px] w-[420px] rounded-full bg-cyan-500/[0.09] blur-[130px]" />
        <div className="absolute -right-40 top-[550px] h-[460px] w-[460px] rounded-full bg-violet-600/[0.10] blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.7) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
            maskImage:
              "linear-gradient(to bottom, black, transparent 85%)",
          }}
        />
      </div>

      {/* Hero */}
      <section className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-14 px-5 pb-20 pt-28 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-12 lg:pb-28 lg:pt-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="relative z-10"
        >
          <motion.div
            variants={reveal}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300"
          >
            <Sparkles size={14} />
            About NEXUS
          </motion.div>

          <motion.h1
            variants={reveal}
            className="max-w-3xl text-5xl font-black leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl"
          >
            The future of
            <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text pb-2 text-transparent">
              university life.
            </span>
          </motion.h1>

          <motion.p
            variants={reveal}
            className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg"
          >
            Education moves forward when people, information, and ideas work
            together. NEXUS brings essential university management experiences
            into one modern digital space.
          </motion.p>

          <motion.div
            variants={reveal}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link
              href="/features"
              className="group inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Explore Features
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 font-semibold text-white transition hover:border-cyan-400/40 hover:bg-white/[0.08]"
            >
              Join NEXUS
              <ArrowDownRight size={18} />
            </Link>
          </motion.div>

          <motion.div
            variants={reveal}
            className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-slate-400"
          >
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              One connected platform
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-400" />
              Built for campus life
            </span>
          </motion.div>
        </motion.div>

        {/* Abstract digital campus visual — built with CSS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[520px]"
        >
          <div className="absolute inset-8 rounded-full bg-cyan-400/10 blur-[90px]" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d1423]/90 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  NEXUS / SYSTEM
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-200">
                  Connected Campus
                </p>
              </div>
              <span className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5 text-xs text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Unified
              </span>
            </div>

            <div className="relative my-7 flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#101f35] via-[#101326] to-[#21123b]">
              <div className="absolute h-[82%] w-[82%] animate-[spin_35s_linear_infinite] rounded-full border border-dashed border-cyan-300/20" />
              <div className="absolute h-[63%] w-[63%] animate-[spin_25s_linear_infinite_reverse] rounded-full border border-violet-300/20" />
              <div className="absolute h-[43%] w-[43%] rounded-full border border-cyan-300/30 shadow-[0_0_60px_rgba(34,211,238,0.08)]" />

              <div className="relative z-10 flex h-28 w-28 flex-col items-center justify-center rounded-[2rem] border border-cyan-300/30 bg-cyan-300/[0.09] shadow-[0_0_80px_rgba(34,211,238,0.16)] backdrop-blur-xl">
                <GraduationCap size={38} className="text-cyan-300" />
                <span className="mt-2 text-xs font-black tracking-[0.24em]">
                  NEXUS
                </span>
              </div>

              <div className="absolute left-[12%] top-[20%] rounded-xl border border-white/10 bg-slate-900/80 p-3 shadow-xl">
                <BookOpen size={22} className="text-violet-300" />
              </div>
              <div className="absolute right-[12%] top-[29%] rounded-xl border border-white/10 bg-slate-900/80 p-3 shadow-xl">
                <Users size={22} className="text-cyan-300" />
              </div>
              <div className="absolute bottom-[15%] left-[24%] rounded-xl border border-white/10 bg-slate-900/80 p-3 shadow-xl">
                <BrainCircuit size={22} className="text-blue-300" />
              </div>
              <div className="absolute bottom-[17%] right-[21%] rounded-xl border border-white/10 bg-slate-900/80 p-3 shadow-xl">
                <Globe2 size={22} className="text-fuchsia-300" />
              </div>

              <div className="absolute left-[25%] top-[30%] h-px w-[18%] rotate-45 bg-cyan-300/30" />
              <div className="absolute right-[25%] top-[38%] h-px w-[18%] -rotate-45 bg-violet-300/30" />
              <div className="absolute bottom-[31%] left-[34%] h-px w-[15%] -rotate-45 bg-blue-300/30" />
              <div className="absolute bottom-[31%] right-[31%] h-px w-[15%] rotate-45 bg-fuchsia-300/30" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Academics", value: "Connected" },
                { label: "Information", value: "Organized" },
                { label: "Experience", value: "Simplified" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3"
                >
                  <p className="text-[10px] text-slate-500 sm:text-xs">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-200 sm:text-sm">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -right-3 top-24 hidden rounded-2xl border border-cyan-300/20 bg-[#101a2b]/95 p-4 shadow-xl shadow-black/20 sm:block">
            <Zap size={20} className="text-cyan-300" />
            <p className="mt-2 text-xs font-semibold text-white">
              Smarter workflows
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Less friction, more focus
            </p>
          </div>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="relative border-y border-white/[0.07] bg-white/[0.018]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-12 lg:py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={reveal}
          >
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
              Our mission
            </p>
            <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
              Making campus life feel more connected.
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={reveal}
            className="border-l border-cyan-400/30 pl-6 sm:pl-8"
          >
            <p className="text-lg leading-8 text-slate-300 sm:text-xl sm:leading-9">
              NEXUS is designed to bring university communities closer to the
              information and tools they need. By organizing everyday academic
              and administrative workflows, our goal is to help students focus
              on learning and help university teams work with greater clarity.
            </p>
            <p className="mt-5 leading-7 text-slate-500">
              We see technology as a bridge between people, knowledge, and
              opportunity—not another barrier to navigate.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
        >
          <motion.div variants={reveal} className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
              What we bring together
            </p>
            <h2 className="mt-5 text-3xl font-bold sm:text-5xl">
              One platform. A more connected campus.
            </h2>
            <p className="mt-5 leading-7 text-slate-400">
              Essential university experiences, thoughtfully organized for
              the people who make education happen.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {capabilities.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  variants={reveal}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.025] p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-cyan-300/[0.035]"
                >
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/[0.05] blur-3xl transition group-hover:bg-cyan-400/[0.12]" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-300">
                      <Icon size={23} />
                    </div>
                    <span className="text-sm font-semibold text-slate-600">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="relative mt-7 text-xl font-bold">
                    {item.title}
                  </h3>
                  <p className="relative mt-3 text-sm leading-7 text-slate-400">
                    {item.description}
                  </p>
                  <div className="relative mt-7 flex items-center gap-2 text-sm font-semibold text-cyan-300">
                    Built for campus life
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="relative border-y border-white/[0.07] bg-[#0a101c]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={reveal}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-violet-300">
              What guides us
            </p>
            <h2 className="mt-5 text-3xl font-bold sm:text-5xl">
              Technology with a purpose.
            </h2>
            <p className="mt-5 leading-7 text-slate-400">
              The principles behind a more thoughtful digital university
              experience.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={container}
            className="mt-14 grid gap-5 md:grid-cols-3"
          >
            {values.map((item) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.number}
                  variants={reveal}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-7"
                >
                  <div className="flex items-center justify-between">
                    <Icon size={25} className="text-violet-300" />
                    <span className="font-mono text-sm text-slate-600">
                      / {item.number}
                    </span>
                  </div>
                  <h3 className="mt-7 text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {item.description}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
          className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-[#10283a] via-[#111a30] to-[#211639] px-6 py-12 text-center sm:px-12 sm:py-16"
        >
          <div className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-violet-500/15 blur-[80px]" />

          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
            <GraduationCap size={29} />
          </div>

          <h2 className="relative mx-auto mt-7 max-w-2xl text-3xl font-black sm:text-5xl">
            Your university journey,
            <span className="block mt-2 bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
              connected through NEXUS.
            </span>
          </h2>

          <p className="relative mx-auto mt-5 max-w-xl leading-7 text-slate-400">
            Discover a more organized way to stay connected with the academic
            community and the tools that support your progress.
          </p>

          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
            >
              View Features
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="relative border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <Link
            href="/"
            className="font-black tracking-[0.2em] text-slate-300"
          >
            NEXUS<span className="text-cyan-300">.</span>
          </Link>
          <p>Connecting people, knowledge, and campus life.</p>
          <Link
            href="/features"
            className="transition hover:text-cyan-300"
          >
            Explore Features →
          </Link>
        </div>
      </footer>
    </main>
  );
}
