"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

import {
  Activity,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
  X,
  XCircle,
} from "lucide-react";

import {
  useAttendance,
  useAttendances,
  useDeleteAttendance,
  useUpdateAttendance,
  type Attendance,
  type AttendanceStatus,
} from "@/hooks/api/useAttendance";

const STATUS_OPTIONS: Array<
  AttendanceStatus | "ALL"
> = [
  "ALL",
  "PRESENT",
  "ABSENT",
  "LATE",
];

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

function formatDate(date?: string) {
  if (!date) return "—";

  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
    },
  ).format(new Date(date));
}

function getStudentName(
  attendance: Attendance,
) {
  return (
    attendance.student?.name ||
    attendance.student?.email ||
    attendance.studentId
  );
}

function getCourseName(
  attendance: Attendance,
) {
  if (attendance.course?.code) {
    return attendance.course.code;
  }

  return (
    attendance.course?.title ||
    attendance.course?.name ||
    attendance.courseId
  );
}

function getStatusClasses(
  status: AttendanceStatus,
) {
  switch (status) {
    case "PRESENT":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

    case "ABSENT":
      return "border-rose-400/20 bg-rose-400/10 text-rose-300";

    case "LATE":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";

    default:
      return "border-white/10 bg-white/5 text-white/70";
  }
}

function StatusIcon({
  status,
}: {
  status: AttendanceStatus;
}) {
  if (status === "PRESENT") {
    return <CheckCircle2 size={14} />;
  }

  if (status === "ABSENT") {
    return <XCircle size={14} />;
  }

  return <Clock3 size={14} />;
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl"
    >
      <div
        className={`absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl ${accent}`}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
            {label}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-cyan-300">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function AttendanceSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map(
        (_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-2xl border border-white/5 bg-white/[0.025]"
          />
        ),
      )}
    </div>
  );
}

