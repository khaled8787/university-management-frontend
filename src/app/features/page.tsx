
"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  Layers3,
  ShieldCheck,
  Sparkles,
  Users,
  UserRoundCheck,
  ChartNoAxesCombined,
  Building2,
  Clock3,
  FileText,
  Fingerprint,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  details: string[];
  size?: "large" | "normal";
};

const features: Feature[] = [
  {
    number: "01",
    title: "Student Management",
    description:
      "Keep student profiles, academic information, departments, and enrollment records organized in one centralized system.",
    icon: GraduationCap,
    accent: "from-cyan-400 to-blue-500",
    details: [
      "Student profiles and IDs",
      "Department information",
      "Enrollment records",
    ],
    size: "large",
  },
  {
    number: "02",
    title: "Course Management",
    description:
      "Organize course catalogs, credits, capacity, faculty assignments, and course fees with a structured workflow.",
    icon: BookOpen,
    accent: "from-violet-400 to-purple-500",
    details: [
      "Course catalog",
      "Credit and fee management",
      "Faculty assignment",
    ],
  },
  {
    number: "03",
    title: "Result Management",
    description:
      "Manage marks, calculate grades automatically, and let students access their academic results.",
    icon: ClipboardCheck,
    accent: "from-emerald-400 to-teal-500",
    details: [
      "Marks and grade calculation",
      "Grade point management",
      "Student result access",
    ],
  },
  {
    number: "04",
    title: "Faculty Management",
    description:
      "Maintain faculty profiles, employee records, and course assignments with role-based access.",
    icon: Users,
    accent: "from-orange-400 to-pink-500",
    details: [
      "Faculty profiles",
      "Employee identification",
      "Assigned course access",
    ],
  },
  {
    number: "05",
    title: "Enrollment Management",
    description:
      "Connect students with courses through a clear enrollment workflow and maintain organized academic records.",
    icon: Layers3,
    accent: "from-blue-400 to-indigo-500",
    details: [
      "Course enrollment",
      "Enrollment status",
      "Course fee validation",
    ],
  },
  {
    number: "06",
    title: "Academic Organization",
    description:
      "Structure academic information around departments, courses, students, and faculty for easier administration.",
    icon: Building2,
    accent: "from-fuchsia-400 to-purple-500",
    details: [
      "Department organization",
      "Academic records",
      "Centralized administration",
    ],
  },
  {
    number: "07",
    title: "Secure Role-Based Access",
    description:
      "Keep administrative operations separated from faculty and student activities through role-based permissions.",
    icon: ShieldCheck,
    accent: "from-cyan-400 to-emerald-400",
    details: [
      "Admin permissions",
      "Faculty-specific access",
      "Student-specific records",
    ],
  },
  {
    number: "08",
    title: "Payment Management",
    description:
      "Support a structured payment workflow for applicable academic fees and keep payment information organized.",
    icon: CreditCard,
    accent: "from-amber-400 to-orange-500",
    details: [
      "Fee-related workflows",
      "Payment records",
      "Payment status tracking",
    ],
  },
];

