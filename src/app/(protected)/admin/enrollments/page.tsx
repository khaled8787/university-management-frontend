"use client";

import { useMemo, useState } from "react";

import {
  AnimatePresence,
  motion,
  type Variants,
} from "framer-motion";

import {
  AlertCircle,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  LoaderCircle,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
  XCircle,
} from "lucide-react";

import {
  useEnrollment,
  useEnrollments,
  useUpdateEnrollmentStatus,
  type Enrollment,
  type EnrollmentStatus,
} from "@/hooks/api/useEnrollments";

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },

  show: {
    opacity: 1,
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
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

function getStudentName(
  enrollment: Enrollment,
) {
  return (
    enrollment.student?.name ||
    enrollment.student?.user?.name ||
    enrollment.student?.studentId ||
    enrollment.studentId
  );
}

function getStudentEmail(
  enrollment: Enrollment,
) {
  return (
    enrollment.student?.email ||
    enrollment.student?.user?.email ||
    "Email unavailable"
  );
}

function getCourseTitle(
  enrollment: Enrollment,
) {
  return (
    enrollment.course?.title ||
    enrollment.course?.name ||
    enrollment.course?.code ||
    enrollment.courseId
  );
}

function getCourseCode(
  enrollment: Enrollment,
) {
  return (
    enrollment.course?.code ||
    enrollment.courseId
  );
}

function formatDate(date?: string) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

function getStatusStyle(
  status: EnrollmentStatus,
) {
  switch (status) {
    case "APPROVED":
      return {
        className:
          "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        icon: CheckCircle2,
      };

    case "REJECTED":
      return {
        className:
          "border-red-400/20 bg-red-400/10 text-red-300",
        icon: XCircle,
      };

    default:
      return {
        className:
          "border-amber-400/20 bg-amber-400/10 text-amber-300",
        icon: Clock3,
      };
  }
}

function StatusBadge({
  status,
}: {
  status: EnrollmentStatus;
}) {
  const config = getStatusStyle(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${config.className}`}
    >
      <Icon className="size-3" />
      {status}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  glow,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  glow: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20"
    >
      <div
        className={`absolute -right-10 -top-10 size-28 rounded-full blur-3xl ${glow}`}
      />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Icon className="size-5 text-cyan-300" />
          </div>

          <ChevronRight className="size-4 text-slate-700 transition group-hover:text-cyan-400" />
        </div>

        <p className="text-3xl font-bold tracking-tight text-white">
          {value}
        </p>

        <p className="mt-1 text-sm text-slate-400">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

function Modal({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
        onMouseDown={(event) => {
          if (
            event.target === event.currentTarget
          ) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 20,
          }}
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-cyan-400/15 bg-[#080d19]/95 shadow-[0_0_100px_rgba(34,211,238,0.08)] backdrop-blur-2xl"
        >
          <div className="flex items-start justify-between border-b border-white/10 p-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {title}
              </h2>

              {description && (
                <p className="mt-1 text-sm text-slate-400">
                  {description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="p-6">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function EnrollmentSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map(
        (_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-3xl border border-white/10 bg-white/[0.035] p-5"
          >
            <div className="flex gap-4">
              <div className="size-11 rounded-2xl bg-white/10" />

              <div className="flex-1">
                <div className="h-4 w-48 rounded bg-white/10" />
                <div className="mt-2 h-3 w-64 rounded bg-white/5" />
              </div>

              <div className="h-7 w-24 rounded-full bg-white/10" />
            </div>
          </div>
        ),
      )}
    </div>
  );
}

function EnrollmentDetails({
  enrollmentId,
  onClose,
}: {
  enrollmentId: string;
  onClose: () => void;
}) {
  const {
    data: enrollment,
    isLoading,
    isError,
  } = useEnrollment(enrollmentId);

  if (isLoading) {
    return (
      <Modal
        title="Enrollment Intelligence"
        onClose={onClose}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-20 rounded-2xl bg-white/5" />
          <div className="h-24 rounded-2xl bg-white/5" />
          <div className="h-24 rounded-2xl bg-white/5" />
        </div>
      </Modal>
    );
  }

  if (isError || !enrollment) {
    return (
      <Modal
        title="Enrollment unavailable"
        onClose={onClose}
      >
        <div className="rounded-2xl border border-red-400/10 bg-red-400/5 p-5 text-sm text-red-300">
          Enrollment details could not be loaded.
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Enrollment Intelligence"
      description="Complete enrollment profile"
      onClose={onClose}
    >
      <div className="space-y-5">
        <div className="rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.08] via-blue-500/[0.04] to-purple-500/[0.08] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
                Enrollment ID
              </p>

              <p className="mt-2 break-all font-mono text-sm text-white">
                {enrollment.id}
              </p>
            </div>

            <StatusBadge
              status={enrollment.status}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
              <UserRound className="size-5" />
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Student
            </p>

            <p className="mt-1 font-semibold text-white">
              {getStudentName(enrollment)}
            </p>

            <p className="mt-1 break-all text-xs text-slate-500">
              {getStudentEmail(enrollment)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-400/10 text-purple-300">
              <BookOpen className="size-5" />
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Course
            </p>

            <p className="mt-1 font-semibold text-white">
              {getCourseTitle(enrollment)}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {getCourseCode(enrollment)}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <InfoItem
            label="Created"
            value={formatDate(
              enrollment.createdAt,
            )}
          />

          <InfoItem
            label="Last Updated"
            value={formatDate(
              enrollment.updatedAt,
            )}
          />

          <InfoItem
            label="Student ID"
            value={
              enrollment.student?.studentId ||
              enrollment.studentId
            }
          />

          <InfoItem
            label="Course ID"
            value={enrollment.courseId}
          />
        </div>
      </div>
    </Modal>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-medium text-slate-200">
        {value || "—"}
      </p>
    </div>
  );
}

export default function AdminEnrollmentsPage() {
  const [statusFilter, setStatusFilter] =
    useState<EnrollmentStatus | undefined>();

  const {
    data: enrollments = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useEnrollments(statusFilter);

  const updateMutation =
    useUpdateEnrollmentStatus();

  const [search, setSearch] = useState("");
  const [selectedEnrollmentId, setSelectedEnrollmentId] =
    useState<string | null>(null);

  const filteredEnrollments = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return enrollments;
    }

    return enrollments.filter(
      (enrollment) => {
        const values = [
          enrollment.id,
          enrollment.studentId,
          enrollment.courseId,
          getStudentName(enrollment),
          getStudentEmail(enrollment),
          getCourseTitle(enrollment),
          getCourseCode(enrollment),
          enrollment.status,
        ];

        return values.some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
        );
      },
    );
  }, [enrollments, search]);

  const pendingCount = enrollments.filter(
    (item) => item.status === "PENDING",
  ).length;

  const approvedCount = enrollments.filter(
    (item) => item.status === "APPROVED",
  ).length;

  const rejectedCount = enrollments.filter(
    (item) => item.status === "REJECTED",
  ).length;

  const handleStatusChange = async (
    enrollment: Enrollment,
    status: EnrollmentStatus,
  ) => {
    if (enrollment.status === status) {
      return;
    }

    await updateMutation.mutateAsync({
      id: enrollment.id,
      status,
    });
  };

  return (
    <main className="min-h-full overflow-hidden">
      <div className="relative">
        <div className="pointer-events-none absolute -left-40 top-0 size-96 rounded-full bg-cyan-500/[0.06] blur-[120px]" />

        <div className="pointer-events-none absolute right-0 top-96 size-96 rounded-full bg-purple-500/[0.05] blur-[120px]" />

        <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          {/* HEADER */}
          <motion.section
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="mb-8"
          >
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
            >
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                  <ShieldCheck className="size-3.5" />
                  Academic Operations
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Enrollment{" "}
                  <span className="gradient-text">
                    Command Center
                  </span>
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                  Monitor student course registrations,
                  review requests and control enrollment
                  status from one centralized workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-slate-200 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.06] disabled:opacity-50"
              >
                <Clock3
                  className={
                    isFetching
                      ? "size-4 animate-spin"
                      : "size-4"
                  }
                />
                Refresh Data
              </button>
            </motion.div>

            {/* STATS */}
            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={Users}
                label="Total Enrollments"
                value={enrollments.length}
                glow="bg-cyan-400/20"
              />

              <StatCard
                icon={Clock3}
                label="Pending Review"
                value={pendingCount}
                glow="bg-amber-400/20"
              />

              <StatCard
                icon={CheckCircle2}
                label="Approved"
                value={approvedCount}
                glow="bg-emerald-400/20"
              />

              <StatCard
                icon={XCircle}
                label="Rejected"
                value={rejectedCount}
                glow="bg-red-400/20"
              />
            </div>
          </motion.section>

          {/* FILTER BAR */}
          <motion.section
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="mb-6"
          >
            <motion.div
              variants={itemVariants}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-3 xl:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value,
                      )
                    }
                    placeholder="Search student, email, course or enrollment ID..."
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/30"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 xl:pb-0">
                  <FilterButton
                    active={
                      statusFilter === undefined
                    }
                    onClick={() =>
                      setStatusFilter(undefined)
                    }
                  >
                    All
                  </FilterButton>

                  <FilterButton
                    active={
                      statusFilter === "PENDING"
                    }
                    onClick={() =>
                      setStatusFilter("PENDING")
                    }
                  >
                    Pending
                  </FilterButton>

                  <FilterButton
                    active={
                      statusFilter === "APPROVED"
                    }
                    onClick={() =>
                      setStatusFilter("APPROVED")
                    }
                  >
                    Approved
                  </FilterButton>

                  <FilterButton
                    active={
                      statusFilter === "REJECTED"
                    }
                    onClick={() =>
                      setStatusFilter("REJECTED")
                    }
                  >
                    Rejected
                  </FilterButton>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* CONTENT */}
          {isLoading ? (
            <EnrollmentSkeleton />
          ) : isError ? (
            <div className="rounded-3xl border border-red-400/10 bg-red-400/[0.04] p-10 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">
                <AlertCircle className="size-6" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-white">
                Enrollment data unavailable
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                The enrollment registry could not be
                loaded from the university API.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-6 rounded-xl bg-red-400/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/15"
              >
                Try Again
              </button>
            </div>
          ) : filteredEnrollments.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-12 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-cyan-400/[0.07] text-cyan-300">
                <Search className="size-7" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-white">
                No enrollments found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                No enrollment records match your
                current filters.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <motion.div
                initial="hidden"
                animate="show"
                variants={containerVariants}
                className="hidden overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] backdrop-blur-xl lg:block"
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.025]">
                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                          Student
                        </th>

                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                          Course
                        </th>

                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                          Status
                        </th>

                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                          Created
                        </th>

                        <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredEnrollments.map(
                        (enrollment) => (
                          <motion.tr
                            key={enrollment.id}
                            variants={itemVariants}
                            className="group border-b border-white/[0.06] transition hover:bg-cyan-400/[0.025]"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
                                  <UserRound className="size-4" />
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-white">
                                    {getStudentName(
                                      enrollment,
                                    )}
                                  </p>

                                  <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-500">
                                    {getStudentEmail(
                                      enrollment,
                                    )}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-xl bg-purple-400/10 text-purple-300">
                                  <BookOpen className="size-4" />
                                </div>

                                <div>
                                  <p className="text-sm font-medium text-slate-200">
                                    {getCourseTitle(
                                      enrollment,
                                    )}
                                  </p>

                                  <p className="mt-0.5 text-xs text-slate-600">
                                    {getCourseCode(
                                      enrollment,
                                    )}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <StatusBadge
                                status={
                                  enrollment.status
                                }
                              />
                            </td>

                            <td className="px-6 py-5">
                              <p className="text-xs text-slate-400">
                                {formatDate(
                                  enrollment.createdAt,
                                )}
                              </p>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedEnrollmentId(
                                      enrollment.id,
                                    )
                                  }
                                  className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
                                  title="View details"
                                >
                                  <ChevronRight className="size-4" />
                                </button>

                                <StatusActions
                                  enrollment={
                                    enrollment
                                  }
                                  onChange={
                                    handleStatusChange
                                  }
                                  loading={
                                    updateMutation.isPending
                                  }
                                />
                              </div>
                            </td>
                          </motion.tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* MOBILE */}
              <motion.div
                initial="hidden"
                animate="show"
                variants={containerVariants}
                className="grid gap-4 lg:hidden"
              >
                {filteredEnrollments.map(
                  (enrollment) => (
                    <motion.article
                      key={enrollment.id}
                      variants={itemVariants}
                      className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
                            <UserRound className="size-5" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {getStudentName(
                                enrollment,
                              )}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                              {getStudentEmail(
                                enrollment,
                              )}
                            </p>
                          </div>
                        </div>

                        <StatusBadge
                          status={enrollment.status}
                        />
                      </div>

                      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="flex items-center gap-3">
                          <BookOpen className="size-4 text-purple-300" />

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-200">
                              {getCourseTitle(
                                enrollment,
                              )}
                            </p>

                            <p className="text-xs text-slate-600">
                              {getCourseCode(
                                enrollment,
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                        <span>
                          {formatDate(
                            enrollment.createdAt,
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedEnrollmentId(
                              enrollment.id,
                            )
                          }
                          className="flex items-center gap-1 text-cyan-300"
                        >
                          Details
                          <ChevronRight className="size-3.5" />
                        </button>
                      </div>

                      <div className="mt-4">
                        <StatusActions
                          enrollment={enrollment}
                          onChange={
                            handleStatusChange
                          }
                          loading={
                            updateMutation.isPending
                          }
                          mobile
                        />
                      </div>
                    </motion.article>
                  ),
                )}
              </motion.div>
            </>
          )}

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-600">
            <GraduationCap className="size-3.5" />
            Enrollment registry synchronized with university API
          </div>
        </div>
      </div>

      {selectedEnrollmentId && (
        <EnrollmentDetails
          enrollmentId={
            selectedEnrollmentId
          }
          onClose={() =>
            setSelectedEnrollmentId(null)
          }
        />
      )}
    </main>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 whitespace-nowrap rounded-xl border px-4 text-xs font-semibold transition ${
        active
          ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
          : "border-white/10 bg-white/[0.03] text-slate-500 hover:bg-white/[0.06] hover:text-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

function StatusActions({
  enrollment,
  onChange,
  loading,
  mobile = false,
}: {
  enrollment: Enrollment;
  onChange: (
    enrollment: Enrollment,
    status: EnrollmentStatus,
  ) => void;
  loading: boolean;
  mobile?: boolean;
}) {
  return (
    <div
      className={`flex gap-2 ${
        mobile
          ? "w-full"
          : ""
      }`}
    >
      <button
        type="button"
        disabled={
          loading ||
          enrollment.status === "APPROVED"
        }
        onClick={() =>
          onChange(
            enrollment,
            "APPROVED",
          )
        }
        className={`flex items-center justify-center gap-1.5 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.06] text-xs font-medium text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-30 ${
          mobile
            ? "h-10 flex-1"
            : "size-9"
        }`}
        title="Approve enrollment"
      >
        {loading ? (
          <LoaderCircle className="size-3.5 animate-spin" />
        ) : (
          <Check className="size-3.5" />
        )}

        {mobile && "Approve"}
      </button>

      <button
        type="button"
        disabled={
          loading ||
          enrollment.status === "REJECTED"
        }
        onClick={() =>
          onChange(
            enrollment,
            "REJECTED",
          )
        }
        className={`flex items-center justify-center gap-1.5 rounded-xl border border-red-400/10 bg-red-400/[0.06] text-xs font-medium text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-30 ${
          mobile
            ? "h-10 flex-1"
            : "size-9"
        }`}
        title="Reject enrollment"
      >
        <XCircle className="size-3.5" />

        {mobile && "Reject"}
      </button>

      {mobile &&
        enrollment.status !==
          "PENDING" && (
          <button
            type="button"
            disabled={loading}
            onClick={() =>
              onChange(
                enrollment,
                "PENDING",
              )
            }
            className="h-10 flex-1 rounded-xl border border-amber-400/10 bg-amber-400/[0.06] text-xs font-medium text-amber-300 transition hover:bg-amber-400/10 disabled:opacity-30"
          >
            Reset
          </button>
        )}
    </div>
  );
}