"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
  type Variants,
} from "framer-motion";

import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  CreditCard,
  Edit3,
  GraduationCap,
  Layers3,
  LoaderCircle,
  Plus,
  Search,
  Trash2,
  Users,
  X,
  Zap,
} from "lucide-react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  z,
} from "zod";

import {
  useCourse,
  useCourses,
  useCreateCourse,
  useDeleteCourse,
  useUpdateCourse,
  useUpdateCourseStatus,
  type Course,
} from "@/hooks/api/useCourses";

import {
  useDepartments,
} from "@/hooks/api/useDepartments";

import {
  useFaculties,
} from "@/hooks/api/useFaculties";

import {
  getApiErrorMessage,
} from "@/lib/api";

/* ============================================================
   ANIMATION VARIANTS
============================================================ */

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

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },

  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

/* ============================================================
   CREATE COURSE VALIDATION
============================================================ */

const createCourseSchema = z.object({
  code: z.string().trim().min(2, "Course code is required"),
  title: z.string().trim().min(2, "Course title is required"),
  description: z.string().trim().min(5, "Description is required"),

  credit: z.coerce
    .number()
    .min(0.5, "Credit must be at least 0.5")
    .max(10, "Credit cannot exceed 10"),

  departmentId: z.string().min(1, "Department is required"),

  facultyId: z.string().min(1, "Faculty is required"),

  semester: z.coerce
    .number()
    .int("Semester must be a whole number")
    .min(1, "Semester must be at least 1")
    .max(20, "Semester cannot exceed 20"),

  capacity: z.coerce
    .number()
    .int("Capacity must be a whole number")
    .min(1, "Capacity must be at least 1")
    .max(1000, "Capacity cannot exceed 1000"),
});

type CreateCourseFormInput = z.input<typeof createCourseSchema>;
type CreateCourseFormValues = z.output<typeof createCourseSchema>;

/* ============================================================
   HELPERS
============================================================ */

function formatDate(date?: string) {
  if (!date) return "—";

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(new Date(date));
}

/* ============================================================
   INPUT HELPERS
============================================================ */

function formInputClass(
  hasError = false,
) {
  return `h-12 w-full rounded-xl border ${
    hasError
      ? "border-red-400/50 focus:border-red-400/70"
      : "border-white/10 focus:border-cyan-400/40"
  } bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:bg-white/[0.07]`;
}

function formSelectClass(
  hasError = false,
) {
  return `h-12 w-full cursor-pointer rounded-xl border ${
    hasError
      ? "border-red-400/50 focus:border-red-400/70"
      : "border-white/10 focus:border-cyan-400/40"
  } bg-[#0b1322] px-4 text-sm text-white outline-none transition focus:bg-[#101b2e]`;
}

/* ============================================================
   COURSE SKELETON
============================================================ */

function CourseSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map(
        (_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-3xl border border-white/10 bg-white/[0.035] p-6"
          >
            <div className="mb-5 flex justify-between">
              <div className="h-10 w-20 rounded-xl bg-white/10" />

              <div className="h-7 w-20 rounded-full bg-white/10" />
            </div>

            <div className="h-6 w-3/4 rounded-lg bg-white/10" />

            <div className="mt-3 h-4 w-full rounded bg-white/5" />

            <div className="mt-2 h-4 w-5/6 rounded bg-white/5" />

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="h-16 rounded-2xl bg-white/5" />

              <div className="h-16 rounded-2xl bg-white/5" />
            </div>

            <div className="mt-5 h-10 rounded-xl bg-white/10" />
          </div>
        ),
      )}
    </div>
  );
}

/* ============================================================
   GENERIC MODAL
============================================================ */

