"use client";

import { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Activity,
  Award,
  BookOpen,
  CalendarCheck2,
  ChevronRight,
  GraduationCap,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
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
import { useStudents } from "@/hooks/api/useStudents";
import { useAttendances } from "@/hooks/api/useAttendance";
import { useResults } from "@/hooks/api/useResults";
import { getApiErrorMessage } from "@/lib/api";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants: Variants = {
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

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-56 rounded-[2rem] border border-white/10 bg-white/[0.035]" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-3xl border border-white/10 bg-white/[0.035]"
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="h-96 rounded-3xl border border-white/10 bg-white/[0.035]" />
        <div className="h-96 rounded-3xl border border-white/10 bg-white/[0.035]" />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.05]"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-400/[0.07] blur-3xl transition group-hover:bg-cyan-400/[0.13]" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            {label}
          </p>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>

        <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.07] p-3 text-cyan-300">
          <Icon size={19} />
        </div>
      </div>
    </motion.div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: typeof Users;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <motion.a
      variants={itemVariants}
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.025] p-4 transition duration-300 hover:border-cyan-400/20 hover:bg-cyan-400/[0.035]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300 transition group-hover:scale-105">
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="mt-1 truncate text-xs text-slate-600">{description}</p>
      </div>

      <ChevronRight
        size={16}
        className="text-slate-700 transition group-hover:translate-x-1 group-hover:text-cyan-300"
      />
    </motion.a>
  );
}

