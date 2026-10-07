"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  Award,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CircleAlert,
  Eye,
  GraduationCap,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserRound,
  X,
} from "lucide-react";

import { getApiErrorMessage } from "@/lib/api";
import { useMyResults, type Result, type ResultGrade } from "@/hooks/api/useResults";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const gradeOptions: Array<"ALL" | ResultGrade> = [
  "ALL",
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

function formatGrade(grade: ResultGrade) {
  return grade.replace("_", "+");
}

function formatDate(date?: string) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getGradeTone(grade: ResultGrade) {
  if (grade === "A_PLUS" || grade === "A") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  if (grade === "A_MINUS" || grade === "B_PLUS" || grade === "B") {
    return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
  }

  if (grade === "B_MINUS" || grade === "C_PLUS" || grade === "C") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  }

  if (grade === "D") {
    return "border-orange-400/20 bg-orange-400/10 text-orange-300";
  }

  return "border-red-400/20 bg-red-400/10 text-red-300";
}

function getScoreTone(marks: number) {
  if (marks >= 80) return "text-emerald-300";
  if (marks >= 70) return "text-cyan-300";
  if (marks >= 60) return "text-amber-300";
  if (marks >= 50) return "text-orange-300";
  return "text-red-300";
}

function getPerformanceLabel(gpa: number) {
  if (gpa >= 3.75) return "Exceptional";
  if (gpa >= 3.5) return "Excellent";
  if (gpa >= 3.0) return "Strong";
  if (gpa >= 2.5) return "Good";
  if (gpa >= 2.0) return "Developing";
  return "Needs Focus";
}

function ResultsSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-3xl border border-white/10 bg-white/[0.035] p-5"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 rounded bg-white/10" />
            <div className="h-9 w-14 rounded-xl bg-white/10" />
          </div>

          <div className="mt-5 h-6 w-2/3 rounded bg-white/10" />
          <div className="mt-3 h-4 w-1/2 rounded bg-white/10" />

          <div className="mt-7 h-2 rounded-full bg-white/10" />

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="h-16 rounded-2xl bg-white/10" />
            <div className="h-16 rounded-2xl bg-white/10" />
            <div className="h-16 rounded-2xl bg-white/10" />
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
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.05]"
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl transition group-hover:bg-cyan-400/20" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
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

