"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Edit3,
  GraduationCap,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";

import {
  useCreateResult,
  useDeleteResult,
  useResults,
  useUpdateResult,
  type Result,
  type ResultGrade,
} from "@/hooks/api/useResults";
import {
  useStudents,
  type Student,
} from "@/hooks/api/useStudents";

import {
  useCourses,
  type Course,
} from "@/hooks/api/useCourses";
import { getApiErrorMessage } from "@/lib/api";
import { getAuthUser } from "@/lib/auth";

const pageVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.055,
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

const resultSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  courseId: z.string().min(1, "Course is required"),
  marks: z.coerce
    .number()
    .min(0, "Marks cannot be negative")
    .max(100, "Marks cannot exceed 100"),
  grade: z.enum([
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
  ]),
  gradePoint: z.coerce
    .number()
    .min(0)
    .max(4),
  remarks: z.string().trim().max(500).optional(),
});

type ResultFormInput = z.input<typeof resultSchema>;
type ResultFormValues = z.output<typeof resultSchema>;

const gradeOptions: Array<{
  value: ResultGrade;
  label: string;
  point: number;
}> = [
  { value: "A_PLUS", label: "A+", point: 4 },
  { value: "A", label: "A", point: 4 },
  { value: "A_MINUS", label: "A-", point: 3.7 },
  { value: "B_PLUS", label: "B+", point: 3.3 },
  { value: "B", label: "B", point: 3 },
  { value: "B_MINUS", label: "B-", point: 2.7 },
  { value: "C_PLUS", label: "C+", point: 2.3 },
  { value: "C", label: "C", point: 2 },
  { value: "D", label: "D", point: 1 },
  { value: "F", label: "F", point: 0 },
];

function gradeLabel(grade: ResultGrade) {
  return (
    gradeOptions.find((item) => item.value === grade)?.label ?? grade
  );
}

function gradePointForMarks(marks: number) {
  if (marks >= 80) return { grade: "A_PLUS" as ResultGrade, point: 4 };
  if (marks >= 75) return { grade: "A" as ResultGrade, point: 4 };
  if (marks >= 70) return { grade: "A_MINUS" as ResultGrade, point: 3.7 };
  if (marks >= 65) return { grade: "B_PLUS" as ResultGrade, point: 3.3 };
  if (marks >= 60) return { grade: "B" as ResultGrade, point: 3 };
  if (marks >= 55) return { grade: "B_MINUS" as ResultGrade, point: 2.7 };
  if (marks >= 50) return { grade: "C_PLUS" as ResultGrade, point: 2.3 };
  if (marks >= 45) return { grade: "C" as ResultGrade, point: 2 };
  if (marks >= 40) return { grade: "D" as ResultGrade, point: 1 };

  return { grade: "F" as ResultGrade, point: 0 };
}

function formatDate(date?: string) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ResultSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-3xl border border-white/8 bg-white/[0.025] p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white/10" />

              <div>
                <div className="h-4 w-40 rounded bg-white/10" />
                <div className="mt-2 h-3 w-28 rounded bg-white/10" />
              </div>
            </div>

            <div className="h-8 w-16 rounded-full bg-white/10" />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="h-14 rounded-2xl bg-white/10" />
            <div className="h-14 rounded-2xl bg-white/10" />
            <div className="h-14 rounded-2xl bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Award;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/20"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-400/[0.06] blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            {label}
          </p>

          <p className="mt-3 text-2xl font-semibold text-white">{value}</p>

          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>

        <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.07] p-3 text-cyan-300">
          <Icon size={19} />
        </div>
      </div>
    </motion.div>
  );
}

