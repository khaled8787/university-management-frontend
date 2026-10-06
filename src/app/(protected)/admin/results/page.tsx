"use client";

import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle2,
  Eye,
  GraduationCap,
  Loader2,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
  X,
  XCircle,
} from "lucide-react";

import {
  motion,
  type Variants,
} from "framer-motion";

import {
  useMemo,
  useState,
} from "react";

import {
  useDeleteResult,
  useResult,
  useResults,
  useUpdateResult,
  type Result,
  type ResultGrade,
} from "@/hooks/api/useResults";

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

const grades: ResultGrade[] = [
  "A_PLUS",
  "A",
  "A_MINUS",
  "B_PLUS",
  "B",
  "B_MINUS",
  "C_PLUS",
  "C",
  "D",
  "F",
];

function gradeLabel(grade: ResultGrade) {
  return grade.replace("_", "+");
}

function gradeStyle(grade: ResultGrade) {
  if (grade === "A_PLUS" || grade === "A") {
    return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
  }

  if (
    grade === "A_MINUS" ||
    grade === "B_PLUS"
  ) {
    return "border-blue-400/20 bg-blue-400/10 text-blue-300";
  }

  if (
    grade === "B" ||
    grade === "B_MINUS" ||
    grade === "C_PLUS"
  ) {
    return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  }

  if (grade === "F") {
    return "border-rose-400/20 bg-rose-400/10 text-rose-300";
  }

  return "border-white/10 bg-white/[0.04] text-slate-300";
}

function studentName(result: Result) {
  return (
    result.student?.name ||
    result.student?.email ||
    result.studentId
  );
}

function courseName(result: Result) {
  return (
    result.course?.title ||
    result.course?.name ||
    result.course?.code ||
    result.courseId
  );
}

function facultyName(result: Result) {
  return (
    result.faculty?.name ||
    result.faculty?.email ||
    result.facultyId
  );
}

