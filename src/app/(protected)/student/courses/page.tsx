"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Code2,
  GraduationCap,
  Layers3,
  LoaderCircle,
  Search,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useCourse,
  useCourses,
  type Course,
} from "@/hooks/api/useCourses";
import {
  useEnrollments,
  type Enrollment,
} from "@/hooks/api/useEnrollments";
import { api, getApiErrorMessage } from "@/lib/api";

const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
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

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

function formatDate(date?: string) {
  if (!date) return "Recently added";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function CourseSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5">
      <div className="animate-pulse space-y-5">
        <div className="h-28 rounded-2xl bg-white/[0.07]" />

        <div className="space-y-3">
          <div className="h-4 w-24 rounded bg-white/[0.07]" />
          <div className="h-6 w-4/5 rounded bg-white/[0.07]" />
          <div className="h-4 w-full rounded bg-white/[0.05]" />
          <div className="h-4 w-3/4 rounded bg-white/[0.05]" />
        </div>

        <div className="h-11 rounded-xl bg-white/[0.06]" />
      </div>
    </div>
  );
}

function CourseDetailsModal({
  courseId,
  onClose,
  onEnroll,
  enrollingId,
  isAlreadyEnrolled,
}: {
  courseId: string;
  onClose: () => void;
  onEnroll: (course: Course) => void;
  enrollingId: string | null;
  isAlreadyEnrolled: boolean;
}) {
  const { data: course, isLoading, isError } = useCourse(courseId);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-cyan-400/20 bg-[#07101f] shadow-[0_0_80px_rgba(34,211,238,0.12)]"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/60 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {isLoading ? (
            <div className="space-y-6 p-8">
              <div className="h-40 animate-pulse rounded-3xl bg-white/[0.06]" />
              <div className="h-8 w-2/3 animate-pulse rounded bg-white/[0.06]" />
              <div className="h-20 animate-pulse rounded bg-white/[0.04]" />
            </div>
          ) : isError || !course ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10">
                <BookOpen className="h-7 w-7 text-red-300" />
              </div>

              <h3 className="text-xl font-semibold text-white">
                Course unavailable
              </h3>

              <p className="mt-2 max-w-md text-sm text-white/45">
                We could not load this course right now. Please close this
                window and try again.
              </p>
            </div>
          ) : (
            <div>
              <div className="relative overflow-hidden px-7 pb-8 pt-8 sm:px-9">
                <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

                <div className="relative">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 font-mono text-xs font-semibold tracking-wider text-cyan-300">
                      {course.code}
                    </span>

                    {course.isActive ? (
                      <span className="flex items-center gap-1.5 rounded-lg border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                        Enrollment Open
                      </span>
                    ) : (
                      <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/40">
                        Inactive
                      </span>
                    )}
                  </div>

                  <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {course.title}
                  </h2>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
                    {course.description ||
                      "No detailed course description is available yet."}
                  </p>

                  <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <InfoBox
                      icon={<Layers3 className="h-4 w-4" />}
                      label="Credits"
                      value={String(course.credit)}
                    />
                    <InfoBox
                      icon={<GraduationCap className="h-4 w-4" />}
                      label="Semester"
                      value={`Sem ${course.semester}`}
                    />
                    <InfoBox
                      icon={<Users className="h-4 w-4" />}
                      label="Capacity"
                      value={String(course.capacity)}
                    />
                    <InfoBox
                      icon={<Clock3 className="h-4 w-4" />}
                      label="Added"
                      value={formatDate(course.createdAt)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 p-7 sm:p-9">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
                    <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/35">
                      <Layers3 className="h-4 w-4" />
                      Department
                    </div>

                    <p className="font-medium text-white">
                      {course.department?.name || "Department information unavailable"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
                    <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/35">
                      <GraduationCap className="h-4 w-4" />
                      Faculty
                    </div>

                    <p className="font-medium text-white">
                      {course.faculty?.name || "Faculty information unavailable"}
                    </p>

                    {course.faculty?.designation && (
                      <p className="mt-1 text-xs text-white/35">
                        {course.faculty.designation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  {isAlreadyEnrolled ? (
                    <div className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm font-semibold text-emerald-300">
                      <CheckCircle2 className="h-5 w-5" />
                      You are already enrolled
                    </div>
                  ) : !course.isActive ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-center text-sm text-white/40">
                      This course is currently unavailable for enrollment.
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onEnroll(course)}
                      disabled={enrollingId === course.id}
                      className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-5 py-4 text-sm font-bold text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.16)] transition hover:shadow-[0_0_45px_rgba(34,211,238,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {enrollingId === course.id ? (
                        <>
                          <LoaderCircle className="h-5 w-5 animate-spin" />
                          Processing enrollment...
                        </>
                      ) : (
                        <>
                          Enroll in this course
                          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-4">
      <div className="mb-2 flex items-center gap-2 text-white/35">
        {icon}
        <span className="text-[11px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function CourseCard({
  course,
  enrollment,
  onDetails,
  onEnroll,
  enrollingId,
}: {
  course: Course;
  enrollment?: Enrollment;
  onDetails: (id: string) => void;
  onEnroll: (course: Course) => void;
  enrollingId: string | null;
}) {
  const enrolled = Boolean(enrollment);

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 transition-colors hover:border-cyan-400/20 hover:bg-white/[0.05]"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/8 blur-3xl transition-all duration-500 group-hover:bg-cyan-400/15" />

      <div className="relative">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
              <Code2 className="h-5 w-5" />
            </span>

            <div>
              <p className="font-mono text-xs font-semibold tracking-wider text-cyan-300">
                {course.code}
              </p>

              <p className="mt-0.5 text-[11px] text-white/30">
                Semester {course.semester}
              </p>
            </div>
          </div>

          {enrolled ? (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
              <CheckCircle2 className="h-3 w-3" />
              {enrollment?.status}
            </span>
          ) : course.isActive ? (
            <span className="flex items-center gap-1.5 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              Open
            </span>
          ) : (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/35">
              Closed
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 min-h-[3.5rem] text-xl font-semibold leading-7 tracking-tight text-white">
          {course.title}
        </h3>

        <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-white/40">
          {course.description || "No course description available."}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <MiniStat
            icon={<Layers3 className="h-3.5 w-3.5" />}
            value={`${course.credit}`}
            label="Credits"
          />
          <MiniStat
            icon={<Users className="h-3.5 w-3.5" />}
            value={`${course.capacity}`}
            label="Seats"
          />
          <MiniStat
            icon={<GraduationCap className="h-3.5 w-3.5" />}
            value={`S${course.semester}`}
            label="Term"
          />
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-white/8 pt-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-white/60">
              {course.faculty?.name || "Faculty not assigned"}
            </p>

            <p className="mt-0.5 truncate text-[11px] text-white/30">
              {course.department?.name || "Department unavailable"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onDetails(course.id)}
            className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-white/65 transition hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-cyan-300"
          >
            Details
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {!enrolled && course.isActive && (
          <button
            type="button"
            onClick={() => onEnroll(course)}
            disabled={enrollingId === course.id}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-slate-950 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enrollingId === course.id ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Enrolling...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Enroll Now
              </>
            )}
          </button>
        )}

        {enrolled && (
          <div className="mt-3 flex w-full items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.06] px-4 py-3 text-xs font-medium text-emerald-300/80">
            Enrollment status: {enrollment?.status}
          </div>
        )}
      </div>
    </motion.article>
  );
}

function MiniStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/7 bg-white/[0.025] px-2.5 py-2.5">
      <div className="flex items-center gap-1.5 text-white/30">
        {icon}
        <span className="text-[9px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-white/80">{value}</p>
    </div>
  );
}

export default function StudentCoursesPage() {
  const queryClient = useQueryClient();

  const {
    data: courses = [],
    isLoading: coursesLoading,
    isError: coursesError,
    refetch: refetchCourses,
  } = useCourses();

  const {
    data: enrollments = [],
    isLoading: enrollmentsLoading,
    isError: enrollmentsError,
  } = useEnrollments();

  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    null,
  );
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const enrollmentMap = useMemo(() => {
    const map = new Map<string, Enrollment>();

    enrollments.forEach((enrollment) => {
      map.set(enrollment.courseId, enrollment);
    });

    return map;
  }, [enrollments]);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          course.code,
          course.title,
          course.description,
          course.department?.name,
          course.faculty?.name,
          course.faculty?.designation,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedSearch),
          );

      const matchesStatus = !activeOnly || course.isActive;

      return matchesSearch && matchesStatus;
    });
  }, [courses, search, activeOnly]);

  const stats = useMemo(() => {
    const enrolledCount = enrollments.length;
    const activeCount = courses.filter((course) => course.isActive).length;
    const availableCount = courses.filter(
      (course) => course.isActive && !enrollmentMap.has(course.id),
    ).length;

    return {
      total: courses.length,
      active: activeCount,
      enrolled: enrolledCount,
      available: availableCount,
    };
  }, [courses, enrollments, enrollmentMap]);

  async function handleEnroll(course: Course) {
    if (enrollmentMap.has(course.id)) {
      setActionMessage({
        type: "error",
        text: "You already have an enrollment for this course.",
      });
      return;
    }

    if (!course.isActive) {
      setActionMessage({
        type: "error",
        text: "This course is currently unavailable.",
      });
      return;
    }

    try {
      setActionMessage(null);
      setEnrollingId(course.id);

      await api.post("/enrollments", {
        courseId: course.id,
      });

      await queryClient.invalidateQueries({
        queryKey: ["enrollments"],
      });

      setActionMessage({
        type: "success",
        text: `${course.code} enrollment request submitted successfully.`,
      });

      setSelectedCourseId(null);
    } catch (error) {
      setActionMessage({
        type: "error",
        text: getApiErrorMessage(
          error,
          "Could not submit enrollment request.",
        ),
      });
    } finally {
      setEnrollingId(null);
    }
  }

  const isLoading = coursesLoading || enrollmentsLoading;
  const isError = coursesError || enrollmentsError;

  return (
    <main className="min-h-full pb-12">
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="show"
        className="space-y-7"
      >
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/[0.07] via-white/[0.025] to-violet-500/[0.07] p-6 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                <Sparkles className="h-3.5 w-3.5" />
                Academic Course Network
              </div>

              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Explore your next{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  learning path.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
                Discover active university courses, inspect their academic
                details, and submit enrollment requests from one futuristic
                course explorer.
              </p>
            </div>

            <div className="relative hidden h-40 w-40 lg:block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-5 rounded-full border border-cyan-400/20"
              />

              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-10 rounded-full border border-violet-400/20 border-dashed"
              />

              <div className="absolute inset-[3.75rem] flex items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/10 shadow-[0_0_45px_rgba(34,211,238,0.18)]">
                <BookOpen className="h-8 w-8 text-cyan-300" />
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={<BookOpen className="h-5 w-5" />}
            label="Courses"
            value={stats.total}
            accent="cyan"
          />
          <StatCard
            icon={<Zap className="h-5 w-5" />}
            label="Active"
            value={stats.active}
            accent="blue"
          />
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="My Enrollments"
            value={stats.enrolled}
            accent="emerald"
          />
          <StatCard
            icon={<Sparkles className="h-5 w-5" />}
            label="Available"
            value={stats.available}
            accent="violet"
          />
        </section>

        {/* SEARCH / FILTER */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by course code, title, faculty or department..."
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-cyan-400/30 focus:bg-black/30"
              />
            </div>

            <button
              type="button"
              onClick={() => setActiveOnly((current) => !current)}
              className={`flex h-12 items-center justify-center gap-2 rounded-2xl border px-5 text-sm font-semibold transition ${
                activeOnly
                  ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                  : "border-white/10 bg-white/[0.03] text-white/45 hover:text-white"
              }`}
            >
              <Zap className="h-4 w-4" />
              Active only
            </button>

            <button
              type="button"
              onClick={() => refetchCourses()}
              disabled={coursesLoading}
              className="flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-sm font-semibold text-white/55 transition hover:border-white/20 hover:text-white disabled:opacity-40"
            >
              {coursesLoading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                "Refresh"
              )}
            </button>
          </div>
        </section>

        {/* FEEDBACK */}
        <AnimatePresence mode="wait">
          {actionMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-sm ${
                actionMessage.type === "success"
                  ? "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300"
                  : "border-red-400/15 bg-red-400/[0.07] text-red-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {actionMessage.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <X className="h-4 w-4 shrink-0" />
                )}

                <span>{actionMessage.text}</span>
              </div>

              <button
                type="button"
                onClick={() => setActionMessage(null)}
                className="text-white/30 transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COURSES */}
        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <section className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-red-400/10 bg-red-400/[0.025] p-8 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/15 bg-red-400/10">
              <BookOpen className="h-7 w-7 text-red-300" />
            </div>

            <h2 className="text-xl font-semibold text-white">
              Course network unavailable
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-white/40">
              We could not load the available courses. Check your connection
              and try again.
            </p>

            <button
              type="button"
              onClick={() => refetchCourses()}
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50"
            >
              Try again
            </button>
          </section>
        ) : filteredCourses.length === 0 ? (
          <section className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <Search className="h-7 w-7 text-white/30" />
            </div>

            <h2 className="text-xl font-semibold text-white">
              No courses found
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-white/35">
              Try another search term or disable the active-only filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveOnly(false);
              }}
              className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/65 transition hover:border-cyan-400/20 hover:text-cyan-300"
            >
              Clear filters
            </button>
          </section>
        ) : (
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                enrollment={enrollmentMap.get(course.id)}
                onDetails={setSelectedCourseId}
                onEnroll={handleEnroll}
                enrollingId={enrollingId}
              />
            ))}
          </motion.section>
        )}

        {/* FOOTER INFO */}
        {!isLoading && filteredCourses.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-white/7 pt-5 text-xs text-white/25 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {filteredCourses.length} of {courses.length} courses
            </span>

            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Course data synchronized with university system
            </span>
          </div>
        )}
      </motion.div>

      {/* DETAILS MODAL */}
      {selectedCourseId && (
        <CourseDetailsModal
          courseId={selectedCourseId}
          onClose={() => setSelectedCourseId(null)}
          onEnroll={handleEnroll}
          enrollingId={enrollingId}
          isAlreadyEnrolled={Boolean(
            enrollmentMap.get(selectedCourseId),
          )}
        />
      )}
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: "cyan" | "blue" | "emerald" | "violet";
}) {
  const accentClasses = {
    cyan: "border-cyan-400/15 bg-cyan-400/10 text-cyan-300",
    blue: "border-blue-400/15 bg-blue-400/10 text-blue-300",
    emerald: "border-emerald-400/15 bg-emerald-400/10 text-emerald-300",
    violet: "border-violet-400/15 bg-violet-400/10 text-violet-300",
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${accentClasses[accent]}`}
        >
          {icon}
        </div>

        <span className="text-2xl font-semibold text-white">{value}</span>
      </div>

      <p className="mt-4 text-xs uppercase tracking-[0.15em] text-white/30">
        {label}
      </p>
    </div>
  );
}