"use client";

import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Layers3,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const portals = [
  {
    id: "01",
    name: "Student",
    eyebrow: "YOUR JOURNEY, CONNECTED",
    description:
      "Explore your academic world, discover courses, stay connected with campus life, and take ownership of your university journey.",
    icon: GraduationCap,
    gradient: "from-cyan-300 via-sky-400 to-blue-500",
    glow: "bg-cyan-400",
    border: "group-hover:border-cyan-300/40",
    text: "text-cyan-300",
    features: ["Academic resources", "Course discovery", "Campus experience"],
    shape: "student",
  },
  {
    id: "02",
    name: "Faculty",
    eyebrow: "TEACHING, REIMAGINED",
    description:
      "Bring teaching workflows, course information, and academic collaboration into a more connected digital workspace.",
    icon: BookOpen,
    gradient: "from-violet-300 via-purple-400 to-fuchsia-500",
    glow: "bg-violet-400",
    border: "group-hover:border-violet-300/40",
    text: "text-violet-300",
    features: ["Course coordination", "Academic collaboration", "Faculty workspace"],
    shape: "faculty",
  },
  {
    id: "03",
    name: "Administration",
    eyebrow: "CLARITY AT EVERY LEVEL",
    description:
      "Organize institutional information, oversee university workflows, and support a structured campus-wide experience.",
    icon: ShieldCheck,
    gradient: "from-emerald-300 via-teal-400 to-cyan-500",
    glow: "bg-emerald-400",
    border: "group-hover:border-emerald-300/40",
    text: "text-emerald-300",
    features: ["Institutional oversight", "Role-based access", "Operational workflows"],
    shape: "admin",
  },
];

export default function UserPortals() {
  return (
    <section
      id="portals"
      className="relative isolate overflow-hidden bg-[#070b16] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-16"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-500/[0.07] blur-[150px]" />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-cyan-500/[0.06] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(148,163,184,0.5) 0.7px, transparent 0.7px)",
            backgroundSize: "25px 25px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          }}
        />
      </div>

      <div className="mx-auto max-w-[1440px]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
          className="mb-14 flex flex-col justify-between gap-8 md:mb-20 md:flex-row md:items-end"
        >
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-4 py-2 text-xs font-medium tracking-[0.18em] text-violet-200 uppercase">
              <Users size={14} />
              One university. Every perspective.
            </div>

            <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-5xl lg:text-7xl">
              Your space.
              <span className="block bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
                Your purpose.
              </span>
            </h2>
          </div>

          <div className="max-w-md md:pb-2">
            <p className="text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
              Different roles. Different responsibilities. One connected
              experience built around the people who make a university thrive.
            </p>

            <div className="mt-5 flex items-center gap-3 text-xs tracking-wide text-slate-500">
              <span className="h-px w-8 bg-gradient-to-r from-cyan-400 to-violet-400" />
              EXPLORE THE NEXUS ECOSYSTEM
              <ArrowDownRight size={15} />
            </div>
          </div>
        </motion.div>

        {/* Portal cards */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {portals.map((portal, index) => {
            const Icon = portal.icon;

            return (
              <motion.article
                key={portal.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.12,
                  ease: "easeOut",
                }}
                whileHover={{ y: -7 }}
                className={`group relative isolate flex min-h-[490px] flex-col overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#0b1120]/80 p-6 transition-colors duration-500 sm:p-8 ${portal.border}`}
              >
                {/* Card glow */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full ${portal.glow} opacity-[0.035] blur-[90px] transition-opacity duration-700 group-hover:opacity-[0.15]`}
                />

                {/* Card header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${portal.gradient} text-slate-950 shadow-lg`}
                    >
                      <Icon size={21} strokeWidth={1.8} />
                    </div>

                    <span className="text-xs font-medium tracking-[0.15em] text-slate-400 uppercase">
                      {portal.eyebrow}
                    </span>
                  </div>

                  <span className="font-mono text-xs text-slate-600">
                    {portal.id}
                  </span>
                </div>

                {/* Decorative orbital illustration */}
                <div className="relative my-8 flex h-44 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.018]">
                  <div
                    aria-hidden="true"
                    className="absolute h-36 w-36 rounded-full border border-white/[0.08]"
                  />
                  <motion.div
                    aria-hidden="true"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 24,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute h-28 w-28 rounded-full border border-dashed border-white/[0.16]"
                  />
                  <div
                    aria-hidden="true"
                    className={`absolute h-20 w-20 rounded-full bg-gradient-to-br ${portal.gradient} opacity-10 blur-2xl`}
                  />

                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 220, damping: 15 }}
                    className="relative flex h-[76px] w-[76px] items-center justify-center rounded-[24px] border border-white/15 bg-[#10182a] shadow-2xl"
                  >
                    <Icon
                      size={35}
                      strokeWidth={1.25}
                      className={portal.text}
                    />
                    <span
                      className={`absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full ${portal.glow} shadow-[0_0_15px_currentColor]`}
                    />
                  </motion.div>

                  <span className="absolute left-5 top-5 font-mono text-[10px] tracking-widest text-slate-600">
                    NEXUS / {portal.id}
                  </span>

                  <Sparkles
                    size={15}
                    className={`absolute bottom-5 right-5 ${portal.text} opacity-60`}
                  />

                  <span className="absolute bottom-5 left-5 text-[10px] tracking-widest text-slate-600 uppercase">
                    Connected by design
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                    {portal.name}
                    <span
                      className={`ml-2 inline-block text-xl opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 ${portal.text}`}
                    >
                      ↗
                    </span>
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    {portal.description}
                  </p>
                </div>

                {/* Feature tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {portal.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[11px] text-slate-400 transition-colors group-hover:border-white/[0.12] group-hover:text-slate-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Bottom accent */}
                <div className="mt-auto pt-8">
                  <div className="mb-5 h-px w-full bg-white/[0.07]" />

                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${portal.text}`}>
                      Explore your experience
                    </span>

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.07] ${portal.text}`}
                    >
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Closing line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-4"
        >
          <Layers3 size={17} className="text-slate-500" />
          <p className="text-xs leading-6 text-slate-500 sm:text-sm">
            A unified experience that respects every role in the university.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