export default function AdminResultsPage() {
  const [gradeFilter, setGradeFilter] =
    useState<ResultGrade | undefined>();

  const [search, setSearch] = useState("");

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [editId, setEditId] =
    useState<string | null>(null);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  const [editMarks, setEditMarks] =
    useState("");

  const [editGrade, setEditGrade] =
    useState<ResultGrade>("A_PLUS");

  const [editGradePoint, setEditGradePoint] =
    useState("");

  const {
    data: results = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useResults(gradeFilter);

  const selectedResult =
    useResult(selectedId);

  const updateMutation =
    useUpdateResult();

  const deleteMutation =
    useDeleteResult();

  const filteredResults = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return results;
    }

    return results.filter((result) => {
      const searchable = [
        result.id,
        result.studentId,
        result.courseId,
        result.facultyId,
        result.student?.name,
        result.student?.email,
        result.student?.studentId,
        result.course?.code,
        result.course?.title,
        result.course?.name,
        result.faculty?.name,
        result.faculty?.email,
        result.faculty?.employeeId,
        result.grade,
        String(result.marks),
        String(result.gradePoint),
        result.remarks,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [results, search]);

  const stats = useMemo(() => {
    return {
      total: results.length,

      excellent: results.filter(
        (item) =>
          item.grade === "A_PLUS" ||
          item.grade === "A",
      ).length,

      passing: results.filter(
        (item) =>
          item.grade !== "F",
      ).length,

      failed: results.filter(
        (item) =>
          item.grade === "F",
      ).length,
    };
  }, [results]);

  const openEdit = (result: Result) => {
    setEditId(result.id);
    setEditMarks(String(result.marks));
    setEditGrade(result.grade);
    setEditGradePoint(
      String(result.gradePoint),
    );
  };

  const handleUpdate = async () => {
    if (!editId) return;

    const marks = Number(editMarks);
    const gradePoint =
      Number(editGradePoint);

    if (
      Number.isNaN(marks) ||
      Number.isNaN(gradePoint)
    ) {
      return;
    }

    await updateMutation.mutateAsync({
      id: editId,
      marks,
      grade: editGrade,
      gradePoint,
    });

    setEditId(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    await deleteMutation.mutateAsync(
      deleteId,
    );

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
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
              <Award className="h-3.5 w-3.5" />
              Academic Intelligence
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
              Results{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Review academic performance, monitor grades,
              and maintain accurate student result records.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-violet-400/30 hover:bg-violet-400/10 disabled:opacity-60"
          >
            <RefreshCw
              className={
                isFetching
                  ? "h-4 w-4 animate-spin"
                  : "h-4 w-4"
              }
            />

            Refresh
          </button>
        </div>
      </motion.section>

      {/* STATS */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={GraduationCap}
          label="Total Results"
          value={stats.total}
          description="Loaded result records"
        />

        <StatCard
          icon={Award}
          label="Excellent"
          value={stats.excellent}
          description="A+ and A grades"
        />

        <StatCard
          icon={CheckCircle2}
          label="Passing"
          value={stats.passing}
          description="Successful results"
        />

        <StatCard
          icon={XCircle}
          label="Failed"
          value={stats.failed}
          description="F grade records"
          danger
        />
      </section>

      {/* FILTERS */}
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
              placeholder="Search student, course, grade..."
              className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400/40 focus:ring-2 focus:ring-violet-400/10"
            />
          </div>

          <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
            <FilterButton
              active={!gradeFilter}
              onClick={() =>
                setGradeFilter(undefined)
              }
            >
              All
            </FilterButton>

            {grades.map((grade) => (
              <FilterButton
                key={grade}
                active={gradeFilter === grade}
                onClick={() =>
                  setGradeFilter(grade)
                }
              >
                {gradeLabel(grade)}
              </FilterButton>
            ))}
          </div>
        </div>
      </motion.section>

      {/* TABLE */}
      <motion.section
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] backdrop-blur-xl"
      >
        {isLoading ? (
          <ResultSkeleton />
        ) : isError ? (
          <StateBlock
            icon={AlertCircle}
            title="Result data unavailable"
            description="We could not load result records from the backend."
            action={
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-xl border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm font-bold text-violet-300"
              >
                Try again
              </button>
            }
          />
        ) : filteredResults.length === 0 ? (
          <StateBlock
            icon={BookOpen}
            title="No result records"
            description={
              search
                ? "No result matches your search."
                : "There are no result records available yet."
            }
          />
        ) : (
          <>
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
                      Marks
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Grade
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      GPA
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredResults.map(
                    (result) => (
                      <ResultRow
                        key={result.id}
                        result={result}
                        onView={() =>
                          setSelectedId(result.id)
                        }
                        onEdit={() =>
                          openEdit(result)
                        }
                        onDelete={() =>
                          setDeleteId(result.id)
                        }
                      />
                    ),
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-4 lg:hidden">
              {filteredResults.map(
                (result) => (
                  <ResultCard
                    key={result.id}
                    result={result}
                    onView={() =>
                      setSelectedId(result.id)
                    }
                    onEdit={() =>
                      openEdit(result)
                    }
                    onDelete={() =>
                      setDeleteId(result.id)
                    }
                  />
                ),
              )}
            </div>
          </>
        )}
      </motion.section>

      {/* VIEW */}
      {selectedId && (
        <Modal
          title="Result Details"
          onClose={() =>
            setSelectedId(null)
          }
        >
          {selectedResult.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-7 w-7 animate-spin text-violet-300" />
            </div>
          ) : selectedResult.data ? (
            <ResultDetails
              result={selectedResult.data}
            />
          ) : (
            <p className="py-8 text-center text-sm text-slate-500">
              Result details could not be loaded.
            </p>
          )}
        </Modal>
      )}

      {/* EDIT */}
      {editId && (
        <Modal
          title="Update Result"
          onClose={() => setEditId(null)}
        >
          <div className="space-y-5">
            <Field
              label="Marks"
              type="number"
              value={editMarks}
              onChange={setEditMarks}
              placeholder="85"
            />

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Grade
              </label>

              <select
                value={editGrade}
                onChange={(event) =>
                  setEditGrade(
                    event.target
                      .value as ResultGrade,
                  )
                }
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none focus:border-violet-400/40"
              >
                {grades.map((grade) => (
                  <option
                    key={grade}
                    value={grade}
                    className="bg-[#07101f]"
                  >
                    {gradeLabel(grade)}
                  </option>
                ))}
              </select>
            </div>

            <Field
              label="Grade Point"
              type="number"
              value={editGradePoint}
              onChange={setEditGradePoint}
              placeholder="4"
            />

            <button
              type="button"
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/10 disabled:opacity-60"
            >
              {updateMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              Save Changes
            </button>
          </div>
        </Modal>
      )}

      {/* DELETE */}
      {deleteId && (
        <Modal
          title="Delete Result"
          onClose={() =>
            setDeleteId(null)
          }
        >
          <div className="space-y-5">
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4">
              <div className="flex gap-3">
                <Trash2 className="h-5 w-5 shrink-0 text-rose-300" />

                <div>
                  <p className="font-bold text-rose-200">
                    Delete this result?
                  </p>

                  <p className="mt-1 text-sm leading-6 text-rose-200/60">
                    This result record will be permanently
                    removed from the system.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeleteId(null)
                }
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
  danger = false,
}: {
  icon: typeof Award;
  label: string;
  value: number;
  description: string;
  danger?: boolean;
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

        <div
          className={`rounded-2xl border p-3 ${
            danger
              ? "border-rose-400/10 bg-rose-400/10"
              : "border-violet-400/10 bg-violet-400/10"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${
              danger
                ? "text-rose-300"
                : "text-violet-300"
            }`}
          />
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
      className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
        active
          ? "border border-violet-400/20 bg-violet-400/10 text-violet-300"
          : "border border-white/10 bg-white/[0.03] text-slate-500 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function ResultRow({
  result,
  onView,
  onEdit,
  onDelete,
}: {
  result: Result;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="border-b border-white/[0.06] transition hover:bg-white/[0.025]">
      <td className="px-6 py-5">
        <p className="font-semibold text-white">
          {studentName(result)}
        </p>

        <p className="mt-1 text-xs text-slate-600">
          {result.student?.studentId ||
            result.studentId}
        </p>
      </td>

      <td className="px-6 py-5">
        <p className="font-medium text-slate-300">
          {courseName(result)}
        </p>

        {result.course?.code && (
          <p className="mt-1 text-xs text-slate-600">
            {result.course.code}
          </p>
        )}
      </td>

      <td className="px-6 py-5">
        <span className="font-black text-white">
          {result.marks}
        </span>
        <span className="text-xs text-slate-600">
          {" "}
          / 100
        </span>
      </td>

      <td className="px-6 py-5">
        <span
          className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-black ${gradeStyle(
            result.grade,
          )}`}
        >
          {gradeLabel(result.grade)}
        </span>
      </td>

      <td className="px-6 py-5">
        <span className="font-bold text-slate-200">
          {result.gradePoint}
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
            icon={Pencil}
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

function ResultCard({
  result,
  onView,
  onEdit,
  onDelete,
}: {
  result: Result;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-white">
            {studentName(result)}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {result.student?.studentId ||
              result.studentId}
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1.5 text-xs font-black ${gradeStyle(
            result.grade,
          )}`}
        >
          {gradeLabel(result.grade)}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <MiniValue
          label="Marks"
          value={`${result.marks}`}
        />

        <MiniValue
          label="GPA"
          value={`${result.gradePoint}`}
        />

        <MiniValue
          label="Course"
          value={
            result.course?.code ||
            result.courseId
          }
        />
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
          className="flex-1 rounded-xl border border-violet-400/10 bg-violet-400/10 py-2 text-xs font-bold text-violet-300"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="rounded-xl border border-rose-400/10 bg-rose-400/10 px-3 text-rose-300"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function MiniValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold text-slate-200">
        {value}
      </p>
    </div>
  );
}

function ResultDetails({
  result,
}: {
  result: Result;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-600">
            Result ID
          </p>

          <p className="mt-1 break-all text-sm font-semibold text-white">
            {result.id}
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1.5 text-xs font-black ${gradeStyle(
            result.grade,
          )}`}
        >
          {gradeLabel(result.grade)}
        </span>
      </div>

      <Detail
        label="Student"
        value={studentName(result)}
      />

      <Detail
        label="Course"
        value={courseName(result)}
      />

      <Detail
        label="Faculty"
        value={facultyName(result)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Detail
          label="Marks"
          value={`${result.marks} / 100`}
        />

        <Detail
          label="Grade Point"
          value={`${result.gradePoint}`}
        />
      </div>

      <Detail
        label="Remarks"
        value={result.remarks || "No remarks"}
      />
    </div>
  );
}

function Detail({
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

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400/40"
      />
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
          : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-violet-400/20 hover:text-violet-300"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
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
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 10,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#07101f]/95 p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-400 hover:text-white"
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
        <Icon className="h-7 w-7 text-violet-300" />
      </div>

      <h3 className="mt-5 text-lg font-bold text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="space-y-4 p-6">
      {Array.from({ length: 7 }).map(
        (_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse rounded-2xl bg-white/[0.045]"
          />
        ),
      )}
    </div>
  );
}