function Modal({
  children,
  onClose,
  title,
  description,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  description?: string;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
        onMouseDown={(event) => {
          if (
            event.target ===
            event.currentTarget
          ) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.94,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.94,
            y: 20,
          }}
          transition={{
            duration: 0.25,
          }}
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-cyan-400/15 bg-[#080d19]/95 shadow-[0_0_80px_rgba(34,211,238,0.08)] backdrop-blur-2xl"
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

/* ============================================================
   CREATE COURSE MODAL
============================================================ */

function CreateCourseModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const createMutation =
    useCreateCourse();

  const {
    data: departments = [],
    isLoading: departmentsLoading,
    isError: departmentsError,
  } = useDepartments();

  const {
    data: faculties = [],
    isLoading: facultiesLoading,
    isError: facultiesError,
  } = useFaculties();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } =
    useForm<CreateCourseFormInput, unknown, CreateCourseFormValues>({
  resolver: zodResolver(createCourseSchema),
  defaultValues: {
    code: "",
    title: "",
    description: "",
    credit: 3,
    departmentId: "",
    facultyId: "",
    semester: 1,
    capacity: 30,
  },
});

  const close = () => {
    if (createMutation.isPending) {
      return;
    }

    reset();

    onClose();
  };

  const onSubmit = async (
    values: CreateCourseFormValues,
  ) => {
    try {
      await createMutation.mutateAsync(
        {
          code: values.code
            .trim()
            .toUpperCase(),

          title: values.title.trim(),

          description:
            values.description.trim(),

          credit: values.credit,

          departmentId:
            values.departmentId,

          facultyId:
            values.facultyId,

          semester:
            values.semester,

          capacity:
            values.capacity,
        },
      );

      reset();

      onClose();
    } catch {
      // Error is displayed below.
    }
  };

  const dependencyLoading =
    departmentsLoading ||
    facultiesLoading;

  const dependencyError =
    departmentsError ||
    facultiesError;

  return (
    <Modal
      title="Create New Course"
      description="Add a new course to the academic registry"
      onClose={close}
    >
      <form
        onSubmit={handleSubmit(
          onSubmit,
        )}
        className="space-y-6"
      >
        {/* Identity */}
        <div>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <Code2 className="size-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Course Identity
                </p>

                <p className="text-xs text-slate-500">
                  Basic course information
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Code */}
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-300">
                Course Code
              </label>

              <input
                {...register("code")}
                placeholder="CSE-101"
                className={formInputClass(
                  Boolean(
                    errors.code,
                  ),
                )}
              />

              {errors.code && (
                <p className="mt-1.5 text-xs text-red-400">
                  {
                    errors.code
                      .message
                  }
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-300">
                Course Title
              </label>

              <input
                {...register("title")}
                placeholder="Introduction to Programming"
                className={formInputClass(
                  Boolean(
                    errors.title,
                  ),
                )}
              />

              {errors.title && (
                <p className="mt-1.5 text-xs text-red-400">
                  {
                    errors.title
                      .message
                  }
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-xs font-medium text-slate-300">
            Description
          </label>

          <textarea
            {...register(
              "description",
            )}
            rows={4}
            placeholder="Fundamentals of programming and problem solving"
            className={`w-full resize-none rounded-xl border ${
              errors.description
                ? "border-red-400/50"
                : "border-white/10 focus:border-cyan-400/40"
            } bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:bg-white/[0.07]`}
          />

          {errors.description && (
            <p className="mt-1.5 text-xs text-red-400">
              {
                errors
                  .description
                  .message
              }
            </p>
          )}
        </div>

        {/* Academic assignment */}
        <div>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-purple-400/10 text-purple-300">
                <GraduationCap className="size-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Academic Assignment
                </p>

                <p className="text-xs text-slate-500">
                  Assign department and faculty
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Department */}
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-300">
                Department
              </label>

              <select
                {...register(
                  "departmentId",
                )}
                disabled={
                  departmentsLoading
                }
                className={formSelectClass(
                  Boolean(
                    errors.departmentId,
                  ),
                )}
              >
                <option value="">
                  {departmentsLoading
                    ? "Loading departments..."
                    : "Select department"}
                </option>

                {departments.map(
                  (department) => (
                    <option
                      key={
                        department.id
                      }
                      value={
                        department.id
                      }
                    >
                      {
                        department.name
                      }

                      {department.code
                        ? ` (${department.code})`
                        : ""}
                    </option>
                  ),
                )}
              </select>

              {errors.departmentId && (
                <p className="mt-1.5 text-xs text-red-400">
                  {
                    errors
                      .departmentId
                      .message
                  }
                </p>
              )}
            </div>

            {/* Faculty */}
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-300">
                Faculty
              </label>

              <select
                {...register(
                  "facultyId",
                )}
                disabled={
                  facultiesLoading
                }
                className={formSelectClass(
                  Boolean(
                    errors.facultyId,
                  ),
                )}
              >
                <option value="">
                  {facultiesLoading
                    ? "Loading faculty..."
                    : "Select faculty"}
                </option>

                {faculties.map(
                  (faculty) => (
                    <option
                      key={faculty.id}
                      value={faculty.id}
                    >
                      {faculty.name}

                      {faculty.employeeId
                        ? ` • ${faculty.employeeId}`
                        : ""}
                    </option>
                  ),
                )}
              </select>

              {errors.facultyId && (
                <p className="mt-1.5 text-xs text-red-400">
                  {
                    errors
                      .facultyId
                      .message
                  }
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Course configuration */}
        <div>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
                <Layers3 className="size-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Course Configuration
                </p>

                <p className="text-xs text-slate-500">
                  Set academic limits
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Credit */}
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-300">
                Credit
              </label>

              <input
                {...register(
                  "credit",
                )}
                type="number"
                min="0.5"
                max="10"
                step="0.5"
                className={formInputClass(
                  Boolean(
                    errors.credit,
                  ),
                )}
              />

              {errors.credit && (
                <p className="mt-1.5 text-xs text-red-400">
                  {
                    errors
                      .credit
                      .message
                  }
                </p>
              )}
            </div>

            {/* Semester */}
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-300">
                Semester
              </label>

              <input
                {...register(
                  "semester",
                )}
                type="number"
                min="1"
                max="12"
                className={formInputClass(
                  Boolean(
                    errors.semester,
                  ),
                )}
              />

              {errors.semester && (
                <p className="mt-1.5 text-xs text-red-400">
                  {
                    errors
                      .semester
                      .message
                  }
                </p>
              )}
            </div>

            {/* Capacity */}
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-300">
                Capacity
              </label>

              <input
                {...register(
                  "capacity",
                )}
                type="number"
                min="1"
                max="500"
                className={formInputClass(
                  Boolean(
                    errors.capacity,
                  ),
                )}
              />

              {errors.capacity && (
                <p className="mt-1.5 text-xs text-red-400">
                  {
                    errors
                      .capacity
                      .message
                  }
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Dependency error */}
        {dependencyError && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-400/10 bg-red-400/[0.05] p-4">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-300" />

            <div>
              <p className="text-sm font-medium text-red-300">
                Academic data unavailable
              </p>

              <p className="mt-1 text-xs leading-5 text-red-300/70">
                Departments or faculty could
                not be loaded. Please refresh
                and try again.
              </p>
            </div>
          </div>
        )}

        {/* API error */}
        {createMutation.isError && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-400/10 bg-red-400/[0.05] p-4">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-300" />

            <div>
              <p className="text-sm font-medium text-red-300">
                Course creation failed
              </p>

              <p className="mt-1 text-xs leading-5 text-red-300/70">
                {getApiErrorMessage(
                  createMutation.error,
                  "Unable to create the course.",
                )}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={close}
            disabled={
              createMutation.isPending
            }
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              createMutation.isPending ||
              dependencyLoading ||
              dependencyError
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createMutation.isPending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="size-4" />
                Create Course
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20"
    >
      <div
        className={`absolute -right-8 -top-8 size-24 rounded-full blur-3xl ${accent}`}
      />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Icon className="size-5 text-cyan-300" />
          </div>

          <Zap className="size-4 text-slate-600 transition group-hover:text-cyan-400" />
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

/* ============================================================
   COURSE DETAILS
============================================================ */

function CourseDetails({
  courseId,
  onClose,
}: {
  courseId: string;
  onClose: () => void;
}) {
  const {
    data: course,
    isLoading,
    isError,
  } = useCourse(courseId);

  if (isLoading) {
    return (
      <Modal
        title="Course Intelligence"
        onClose={onClose}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-16 rounded-2xl bg-white/5" />

          <div className="h-24 rounded-2xl bg-white/5" />

          <div className="h-24 rounded-2xl bg-white/5" />
        </div>
      </Modal>
    );
  }

  if (isError || !course) {
    return (
      <Modal
        title="Unable to load course"
        onClose={onClose}
      >
        <div className="rounded-2xl border border-red-400/10 bg-red-400/5 p-5 text-sm text-red-300">
          Course details could not be loaded.
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Course Intelligence"
      description="Complete academic profile"
      onClose={onClose}
    >
      <div className="space-y-5">
        <div className="rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.08] via-blue-500/[0.04] to-purple-500/[0.08] p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                <Code2 className="size-3.5" />

                {course.code}
              </div>

              <h3 className="text-2xl font-bold text-white">
                {course.title}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {course.description ||
                  "No course description available."}
              </p>
            </div>

            <div
              className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                course.isActive
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                  : "border-red-400/20 bg-red-400/10 text-red-300"
              }`}
            >
              <span className="size-1.5 rounded-full bg-current" />

              {course.isActive
                ? "ACTIVE"
                : "INACTIVE"}
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <InfoBox
            icon={CreditCard}
            label="Credit"
            value={`${course.credit} Credits`}
          />

          <InfoBox
            icon={Layers3}
            label="Semester"
            value={`Semester ${course.semester}`}
          />

          <InfoBox
            icon={Users}
            label="Capacity"
            value={`${course.capacity} Students`}
          />

          <InfoBox
            icon={GraduationCap}
            label="Department"
            value={
              course.department?.name ||
              course.departmentId
            }
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Assigned Faculty
          </p>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-400/10 text-purple-300">
              <GraduationCap className="size-5" />
            </div>

            <div>
              <p className="font-medium text-white">
                {course.faculty?.name ||
                  "Faculty not available"}
              </p>

              <p className="text-xs text-slate-500">
                {course.faculty
                  ?.designation ||
                  course.faculty
                    ?.employeeId ||
                  course.facultyId}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <p className="text-xs text-slate-500">
              Created
            </p>

            <p className="mt-1 text-sm font-medium text-slate-200">
              {formatDate(
                course.createdAt,
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <p className="text-xs text-slate-500">
              Last Updated
            </p>

            <p className="mt-1 text-sm font-medium text-slate-200">
              {formatDate(
                course.updatedAt,
              )}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ============================================================
   INFO BOX
============================================================ */

function InfoBox({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
          <Icon className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-slate-500">
            {label}
          </p>

          <p className="truncate text-sm font-medium text-slate-200">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   EDIT COURSE MODAL
============================================================ */

function EditCourseModal({
  course,
  onClose,
}: {
  course: Course;
  onClose: () => void;
}) {
  const updateMutation =
    useUpdateCourse();

  const [title, setTitle] =
    useState(course.title);

  const [capacity, setCapacity] =
    useState(
      String(course.capacity),
    );

  const submit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const cleanTitle =
      title.trim();

    const numericCapacity =
      Number(capacity);

    if (!cleanTitle) {
      return;
    }

    if (
      !Number.isInteger(
        numericCapacity,
      ) ||
      numericCapacity < 1
    ) {
      return;
    }

    try {
      await updateMutation.mutateAsync(
        {
          id: course.id,
          title: cleanTitle,
          capacity:
            numericCapacity,
        },
      );

      onClose();
    } catch {
      // Error displayed inside modal.
    }
  };

  return (
    <Modal
      title="Edit Course"
      description="Update the fields supported by the API"
      onClose={onClose}
    >
      <form
        onSubmit={submit}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Course Title
          </label>

          <input
            value={title}
            onChange={(event) =>
              setTitle(
                event.target.value,
              )
            }
            className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:bg-white/[0.07]"
            placeholder="Course title"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Capacity
          </label>

          <input
            type="number"
            min={1}
            value={capacity}
            onChange={(event) =>
              setCapacity(
                event.target.value,
              )
            }
            className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:bg-white/[0.07]"
          />
        </div>

        {updateMutation.isError && (
          <div className="rounded-xl border border-red-400/10 bg-red-400/5 p-3 text-sm text-red-300">
            {getApiErrorMessage(
              updateMutation.error,
              "Failed to update course.",
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={
            updateMutation.isPending
          }
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updateMutation.isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />

              Updating...
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4" />

              Save Changes
            </>
          )}
        </button>
      </form>
    </Modal>
  );
}

/* ============================================================
   MAIN PAGE
============================================================ */

export default function AdminCoursesPage() {
  const {
    data: courses = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useCourses();

  const deleteMutation =
    useDeleteCourse();

  const statusMutation =
    useUpdateCourseStatus();

  const [
    createModalOpen,
    setCreateModalOpen,
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedCourseId,
    setSelectedCourseId,
  ] = useState<string | null>(
    null,
  );

  const [
    editingCourse,
    setEditingCourse,
  ] = useState<Course | null>(
    null,
  );

  const [
    deletingCourse,
    setDeletingCourse,
  ] = useState<Course | null>(
    null,
  );

  const filteredCourses =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return courses;
      }

      return courses.filter(
        (course) => {
          return [
            course.code,
            course.title,
            course.description,
            course.department
              ?.name,
            course.faculty
              ?.name,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(query),
            );
        },
      );
    }, [courses, search]);

  const activeCourses =
    courses.filter(
      (course) =>
        course.isActive,
    ).length;

  const inactiveCourses =
    courses.filter(
      (course) =>
        !course.isActive,
    ).length;

  const totalCapacity =
    courses.reduce(
      (total, course) =>
        total +
        Number(
          course.capacity || 0,
        ),
      0,
    );

  const handleToggleStatus =
    async (
      course: Course,
    ) => {
      try {
        await statusMutation.mutateAsync(
          {
            id: course.id,
            isActive:
              !course.isActive,
          },
        );
      } catch {
        // API error handled by mutation.
      }
    };

  const handleDelete =
    async () => {
      if (!deletingCourse) {
        return;
      }

      try {
        await deleteMutation.mutateAsync(
          deletingCourse.id,
        );

        setDeletingCourse(null);
      } catch {
        // Error stays visible inside modal.
      }
    };

  return (
    <main className="min-h-full overflow-hidden">
      <div className="relative">
        {/* Ambient futuristic background */}
        <div className="pointer-events-none absolute -left-40 top-0 size-96 rounded-full bg-cyan-500/[0.06] blur-[120px]" />

        <div className="pointer-events-none absolute right-0 top-80 size-96 rounded-full bg-purple-500/[0.05] blur-[120px]" />

        <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.section
            initial="hidden"
            animate="show"
            variants={
              containerVariants
            }
            className="mb-8"
          >
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
            >
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                  <BookOpen className="size-3.5" />

                  Academic Core
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Course{" "}
                  <span className="gradient-text">
                    Command Center
                  </span>
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                  Manage academic courses,
                  faculty assignments,
                  capacity and course
                  availability from one
                  intelligent workspace.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                {/* NEW COURSE */}
                <button
                  type="button"
                  onClick={() =>
                    setCreateModalOpen(
                      true,
                    )
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30"
                >
                  <Plus className="size-4" />

                  New Course
                </button>

                {/* REFRESH */}
                <button
                  type="button"
                  onClick={() =>
                    refetch()
                  }
                  disabled={
                    isFetching
                  }
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
              </div>
            </motion.div>

            {/* Stats */}
            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={BookOpen}
                label="Total Courses"
                value={
                  courses.length
                }
                accent="bg-cyan-400/20"
              />

              <StatCard
                icon={
                  CheckCircle2
                }
                label="Active Courses"
                value={
                  activeCourses
                }
                accent="bg-emerald-400/20"
              />

              <StatCard
                icon={AlertCircle}
                label="Inactive Courses"
                value={
                  inactiveCourses
                }
                accent="bg-red-400/20"
              />

              <StatCard
                icon={Users}
                label="Total Capacity"
                value={
                  totalCapacity
                }
                accent="bg-purple-400/20"
              />
            </div>
          </motion.section>

          {/* Search */}
          <motion.section
            initial="hidden"
            animate="show"
            variants={
              containerVariants
            }
            className="mb-6"
          >
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-400/[0.025] via-transparent to-purple-500/[0.025]" />

              <div className="relative flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

                  <input
                    value={search}
                    onChange={(
                      event,
                    ) =>
                      setSearch(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Search by course code, title, department or faculty..."
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/30"
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 text-xs text-slate-400 sm:min-w-36">
                  <span>
                    Showing
                  </span>

                  <span className="font-semibold text-cyan-300">
                    {
                      filteredCourses.length
                    }
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* Content */}
          {isLoading ? (
            <CourseSkeleton />
          ) : isError ? (
            <div className="rounded-3xl border border-red-400/10 bg-red-400/[0.04] p-10 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">
                <AlertCircle className="size-6" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-white">
                Course data unavailable
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                Something went wrong
                while loading the
                academic course
                registry.
              </p>

              <button
                type="button"
                onClick={() =>
                  refetch()
                }
                className="mt-6 rounded-xl bg-red-400/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/15"
              >
                Try Again
              </button>
            </div>
          ) : filteredCourses.length ===
            0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-12 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-cyan-400/[0.07] text-cyan-300">
                <Search className="size-7" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-white">
                No courses found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try another search
                term.
              </p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={
                containerVariants
              }
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {filteredCourses.map(
                (course) => (
                  <motion.article
                    key={course.id}
                    variants={
                      itemVariants
                    }
                    whileHover={{
                      y: -5,
                    }}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition hover:border-cyan-400/20 hover:shadow-[0_20px_70px_rgba(0,0,0,0.25)]"
                  >
                    <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-cyan-400/[0.045] blur-3xl transition group-hover:bg-cyan-400/[0.09]" />

                    <div className="relative">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-11 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.07] text-cyan-300">
                            <BookOpen className="size-5" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold tracking-wider text-cyan-300">
                                {
                                  course.code
                                }
                              </span>

                              <span
                                className={`size-1.5 rounded-full ${
                                  course.isActive
                                    ? "bg-emerald-400"
                                    : "bg-red-400"
                                }`}
                              />
                            </div>

                            <p className="mt-0.5 text-xs text-slate-500">
                              Semester{" "}
                              {
                                course.semester
                              }
                            </p>
                          </div>
                        </div>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            course.isActive
                              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                              : "border-red-400/20 bg-red-400/10 text-red-300"
                          }`}
                        >
                          {course.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>

                      <h2 className="mt-5 line-clamp-2 text-lg font-semibold text-white transition group-hover:text-cyan-100">
                        {
                          course.title
                        }
                      </h2>

                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                        {course.description ||
                          "No description available for this course."}
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                          <div className="flex items-center gap-2 text-slate-500">
                            <CreditCard className="size-3.5" />

                            <span className="text-[11px]">
                              Credit
                            </span>
                          </div>

                          <p className="mt-1 text-sm font-semibold text-white">
                            {
                              course.credit
                            }
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                          <div className="flex items-center gap-2 text-slate-500">
                            <Users className="size-3.5" />

                            <span className="text-[11px]">
                              Capacity
                            </span>
                          </div>

                          <p className="mt-1 text-sm font-semibold text-white">
                            {
                              course.capacity
                            }
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-purple-400/10 text-purple-300">
                            <GraduationCap className="size-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-slate-300">
                              {
                                course.faculty
                                  ?.name ||
                                "Faculty not assigned"
                              }
                            </p>

                            <p className="truncate text-[11px] text-slate-600">
                              {
                                course.department
                                  ?.name ||
                                course.departmentId
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCourseId(
                              course.id,
                            )
                          }
                          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-medium text-slate-300 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.06] hover:text-cyan-200"
                        >
                          <ChevronRight className="size-4" />

                          Details
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setEditingCourse(
                              course,
                            )
                          }
                          className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-blue-400/20 hover:bg-blue-400/10 hover:text-blue-300"
                          title="Edit course"
                        >
                          <Edit3 className="size-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStatus(
                              course,
                            )
                          }
                          disabled={
                            statusMutation.isPending
                          }
                          className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-emerald-400/20 hover:bg-emerald-400/10 hover:text-emerald-300 disabled:opacity-40"
                          title={
                            course.isActive
                              ? "Deactivate"
                              : "Activate"
                          }
                        >
                          {statusMutation.isPending ? (
                            <LoaderCircle className="size-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="size-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeletingCourse(
                              course,
                            )
                          }
                          className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-300"
                          title="Delete course"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ),
              )}
            </motion.div>
          )}

          {/* Footer hint */}
          {!isLoading &&
            !isError &&
            courses.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-600">
                <Layers3 className="size-3.5" />

                Course registry synced
                with university API
              </div>
            )}
        </div>
      </div>

      {/* ======================================================
          CREATE COURSE
      ====================================================== */}

      {createModalOpen && (
        <CreateCourseModal
          onClose={() =>
            setCreateModalOpen(
              false,
            )
          }
        />
      )}

      {/* ======================================================
          DETAILS
      ====================================================== */}

      {selectedCourseId && (
        <CourseDetails
          courseId={
            selectedCourseId
          }
          onClose={() =>
            setSelectedCourseId(
              null,
            )
          }
        />
      )}

      {/* ======================================================
          EDIT
      ====================================================== */}

      {editingCourse && (
        <EditCourseModal
          course={
            editingCourse
          }
          onClose={() =>
            setEditingCourse(
              null,
            )
          }
        />
      )}

      {/* ======================================================
          DELETE CONFIRMATION
      ====================================================== */}

      {deletingCourse && (
        <Modal
          title="Delete Course?"
          description="This action cannot be undone."
          onClose={() =>
            setDeletingCourse(
              null,
            )
          }
        >
          <div className="space-y-5">
            <div className="rounded-2xl border border-red-400/10 bg-red-400/[0.05] p-5">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
                  <Trash2 className="size-5" />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    {
                      deletingCourse.title
                    }
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {
                      deletingCourse.code
                    }
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm leading-6 text-slate-400">
              Are you sure you want
              to permanently remove
              this course from the
              academic registry?
            </p>

            {deleteMutation.isError && (
              <div className="rounded-xl border border-red-400/10 bg-red-400/5 p-3 text-sm text-red-300">
                {getApiErrorMessage(
                  deleteMutation.error,
                  "Failed to delete the course. Please try again.",
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeletingCourse(
                    null,
                  )
                }
                disabled={
                  deleteMutation.isPending
                }
                className="h-11 flex-1 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleDelete
                }
                disabled={
                  deleteMutation.isPending
                }
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/90 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />

                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4" />

                    Delete Course
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}