const additionalCapabilities = [
  {
    icon: Fingerprint,
    title: "Protected Access",
    description:
      "Authentication and permissions help keep academic information accessible to the right users.",
  },
  {
    icon: FileText,
    title: "Organized Records",
    description:
      "Keep important academic information structured and easier to retrieve when needed.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Academic Overview",
    description:
      "Make student, course, and faculty information easier to navigate from the relevant dashboard.",
  },
  {
    icon: Clock3,
    title: "Efficient Workflow",
    description:
      "Reduce repetitive administrative work through centralized, consistent workflows.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
      <Sparkles className="size-3.5" />
      {children}
    </div>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -6 }}
      className={`group relative overflow-hidden rounded-3xl border border-white/[0.09] bg-white/[0.025] p-6 transition-colors duration-300 hover:border-cyan-300/25 hover:bg-white/[0.045] sm:p-7 ${
        feature.size === "large"
          ? "lg:col-span-2"
          : ""
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-gradient-to-br ${feature.accent} opacity-[0.07] blur-[75px] transition-opacity duration-500 group-hover:opacity-[0.15]`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div
          className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${feature.accent} bg-opacity-10 text-white shadow-lg shadow-black/10`}
        >
          <Icon className="size-5" />
        </div>

        <span className="font-mono text-xs tracking-widest text-white/25">
          {feature.number}
        </span>
      </div>

      <div className="relative mt-7">
        <h3 className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-cyan-200 sm:text-2xl">
          {feature.title}
        </h3>

        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
          {feature.description}
        </p>
      </div>

      <ul className="relative mt-6 space-y-3 border-t border-white/[0.07] pt-5">
        {feature.details.map((detail) => (
          <li
            key={detail}
            className="flex items-center gap-3 text-sm text-slate-300"
          >
            <CheckCircle2 className="size-4 shrink-0 text-cyan-400" />
            {detail}
          </li>
        ))}
      </ul>

      <div className="relative mt-7 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          UMS MODULE
        </span>

        <div className="flex size-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all duration-300 group-hover:border-cyan-300/30 group-hover:bg-cyan-300/10 group-hover:text-cyan-200">
          <ArrowUpRight className="size-4" />
        </div>
      </div>
    </motion.article>
  );
}

export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b14] text-white selection:bg-cyan-400/30">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-56 top-24 size-[480px] rounded-full bg-cyan-500/[0.09] blur-[150px]" />
        <div className="absolute -right-48 top-[650px] size-[480px] rounded-full bg-violet-600/[0.09] blur-[150px]" />
        <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />

        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(148,163,184,0.45) 0.7px, transparent 0.7px)",
            backgroundSize: "28px 28px",
            maskImage:
              "linear-gradient(to bottom, black, transparent 70%)",
          }}
        />
      </div>

      {/* Hero */}
      <section className="relative px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div variants={itemVariants}>
              <SectionLabel>
                Everything in one place
              </SectionLabel>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl font-black leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-7xl"
            >
              A smarter way to
              <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text pb-2 text-transparent">
                manage academics.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg"
            >
              Discover the tools that bring students, faculty,
              courses, enrollments, and academic results together
              in one organized University Management System.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                href="/register"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 text-sm font-bold text-[#06101d] shadow-lg shadow-cyan-500/15 transition-all hover:-translate-y-0.5 hover:shadow-cyan-400/25 sm:w-auto"
              >
                Get started
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/login"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-6 text-sm font-semibold text-white transition-colors hover:border-white/20 hover:bg-white/[0.07] sm:w-auto"
              >
                Sign in
                <ArrowUpRight className="size-4 text-slate-400" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Overview strip */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.65 }}
            className="mx-auto mt-16 grid max-w-4xl grid-cols-2 overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.025] sm:grid-cols-4"
          >
            {[
              {
                label: "Academic",
                value: "Centralized",
              },
              {
                label: "Access",
                value: "Role-based",
              },
              {
                label: "Records",
                value: "Organized",
              },
              {
                label: "Experience",
                value: "Responsive",
              },
            ].map((item, index) => (
              <div
                key={item.label}
                className={`px-4 py-5 text-center sm:px-5 ${
                  index % 2 === 0
                    ? "border-r border-white/[0.07] sm:border-r"
                    : "sm:border-r"
                } ${
                  index < 2
                    ? "border-b border-white/[0.07] sm:border-b-0"
                    : ""
                } ${
                  index === 3 ? "sm:border-r-0" : ""
                }`}
              >
                <p className="text-base font-bold text-white sm:text-lg">
                  {item.value}
                </p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500 sm:text-xs">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main features */}
      <section
        id="modules"
        className="relative scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <motion.div variants={itemVariants}>
                <SectionLabel>
                  Core capabilities
                </SectionLabel>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl"
              >
                Everything your academic workflow needs.
              </motion.h2>
            </div>

            <motion.p
              variants={itemVariants}
              className="max-w-md text-sm leading-7 text-slate-400"
            >
              Explore the key areas designed to make university
              administration more structured and easier to navigate.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            variants={containerVariants}
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.number}
                feature={feature}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel>
              Built for clarity
            </SectionLabel>

            <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Less complexity.
              <span className="mt-2 block text-cyan-300">
                More control.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-8 text-slate-400 sm:text-base">
              A university involves many connected processes.
              UMS brings supported academic modules into a
              consistent interface, helping each role focus
              on the information relevant to them.
            </p>

            <Link
              href="/register"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition-colors hover:text-cyan-200"
            >
              Explore UMS
              <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="grid gap-4 sm:grid-cols-2"
          >
            {additionalCapabilities.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  variants={itemVariants}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition-colors hover:border-cyan-300/20 hover:bg-white/[0.04]"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.07] text-cyan-300">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mt-5 font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    {item.description}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 pb-24 pt-8 sm:px-6 sm:pb-28 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br from-cyan-400/[0.10] via-blue-500/[0.06] to-violet-500/[0.10] px-6 py-12 sm:px-12 sm:py-16 lg:px-16"
        >
          <div className="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full bg-cyan-400/10 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-violet-500/10 blur-[100px]" />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                <CheckCircle2 className="size-4" />
                Your academic journey starts here
              </div>

              <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Ready for a more organized university experience?
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                Access your account and explore the tools
                available for your role in the university.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
              <Link
                href="/register"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-6 text-sm font-bold text-[#06101d] transition-all hover:bg-cyan-200"
              >
                Create account
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-white transition-colors hover:bg-white/[0.08]"
              >
                Sign in to UMS
                <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.07] px-4 py-7 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 font-bold tracking-tight text-white sm:justify-start"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 text-[#06101d]">
              <GraduationCap className="size-4" />
            </span>
            UMS
            <span className="font-normal text-slate-500">
              University Management System
            </span>
          </Link>

          <p className="text-xs text-slate-500">
            A more organized way to manage academic life.
          </p>
        </div>
      </footer>
    </main>
  );
}
