"use client";

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
  X,
  XCircle,
} from "lucide-react";

import { motion, type Variants } from "framer-motion";
import { useMemo, useState } from "react";

import {
  useAttendance,
  useAttendances,
  useDeleteAttendance,
  useUpdateAttendance,
  type Attendance,
  type AttendanceStatus,
} from "@/hooks/api/useAttendance";

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
    className: string;
    icon: typeof CheckCircle2;
  }
> = {
  PRESENT: {
    label: "Present",
    className:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    icon: CheckCircle2,
  },

  ABSENT: {
    label: "Absent",
    className:
      "border-rose-400/20 bg-rose-400/10 text-rose-300",
    icon: XCircle,
  },

  LATE: {
    label: "Late",
    className:
      "border-amber-400/20 bg-amber-400/10 text-amber-300",
    icon: Clock3,
  },
};

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStudentName(attendance: Attendance) {
  return (
    attendance.student?.name ||
    attendance.student?.email ||
    attendance.studentId
  );
}

function getCourseName(attendance: Attendance) {
  return (
    attendance.course?.title ||
    attendance.course?.name ||
    attendance.course?.code ||
    attendance.courseId
  );
}

function getFacultyName(attendance: Attendance) {
  return (
    attendance.faculty?.name ||
    attendance.faculty?.email ||
    attendance.facultyId
  );
}