export default function AdminAttendancePage() {
  const reduceMotion = useReducedMotion();

  const [status, setStatus] =
    useState<AttendanceStatus | "ALL">(
      "ALL",
    );

  const [search, setSearch] =
    useState("");

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  const [editStatus, setEditStatus] =
    useState<AttendanceStatus>("PRESENT");

  const [editRemarks, setEditRemarks] =
    useState("");

  const currentFilter =
    status === "ALL"
      ? undefined
      : status;

  const {
    data: attendances = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } =
    useAttendances(currentFilter);

  const selectedAttendance =
    useAttendance(selectedId);

  const updateMutation =
    useUpdateAttendance();

  const deleteMutation =
    useDeleteAttendance();

  const filteredAttendances =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) return attendances;

      return attendances.filter(
        (attendance) => {
          return [
            attendance.id,
            attendance.studentId,
            attendance.courseId,
            attendance.facultyId,
            attendance.student?.name,
            attendance.student?.email,
            attendance.student?.studentId,
            attendance.course?.code,
            attendance.course?.title,
            attendance.faculty?.name,
            attendance.faculty?.employeeId,
            attendance.status,
            attendance.remarks,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(query),
            );
        },
      );
    }, [attendances, search]);

  const stats = useMemo(
    () => ({
      total: attendances.length,
      present: attendances.filter(
        (item) =>
          item.status === "PRESENT",
      ).length,
      absent: attendances.filter(
        (item) =>
          item.status === "ABSENT",
      ).length,
      late: attendances.filter(
        (item) =>
          item.status === "LATE",
      ).length,
    }),
    [attendances],
  );

  const openEdit = (
    attendance: Attendance,
  ) => {
    setEditingId(attendance.id);
    setEditStatus(attendance.status);
    setEditRemarks(
      attendance.remarks ?? "",
    );
  };

  const closeEdit = () => {
    if (updateMutation.isPending) return;

    setEditingId(null);
    setEditRemarks("");
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    await updateMutation.mutateAsync({
      id: editingId,
      status: editStatus,
      remarks: editRemarks.trim(),
    });

    closeEdit();
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    await deleteMutation.mutateAsync(
      deleteId,
    );

    if (selectedId === deleteId) {
      setSelectedId(null);
    }

    setDeleteId(null);
  };

  const animationProps = reduceMotion
    ? {}
    : {
        variants: itemVariants,
      };

  return (
    <main className="min-h-full space-y-6">
      {/* Header */}
      <motion.section
        initial={
          reduceMotion
            ? undefined
            : { opacity: 0, y: -15 }
        }
        animate={
          reduceMotion
            ? undefined
            : { opacity: 1, y: 0 }
        }
        className="relative overflow-hidden rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.08] via-transparent to-violet-500/[0.08] p-6 md:p-8"
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
              <Activity size={14} />
              Academic tracking
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Attendance{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50 md:text-base">
              Monitor attendance records,
              identify irregularities and
              keep academic participation
              under control.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                isFetching
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.07,
            },
          },
        }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label="Records loaded"
          value={stats.total}
          icon={<CalendarDays size={20} />}
          accent="bg-cyan-400/20"
        />

        <StatCard
          label="Present"
          value={stats.present}
          icon={<CheckCircle2 size={20} />}
          accent="bg-emerald-400/20"
        />

        <StatCard
          label="Absent"
          value={stats.absent}
          icon={<XCircle size={20} />}
          accent="bg-rose-400/20"
        />

        <StatCard
          label="Late"
          value={stats.late}
          icon={<Clock3 size={20} />}
          accent="bg-amber-400/20"
        />
      </motion.section>

      {/* Controls */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search student, course, faculty..."
              className="h-11 w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setStatus(option)
                  }
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    status === option
                      ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                      : "border-white/10 bg-white/[0.03] text-white/45 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {option}
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <motion.section
        initial="hidden"
        animate="show"
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] backdrop-blur-xl"
      >
        {isLoading ? (
          <div className="p-5">
            <AttendanceSkeleton />
          </div>
        ) : isError ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-rose-300">
              <AlertCircle size={26} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-white">
              Unable to load attendance
            </h3>

            <p className="mt-2 max-w-md text-sm text-white/40">
              {error instanceof Error
                ? error.message
                : "Something went wrong while loading attendance records."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Try again
            </button>
          </div>
        ) : filteredAttendances.length ===
          0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-cyan-300">
              <CalendarDays size={26} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-white">
              No attendance records
            </h3>

            <p className="mt-2 max-w-md text-sm text-white/40">
              No records match the current
              search or status filter.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-left">
                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                      Student
                    </th>

                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                      Course
                    </th>

                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                      Date
                    </th>

                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAttendances.map(
                    (attendance) => (
                      <motion.tr
                        key={attendance.id}
                        {...animationProps}
                        className="border-b border-white/5 transition hover:bg-white/[0.035]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/5 text-cyan-300">
                              <UserCheck size={18} />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-white">
                                {getStudentName(
                                  attendance,
                                )}
                              </p>

                              <p className="mt-0.5 text-xs text-white/30">
                                {attendance.student
                                  ?.studentId ||
                                  attendance.studentId}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-white/80">
                            {getCourseName(
                              attendance,
                            )}
                          </p>

                          <p className="mt-0.5 text-xs text-white/30">
                            {attendance.faculty
                              ?.name ||
                              attendance.facultyId}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-white/55">
                          {formatDate(
                            attendance.date,
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                              attendance.status,
                            )}`}
                          >
                            <StatusIcon
                              status={
                                attendance.status
                              }
                            />

                            {attendance.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedId(
                                  attendance.id,
                                )
                              }
                              className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/50 transition hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-cyan-300"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openEdit(
                                  attendance,
                                )
                              }
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60 transition hover:bg-white/10 hover:text-white"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteId(
                                  attendance.id,
                                )
                              }
                              className="rounded-lg border border-rose-400/10 bg-rose-400/5 p-2 text-rose-300 transition hover:bg-rose-400/10"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="space-y-3 p-4 md:hidden">
              {filteredAttendances.map(
                (attendance) => (
                  <motion.div
                    key={attendance.id}
                    {...animationProps}
                    className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">
                          {getStudentName(
                            attendance,
                          )}
                        </p>

                        <p className="mt-1 text-xs text-white/35">
                          {getCourseName(
                            attendance,
                          )}
                        </p>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium ${getStatusClasses(
                          attendance.status,
                        )}`}
                      >
                        <StatusIcon
                          status={
                            attendance.status
                          }
                        />

                        {attendance.status}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="text-xs text-white/35">
                        {formatDate(
                          attendance.date,
                        )}
                      </span>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedId(
                              attendance.id,
                            )
                          }
                          className="rounded-lg border border-white/10 p-2 text-white/50"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openEdit(
                              attendance,
                            )
                          }
                          className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/60"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteId(
                              attendance.id,
                            )
                          }
                          className="rounded-lg border border-rose-400/10 p-2 text-rose-300"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ),
              )}
            </div>
          </>
        )}
      </motion.section>

      {/* View modal */}
      {selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#080d18] p-6 shadow-2xl shadow-cyan-950/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/60">
                  Attendance record
                </p>

                <h2 className="mt-2 text-xl font-semibold text-white">
                  Attendance Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedId(null)
                }
                className="rounded-xl border border-white/10 p-2 text-white/50 hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {selectedAttendance.isLoading ? (
              <div className="mt-6 space-y-3">
                <div className="h-14 animate-pulse rounded-xl bg-white/5" />
                <div className="h-14 animate-pulse rounded-xl bg-white/5" />
                <div className="h-14 animate-pulse rounded-xl bg-white/5" />
              </div>
            ) : selectedAttendance.data ? (
              <div className="mt-6 space-y-3">
                <DetailRow
                  label="Student"
                  value={getStudentName(
                    selectedAttendance.data,
                  )}
                />

                <DetailRow
                  label="Course"
                  value={getCourseName(
                    selectedAttendance.data,
                  )}
                />

                <DetailRow
                  label="Faculty"
                  value={
                    selectedAttendance.data
                      .faculty?.name ||
                    selectedAttendance.data
                      .facultyId
                  }
                />

                <DetailRow
                  label="Date"
                  value={formatDate(
                    selectedAttendance.data
                      .date,
                  )}
                />

                <DetailRow
                  label="Status"
                  value={
                    selectedAttendance.data
                      .status
                  }
                />

                <DetailRow
                  label="Remarks"
                  value={
                    selectedAttendance.data
                      .remarks || "No remarks"
                  }
                />
              </div>
            ) : (
              <p className="mt-6 text-sm text-rose-300">
                Failed to load attendance
                details.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#080d18] p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/60">
                  Modify record
                </p>

                <h2 className="mt-2 text-xl font-semibold text-white">
                  Update Attendance
                </h2>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                className="rounded-xl border border-white/10 p-2 text-white/50 hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                  Status
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      "PRESENT",
                      "ABSENT",
                      "LATE",
                    ] as AttendanceStatus[]
                  ).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setEditStatus(item)
                      }
                      className={`rounded-xl border px-3 py-3 text-xs font-medium transition ${
                        editStatus === item
                          ? getStatusClasses(
                              item,
                            )
                          : "border-white/10 bg-white/[0.03] text-white/40"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                  Remarks
                </label>

                <textarea
                  value={editRemarks}
                  onChange={(event) =>
                    setEditRemarks(
                      event.target.value,
                    )
                  }
                  rows={4}
                  placeholder="Add attendance remarks..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-cyan-400/40"
                />
              </div>

              <button
                type="button"
                onClick={handleUpdate}
                disabled={
                  updateMutation.isPending
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl border border-rose-400/10 bg-[#080d18] p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-400/10 text-rose-300">
              <Trash2 size={22} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-white">
              Delete attendance?
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/40">
              This attendance record will be
              permanently removed.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeleteId(null)
                }
                disabled={
                  deleteMutation.isPending
                }
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60 hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={
                  deleteMutation.isPending
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500/90 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-500 disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={16} />
                )}

                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.025] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm text-white/80">
        {value}
      </p>
    </div>
  );
}