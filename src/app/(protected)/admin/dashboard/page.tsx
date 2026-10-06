"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  GraduationCap,
  RefreshCw,
  ShieldCheck,
  Users,
  Activity,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useCourses } from "@/hooks/api/useCourses";
import { useDepartments } from "@/hooks/api/useDepartments";
import { useFaculties } from "@/hooks/api/useFaculties";
import { useStudents } from "@/hooks/api/useStudents";

const chartData = [
  { month: "Jan", students: 24, faculty: 8 },
  { month: "Feb", students: 32, faculty: 9 },
  { month: "Mar", students: 41, faculty: 10 },
  { month: "Apr", students: 48, faculty: 11 },
  { month: "May", students: 57, faculty: 12 },
  { month: "Jun", students: 68, faculty: 14 },
  { month: "Jul", students: 76, faculty: 15 },
  { month: "Aug", students: 84, faculty: 17 },
  { month: "Sep", students: 92, faculty: 18 },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export default function AdminDashboardPage() {
  const reduceMotion = useReducedMotion();

  const {
    data: students = [],
    isLoading: studentsLoading,
    isError: studentsError,
    refetch: refetchStudents,
  } = useStudents();

  const {
    data: faculties = [],
    isLoading: facultiesLoading,
    isError: facultiesError,
    refetch: refetchFaculties,
  } = useFaculties();

  const {
    data: courses = [],
    isLoading: coursesLoading,
    isError: coursesError,
    refetch: refetchCourses,
  } = useCourses();

  const {
    data: departments = [],
    isLoading: departmentsLoading,
    isError: departmentsError,
    refetch: refetchDepartments,
  } = useDepartments();

  const loading =
    studentsLoading ||
    facultiesLoading ||
    coursesLoading ||
    departmentsLoading;

  const hasError =
    studentsError ||
    facultiesError ||
    coursesError ||
    departmentsError;

  const refreshAll = async () => {
    await Promise.all([
      refetchStudents(),
      refetchFaculties(),
      refetchCourses(),
      refetchDepartments(),
    ]);
  };

  const stats = [
    {
      label: "Total Students",
      value: students.length,
      icon: GraduationCap,
      description: "Registered students",
      href: "/admin/students",
    },
    {
      label: "Faculty Members",
      value: faculties.length,
      icon: Users,
      description: "Active teaching staff",
      href: "/admin/faculty",
    },
    {
      label: "Departments",
      value: departments.length,
      icon: Building2,
      description: "Academic departments",
      href: "/admin/departments",
    },
    {
      label: "Courses",
      value: courses.length,
      icon: BookOpen,
      description: "Available courses",
      href: "/admin/courses",
    },
  ];

  const recentStudents = students.slice(0, 5);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-8"
    >
      {/* Header */}
      <motion.section
        variants={itemVariants}
        initial={reduceMotion ? false : "hidden"}
        animate="show"
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-cyan-950/10 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-cyan-300/70">
              <Sparkles size={14} />
              Command Center
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              University{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-400 bg-clip-text text-transparent">
                Overview
              </span>
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Monitor your university ecosystem, academic resources,
              people, and courses from one intelligent control center.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshAll}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm font-medium text-slate-200 transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh data
          </button>
        </div>
      </motion.section>

      {/* Error */}
      {hasError && (
        <motion.div
          variants={itemVariants}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm text-red-200"
        >
          Some dashboard data could not be loaded. Please refresh
          and try again.
        </motion.div>
      )}

      {/* Stats */}
      <motion.section
        variants={containerVariants}
        initial={reduceMotion ? false : "hidden"}
        animate="show"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            {...stat}
            loading={loading}
          />
        ))}
      </motion.section>

      {/* Main grid */}
      <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        {/* Growth chart */}
        <motion.section
          variants={itemVariants}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-6"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Growth analytics
              </p>
              <h2 className="mt-2 text-lg font-semibold text-white">
                Academic ecosystem
              </h2>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Students
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-400" />
                Faculty
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="studentGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#67e8f9"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="#67e8f9"
                      stopOpacity={0}
                    />
                  </linearGradient>

                  <linearGradient
                    id="facultyGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#a78bfa"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="100%"
                      stopColor="#a78bfa"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#0c1220",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#67e8f9"
                  strokeWidth={2}
                  fill="url(#studentGradient)"
                />

                <Area
                  type="monotone"
                  dataKey="faculty"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  fill="url(#facultyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* System status */}
        <motion.section
          variants={itemVariants}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-6"
        >
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              System health
            </p>

            <h2 className="mt-2 text-lg font-semibold text-white">
              Platform status
            </h2>
          </div>

          <div className="space-y-3">
            <StatusItem
              icon={ShieldCheck}
              label="Authentication"
              value="Operational"
            />

            <StatusItem
              icon={Activity}
              label="API Connection"
              value={hasError ? "Needs attention" : "Operational"}
              warning={Boolean(hasError)}
            />

            <StatusItem
              icon={Building2}
              label="Departments"
              value={`${departments.length} active`}
            />

            <StatusItem
              icon={BookOpen}
              label="Course Catalog"
              value={`${courses.length} loaded`}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.035] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300">
                <Sparkles size={17} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-200">
                  NEXUS Core
                </p>
                <p className="text-xs text-slate-500">
                  University management services connected
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Recent students */}
      <motion.section
        variants={itemVariants}
        initial={reduceMotion ? false : "hidden"}
        animate="show"
        className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Latest records
            </p>

            <h2 className="mt-2 text-lg font-semibold text-white">
              Recent students
            </h2>
          </div>

          <a
            href="/admin/students"
            className="flex items-center gap-1 text-xs font-medium text-cyan-300 transition hover:text-cyan-200"
          >
            View all
            <ArrowUpRight size={14} />
          </a>
        </div>

        {loading ? (
          <StudentSkeleton />
        ) : recentStudents.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <GraduationCap className="mx-auto text-slate-600" size={28} />
            <p className="mt-3 text-sm text-slate-500">
              No student records available yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {recentStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        x: -10,
                      }
                }
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-white/[0.025] sm:px-6"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.06] text-sm font-semibold text-cyan-200">
                    {student.name?.charAt(0)?.toUpperCase() ?? "S"}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-200">
                      {student.name}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {student.studentId} · {student.email}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={16}
                  className="shrink-0 text-slate-600"
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}