export default function AdminAttendancePage() {
  const [statusFilter, setStatusFilter] =
    useState<AttendanceStatus | undefined>();

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  const [editId, setEditId] =
    useState<string | null>(null);

  const [editStatus, setEditStatus] =
    useState<AttendanceStatus>("PRESENT");

  const [editRemarks, setEditRemarks] =
    useState("");

  const {
    data: attendances = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useAttendances(statusFilter);

  const selectedAttendance =
    useAttendance(selectedId);

  const updateMutation =
    useUpdateAttendance();

  const deleteMutation =
    useDeleteAttendance();

  const filteredAttendances = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return attendances;
    }

    return attendances.filter((attendance) => {
      const searchable = [
        attendance.id,
        attendance.studentId,
        attendance.courseId,
        attendance.facultyId,
        attendance.student?.name,
        attendance.student?.email,
        attendance.student?.studentId,
        attendance.course?.code,
        attendance.course?.title,
        attendance.course?.name,
        attendance.faculty?.name,
        attendance.faculty?.email,
        attendance.faculty?.employeeId,
        attendance.remarks,
        attendance.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [attendances, search]);

  const stats = useMemo(() => {
    return {
      total: attendances.length,
      present: attendances.filter(
        (item) => item.status === "PRESENT",
      ).length,
      absent: attendances.filter(
        (item) => item.status === "ABSENT",
      ).length,
      late: attendances.filter(
        (item) => item.status === "LATE",
      ).length,
    };
  }, [attendances]);

  const openEdit = (attendance: Attendance) => {
    setEditId(attendance.id);
    setEditStatus(attendance.status);
    setEditRemarks(attendance.remarks ?? "");
  };

  const handleUpdate = async () => {
    if (!editId) return;

    await updateMutation.mutateAsync({
      id: editId,
      status: editStatus,
      remarks: editRemarks.trim(),
    });

    setEditId(null);
    setEditRemarks("");
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    await deleteMutation.mutateAsync(deleteId);

    setDeleteId(null);

    if (selectedId === deleteId) {
      setSelectedId(null);
    }
  };

  return (
    <main className="min-h-full space-y-6">
      {/* HERO */}
      <motion.section
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-xl md:p-8"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              <UserCheck className="h-3.5 w-3.5" />
              Academic Control
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
              Attendance{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Monitor attendance records, review student presence,
              and keep every academic session synchronized.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
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

      {/* STATS */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={CalendarDays}
          label="Total Records"
          value={stats.total}
          description="Loaded attendance records"
        />

        <StatCard
          icon={CheckCircle2}
          label="Present"
          value={stats.present}
          description="Students marked present"
        />

        <StatCard
          icon={XCircle}
          label="Absent"
          value={stats.absent}
          description="Students marked absent"
        />

        <StatCard
          icon={Clock3}
          label="Late"
          value={stats.late}
          description="Late arrivals"
        />
      </section>

      {/* TOOLBAR */}
      <motion.section
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="rounded-3xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-xl"
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search student, course, faculty..."
              className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={!statusFilter}
              onClick={() =>
                setStatusFilter(undefined)
              }
            >
              All
            </FilterButton>

            <FilterButton
              active={statusFilter === "PRESENT"}
              onClick={() =>
                setStatusFilter("PRESENT")
              }
            >
              Present
            </FilterButton>

            <FilterButton
              active={statusFilter === "ABSENT"}
              onClick={() =>
                setStatusFilter("ABSENT")
              }
            >
              Absent
            </FilterButton>

            <FilterButton
              active={statusFilter === "LATE"}
              onClick={() =>
                setStatusFilter("LATE")
              }
            >
              Late
            </FilterButton>
          </div>
        </div>
      </motion.section>

      {/* CONTENT */}
      <motion.section
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] backdrop-blur-xl"
      >
        {isLoading ? (
          <AttendanceSkeleton />
        ) : isError ? (
          <StateBlock
            icon={AlertCircle}
            title="Attendance data unavailable"
            description="We could not load attendance records from the backend."
            action={
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300"
              >
                Try again
              </button>
            }
          />
        ) : filteredAttendances.length === 0 ? (
          <StateBlock
            icon={CalendarDays}
            title="No attendance records"
            description={
              search
                ? "No attendance record matches your search."
                : "There are no attendance records available yet."
            }
          />
        ) : (
          <>
            {/* DESKTOP */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.025]">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Student
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Course
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Faculty
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAttendances.map(
                    (attendance) => (
                      <AttendanceRow
                        key={attendance.id}
                        attendance={attendance}
                        onView={() =>
                          setSelectedId(attendance.id)
                        }
                        onEdit={() =>
                          openEdit(attendance)
                        }
                        onDelete={() =>
                          setDeleteId(attendance.id)
                        }
                      />
                    ),
                  )}
                </tbody>
              </table>
            </div>

            {/* MOBILE */}
            <div className="grid gap-3 p-4 lg:hidden">
              {filteredAttendances.map(
                (attendance) => (
                  <AttendanceCard
                    key={attendance.id}
                    attendance={attendance}
                    onView={() =>
                      setSelectedId(attendance.id)
                    }
                    onEdit={() =>
                      openEdit(attendance)
                    }
                    onDelete={() =>
                      setDeleteId(attendance.id)
                    }
                  />
                ),
              )}
            </div>
          </>
        )}
      </motion.section>

      {/* VIEW MODAL */}
      {selectedId && (
        <Modal
          onClose={() => setSelectedId(null)}
          title="Attendance Details"
        >
          {selectedAttendance.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-7 w-7 animate-spin text-cyan-300" />
            </div>
          ) : selectedAttendance.data ? (
            <AttendanceDetails
              attendance={selectedAttendance.data}
            />
          ) : (
            <p className="py-8 text-center text-sm text-slate-500">
              Attendance details could not be loaded.
            </p>
          )}
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editId && (
        <Modal
          onClose={() => setEditId(null)}
          title="Update Attendance"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Status
              </label>

              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    "PRESENT",
                    "ABSENT",
                    "LATE",
                  ] as AttendanceStatus[]
                ).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setEditStatus(status)
                    }
                    className={`rounded-xl border px-3 py-3 text-xs font-bold transition ${
                      editStatus === status
                        ? statusConfig[status]
                            .className
                        : "border-white/10 bg-white/[0.03] text-slate-500 hover:text-white"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Remarks
              </label>

              <textarea
                value={editRemarks}
                onChange={(event) =>
                  setEditRemarks(event.target.value)
                }
                rows={4}
                placeholder="Add attendance remarks..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
              />
            </div>

            <button
              type="button"
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/10 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updateMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              Save Changes
            </button>
          </div>
        </Modal>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <Modal
          onClose={() => setDeleteId(null)}
          title="Delete Attendance"
        >
          <div className="space-y-5">
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4">
              <div className="flex gap-3">
                <Trash2 className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />

                <div>
                  <p className="font-semibold text-rose-200">
                    Remove this attendance record?
                  </p>

                  <p className="mt-1 text-sm leading-6 text-rose-200/60">
                    This action will permanently delete the
                    selected attendance record.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-300"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-500/90 px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                {deleteMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="show"
      className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {description}
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/10 p-3">
          <Icon className="h-5 w-5 text-cyan-300" />
        </div>
      </div>
    </motion.div>
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
      className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
        active
          ? "border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
          : "border border-white/10 bg-white/[0.03] text-slate-500 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function AttendanceRow({
  attendance,
  onView,
  onEdit,
  onDelete,
}: {
  attendance: Attendance;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const config = statusConfig[attendance.status];
  const Icon = config.icon;

  return (
    <tr className="border-b border-white/[0.06] transition hover:bg-white/[0.025]">
      <td className="px-6 py-5">
        <p className="font-semibold text-white">
          {getStudentName(attendance)}
        </p>

        <p className="mt-1 text-xs text-slate-600">
          {attendance.student?.studentId ||
            attendance.studentId}
        </p>
      </td>

      <td className="px-6 py-5">
        <p className="font-medium text-slate-300">
          {getCourseName(attendance)}
        </p>
      </td>

      <td className="px-6 py-5 text-sm text-slate-400">
        {getFacultyName(attendance)}
      </td>

      <td className="px-6 py-5 text-sm text-slate-400">
        {formatDate(attendance.date)}
      </td>

      <td className="px-6 py-5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${config.className}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {config.label}
        </span>
      </td>

      <td className="px-6 py-5">
        <div className="flex justify-end gap-2">
          <ActionButton
            icon={Eye}
            label="View"
            onClick={onView}
          />

          <ActionButton
            icon={Clock3}
            label="Edit"
            onClick={onEdit}
          />

          <ActionButton
            icon={Trash2}
            label="Delete"
            danger
            onClick={onDelete}
          />
        </div>
      </td>
    </tr>
  );
}

function AttendanceCard({
  attendance,
  onView,
  onEdit,
  onDelete,
}: {
  attendance: Attendance;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const config = statusConfig[attendance.status];
  const Icon = config.icon;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-white">
            {getStudentName(attendance)}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {attendance.student?.studentId ||
              attendance.studentId}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${config.className}`}
        >
          <Icon className="h-3 w-3" />
          {config.label}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-slate-600">Course</p>
          <p className="mt-1 text-slate-300">
            {getCourseName(attendance)}
          </p>
        </div>

        <div>
          <p className="text-slate-600">Date</p>
          <p className="mt-1 text-slate-300">
            {formatDate(attendance.date)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onView}
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] py-2 text-xs font-bold text-slate-300"
        >
          View
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="flex-1 rounded-xl border border-cyan-400/10 bg-cyan-400/10 py-2 text-xs font-bold text-cyan-300"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="rounded-xl border border-rose-400/10 bg-rose-400/10 px-3 py-2 text-rose-300"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  danger = false,
}: {
  icon: typeof Eye;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`rounded-xl border p-2 transition ${
        danger
          ? "border-rose-400/10 bg-rose-400/5 text-rose-300 hover:bg-rose-400/10"
          : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-cyan-400/20 hover:text-cyan-300"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function AttendanceDetails({
  attendance,
}: {
  attendance: Attendance;
}) {
  const config = statusConfig[attendance.status];
  const Icon = config.icon;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-600">
            Attendance ID
          </p>

          <p className="mt-1 break-all text-sm font-semibold text-white">
            {attendance.id}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${config.className}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {config.label}
        </span>
      </div>

      <DetailItem
        label="Student"
        value={getStudentName(attendance)}
      />

      <DetailItem
        label="Course"
        value={getCourseName(attendance)}
      />

      <DetailItem
        label="Faculty"
        value={getFacultyName(attendance)}
      />

      <DetailItem
        label="Date"
        value={formatDate(attendance.date)}
      />

      <DetailItem
        label="Remarks"
        value={attendance.remarks || "No remarks"}
      />
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <p className="text-xs uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-sm leading-6 text-slate-300">
        {value}
      </p>
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#07101f]/95 p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {children}
      </motion.div>
    </div>
  );
}

function StateBlock({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof AlertCircle;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <Icon className="h-7 w-7 text-cyan-300" />
      </div>

      <h3 className="mt-5 text-lg font-bold text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function AttendanceSkeleton() {
  return (
    <div className="space-y-4 p-6">
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className="h-16 animate-pulse rounded-2xl bg-white/[0.045]"
        />
      ))}
    </div>
  );
}