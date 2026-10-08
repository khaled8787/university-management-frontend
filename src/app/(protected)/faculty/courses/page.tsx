"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  Eye,
  GraduationCap,
  Layers3,
  RefreshCw,
  Search,
  Users,
  X,
  Zap,
} from "lucide-react";

import {
  useCourse,
  useCourses,
  type Course,
} from "@/hooks/api/useCourses";
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

function formatDate(date?: string) {
  if (!date) return "—";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "—";

  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CourseSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.035] p-5"
        >
          <div className="flex justify-between">
            <div className="h-10 w-20 rounded-xl bg-white/10" />
            <div className="h-8 w-16 rounded-full bg-white/10" />
          </div>

          <div className="mt-6 h-6 w-3/4 rounded bg-white/10" />
          <div className="mt-3 h-4 w-1/2 rounded bg-white/10" />

          <div className="mt-7 h-2 rounded-full bg-white/10" />

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="h-16 rounded-2xl bg-white/10" />
            <div className="h-16 rounded-2xl bg-white/10" />
          </div>

          <div className="mt-5 h-11 rounded-xl bg-white/10" />
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
  icon: typeof BookOpen;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-400/[0.07] blur-3xl transition group-hover:bg-cyan-400/[0.13]" />

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

function CourseCard({
  course,
  onView,
}: {
  course: Course;
  onView: (course: Course) => void;
}) {
  const capacity = Math.max(course.capacity || 0, 0);

  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition-colors duration-300 hover:border-cyan-400/20 hover:bg-white/[0.05]"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/[0.05] blur-3xl transition group-hover:bg-cyan-400/[0.1]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 min-w-16 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] px-3 text-cyan-300">
            <span className="text-xs font-bold tracking-wider">
              {course.code}
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold ${
              course.isActive
                ? "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300"
                : "border-slate-400/10 bg-slate-400/[0.05] text-slate-500"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                course.isActive ? "bg-emerald-400" : "bg-slate-600"
              }`}
            />
            {course.isActive ? "ACTIVE" : "INACTIVE"}
          </div>
        </div>

        <h2 className="mt-6 line-clamp-2 min-h-[3.5rem] text-lg font-semibold leading-7 text-white">
          {course.title}
        </h2>

        <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">
          {course.description || "No course description available."}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/7 bg-black/20 p-3">
            <div className="flex items-center gap-2 text-slate-600">
              <Layers3 size={13} />
              <span className="text-[10px] uppercase tracking-wider">
                Credit
              </span>
            </div>

            <p className="mt-2 text-sm font-semibold text-white">
              {course.credit}
            </p>
          </div>

          <div className="rounded-2xl border border-white/7 bg-black/20 p-3">
            <div className="flex items-center gap-2 text-slate-600">
              <Clock3 size={13} />
              <span className="text-[10px] uppercase tracking-wider">
                Semester
              </span>
            </div>

            <p className="mt-2 text-sm font-semibold text-white">
              {course.semester}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Users size={13} />
              Capacity
            </div>

            <span className="text-xs font-semibold text-cyan-300">
              {capacity}
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
              style={{
                width: `${Math.min(Math.max(capacity / 100, 0.05), 1) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs text-slate-600">
          <GraduationCap size={13} />

          <span className="truncate">
            {course.department?.name || "Department unavailable"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onView(course)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-xs font-medium text-slate-300 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.06] hover:text-cyan-200"
        >
          <Eye size={14} />
          Explore Course
          <ChevronRight size={14} />
        </button>
      </div>
    </motion.article>
  );
}

