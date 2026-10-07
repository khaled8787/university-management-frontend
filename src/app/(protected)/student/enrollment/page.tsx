"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  LoaderCircle,
  RefreshCw,
  Search,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  useEnrollments,
  type Enrollment,
  type EnrollmentStatus,
} from "@/hooks/api/useEnrollments";
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

type StatusFilter = "ALL" | EnrollmentStatus;

const statusConfig: Record<
  EnrollmentStatus,
  {
    label: string;
    icon: typeof Clock3;
    className: string;
    dotClass: string;
  }
> = {
  PENDING: {
    label: "Pending",
    icon: Clock3,
    className:
      "border-amber-400/20 bg-amber-400/[0.08] text-amber-300",
    dotClass: "bg-amber-300",
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    className:
      "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300",
    dotClass: "bg-emerald-300",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    className: "border-red-400/20 bg-red-400/[0.08] text-red-300",
    dotClass: "bg-red-300",
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

function StatusBadge({ status }: { status: EnrollmentStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${config.className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${config.dotClass} shadow-[0_0_10px_currentColor]`}
      />
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function EnrollmentSkeleton() {
  return (
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
              <div className="h-4 w-24 rounded bg-white/[0.08]" />
              <div className="h-6 w-3/4 rounded bg-white/[0.08]" />
              <div className="h-3 w-full rounded bg-white/[0.06]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 rounded-2xl bg-white/[0.05]" />
              <div className="h-16 rounded-2xl bg-white/[0.05]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof GraduationCap;
  accent: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl"
    >
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40 ${accent}`}
      />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.05]">
          <Icon className="h-5 w-5 text-cyan-300" />
        </div>
      </div>
    </motion.div>
  );
}

function EnrollmentCard({
  enrollment,
  onOpen,
}: {
  enrollment: Enrollment;
  onOpen: (enrollment: Enrollment) => void;
}) {
  const course = enrollment.course;

  return (
    <motion.button
      variants={itemVariants}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onOpen(enrollment)}
      className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 text-left backdrop-blur-xl transition-colors duration-300 hover:border-cyan-400/20 hover:bg-white/[0.04]"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.07]">
            <BookOpen className="h-5 w-5 text-cyan-300" />
          </div>

          <StatusBadge status={enrollment.status} />
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/70">
            {course?.code ?? "COURSE"}
          </p>

          <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-white">
            {course?.title ?? course?.name ?? "Unknown course"}
          </h3>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
              Credit
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-200">
              {course?.credit ?? "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
              Semester
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-200">
              {course?.semester ?? "—"}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(enrollment.createdAt)}
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

function EnrollmentDetailsModal({
  enrollment,
  onClose,
}: {
  enrollment: Enrollment | null;
  onClose: () => void;
}) {
  if (!enrollment) return null;

  const course = enrollment.course;

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
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/[0.1] bg-[#07111f]/95 shadow-2xl shadow-cyan-950/30"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

          <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300/70">
                Enrollment details
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
                    Course title
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {course?.title ?? course?.name ?? "Unknown course"}
                  </h3>
                </div>

                <StatusBadge status={enrollment.status} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
                  Course code
                </p>
                <p className="mt-2 font-semibold text-slate-200">
                  {course?.code ?? "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
                  Credit
                </p>
                <p className="mt-2 font-semibold text-slate-200">
                  {course?.credit ?? "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
                  Semester
                </p>
                <p className="mt-2 font-semibold text-slate-200">
                  {course?.semester ?? "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
                  Enrolled on
                </p>
                <p className="mt-2 font-semibold text-slate-200">
                  {formatDate(enrollment.createdAt)}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Enrollment status
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your current enrollment state is controlled by the
                    university academic workflow.
                  </p>
                </div>
              </div>
            </div>

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

export default function StudentEnrollmentPage() {
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");
  const [search, setSearch] = useState("");
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);

  const {
    data: enrollments = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useEnrollments();

  const filteredEnrollments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return enrollments.filter((enrollment) => {
      const course = enrollment.course;

      const matchesStatus =
        statusFilter === "ALL" ||
        enrollment.status === statusFilter;

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
        enrollment.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [enrollments, search, statusFilter]);

  const counts = useMemo(() => {
    return {
      total: enrollments.length,
      pending: enrollments.filter(
        (item) => item.status === "PENDING",
      ).length,
      approved: enrollments.filter(
        (item) => item.status === "APPROVED",
      ).length,
      rejected: enrollments.filter(
        (item) => item.status === "REJECTED",
      ).length,
    };
  }, [enrollments]);

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
              Academic enrollment
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Your{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                enrollments
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Track your course enrollment journey, review academic
              status, and keep your semester activity organized from
              one command center.
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

      {/* Stats */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label="Total enrollments"
          value={counts.total}
          icon={GraduationCap}
          accent="bg-cyan-400"
        />

        <StatCard
          label="Approved"
          value={counts.approved}
          icon={CheckCircle2}
          accent="bg-emerald-400"
        />

        <StatCard
          label="Pending"
          value={counts.pending}
          icon={Clock3}
          accent="bg-amber-400"
        />

        <StatCard
          label="Rejected"
          value={counts.rejected}
          icon={XCircle}
          accent="bg-red-400"
        />
      </motion.section>

      {/* Controls */}
      <section className="mt-6 rounded-3xl border border-white/[0.07] bg-white/[0.025] p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by course code or title..."
              className="h-11 w-full rounded-2xl border border-white/[0.07] bg-black/20 pl-11 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-600 transition focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ["ALL", "All"],
                ["APPROVED", "Approved"],
                ["PENDING", "Pending"],
                ["REJECTED", "Rejected"],
              ] as [StatusFilter, string][]
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

      {/* Content */}
      <section className="mt-6">
        {isLoading ? (
          <EnrollmentSkeleton />
        ) : isError ? (
          <div className="rounded-3xl border border-red-400/15 bg-red-400/[0.04] p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/15 bg-red-400/[0.08]">
              <AlertCircle className="h-5 w-5 text-red-300" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-white">
              Could not load enrollments
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {getApiErrorMessage(
                error,
                "Something went wrong while loading your enrollments.",
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
        ) : filteredEnrollments.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
              <BookOpen className="h-6 w-6 text-slate-500" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              No enrollments found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {search || statusFilter !== "ALL"
                ? "Try changing your search or status filter."
                : "Your enrollment activity will appear here once you enroll in a course."}
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
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Showing{" "}
                  <span className="text-slate-300">
                    {filteredEnrollments.length}
                  </span>{" "}
                  enrollment
                  {filteredEnrollments.length === 1 ? "" : "s"}
                </p>
              </div>

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
              {filteredEnrollments.map((enrollment) => (
                <EnrollmentCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  onOpen={setSelectedEnrollment}
                />
              ))}
            </motion.div>
          </>
        )}
      </section>

      <EnrollmentDetailsModal
        enrollment={selectedEnrollment}
        onClose={() => setSelectedEnrollment(null)}
      />
    </main>
  );
}