function ResultModal({
  result,
  onClose,
}: {
  result: Result | null;
  onClose: () => void;
}) {
  if (!result) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 18 }}
          className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#07101f]/95 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8"
        >
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-start justify-between gap-5">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  <Award size={12} />
                  Academic Result
                </span>

                <h2 className="mt-4 text-2xl font-semibold text-white">
                  {result.student?.name || "Student Result"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {result.course?.code || "Course"} ·{" "}
                  {result.course?.title || "Course title"}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-black/20 p-5 text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Marks
                </p>

                <p className="mt-2 text-3xl font-semibold text-white">
                  {result.marks}
                </p>

                <p className="mt-1 text-xs text-slate-600">out of 100</p>
              </div>

              <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.035] p-5 text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Grade
                </p>

                <p className="mt-2 text-3xl font-semibold text-cyan-300">
                  {gradeLabel(result.grade)}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-400/10 bg-violet-400/[0.035] p-5 text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Grade Point
                </p>

                <p className="mt-2 text-3xl font-semibold text-violet-300">
                  {result.gradePoint.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Student ID
                </p>

                <p className="mt-2 text-sm text-white">
                  {result.student?.studentId || result.studentId}
                </p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Published
                </p>

                <p className="mt-2 text-sm text-white">
                  {formatDate(result.createdAt)}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-white/8 bg-black/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                Remarks
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                {result.remarks || "No remarks were added for this result."}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ResultFormModal({
  result,
  students,
  courses,
  facultyId,
  onClose,
}: {
  result: Result | null;
  students: Student[];
  courses: Course[];
  facultyId: string;
  onClose: () => void;
}) {
  const createMutation = useCreateResult();
  const updateMutation = useUpdateResult();

  const isEdit = Boolean(result);

  const form = useForm<ResultFormInput, unknown, ResultFormValues>({
    resolver: zodResolver(resultSchema),
    defaultValues: result
      ? {
          studentId: result.studentId,
          courseId: result.courseId,
          marks: result.marks,
          grade: result.grade,
          gradePoint: result.gradePoint,
          remarks: result.remarks || "",
        }
      : {
          studentId: "",
          courseId: "",
          marks: 0,
          grade: "F",
          gradePoint: 0,
          remarks: "",
        },
  });

  const mutation = isEdit ? updateMutation : createMutation;

  const handleMarksChange = (value: string) => {
    const marks = Number(value);

    form.setValue("marks", Number.isNaN(marks) ? 0 : marks);

    if (!isEdit && !Number.isNaN(marks)) {
      const calculated = gradePointForMarks(marks);

      form.setValue("grade", calculated.grade);
      form.setValue("gradePoint", calculated.point);
    }
  };

  const onSubmit = async (values: ResultFormValues) => {
    try {
      if (isEdit && result) {
        await updateMutation.mutateAsync({
          id: result.id,
          marks: values.marks,
          grade: values.grade,
          gradePoint: values.gradePoint,
        });
      } else {
        await createMutation.mutateAsync({
          studentId: values.studentId,
          courseId: values.courseId,
          facultyId,
          marks: values.marks,
          grade: values.grade,
          gradePoint: values.gradePoint,
          remarks: values.remarks || "",
        });
      }

      onClose();
    } catch {
      // mutation error is rendered below
    }
  };

  const mutationError = mutation.error
    ? getApiErrorMessage(
        mutation.error,
        "Unable to save this result.",
      )
    : "";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#07101f]/95 p-6 shadow-2xl sm:p-8"
        >
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  {isEdit ? (
                    <>
                      <Edit3 size={12} />
                      Update Result
                    </>
                  ) : (
                    <>
                      <Plus size={12} />
                      Publish Result
                    </>
                  )}
                </div>

                <h2 className="mt-4 text-2xl font-semibold text-white">
                  {isEdit ? "Update academic result" : "Create academic result"}
                </h2>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {isEdit
                    ? "Update the marks and academic grade information."
                    : "Publish a new result for a student from your faculty workspace."}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {mutationError && (
              <div className="mt-6 flex gap-3 rounded-2xl border border-red-400/15 bg-red-400/[0.04] p-4 text-xs text-red-200">
                <AlertCircle className="mt-0.5 shrink-0" size={16} />
                <span>{mutationError}</span>
              </div>
            )}

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-7 space-y-5"
            >
              {!isEdit && (
                <>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-400">
                      Student
                    </label>

                    <select
                      {...form.register("studentId")}
                      className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-cyan-400/30"
                    >
                      <option value="" className="bg-[#07101f]">
                        Select student
                      </option>

                      {students.map((student) => (
                        <option
                          key={student.id}
                          value={student.id}
                          className="bg-[#07101f]"
                        >
                          {student.name || student.email || student.studentId || student.id}
                          {student.studentId
                            ? ` · ${student.studentId}`
                            : ""}
                        </option>
                      ))}
                    </select>

                    {form.formState.errors.studentId && (
                      <p className="mt-2 text-xs text-red-300">
                        {form.formState.errors.studentId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-400">
                      Course
                    </label>

                    <select
                      {...form.register("courseId")}
                      className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-cyan-400/30"
                    >
                      <option value="" className="bg-[#07101f]">
                        Select course
                      </option>

                      {courses.map((course) => (
                        <option
                          key={course.id}
                          value={course.id}
                          className="bg-[#07101f]"
                        >
                          {course.code} · {course.title}
                        </option>
                      ))}
                    </select>

                    {form.formState.errors.courseId && (
                      <p className="mt-2 text-xs text-red-300">
                        {form.formState.errors.courseId.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Marks
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  {...form.register("marks")}
                  onChange={(event) => handleMarksChange(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-cyan-400/30"
                />

                {form.formState.errors.marks && (
                  <p className="mt-2 text-xs text-red-300">
                    {form.formState.errors.marks.message}
                  </p>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-400">
                    Grade
                  </label>

                  <select
                    {...form.register("grade")}
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-cyan-400/30"
                  >
                    {gradeOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="bg-[#07101f]"
                      >
                        {option.label} · {option.point.toFixed(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-400">
                    Grade Point
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="4"
                    step="0.01"
                    {...form.register("gradePoint")}
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-cyan-400/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Remarks
                </label>

                <textarea
                  {...form.register("remarks")}
                  rows={4}
                  placeholder="Add optional academic remarks..."
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-3 text-xs font-medium text-slate-400 transition hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.08] px-6 py-3 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/[0.13] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {mutation.isPending ? (
                    <>
                      <LoaderCircle size={15} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      {isEdit ? "Update Result" : "Publish Result"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function FacultyResultsPage() {
  const user = getAuthUser();

  const {
    data: results = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useResults();

  const {
    data: studentsResponse,
    isLoading: studentsLoading,
  } = useStudents();

  const {
    data: courses = [],
    isLoading: coursesLoading,
  } = useCourses();

  const createMutation = useCreateResult();
  const deleteMutation = useDeleteResult();

  const students = useMemo(() => {
    if (Array.isArray(studentsResponse)) return studentsResponse;

    return [];
  }, [studentsResponse]);

  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<ResultGrade | "ALL">("ALL");
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Result | null>(null);

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    return results.filter((result) => {
      const matchesGrade =
        gradeFilter === "ALL" || result.grade === gradeFilter;

      if (!matchesGrade) return false;

      if (!query) return true;

      return [
        result.student?.name,
        result.student?.email,
        result.student?.studentId,
        result.course?.code,
        result.course?.title,
        gradeLabel(result.grade),
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query),
        );
    });
  }, [results, search, gradeFilter]);

  const averageMarks = results.length
    ? results.reduce((sum, result) => sum + Number(result.marks || 0), 0) /
      results.length
    : 0;

  const averagePoint = results.length
    ? results.reduce(
        (sum, result) => sum + Number(result.gradePoint || 0),
        0,
      ) / results.length
    : 0;

  const passedCount = results.filter(
    (result) => result.grade !== "F",
  ).length;

  const topScore = results.length
    ? Math.max(...results.map((result) => Number(result.marks || 0)))
    : 0;

  const errorMessage = getApiErrorMessage(
    error,
    "Unable to load academic results.",
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      // Error state is handled below.
    }
  };

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="min-h-full pb-10"
    >
      <div className="mx-auto max-w-[1500px]">
        {/* HERO */}
        <motion.section
          variants={itemVariants}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-violet-500/[0.08] via-blue-500/[0.035] to-cyan-400/[0.07] p-6 sm:p-8 lg:p-10"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-400/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300">
                <Trophy size={13} />
                Academic Performance
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Results{" "}
                <span className="bg-gradient-to-r from-violet-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Command
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Publish, review and manage student academic results from a
                single futuristic faculty workspace.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-5 text-sm font-medium text-slate-300 transition hover:border-cyan-400/20 hover:text-cyan-200 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={isFetching ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.08] px-5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/[0.13]"
              >
                <Plus size={17} />
                Publish Result
              </button>
            </div>
          </div>
        </motion.section>

        {/* STATS */}
        <motion.section
          variants={pageVariants}
          className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <StatCard
            icon={Award}
            label="Results"
            value={String(results.length)}
            detail="Loaded academic records"
          />

          <StatCard
            icon={GraduationCap}
            label="Average Marks"
            value={averageMarks.toFixed(1)}
            detail="Across loaded results"
          />

          <StatCard
            icon={Trophy}
            label="Average GPA"
            value={averagePoint.toFixed(2)}
            detail={`${passedCount} passed results`}
          />

          <StatCard
            icon={Zap}
            label="Top Score"
            value={topScore.toFixed(0)}
            detail="Highest loaded marks"
          />
        </motion.section>

        {/* TOOLBAR */}
        <motion.section
          variants={itemVariants}
          className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-xl">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search student, ID, course or grade..."
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/30"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setGradeFilter("ALL")}
                className={`rounded-xl border px-3.5 py-2.5 text-xs font-medium transition ${
                  gradeFilter === "ALL"
                    ? "border-cyan-400/20 bg-cyan-400/[0.07] text-cyan-200"
                    : "border-white/8 bg-white/[0.025] text-slate-500"
                }`}
              >
                All
              </button>

              {gradeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setGradeFilter(option.value)}
                  className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition ${
                    gradeFilter === option.value
                      ? "border-violet-400/20 bg-violet-400/[0.07] text-violet-200"
                      : "border-white/8 bg-white/[0.025] text-slate-500"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CONTENT */}
        <section className="mt-6">
          {isLoading ? (
            <ResultSkeleton />
          ) : isError ? (
            <motion.div
              variants={itemVariants}
              className="rounded-3xl border border-red-400/15 bg-red-400/[0.035] p-10 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/15 bg-red-400/[0.07] text-red-300">
                <AlertCircle size={23} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-white">
                Result network unavailable
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.07] px-4 py-2.5 text-xs font-medium text-red-200"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
            </motion.div>
          ) : filteredResults.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="rounded-3xl border border-white/10 bg-white/[0.025] px-6 py-16 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-violet-400/15 bg-violet-400/[0.06] text-violet-300">
                <Award size={27} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-white">
                No results found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                No academic result matches your current search or grade filter.
              </p>

              {(search || gradeFilter !== "ALL") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setGradeFilter("ALL");
                  }}
                  className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-slate-300 hover:border-cyan-400/20"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              variants={pageVariants}
              className="space-y-4"
            >
              {filteredResults.map((result) => (
                <motion.article
                  key={result.id}
                  variants={itemVariants}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition hover:border-cyan-400/15 hover:bg-white/[0.045]"
                >
                  <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-400/[0.04] blur-3xl" />

                  <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-400/[0.07] text-violet-300">
                        <GraduationCap size={20} />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold text-white">
                          {result.student?.name || "Unknown Student"}
                        </h2>

                        <p className="mt-1 truncate text-xs text-slate-600">
                          {result.student?.studentId || result.studentId}
                          {" · "}
                          {result.course?.code || result.courseId}
                          {" · "}
                          {result.course?.title || "Course"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 xl:min-w-[420px]">
                      <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                        <p className="text-[9px] uppercase tracking-wider text-slate-600">
                          Marks
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                          {result.marks}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.035] px-4 py-3">
                        <p className="text-[9px] uppercase tracking-wider text-slate-600">
                          Grade
                        </p>

                        <p className="mt-1 text-sm font-semibold text-cyan-300">
                          {gradeLabel(result.grade)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-violet-400/10 bg-violet-400/[0.035] px-4 py-3">
                        <p className="text-[9px] uppercase tracking-wider text-slate-600">
                          GPA
                        </p>

                        <p className="mt-1 text-sm font-semibold text-violet-300">
                          {result.gradePoint.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedResult(result)}
                        className="rounded-xl border border-white/10 bg-white/[0.035] p-2.5 text-slate-500 transition hover:border-cyan-400/20 hover:text-cyan-300"
                        title="View result"
                      >
                        <ChevronRight size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingResult(result)}
                        className="rounded-xl border border-white/10 bg-white/[0.035] p-2.5 text-slate-500 transition hover:border-blue-400/20 hover:text-blue-300"
                        title="Edit result"
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(result)}
                        className="rounded-xl border border-red-400/10 bg-red-400/[0.03] p-2.5 text-red-400/60 transition hover:border-red-400/20 hover:bg-red-400/[0.06] hover:text-red-300"
                        title="Delete result"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="relative mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/7 pt-4 text-[10px] text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={12} />
                      {result.course?.title || "Course"}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Users size={12} />
                      Faculty result
                    </span>

                    <span>
                      Published {formatDate(result.createdAt)}
                    </span>

                    <span
                      className={`ml-auto rounded-full px-3 py-1 ${
                        result.grade === "F"
                          ? "bg-red-400/[0.06] text-red-300"
                          : "bg-emerald-400/[0.06] text-emerald-300"
                      }`}
                    >
                      {result.grade === "F" ? "Needs Improvement" : "Passed"}
                    </span>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </section>

        {!isLoading && !isError && results.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/7 bg-white/[0.02] px-5 py-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>
              Showing {filteredResults.length} of {results.length} loaded
              results
            </span>

            <span className="flex items-center gap-2">
              <Zap size={13} className="text-cyan-400" />
              NEXUS Academic Engine
            </span>
          </motion.div>
        )}
      </div>

      {/* CREATE */}
      {showCreate && (
        <ResultFormModal
          result={null}
          students={students}
          courses={courses}
          facultyId={user?.id || ""}
          onClose={() => setShowCreate(false)}
        />
      )}

      {/* EDIT */}
      {editingResult && (
        <ResultFormModal
          result={editingResult}
          students={students}
          courses={courses}
          facultyId={user?.id || ""}
          onClose={() => setEditingResult(null)}
        />
      )}

      {/* DETAILS */}
      <ResultModal
        result={selectedResult}
        onClose={() => setSelectedResult(null)}
      />

      {/* DELETE CONFIRMATION */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="w-full max-w-md rounded-[2rem] border border-red-400/15 bg-[#07101f] p-6 shadow-2xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/15 bg-red-400/[0.06] text-red-300">
                <Trash2 size={22} />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-white">
                Delete academic result?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This will permanently remove the result for{" "}
                <span className="text-slate-300">
                  {deleteTarget.student?.name || "this student"}
                </span>
                .
              </p>

              {deleteMutation.error && (
                <p className="mt-4 text-xs text-red-300">
                  {getApiErrorMessage(
                    deleteMutation.error,
                    "Unable to delete this result.",
                  )}
                </p>
              )}

              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-xs font-medium text-slate-400"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/[0.07] px-4 py-3 text-xs font-semibold text-red-200 disabled:opacity-50"
                >
                  {deleteMutation.isPending ? (
                    <LoaderCircle size={15} className="animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}

                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}