function CourseDetailsModal({
  course,
  onClose,
}: {
  course: Course | null;
  onClose: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  const { data: detailedCourse, isLoading } = useCourse(
    showDetails ? course?.id ?? null : null,
  );

  const activeCourse = detailedCourse ?? course;

  if (!course) return null;

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
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] text-cyan-300">
                    {course.code}
                  </span>

                  <span
                    className={`rounded-lg border px-3 py-1.5 text-[10px] font-semibold ${
                      course.isActive
                        ? "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300"
                        : "border-white/10 bg-white/[0.04] text-slate-500"
                    }`}
                  >
                    {course.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-semibold leading-tight text-white">
                  {activeCourse?.title}
                </h2>

                <p className="mt-2 text-xs text-slate-500">
                  Created {formatDate(activeCourse?.createdAt)}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition hover:border-white/20 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {!showDetails ? (
              <div className="mt-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                      Department
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {activeCourse?.department?.name || "—"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                      Faculty
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {activeCourse?.faculty?.name || "—"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                      Credit
                    </p>
                    <p className="mt-2 text-sm font-medium text-cyan-300">
                      {activeCourse?.credit ?? "—"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                      Semester
                    </p>
                    <p className="mt-2 text-sm font-medium text-cyan-300">
                      {activeCourse?.semester ?? "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.035] p-5">
                  <div className="flex items-center gap-3">
                    <BookOpen size={17} className="text-cyan-300" />
                    <p className="text-sm font-semibold text-white">
                      Course Overview
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {activeCourse?.description ||
                      "No course description has been provided."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] px-4 py-3 text-xs font-medium text-cyan-200 transition hover:bg-cyan-400/[0.1]"
                >
                  {isLoading ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <>
                      <Zap size={14} />
                      Load Full Course Details
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="mt-8">
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-16 animate-pulse rounded-2xl bg-white/[0.05]"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-3xl border border-white/8 bg-black/20 p-5">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                        Course Description
                      </p>

                      <p className="mt-3 text-sm leading-7 text-slate-400">
                        {activeCourse?.description ||
                          "No description available."}
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                        <p className="text-[10px] uppercase tracking-wider text-slate-600">
                          Course ID
                        </p>
                        <p className="mt-2 break-all text-xs font-medium text-slate-300">
                          {activeCourse?.id}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                        <p className="text-[10px] uppercase tracking-wider text-slate-600">
                          Capacity
                        </p>
                        <p className="mt-2 text-sm font-medium text-white">
                          {activeCourse?.capacity ?? "—"} students
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle2
                          size={17}
                          className={
                            activeCourse?.isActive
                              ? "text-emerald-300"
                              : "text-slate-600"
                          }
                        />

                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-600">
                            Course Status
                          </p>

                          <p className="mt-1 text-sm font-medium text-white">
                            {activeCourse?.isActive
                              ? "Currently active"
                              : "Currently inactive"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function FacultyCoursesPage() {
  const { data: courses = [], isLoading, isError, error, refetch, isFetching } =
    useCourses();

  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesStatus = activeOnly ? course.isActive : true;

      if (!matchesStatus) return false;

      if (!query) return true;

      return [
        course.code,
        course.title,
        course.description,
        course.department?.name,
        course.faculty?.name,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [courses, search, activeOnly]);

  const activeCount = courses.filter((course) => course.isActive).length;

  const totalCapacity = courses.reduce(
    (sum, course) => sum + Number(course.capacity || 0),
    0,
  );

  const errorMessage = getApiErrorMessage(
    error,
    "Unable to load course information.",
  );

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="min-h-full pb-10"
    >
      <div className="mx-auto max-w-[1500px]">
        {/* HERO */}
        <motion.section
          variants={itemVariants}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/[0.08] via-blue-500/[0.035] to-violet-500/[0.07] p-6 sm:p-8 lg:p-10"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                <BookOpen size={13} />
                Faculty Course Network
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Course{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  Command
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Explore course information, academic structure, capacity and
                faculty assignments from your teaching workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.07] px-5 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={isFetching ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </motion.section>

        {/* STATS */}
        <motion.section
          variants={containerVariants}
          className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <StatCard
            icon={BookOpen}
            label="Total Courses"
            value={String(courses.length)}
            detail="Available course records"
          />

          <StatCard
            icon={CheckCircle2}
            label="Active"
            value={String(activeCount)}
            detail="Currently active courses"
          />

          <StatCard
            icon={Layers3}
            label="Credits"
            value={String(
              courses.reduce(
                (sum, course) => sum + Number(course.credit || 0),
                0,
              ),
            )}
            detail="Combined course credits"
          />

          <StatCard
            icon={Users}
            label="Capacity"
            value={String(totalCapacity)}
            detail="Combined configured capacity"
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
                placeholder="Search course code, title, department..."
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400/30"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveOnly(true)}
                className={`rounded-xl border px-4 py-2.5 text-xs font-medium transition ${
                  activeOnly
                    ? "border-cyan-400/20 bg-cyan-400/[0.07] text-cyan-200"
                    : "border-white/8 bg-white/[0.025] text-slate-500"
                }`}
              >
                Active Only
              </button>

              <button
                type="button"
                onClick={() => setActiveOnly(false)}
                className={`rounded-xl border px-4 py-2.5 text-xs font-medium transition ${
                  !activeOnly
                    ? "border-cyan-400/20 bg-cyan-400/[0.07] text-cyan-200"
                    : "border-white/8 bg-white/[0.025] text-slate-500"
                }`}
              >
                All Courses
              </button>
            </div>
          </div>
        </motion.section>

        {/* CONTENT */}
        <section className="mt-6">
          {isLoading ? (
            <CourseSkeleton />
          ) : isError ? (
            <motion.div
              variants={itemVariants}
              className="rounded-3xl border border-red-400/15 bg-red-400/[0.035] p-10 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/15 bg-red-400/[0.07] text-red-300">
                <Zap size={23} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-white">
                Course network unavailable
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
          ) : filteredCourses.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="rounded-3xl border border-white/10 bg-white/[0.025] px-6 py-16 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-300">
                <BookOpen size={27} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-white">
                No courses found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try changing your search or switching the course filter.
              </p>

              {(search || activeOnly) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveOnly(false);
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
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onView={setSelectedCourse}
                />
              ))}
            </motion.div>
          )}
        </section>

        {!isLoading && !isError && courses.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/7 bg-white/[0.02] px-5 py-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>
              Showing {filteredCourses.length} of {courses.length} course
              records
            </span>

            <span className="flex items-center gap-2">
              <Code2 size={13} className="text-cyan-400" />
              NEXUS Faculty Network
            </span>
          </motion.div>
        )}
      </div>

      <CourseDetailsModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </motion.main>
  );
}