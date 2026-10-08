
"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  Activity,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Search,
  Users,
  X,
  XCircle,
  ChevronRight,
  BookOpen,
  GraduationCap,
  CalendarCheck,
  ClipboardList,
} from "lucide-react";

import {
  useAttendances,
  type Attendance,
  type AttendanceStatus,
} from "@/hooks/api/useAttendance";
import { getApiErrorMessage } from "@/lib/api";

type StatusFilter = "ALL" | AttendanceStatus;

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const statusConfig: Record<
  AttendanceStatus,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  PRESENT: {
    label: "Present",
    className:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    icon: CheckCircle2,
  },
  ABSENT: {
    label: "Absent",
    className: "border-rose-400/20 bg-rose-400/10 text-rose-300",
    icon: XCircle,
  },
  LATE: {
    label: "Late",
    className: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    icon: Clock3,
  },
};

function formatDate(value?: string) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTime(value?: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStudentName(attendance: Attendance) {
  return (
    attendance.student?.name ||
    attendance.student?.email ||
    attendance.student?.studentId ||
    "Student"
  );
}

function getCourseName(attendance: Attendance) {
  const course = attendance.course;

  if (!course) return "Course unavailable";

  if (course.code && (course.title || course.name)) {
    return `${course.code} · ${course.title || course.name}`;
  }

  return course.title || course.name || course.code || "Course";
}

function AttendanceSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/[0.07]" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-2/3 rounded bg-white/[0.07]" />
              <div className="h-3 w-1/2 rounded bg-white/[0.05]" />
            </div>
          </div>
          <div className="mb-4 h-4 w-3/4 rounded bg-white/[0.07]" />
          <div className="h-10 rounded-xl bg-white/[0.04]" />
        </div>
      ))}
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: typeof Activity;
  accent: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b1220]/80 p-5 transition duration-300 hover:-translate-y-1 hover:border-white/[0.16]"
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl ${accent}`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
          <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <Icon className="h-5 w-5 text-cyan-300" />
        </div>
      </div>
    </motion.div>
  );
}

function AttendanceCard({
  attendance,
  onOpen,
}: {
  attendance: Attendance;
  onOpen: (attendance: Attendance) => void;
}) {
  const config = statusConfig[attendance.status];
  const StatusIcon = config.icon;

  return (
    <motion.article
      variants={itemVariants}
      layout
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b1220]/80 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-[#0d1728]"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/[0.035] blur-3xl transition group-hover:bg-cyan-400/[0.08]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.08]">
              <GraduationCap className="h-5 w-5 text-cyan-300" />
            </div>

            <div className="min-w-0">
              <h3 className="truncate font-semibold text-white">
                {getStudentName(attendance)}
              </h3>
              <p className="mt-1 truncate text-xs text-slate-500">
                {attendance.student?.studentId || "Student record"}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {config.label}
          </span>
        </div>

        <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <BookOpen className="h-4 w-4 shrink-0 text-cyan-300" />
            <span className="truncate">{getCourseName(attendance)}</span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(attendance.date)}
          </div>
        </div>

        {attendance.remarks && (
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-400">
            {attendance.remarks}
          </p>
        )}

        <button
          type="button"
          onClick={() => onOpen(attendance)}
          className="mt-5 flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-300/25 hover:bg-cyan-300/[0.05] hover:text-cyan-200"
        >
          View attendance details
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.article>
  );
}

function AttendanceDetailsModal({
  attendance,
  onClose,
}: {
  attendance: Attendance;
  onClose: () => void;
}) {
  const config = statusConfig[attendance.status];
  const StatusIcon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        key="attendance-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="attendance-modal-title"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0b1220] shadow-2xl shadow-cyan-950/30"
        >
          <div className="relative overflow-hidden border-b border-white/[0.08] p-6">
            <div className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-cyan-400/[0.10] blur-3xl" />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.07] px-3 py-1.5 text-xs text-cyan-200">
                  <ClipboardList className="h-3.5 w-3.5" />
                  Attendance record
                </div>

                <h2
                  id="attendance-modal-title"
                  className="text-xl font-semibold text-white"
                >
                  Attendance details
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Review the recorded attendance information.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4 p-6">
            <div className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/[0.08]">
                <GraduationCap className="h-6 w-6 text-cyan-300" />
              </div>

              <div className="min-w-0">
                <p className="font-medium text-white">
                  {getStudentName(attendance)}
                </p>
                <p className="mt-1 break-all text-sm text-slate-500">
                  {attendance.student?.email || "Email unavailable"}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.07] p-4">
                <p className="text-xs text-slate-500">Attendance status</p>
                <span
                  className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${config.className}`}
                >
                  <StatusIcon className="h-4 w-4" />
                  {config.label}
                </span>
              </div>

              <div className="rounded-xl border border-white/[0.07] p-4">
                <p className="text-xs text-slate-500">Attendance date</p>
                <p className="mt-3 font-medium text-white">
                  {formatDate(attendance.date)}
                </p>
                {formatTime(attendance.date) && (
                  <p className="mt-1 text-xs text-slate-500">
                    {formatTime(attendance.date)}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.07] p-4">
              <p className="text-xs text-slate-500">Course</p>
              <p className="mt-2 font-medium text-white">
                {getCourseName(attendance)}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.07] p-4">
              <p className="text-xs text-slate-500">Remarks</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                {attendance.remarks || "No remarks were provided."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-300/[0.14]"
            >
              Close details
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function FacultyAttendancePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);

  const queryStatus =
    statusFilter === "ALL" ? undefined : statusFilter;

  const {
    data: attendanceRecords = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAttendances(queryStatus);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return attendanceRecords;

    return attendanceRecords.filter((attendance) => {
      const searchable = [
        getStudentName(attendance),
        attendance.student?.email,
        attendance.student?.studentId,
        getCourseName(attendance),
        attendance.status,
        attendance.remarks,
        attendance.faculty?.name,
      ];

      return searchable.some((value) =>
        value?.toLowerCase().includes(query),
      );
    });
  }, [attendanceRecords, search]);

  const total = attendanceRecords.length;
  const present = attendanceRecords.filter(
    (item) => item.status === "PRESENT",
  ).length;
  const absent = attendanceRecords.filter(
    (item) => item.status === "ABSENT",
  ).length;
  const late = attendanceRecords.filter(
    (item) => item.status === "LATE",
  ).length;

  const attendanceRate =
    total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen space-y-7 pb-10"
    >
      <motion.section
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-[#101c31] via-[#0b1220] to-[#15102a] p-6 sm:p-8 lg:p-10"
      >
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/[0.10] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-1/3 h-64 w-64 rounded-full bg-violet-500/[0.09] blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1.5 text-xs font-medium tracking-wide text-cyan-200">
              <Activity className="h-3.5 w-3.5" />
              FACULTY WORKSPACE / ATTENDANCE
            </div>

            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Attendance{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                Command.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              Monitor student attendance records, review class participation,
              and quickly identify attendance patterns across your available
              records.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-slate-300">
                <CalendarCheck className="h-4 w-4 text-cyan-300" />
                Attendance overview
              </div>

              <button
                type="button"
                onClick={() => void refetch()}
                disabled={isFetching}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] px-4 py-3 text-sm font-medium text-cyan-200 transition hover:bg-cyan-300/[0.14] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh records
              </button>
            </div>
          </div>

          <div className="relative mx-auto flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48">
            <div className="absolute inset-0 rounded-full border border-cyan-300/10" />
            <div className="absolute inset-3 rounded-full border border-dashed border-cyan-300/20" />
            <div className="absolute inset-7 rounded-full bg-gradient-to-br from-cyan-300/15 to-violet-400/10 blur-sm" />
            <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-3xl border border-cyan-300/20 bg-[#0c182a]/90 shadow-[0_0_55px_rgba(34,211,238,0.10)]">
              <Activity className="h-8 w-8 text-cyan-300" />
              <span className="mt-2 text-2xl font-semibold text-white">
                {isLoading ? "—" : `${attendanceRate}%`}
              </span>
              <span className="text-[10px] tracking-widest text-slate-500">
                PRESENT
              </span>
            </div>
            <span className="absolute right-3 top-6 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(103,232,249,0.8)]" />
            <span className="absolute bottom-5 left-5 h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_15px_rgba(196,181,253,0.8)]" />
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Loaded records"
          value={isLoading ? "—" : total}
          subtitle="Records returned by the API"
          icon={Users}
          accent="bg-cyan-400/10"
        />
        <StatCard
          title="Present"
          value={isLoading ? "—" : present}
          subtitle="Marked as present"
          icon={CheckCircle2}
          accent="bg-emerald-400/10"
        />
        <StatCard
          title="Absent"
          value={isLoading ? "—" : absent}
          subtitle="Marked as absent"
          icon={XCircle}
          accent="bg-rose-400/10"
        />
        <StatCard
          title="Late"
          value={isLoading ? "—" : late}
          subtitle="Marked as late"
          icon={Clock3}
          accent="bg-amber-400/10"
        />
      </section>

      <motion.section
        variants={itemVariants}
        className="rounded-2xl border border-white/[0.08] bg-[#0b1220]/75 p-4 sm:p-5"
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Attendance records
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search and filter the records returned by your account.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative sm:min-w-64">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search student or course..."
                aria-label="Search attendance records"
                className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["ALL", "All"],
                  ["PRESENT", "Present"],
                  ["ABSENT", "Absent"],
                  ["LATE", "Late"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatusFilter(value)}
                  className={`rounded-xl border px-3.5 py-2.5 text-xs font-medium transition ${
                    statusFilter === value
                      ? "border-cyan-300/25 bg-cyan-300/[0.10] text-cyan-200"
                      : "border-white/[0.07] bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {isLoading ? (
        <AttendanceSkeleton />
      ) : isError ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.04] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/[0.08]">
            <AlertCircle className="h-6 w-6 text-rose-300" />
          </div>
          <h3 className="mt-4 font-semibold text-white">
            Could not load attendance
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">
            {getApiErrorMessage(
              error,
              "Please check your connection and try again.",
            )}
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-rose-300/20 bg-rose-300/[0.08] px-4 py-2.5 text-sm text-rose-200 transition hover:bg-rose-300/[0.14]"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.05]">
            <ClipboardList className="h-7 w-7 text-cyan-300/70" />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-white">
            {search || statusFilter !== "ALL"
              ? "No matching records"
              : "No attendance records yet"}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {search || statusFilter !== "ALL"
              ? "Try a different search term or select another status."
              : "Attendance records will appear here when the backend returns records available to your account."}
          </p>
          {(search || statusFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
              className="mt-5 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.05]"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3 text-sm">
            <p className="text-slate-400">
              Showing{" "}
              <span className="font-medium text-white">
                {filteredRecords.length}
              </span>{" "}
              loaded record{filteredRecords.length === 1 ? "" : "s"}
            </p>
            <span className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-xs text-slate-500">
              {statusFilter === "ALL"
                ? "All statuses"
                : statusConfig[statusFilter].label}
            </span>
          </div>

          <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="show"
            className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredRecords.map((attendance) => (
                <AttendanceCard
                  key={attendance.id}
                  attendance={attendance}
                  onOpen={setSelectedAttendance}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}

      {selectedAttendance && (
        <AttendanceDetailsModal
          attendance={selectedAttendance}
          onClose={() => setSelectedAttendance(null)}
        />
      )}
    </motion.main>
  );
}
