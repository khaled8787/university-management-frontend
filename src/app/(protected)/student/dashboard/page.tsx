"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  GraduationCap,
  Layers3,
  LoaderCircle,
  Medal,
  Sparkles,
  TrendingUp,
  WalletCards,
  XCircle,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

import { getAuthUser } from "@/lib/auth";
import { getApiErrorMessage } from "@/lib/api";

import { useMyAttendance } from "@/hooks/api/useAttendance";
import { useEnrollments } from "@/hooks/api/useEnrollments";import { useMyResults } from "@/hooks/api/useResults";
import { useMyPayments } from "@/hooks/api/usePayments";

import type { Attendance } from "@/hooks/api/useAttendance";
import type { Enrollment } from "@/hooks/api/useEnrollments";
import type { Result } from "@/hooks/api/useResults";
import type { Payment } from "@/hooks/api/usePayments";

const pageVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
      staggerChildren: 0.08,
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

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatCurrency(
  value: number | string,
  currency = "BDT",
) {
  const amount =
    typeof value === "string"
      ? Number(value)
      : value;

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getEnrollmentStatus(status: string) {
  switch (status) {
    case "APPROVED":
      return {
        label: "Approved",
        className:
          "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        icon: CheckCircle2,
      };

    case "REJECTED":
      return {
        label: "Rejected",
        className:
          "border-rose-400/20 bg-rose-400/10 text-rose-300",
        icon: XCircle,
      };

    default:
      return {
        label: "Pending",
        className:
          "border-amber-400/20 bg-amber-400/10 text-amber-300",
        icon: Clock3,
      };
  }
}

function getAttendanceStatus(status: string) {
  switch (status) {
    case "PRESENT":
      return {
        label: "Present",
        className:
          "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      };

    case "LATE":
      return {
        label: "Late",
        className:
          "border-amber-400/20 bg-amber-400/10 text-amber-300",
      };

    case "EXCUSED":
      return {
        label: "Excused",
        className:
          "border-sky-400/20 bg-sky-400/10 text-sky-300",
      };

    default:
      return {
        label: "Absent",
        className:
          "border-rose-400/20 bg-rose-400/10 text-rose-300",
      };
  }
}

function getPaymentStatus(status: string) {
  switch (status) {
    case "PAID":
      return {
        label: "Paid",
        className:
          "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      };

    case "FAILED":
      return {
        label: "Failed",
        className:
          "border-rose-400/20 bg-rose-400/10 text-rose-300",
      };

    case "CANCELLED":
      return {
        label: "Cancelled",
        className:
          "border-slate-400/20 bg-slate-400/10 text-slate-300",
      };

    default:
      return {
        label: "Pending",
        className:
          "border-amber-400/20 bg-amber-400/10 text-amber-300",
      };
  }
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]"
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="h-96 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
        <div className="h-96 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
      </div>

      <div className="h-72 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
    </div>
  );
}

function StatCard({
  label,
  value,
  caption,
  icon: Icon,
  href,
}: {
  label: string;
  value: string;
  caption: string;
  icon: typeof Activity;
  href?: string;
}) {
  const content = (
    <motion.div
      variants={itemVariants}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl"
    >
      <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl transition-all duration-500 group-hover:bg-cyan-400/20" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {caption}
          </p>
        </div>

        <div className="flex size-11 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
          <Icon className="size-5" />
        </div>
      </div>
    </motion.div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}

function SectionHeader({
  eyebrow,
  title,
  href,
  action,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300/70">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
          {title}
        </h2>
      </div>

      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-cyan-300"
        >
          {action ?? "View all"}
          <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export default function StudentDashboardPage() {
  const reduceMotion = useReducedMotion();

  const user = getAuthUser();

  const {
  data: enrollments = [],
  isLoading: enrollmentsLoading,
  isError: enrollmentsError,
  refetch: refetchEnrollments,
} = useEnrollments();

  const {
    data: attendance = [],
    isLoading: attendanceLoading,
    isError: attendanceError,
    error: attendanceErrorObject,
    refetch: refetchAttendance,
  } = useMyAttendance();

  const {
    data: results = [],
    isLoading: resultsLoading,
    isError: resultsError,
    error: resultsErrorObject,
    refetch: refetchResults,
  } = useMyResults();

  const {
    data: payments = [],
    isLoading: paymentsLoading,
    isError: paymentsError,
    error: paymentsErrorObject,
    refetch: refetchPayments,
  } = useMyPayments();

  const isLoading =
    enrollmentsLoading ||
    attendanceLoading ||
    resultsLoading ||
    paymentsLoading;

  const hasError =
    enrollmentsError ||
    attendanceError ||
    resultsError ||
    paymentsError;

  const errorMessage =
    getApiErrorMessage(
      enrollmentsError ??
        attendanceErrorObject ??
        resultsErrorObject ??
        paymentsErrorObject,
      "Unable to load student dashboard data.",
    );

  const approvedEnrollments = useMemo(
    () =>
      enrollments.filter(
        (item: Enrollment) =>
          item.status === "APPROVED",
      ),
    [enrollments],
  );

  const pendingEnrollments = useMemo(
    () =>
      enrollments.filter(
        (item: Enrollment) =>
          item.status === "PENDING",
      ),
    [enrollments],
  );

  const attendanceStats = useMemo(() => {
    const total = attendance.length;

    const present = attendance.filter(
      (item: Attendance) =>
        item.status === "PRESENT",
    ).length;

    const late = attendance.filter(
      (item: Attendance) =>
        item.status === "LATE",
    ).length;

    const absent = attendance.filter(
      (item: Attendance) =>
        item.status === "ABSENT",
    ).length;

    const percentage =
      total > 0
        ? Math.round(
            ((present + late * 0.5) / total) *
              100,
          )
        : 0;

    return {
      total,
      present,
      late,
      absent,
      percentage,
    };
  }, [attendance]);

  const averageGradePoint = useMemo(() => {
    if (!results.length) return 0;

    const total = results.reduce(
      (sum: number, item: Result) =>
        sum + Number(item.gradePoint || 0),
      0,
    );

    return total / results.length;
  }, [results]);

  const paidAmount = useMemo(() => {
    return payments
      .filter(
        (item: Payment) =>
          item.status === "PAID",
      )
      .reduce(
        (sum: number, item: Payment) =>
          sum + Number(item.amount || 0),
        0,
      );
  }, [payments]);

  const recentResults = useMemo(
    () =>
      [...results]
        .sort(
          (a: Result, b: Result) =>
            new Date(
              b.updatedAt ??
                b.createdAt ??
                0,
            ).getTime() -
            new Date(
              a.updatedAt ??
                a.createdAt ??
                0,
            ).getTime(),
        )
        .slice(0, 5),
    [results],
  );

  const recentAttendance = useMemo(
    () =>
      [...attendance]
        .sort(
          (a: Attendance, b: Attendance) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime(),
        )
        .slice(0, 6),
    [attendance],
  );

  const recentPayments = useMemo(
    () =>
      [...payments]
        .sort(
          (a: Payment, b: Payment) =>
            new Date(
              b.createdAt ?? 0,
            ).getTime() -
            new Date(
              a.createdAt ?? 0,
            ).getTime(),
        )
        .slice(0, 4),
    [payments],
  );

  const refreshAll = async () => {
    await Promise.all([
      refetchEnrollments(),
      refetchAttendance(),
      refetchResults(),
      refetchPayments(),
    ]);
  };

  if (isLoading) {
    return (
      <main className="min-h-full">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <DashboardSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-full overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-cyan-500/[0.07] blur-[120px]" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-purple-500/[0.06] blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-500/[0.05] blur-[120px]" />
      </div>

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="show"
        className="relative mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8"
      >
        {/* Hero */}
        <motion.section
          variants={itemVariants}
          className="relative mb-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-2xl sm:p-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_60%_100%,rgba(168,85,247,0.09),transparent_30%)]" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                <Sparkles className="size-3.5" />
                Student Command Center
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Welcome back,
                <span className="gradient-text ml-2">
                  {user?.name || "Student"}
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Your academic orbit is synchronized.
                Track courses, attendance, results and
                payments from one intelligent workspace.
              </p>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative flex size-36 items-center justify-center rounded-full border border-cyan-300/15 bg-cyan-300/[0.04] shadow-[0_0_80px_rgba(34,211,238,0.12)]">
                <div className="absolute inset-5 rounded-full border border-purple-300/15" />

                <div className="absolute inset-8 rounded-full border border-cyan-300/20" />

                <GraduationCap className="relative size-12 text-cyan-300" />

                <div className="absolute -right-2 top-5 size-2 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />

                <div className="absolute -bottom-1 left-8 size-1.5 rounded-full bg-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Error */}
        {hasError && (
          <motion.div
            variants={itemVariants}
            className="mb-6 flex flex-col gap-4 rounded-2xl border border-rose-400/20 bg-rose-400/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium text-rose-200">
                Dashboard data could not be fully loaded.
              </p>
              <p className="mt-1 text-xs text-rose-300/70">
                {errorMessage}
              </p>
            </div>

            <button
              type="button"
              onClick={refreshAll}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-300/20 bg-rose-300/10 px-4 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-300/15"
            >
              <Activity className="size-4" />
              Retry
            </button>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Active courses"
            value={String(
              approvedEnrollments.length,
            )}
            caption="Approved enrollments"
            icon={BookOpen}
            href="/student/courses"
          />

          <StatCard
            label="Recent attendance"
            value={`${attendanceStats.percentage}%`}
            caption={`${attendanceStats.present} present · ${attendanceStats.absent} absent`}
            icon={Activity}
            href="/student/attendance"
          />

          <StatCard
            label="Average GPA"
            value={
              averageGradePoint
                ? averageGradePoint.toFixed(2)
                : "—"
            }
            caption={`${results.length} recent results`}
            icon={Medal}
            href="/student/results"
          />

          <StatCard
            label="Paid amount"
            value={
              paidAmount
                ? formatCurrency(paidAmount)
                : "৳0"
            }
            caption={`${payments.filter((p) => p.status === "PAID").length} paid transactions`}
            icon={WalletCards}
            href="/student/payments"
          />
        </div>

        {/* Main grid */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          {/* Courses */}
          <motion.section
            variants={itemVariants}
            className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl sm:p-6"
          >
            <SectionHeader
              eyebrow="Academic flow"
              title="My courses"
              href="/student/courses"
              action="Open courses"
            />

            {enrollments.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 px-6 text-center">
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                  <BookOpen className="size-5" />
                </div>

                <p className="text-sm font-medium text-white">
                  No enrollment activity yet
                </p>

                <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                  Your enrolled courses will appear here
                  once you submit an enrollment.
                </p>

                <Link
                  href="/student/enrollment"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-300/15"
                >
                  Browse enrollment
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {enrollments.slice(0, 5).map(
                  (enrollment: Enrollment) => {
                    const status =
                      getEnrollmentStatus(
                        enrollment.status,
                      );

                    const StatusIcon =
                      status.icon;

                    const courseCode =
                      enrollment.course?.code ||
                      "COURSE";

                    const courseTitle =
                      enrollment.course?.title ||
                      enrollment.course?.name ||
                      "Untitled course";

                    return (
                      <motion.div
                        key={enrollment.id}
                        whileHover={{
                          x: reduceMotion ? 0 : 4,
                        }}
                        className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-black/10 p-4 transition-colors hover:border-cyan-300/15 hover:bg-white/[0.04]"
                      >
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-purple-300/15 bg-purple-300/[0.07] text-purple-300">
                          <Layers3 className="size-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-semibold tracking-[0.16em] text-cyan-300">
                              {courseCode}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-medium ${status.className}`}
                            >
                              <StatusIcon className="size-3" />
                              {status.label}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-sm font-medium text-white">
                            {courseTitle}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-500">
                            Enrolled{" "}
                            {formatDate(
                              enrollment.createdAt,
                            )}
                          </p>
                        </div>

                        <ChevronRight className="hidden size-4 text-slate-600 transition-transform group-hover:translate-x-0.5 sm:block" />
                      </motion.div>
                    );
                  },
                )}
              </div>
            )}
          </motion.section>

          {/* Academic pulse */}
          <motion.section
            variants={itemVariants}
            className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl sm:p-6"
          >
            <SectionHeader
              eyebrow="Academic pulse"
              title="Performance snapshot"
            />

            <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.035] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Average grade point
                  </p>

                  <p className="mt-2 text-4xl font-semibold text-white">
                    {averageGradePoint
                      ? averageGradePoint.toFixed(2)
                      : "—"}
                  </p>
                </div>

                <div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                  <TrendingUp className="size-5" />
                </div>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${Math.min(
                      (averageGradePoint / 4) *
                        100,
                      100,
                    )}%`,
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeOut",
                  }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                />
              </div>

              <div className="mt-2 flex justify-between text-[10px] text-slate-600">
                <span>0.00</span>
                <span>4.00</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Pending
                </p>
                <p className="mt-2 text-2xl font-semibold text-amber-300">
                  {pendingEnrollments.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/10 p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Results
                </p>
                <p className="mt-2 text-2xl font-semibold text-cyan-300">
                  {results.length}
                </p>
              </div>
            </div>

            <Link
              href="/student/results"
              className="mt-4 flex items-center justify-between rounded-2xl border border-white/8 bg-black/10 p-4 transition hover:border-cyan-300/15 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-purple-400/10 text-purple-300">
                  <Medal className="size-4" />
                </div>

                <div>
                  <p className="text-xs font-medium text-white">
                    View academic results
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Explore your latest grades
                  </p>
                </div>
              </div>

              <ArrowUpRight className="size-4 text-slate-500" />
            </Link>
          </motion.section>
        </div>

        {/* Attendance + results */}
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          {/* Attendance */}
          <motion.section
            variants={itemVariants}
            className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl sm:p-6"
          >
            <SectionHeader
              eyebrow="Presence matrix"
              title="Recent attendance"
              href="/student/attendance"
            />

            <div className="mb-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Present
                </p>
                <p className="mt-1 text-xl font-semibold text-emerald-300">
                  {attendanceStats.present}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Late
                </p>
                <p className="mt-1 text-xl font-semibold text-amber-300">
                  {attendanceStats.late}
                </p>
              </div>

              <div className="rounded-2xl border border-rose-400/10 bg-rose-400/[0.04] p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Absent
                </p>
                <p className="mt-1 text-xl font-semibold text-rose-300">
                  {attendanceStats.absent}
                </p>
              </div>
            </div>

            {recentAttendance.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
                <CalendarDays className="mx-auto size-7 text-slate-600" />
                <p className="mt-3 text-xs text-slate-500">
                  No attendance records available.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentAttendance.map(
                  (item: Attendance) => {
                    const status =
                      getAttendanceStatus(
                        item.status,
                      );

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/10 px-3 py-3"
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-slate-400">
                          <CalendarDays className="size-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-white">
                            {item.course?.code ||
                              item.course?.title ||
                              "Course"}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-600">
                            {formatDate(item.date)}
                          </p>
                        </div>

                        <span
                          className={`rounded-full border px-2 py-1 text-[9px] font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </motion.section>

          {/* Results */}
          <motion.section
            variants={itemVariants}
            className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl sm:p-6"
          >
            <SectionHeader
              eyebrow="Academic records"
              title="Latest results"
              href="/student/results"
            />

            {recentResults.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
                <Medal className="mx-auto size-7 text-slate-600" />
                <p className="mt-3 text-xs text-slate-500">
                  No result records available yet.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentResults.map(
                  (result: Result) => (
                    <div
                      key={result.id}
                      className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/10 px-4 py-3"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-purple-400/10 text-purple-300">
                        <GraduationCap className="size-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-white">
                          {result.course?.code ||
                            result.course?.title ||
                            "Course"}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                          {result.marks} marks ·{" "}
                          {result.gradePoint} GP
                        </p>
                      </div>

                      <div className="flex size-9 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/10 text-sm font-bold text-cyan-300">
                        {result.grade.replace(
                          "_",
                          "+",
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </motion.section>
        </div>

        {/* Payments */}
        <motion.section
          variants={itemVariants}
          className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl sm:p-6"
        >
          <SectionHeader
            eyebrow="Financial activity"
            title="Recent payments"
            href="/student/payments"
          />

          {recentPayments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
              <CircleDollarSign className="mx-auto size-7 text-slate-600" />
              <p className="mt-3 text-xs text-slate-500">
                No payment transactions available.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {recentPayments.map(
                (payment: Payment) => {
                  const status =
                    getPaymentStatus(
                      payment.status,
                    );

                  return (
                    <div
                      key={payment.id}
                      className="rounded-2xl border border-white/8 bg-black/10 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300">
                          <WalletCards className="size-4" />
                        </div>

                        <span
                          className={`rounded-full border px-2 py-1 text-[9px] font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <p className="mt-4 text-lg font-semibold text-white">
                        {formatCurrency(
                          payment.amount,
                          payment.currency,
                        )}
                      </p>

                      <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-slate-600">
                        {payment.type.replace(
                          "_",
                          " ",
                        )}
                      </p>

                      <p className="mt-3 text-[10px] text-slate-600">
                        {formatDate(
                          payment.createdAt,
                        )}
                      </p>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </motion.section>

        {/* Quick actions */}
        <motion.section
          variants={itemVariants}
          className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            {
              href: "/student/courses",
              icon: BookOpen,
              title: "My Courses",
              caption: "Explore enrolled courses",
            },
            {
              href: "/student/enrollment",
              icon: Layers3,
              title: "Enrollment",
              caption: "Manage course enrollment",
            },
            {
              href: "/student/attendance",
              icon: CalendarDays,
              title: "Attendance",
              caption: "Review attendance records",
            },
            {
              href: "/student/payments",
              icon: WalletCards,
              title: "Payments",
              caption: "Track your transactions",
            },
          ].map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.025] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/15 hover:bg-cyan-300/[0.035]"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.04] text-slate-400 transition-colors group-hover:border-cyan-300/15 group-hover:text-cyan-300">
                  <Icon className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white">
                    {action.title}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-600">
                    {action.caption}
                  </p>
                </div>

                <ArrowUpRight className="size-4 text-slate-700 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-300" />
              </Link>
            );
          })}
        </motion.section>
      </motion.div>
    </main>
  );
}