type StatCardProps = {
  label: string;
  value: number;
  icon: React.ElementType;
  description: string;
  href: string;
  loading: boolean;
};

function StatCard({
  label,
  value,
  icon: Icon,
  description,
  href,
  loading,
}: StatCardProps) {
  return (
    <motion.a
      variants={itemVariants}
      href={href}
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.2,
      }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-cyan-300/20 hover:bg-white/[0.055]"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-300/[0.06] blur-2xl transition group-hover:bg-cyan-300/10" />

      <div className="relative flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan-300">
          <Icon size={20} strokeWidth={1.7} />
        </div>

        <ArrowUpRight
          size={16}
          className="text-slate-600 transition group-hover:text-cyan-300"
        />
      </div>

      <div className="relative mt-5">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
          {label}
        </p>

        {loading ? (
          <div className="mt-2 h-9 w-20 animate-pulse rounded-lg bg-white/10" />
        ) : (
          <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
        )}

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </motion.a>
  );
}

function StatusItem({
  icon: Icon,
  label,
  value,
  warning = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-black/10 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-slate-400">
          <Icon size={16} />
        </div>

        <span className="text-sm text-slate-300">
          {label}
        </span>
      </div>

      <span
        className={
          warning
            ? "text-xs font-medium text-amber-300"
            : "text-xs font-medium text-emerald-300"
        }
      >
        {value}
      </span>
    </div>
  );
}

function StudentSkeleton() {
  return (
    <div className="divide-y divide-white/[0.06]">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 px-5 py-4 sm:px-6"
        >
          <div className="h-10 w-10 animate-pulse rounded-xl bg-white/10" />

          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
            <div className="h-2.5 w-48 animate-pulse rounded bg-white/[0.06]" />
          </div>
        </div>
      ))}
    </div>
  );
}