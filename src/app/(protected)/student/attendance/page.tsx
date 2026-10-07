"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  LoaderCircle,
  RefreshCw,
  Search,
  Sparkles,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  useMyAttendance,
  type Attendance,
  type AttendanceStatus,
} from "@/hooks/api/useAttendance";
import { getApiErrorMessage } from "@/lib/api";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
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

const statusConfig: Record<
  AttendanceStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    className: string;
    dot: string;
  }
> = {
  PRESENT: {
    label: "Present",
    icon: CheckCircle2,
    className:
      "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300",
    dot: "bg-emerald-300",
  },
  ABSENT: {
    label: "Absent",
    icon: XCircle,
    className: "border-red-400/20 bg-red-400/[0.08] text-red-300",
    dot: "bg-red-300",
  },
  LATE: {
    label: "Late",
    icon: Clock3,
    className:
      "border-amber-400/20 bg-amber-400/[0.08] text-amber-300",
    dot: "bg-amber-300",
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

function formatFullDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function StatusBadge({
  status,
}: {
  status: AttendanceStatus;
}) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] ${config.className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${config.dot} shadow-[0_0_10px_currentColor]`}
      />

      <Icon className="h-3.5 w-3.5" />

      {config.label}
    </span>
  );
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: typeof GraduationCap;
  iconClass: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl"
    >
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl opacity-10 transition-opacity duration-500 group-hover:opacity-25 ${iconClass}`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
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
  const course = attendance.course;

  return (
    <motion.button
      variants={itemVariants}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onOpen(attendance)}
      className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 text-left backdrop-blur-xl transition-colors duration-300 hover:border-cyan-400/20 hover:bg-white/[0.04]"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.07]">
            <GraduationCap className="h-5 w-5 text-cyan-300" />
          </div>

          <StatusBadge status={attendance.status} />
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/70">
            {course?.code ?? "COURSE"}
          </p>

          <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-white">
            {course?.title ??
              course?.name ??
              "Unknown course"}
          </h3>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
              Date
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-200">
              {formatDate(attendance.date)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
              Faculty
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-slate-200">
              {attendance.faculty?.name ?? "—"}
            </p>
          </div>
        </div>

        {attendance.remarks && (
          <div className="mt-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex items-start gap-2">
              <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />

              <p className="line-clamp-2 text-xs leading-5 text-slate-500">
                {attendance.remarks}
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(attendance.date)}
          </div>

          <span className="flex items-center gap-1 text-xs font-medium text-cyan-300/80 transition-transform group-hover:translate-x-1">
            View details
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

function AttendanceDetailsModal({
  attendance,
  onClose,
}: {
  attendance: Attendance | null;
  onClose: () => void;
}) {
  if (!attendance) return null;

  const course = attendance.course;
  const faculty = attendance.faculty;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 20,
            scale: 0.97,
          }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/[0.1] bg-[#07111f]/95 shadow-2xl shadow-cyan-950/30"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

          <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300/70">
                Attendance record
              </p>

              <h2 className="mt-1 text-xl font-semibold text-white">
                {course?.code ?? "Course"}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-5 p-6">
            <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.04] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-cyan-300/60">
                    Course
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {course?.title ??
                      course?.name ??
                      "Unknown course"}
                  </h3>

                  <p className="mt-2 text-xs text-slate-500">
                    {formatFullDate(attendance.date)}
                  </p>
                </div>

                <StatusBadge status={attendance.status} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <GraduationCap className="h-4 w-4" />

                  <p className="text-[10px] uppercase tracking-[0.15em]">
                    Course code
                  </p>
                </div>

                <p className="mt-2 font-semibold text-slate-200">
                  {course?.code ?? "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <CalendarDays className="h-4 w-4" />

                  <p className="text-[10px] uppercase tracking-[0.15em]">
                    Attendance date
                  </p>
                </div>

                <p className="mt-2 font-semibold text-slate-200">
                  {formatDate(attendance.date)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <UserRound className="h-4 w-4" />

                  <p className="text-[10px] uppercase tracking-[0.15em]">
                    Faculty
                  </p>
                </div>

                <p className="mt-2 font-semibold text-slate-200">
                  {faculty?.name ?? "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Sparkles className="h-4 w-4" />

                  <p className="text-[10px] uppercase tracking-[0.15em]">
                    Status
                  </p>
                </div>

                <div className="mt-2">
                  <StatusBadge status={attendance.status} />
                </div>
              </div>
            </div>

            {attendance.remarks ? (
              <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                    <FileText className="h-4 w-4 text-cyan-300" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      Faculty remarks
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {attendance.remarks}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4 text-sm text-slate-600">
                No remarks were added for this attendance record.
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function StudentAttendancePage() {
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | AttendanceStatus
  >("ALL");

  const [search, setSearch] = useState("");
  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);

  const {
    data: attendances = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useMyAttendance();

  const filteredAttendances = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return attendances.filter((attendance) => {
      const course = attendance.course;

      const matchesStatus =
        statusFilter === "ALL" ||
        attendance.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableText = [
        course?.code,
        course?.title,
        course?.name,
        attendance.faculty?.name,
        attendance.status,
        attendance.remarks,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [attendances, search, statusFilter]);

  const statistics = useMemo(() => {
    const total = attendances.length;

    const present = attendances.filter(
      (item) => item.status === "PRESENT",
    ).length;

    const absent = attendances.filter(
      (item) => item.status === "ABSENT",
    ).length;

    const late = attendances.filter(
      (item) => item.status === "LATE",
    ).length;

    const attendanceRate =
      total > 0
        ? Math.round(((present + late) / total) * 100)
        : 0;

    return {
      total,
      present,
      absent,
      late,
      attendanceRate,
    };
  }, [attendances]);

  const progressWidth = Math.min(
    100,
    Math.max(0, statistics.attendanceRate),
  );

  return (
    <main className="min-h-screen pb-10">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-gradient-to-br from-cyan-500/[0.08] via-white/[0.02] to-violet-500/[0.06] p-6 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px]" />

        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-[100px]" />

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              Academic attendance
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Your{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                attendance
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Monitor your class participation, review every
              attendance record, and stay aware of your academic
              presence throughout the semester.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/20 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>
      </motion.section>

      {/* Attendance Overview */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="mt-5 overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl sm:p-6"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/70">
              Attendance health
            </p>

            <div className="mt-2 flex items-end gap-3">
              <span className="text-4xl font-semibold tracking-tight text-white">
                {statistics.attendanceRate}%
              </span>

              <span className="mb-1 text-xs text-slate-500">
                participation rate
              </span>
            </div>
          </div>

          <div className="min-w-0 flex-1 lg:max-w-xl">
            <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.13em]">
              <span className="text-slate-600">
                Overall progress
              </span>

              <span className="font-semibold text-cyan-300">
                {statistics.attendanceRate}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full border border-white/[0.06] bg-black/30">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressWidth}%` }}
                transition={{
                  duration: 1,
                  ease: "easeOut",
                }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 shadow-[0_0_18px_rgba(34,211,238,0.25)]"
              />
            </div>

            <p className="mt-2 text-[11px] text-slate-600">
              Present and late records are counted toward participation.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label="Total records"
          value={statistics.total}
          description="Attendance entries"
          icon={GraduationCap}
          iconClass="bg-cyan-400"
        />

        <StatCard
          label="Present"
          value={statistics.present}
          description="Classes attended"
          icon={CheckCircle2}
          iconClass="bg-emerald-400"
        />

        <StatCard
          label="Late"
          value={statistics.late}
          description="Late arrivals"
          icon={Clock3}
          iconClass="bg-amber-400"
        />

        <StatCard
          label="Absent"
          value={statistics.absent}
          description="Missed classes"
          icon={XCircle}
          iconClass="bg-red-400"
        />
      </motion.section>

      {/* Controls */}
      <section className="mt-6 rounded-3xl border border-white/[0.07] bg-white/[0.025] p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search course, faculty or remarks..."
              className="h-11 w-full rounded-2xl border border-white/[0.07] bg-black/20 pl-11 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-600 transition focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ["ALL", "All"],
                ["PRESENT", "Present"],
                ["LATE", "Late"],
                ["ABSENT", "Absent"],
              ] as ["ALL" | AttendanceStatus, string][]
            ).map(([value, label]) => {
              const active = statusFilter === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatusFilter(value)}
                  className={`rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
                    active
                      ? "border-cyan-400/25 bg-cyan-400/[0.1] text-cyan-300"
                      : "border-white/[0.07] bg-white/[0.025] text-slate-500 hover:bg-white/[0.06] hover:text-slate-300"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Records */}
      <section className="mt-6">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5"
              >
                <div className="animate-pulse space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-2xl bg-white/[0.08]" />
                    <div className="h-6 w-24 rounded-full bg-white/[0.08]" />
                  </div>

                  <div className="space-y-3">
                    <div className="h-3 w-20 rounded bg-white/[0.08]" />
                    <div className="h-6 w-3/4 rounded bg-white/[0.08]" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-16 rounded-2xl bg-white/[0.05]" />
                    <div className="h-16 rounded-2xl bg-white/[0.05]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-3xl border border-red-400/15 bg-red-400/[0.04] p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/15 bg-red-400/[0.08]">
              <AlertCircle className="h-5 w-5 text-red-300" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-white">
              Could not load attendance
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {getApiErrorMessage(
                error,
                "Something went wrong while loading your attendance records.",
              )}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.09]"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        ) : filteredAttendances.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
              <CalendarDays className="h-6 w-6 text-slate-500" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              No attendance records found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {search || statusFilter !== "ALL"
                ? "Try changing your search or attendance filter."
                : "Your attendance records will appear here once classes are recorded."}
            </p>

            {(search || statusFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                }}
                className="mt-5 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06] px-4 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/[0.1]"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">
                Showing{" "}
                <span className="text-slate-300">
                  {filteredAttendances.length}
                </span>{" "}
                record
                {filteredAttendances.length === 1 ? "" : "s"}
              </p>

              {isFetching && !isLoading && (
                <LoaderCircle className="h-4 w-4 animate-spin text-cyan-300" />
              )}
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              {filteredAttendances.map((attendance) => (
                <AttendanceCard
                  key={attendance.id}
                  attendance={attendance}
                  onOpen={setSelectedAttendance}
                />
              ))}
            </motion.div>
          </>
        )}
      </section>

      <AttendanceDetailsModal
        attendance={selectedAttendance}
        onClose={() => setSelectedAttendance(null)}
      />
    </main>
  );
}