export default function FacultyDashboardPage() {
  const coursesQuery = useCourses();
  const studentsQuery = useStudents();
  const attendanceQuery = useAttendances();
  const resultsQuery = useResults();

  const courses = coursesQuery.data ?? [];
  const students = studentsQuery.data ?? [];
  const attendance = attendanceQuery.data ?? [];
  const results = resultsQuery.data ?? [];

  const isLoading =
    coursesQuery.isLoading ||
    studentsQuery.isLoading ||
    attendanceQuery.isLoading ||
    resultsQuery.isLoading;

  const hasError =
    coursesQuery.isError ||
    studentsQuery.isError ||
    attendanceQuery.isError ||
    resultsQuery.isError;

  const errorMessage =
    getApiErrorMessage(
      coursesQuery.error ??
        studentsQuery.error ??
        attendanceQuery.error ??
        resultsQuery.error,
      "Unable to load faculty dashboard data.",
    );

  const activeCourses = useMemo(
    () => courses.filter((course) => course.isActive),
    [courses],
  );

  const presentCount = useMemo(
    () => attendance.filter((item) => item.status === "PRESENT").length,
    [attendance],
  );

  const lateCount = useMemo(
    () => attendance.filter((item) => item.status === "LATE").length,
    [attendance],
  );

  const absentCount = useMemo(
    () => attendance.filter((item) => item.status === "ABSENT").length,
    [attendance],
  );

  const attendanceRate = useMemo(() => {
    if (!attendance.length) return 0;

    return ((presentCount + lateCount * 0.5) / attendance.length) * 100;
  }, [attendance.length, presentCount, lateCount]);

  const averageMarks = useMemo(() => {
    if (!results.length) return 0;

    return (
      results.reduce((sum, result) => sum + Number(result.marks || 0), 0) /
      results.length
    );
  }, [results]);

  const averageGradePoint = useMemo(() => {
    if (!results.length) return 0;

    return (
      results.reduce(
        (sum, result) => sum + Number(result.gradePoint || 0),
        0,
      ) / results.length
    );
  }, [results]);

  const chartData = useMemo(() => {
    const buckets = [
      { label: "Week 1", value: 0 },
      { label: "Week 2", value: 0 },
      { label: "Week 3", value: 0 },
      { label: "Week 4", value: 0 },
    ];

    if (!attendance.length) {
      return buckets.map((item) => ({
        ...item,
        value: 0,
      }));
    }

    attendance.forEach((item) => {
      const date = new Date(item.date);

      if (Number.isNaN(date.getTime())) return;

      const week = Math.min(Math.floor((date.getDate() - 1) / 7), 3);

      if (item.status === "PRESENT") {
        buckets[week].value += 100;
      } else if (item.status === "LATE") {
        buckets[week].value += 50;
      }
    });

    return buckets.map((item) => ({
      label: item.label,
      value: attendance.length
        ? Math.round(item.value / Math.max(attendance.length / 4, 1))
        : 0,
    }));
  }, [attendance]);

  const recentResults = useMemo(
    () =>
      [...results]
        .sort((a, b) => {
          const aDate = new Date(a.createdAt ?? 0).getTime();
          const bDate = new Date(b.createdAt ?? 0).getTime();

          return bDate - aDate;
        })
        .slice(0, 5),
    [results],
  );

  const refreshAll = async () => {
    await Promise.all([
      coursesQuery.refetch(),
      studentsQuery.refetch(),
      attendanceQuery.refetch(),
      resultsQuery.refetch(),
    ]);
  };

  if (isLoading) {
    return (
      <main className="min-h-full pb-10">
        <DashboardSkeleton />
      </main>
    );
  }

  if (hasError) {
    return (
      <main className="min-h-full pb-10">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="w-full max-w-lg rounded-[2rem] border border-red-400/15 bg-red-400/[0.035] p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/15 bg-red-400/[0.07] text-red-300">
              <Activity size={24} />
            </div>

            <h1 className="mt-5 text-xl font-semibold text-white">
              Faculty command center unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={refreshAll}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.07] px-5 py-3 text-xs font-medium text-red-200 transition hover:bg-red-400/[0.12]"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="min-h-full pb-10"
    >
      <div className="mx-auto max-w-[1500px] space-y-6">
        {/* HERO */}
        <motion.section
          variants={itemVariants}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/[0.08] via-blue-500/[0.035] to-violet-500/[0.07] p-6 sm:p-8 lg:p-10"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                <Sparkles size={13} />
                Faculty Command Center
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Academic{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  Control
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Monitor your courses, students, attendance and academic
                performance from one intelligent faculty workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={refreshAll}
              disabled={
                coursesQuery.isFetching ||
                studentsQuery.isFetching ||
                attendanceQuery.isFetching ||
                resultsQuery.isFetching
              }
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.07] px-5 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  coursesQuery.isFetching ||
                  studentsQuery.isFetching ||
                  attendanceQuery.isFetching ||
                  resultsQuery.isFetching
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh Data
            </button>
          </div>
        </motion.section>

        {/* STATS */}
        <motion.section
          variants={containerVariants}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <StatCard
            icon={BookOpen}
            label="Active Courses"
            value={String(activeCourses.length)}
            detail={`${courses.length} total courses loaded`}
          />

          <StatCard
            icon={Users}
            label="Students"
            value={String(students.length)}
            detail="Students available in current data"
          />

          <StatCard
            icon={CalendarCheck2}
            label="Attendance"
            value={`${attendanceRate.toFixed(1)}%`}
            detail={`${presentCount} present · ${absentCount} absent`}
          />

          <StatCard
            icon={Award}
            label="Average Point"
            value={averageGradePoint.toFixed(2)}
            detail={`${averageMarks.toFixed(1)}% average marks`}
          />
        </motion.section>

        {/* ANALYTICS */}
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <motion.section
            variants={itemVariants}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] p-2 text-cyan-300">
                    <TrendingUp size={16} />
                  </div>

                  <h2 className="text-base font-semibold text-white">
                    Attendance Pulse
                  </h2>
                </div>

                <p className="mt-2 text-xs text-slate-600">
                  Attendance activity across the available records
                </p>
              </div>

              <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.05] px-3 py-2 text-xs text-emerald-300">
                {attendanceRate.toFixed(1)}% health
              </div>
            </div>

            <div className="mt-7 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="facultyAttendanceGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#22d3ee"
                        stopOpacity={0.28}
                      />
                      <stop
                        offset="100%"
                        stopColor="#22d3ee"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="rgba(255,255,255,0.06)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#475569",
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={35}
                    tick={{
                      fill: "#475569",
                      fontSize: 11,
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#07101f",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 14,
                      color: "#fff",
                    }}
                    labelStyle={{
                      color: "#94a3b8",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    fill="url(#facultyAttendanceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.section>

          {/* QUICK ACTIONS */}
          <motion.section
            variants={itemVariants}
            className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl sm:p-6"
          >
            <div className="flex items-center gap-2">
              <div className="rounded-xl border border-violet-400/10 bg-violet-400/[0.06] p-2 text-violet-300">
                <Zap size={16} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-white">
                  Quick Actions
                </h2>
                <p className="mt-1 text-xs text-slate-600">
                  Jump directly into faculty operations
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <QuickAction
                icon={BookOpen}
                title="My Courses"
                description="Review assigned course information"
                href="/faculty/courses"
              />

              <QuickAction
                icon={Users}
                title="Students"
                description="Explore students connected to your courses"
                href="/faculty/students"
              />

              <QuickAction
                icon={CalendarCheck2}
                title="Attendance"
                description="Record and manage attendance"
                href="/faculty/attendance"
              />

              <QuickAction
                icon={Award}
                title="Results"
                description="Create and manage academic results"
                href="/faculty/results"
              />
            </div>
          </motion.section>
        </div>

        {/* LOWER GRID */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* COURSES */}
          <motion.section
            variants={itemVariants}
            className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl sm:p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen size={17} className="text-cyan-300" />
                  <h2 className="text-base font-semibold text-white">
                    Active Courses
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-600">
                  Current course activity
                </p>
              </div>

              <a
                href="/faculty/courses"
                className="text-xs font-medium text-cyan-300 transition hover:text-cyan-200"
              >
                View All
              </a>
            </div>

            <div className="mt-5 space-y-3">
              {activeCourses.length === 0 ? (
                <div className="rounded-2xl border border-white/8 bg-black/20 p-6 text-center text-sm text-slate-600">
                  No active courses found.
                </div>
              ) : (
                activeCourses.slice(0, 5).map((course) => (
                  <div
                    key={course.id}
                    className="group flex items-center gap-4 rounded-2xl border border-white/7 bg-black/15 p-4 transition hover:border-cyan-400/15 hover:bg-cyan-400/[0.025]"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.05] text-cyan-300">
                      <GraduationCap size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md border border-cyan-400/10 bg-cyan-400/[0.04] px-2 py-1 text-[9px] font-semibold tracking-wider text-cyan-300">
                          {course.code}
                        </span>

                        <span className="text-[10px] text-slate-600">
                          {course.credit} credit
                        </span>
                      </div>

                      <p className="mt-2 truncate text-sm font-medium text-white">
                        {course.title}
                      </p>
                    </div>

                    <div className="hidden text-right sm:block">
                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Capacity
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-300">
                        {course.capacity}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.section>

          {/* RECENT RESULTS */}
          <motion.section
            variants={itemVariants}
            className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl sm:p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Target size={17} className="text-violet-300" />
                  <h2 className="text-base font-semibold text-white">
                    Recent Results
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-600">
                  Latest academic records
                </p>
              </div>

              <a
                href="/faculty/results"
                className="text-xs font-medium text-violet-300 transition hover:text-violet-200"
              >
                Manage
              </a>
            </div>

            <div className="mt-5 space-y-3">
              {recentResults.length === 0 ? (
                <div className="rounded-2xl border border-white/8 bg-black/20 p-6 text-center text-sm text-slate-600">
                  No result records available.
                </div>
              ) : (
                recentResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center gap-4 rounded-2xl border border-white/7 bg-black/15 p-4 transition hover:border-violet-400/15 hover:bg-violet-400/[0.025]"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-xs font-bold ${
                        result.grade === "F"
                          ? "border-red-400/15 bg-red-400/[0.05] text-red-300"
                          : "border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-300"
                      }`}
                    >
                      {result.grade.replace("_", "+")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {result.course?.title ||
                          result.course?.name ||
                          result.course?.code ||
                          "Course"}
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        {result.marks}% · {result.gradePoint.toFixed(2)} point
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Score
                      </p>
                      <p className="mt-1 text-sm font-semibold text-cyan-300">
                        {result.marks}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.section>
        </div>

        {/* ATTENDANCE BREAKDOWN */}
        <motion.section
          variants={itemVariants}
          className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl sm:p-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Activity size={17} className="text-emerald-300" />
                <h2 className="text-base font-semibold text-white">
                  Attendance Overview
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-600">
                Current attendance records available to your faculty account
              </p>
            </div>

            <a
              href="/faculty/attendance"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-emerald-400/20 hover:text-emerald-300"
            >
              Open Attendance
              <ChevronRight size={14} />
            </a>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.035] p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                Present
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-300">
                {presentCount}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.035] p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                Late
              </p>
              <p className="mt-2 text-2xl font-semibold text-amber-300">
                {lateCount}
              </p>
            </div>

            <div className="rounded-2xl border border-red-400/10 bg-red-400/[0.035] p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                Absent
              </p>
              <p className="mt-2 text-2xl font-semibold text-red-300">
                {absentCount}
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.main>
  );
}