function ResultCard({
  result,
  onView,
}: {
  result: Result;
  onView: (result: Result) => void;
}) {
  const scorePercentage = Math.min(Math.max(result.marks, 0), 100);

  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition-colors duration-300 hover:border-cyan-400/20 hover:bg-white/[0.05]"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-cyan-400/[0.06] blur-3xl transition group-hover:bg-cyan-400/[0.11]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-cyan-400/15 bg-cyan-400/[0.06] px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-cyan-300">
                {result.course?.code || "COURSE"}
              </span>

              <span className="text-[10px] text-slate-600">
                {formatDate(result.createdAt)}
              </span>
            </div>

            <h3 className="mt-4 truncate text-lg font-semibold text-white">
              {result.course?.title || result.course?.name || "Course Result"}
            </h3>

            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <UserRound size={13} />
              <span className="truncate">
                {result.faculty?.name || "Faculty not available"}
              </span>
            </div>
          </div>

          <div
            className={`flex h-12 min-w-12 items-center justify-center rounded-2xl border px-3 text-sm font-bold ${getGradeTone(
              result.grade,
            )}`}
          >
            {formatGrade(result.grade)}
          </div>
        </div>

        <div className="mt-7">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">Performance</span>
            <span className={`font-semibold ${getScoreTone(result.marks)}`}>
              {result.marks}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${scorePercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/7 bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Marks
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              {result.marks}
            </p>
          </div>

          <div className="rounded-2xl border border-white/7 bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Point
            </p>
            <p className="mt-1 text-sm font-semibold text-cyan-300">
              {result.gradePoint.toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/7 bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Credit
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              {result.course?.credit ?? "—"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onView(result)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-xs font-medium text-slate-300 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.06] hover:text-cyan-200"
        >
          <Eye size={14} />
          View Result Details
          <ChevronRight size={14} />
        </button>
      </div>
    </motion.article>
  );
}

function ResultDetailsModal({
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 18 }}
          transition={{ duration: 0.25 }}
          className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#07101f]/95 p-6 shadow-2xl shadow-cyan-950/30 sm:p-8"
        >
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-400">
                  Result Intelligence
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {result.course?.title ||
                    result.course?.name ||
                    "Course Result"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {result.course?.code || "—"} · Published{" "}
                  {formatDate(result.createdAt)}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition hover:border-white/20 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 text-center">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                  Marks
                </p>
                <p
                  className={`mt-2 text-3xl font-bold ${getScoreTone(
                    result.marks,
                  )}`}
                >
                  {result.marks}
                </p>
                <p className="mt-1 text-xs text-slate-500">out of 100</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 text-center">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                  Grade
                </p>

                <div
                  className={`mx-auto mt-2 flex h-12 w-16 items-center justify-center rounded-2xl border text-xl font-bold ${getGradeTone(
                    result.grade,
                  )}`}
                >
                  {formatGrade(result.grade)}
                </div>

                <p className="mt-1 text-xs text-slate-500">Final grade</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 text-center">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                  Grade Point
                </p>
                <p className="mt-2 text-3xl font-bold text-cyan-300">
                  {result.gradePoint.toFixed(2)}
                </p>
                <p className="mt-1 text-xs text-slate-500">Academic point</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-cyan-400/[0.07] p-2 text-cyan-300">
                    <BookOpen size={16} />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                      Course
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {result.course?.title ||
                        result.course?.name ||
                        "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-violet-400/[0.07] p-2 text-violet-300">
                    <UserRound size={16} />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                      Faculty
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {result.faculty?.name || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-400/[0.07] p-2 text-blue-300">
                    <GraduationCap size={16} />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                      Credit
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {result.course?.credit ?? "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-400/[0.07] p-2 text-emerald-300">
                    <CalendarDays size={16} />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                      Published
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {formatDate(result.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.035] p-5">
              <div className="flex items-center gap-3">
                <Sparkles size={17} className="text-cyan-300" />
                <p className="text-sm font-semibold text-white">
                  Faculty Remarks
                </p>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {result.remarks?.trim() || "No remarks were added for this result."}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function StudentResultsPage() {
  const { data: results = [], isLoading, isError, error, refetch, isFetching } =
    useMyResults();

  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<"ALL" | ResultGrade>(
    "ALL",
  );
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    return results.filter((result) => {
      const matchesGrade =
        selectedGrade === "ALL" || result.grade === selectedGrade;

      if (!matchesGrade) return false;

      if (!query) return true;

      return [
        result.course?.code,
        result.course?.title,
        result.course?.name,
        result.faculty?.name,
        result.grade,
        result.remarks,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [results, search, selectedGrade]);

  const averageMarks = useMemo(() => {
    if (!results.length) return 0;

    return (
      results.reduce((total, result) => total + Number(result.marks || 0), 0) /
      results.length
    );
  }, [results]);

  const averageGradePoint = useMemo(() => {
    if (!results.length) return 0;

    return (
      results.reduce(
        (total, result) => total + Number(result.gradePoint || 0),
        0,
      ) / results.length
    );
  }, [results]);

  const highestMarks = useMemo(() => {
    if (!results.length) return 0;

    return Math.max(...results.map((result) => Number(result.marks || 0)));
  }, [results]);

  const passedCount = useMemo(
    () => results.filter((result) => result.grade !== "F").length,
    [results],
  );

  const performanceLabel = getPerformanceLabel(averageGradePoint);

  const errorMessage = isError
    ? getApiErrorMessage(error, "Unable to load your academic results.")
    : "";

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="min-h-full pb-10"
    >
      <div className="mx-auto max-w-[1500px]">
        {/* Hero */}
        <motion.section
          variants={itemVariants}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/[0.08] via-blue-500/[0.035] to-violet-500/[0.07] p-6 sm:p-8 lg:p-10"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                <Award size={13} />
                Academic Intelligence
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Your{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  Results
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Track your academic performance, grades, marks and faculty
                feedback from one intelligent command center.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                  Performance
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {performanceLabel}
                </p>
              </div>

              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex h-14 items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.07] px-5 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={isFetching ? "animate-spin" : ""}
                />
                Refresh
              </button>
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
            icon={BookOpen}
            label="Results"
            value={String(results.length)}
            detail="Recorded subjects"
          />

          <StatCard
            icon={Target}
            label="Average Marks"
            value={`${averageMarks.toFixed(1)}%`}
            detail="Across available results"
          />

          <StatCard
            icon={TrendingUp}
            label="Average Point"
            value={averageGradePoint.toFixed(2)}
            detail="Academic grade point"
          />

          <StatCard
            icon={Star}
            label="Highest Score"
            value={`${highestMarks}%`}
            detail={`${passedCount} passed result${passedCount === 1 ? "" : "s"}`}
          />
        </motion.section>

        {/* Toolbar */}
        <motion.section
          variants={itemVariants}
          className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search course, faculty, grade..."
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400/30 focus:bg-black/30"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {gradeOptions.map((grade) => {
                const active = selectedGrade === grade;

                return (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setSelectedGrade(grade)}
                    className={`whitespace-nowrap rounded-xl border px-3.5 py-2.5 text-xs font-medium transition ${
                      active
                        ? "border-cyan-400/25 bg-cyan-400/[0.08] text-cyan-200"
                        : "border-white/8 bg-white/[0.025] text-slate-500 hover:border-white/15 hover:text-slate-300"
                    }`}
                  >
                    {grade === "ALL" ? "All Grades" : formatGrade(grade)}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Content */}
        <section className="mt-6">
          {isLoading ? (
            <ResultsSkeleton />
          ) : isError ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-red-400/15 bg-red-400/[0.035] p-8 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/15 bg-red-400/[0.07] text-red-300">
                <CircleAlert size={24} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-white">
                Results unavailable
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.07] px-4 py-2.5 text-xs font-medium text-red-200 transition hover:bg-red-400/[0.12]"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
            </motion.div>
          ) : filteredResults.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-white/10 bg-white/[0.025] px-6 py-14 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-300">
                <GraduationCap size={27} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-white">
                No results found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {results.length
                  ? "Try changing your search or grade filter."
                  : "Your academic results will appear here once they are published."}
              </p>

              {(search || selectedGrade !== "ALL") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedGrade("ALL");
                  }}
                  className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-cyan-400/20 hover:text-cyan-200"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-4 lg:grid-cols-2"
            >
              {filteredResults.map((result) => (
                <ResultCard
                  key={result.id}
                  result={result}
                  onView={setSelectedResult}
                />
              ))}
            </motion.div>
          )}
        </section>

        {/* Footer info */}
        {!isLoading && !isError && results.length > 0 && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
            className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/7 bg-white/[0.02] px-5 py-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>
              Showing {filteredResults.length} of {results.length} recorded
              results
            </span>

            <span className="flex items-center gap-2">
              <Sparkles size={13} className="text-cyan-400" />
              Academic performance center
            </span>
          </motion.div>
        )}
      </div>

      <ResultDetailsModal
        result={selectedResult}
        onClose={() => setSelectedResult(null)}
      />
    </motion.main>
  );
}