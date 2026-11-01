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
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  useCourse,
  useCourses,
  useCreateCourse,
  useDeleteCourse,
  useUpdateCourse,
  useUpdateCourseStatus,
  type Course,
} from "@/hooks/api/useCourses";
import { useDepartments } from "@/hooks/api/useDepartments";
import { useFaculties } from "@/hooks/api/useFaculties";
import { getApiErrorMessage } from "@/lib/api";

/* ============================================================
   ANIMATION
============================================================ */

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

/* ============================================================
   HELPERS
============================================================ */

function formatDate(date?: string | Date | null): string {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatFee(fee?: number | string | null): string {
  const amount = Number(fee);

  if (fee === null || fee === undefined || !Number.isFinite(amount)) {
    return "Not set";
  }

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount);
}

function inputClass(error = false): string {
  return [
    "h-12 w-full rounded-xl border px-4 text-sm text-white",
    "bg-white/[0.04] outline-none transition",
    "placeholder:text-slate-600 focus:bg-white/[0.07]",
    error
      ? "border-red-400/50 focus:border-red-400"
      : "border-white/10 focus:border-cyan-400/40",
  ].join(" ");
}

function selectClass(error = false): string {
  return [
    "h-12 w-full rounded-xl border px-4 text-sm text-white",
    "bg-[#0b1322] outline-none transition",
    error
      ? "border-red-400/50"
      : "border-white/10 focus:border-cyan-400/40",
  ].join(" ");
}

/* ============================================================
   CREATE COURSE VALIDATION
============================================================ */

const createCourseSchema = z.object({
  code: z.string().trim().min(2, "Course code is required").max(30),
  title: z.string().trim().min(2, "Course title is required").max(150),
  description: z
    .string()
    .trim()
    .min(5, "Description must contain at least 5 characters")
    .max(2000),
  credit: z.coerce
    .number()
    .finite()
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
  fee: z.coerce
    .number()
    .finite("Enter a valid course fee")
    .positive("Course fee must be greater than 0")
    .max(10_000_000, "Course fee is too high"),
});

type CreateCourseInput = z.input<typeof createCourseSchema>;
type CreateCourseValues = z.output<typeof createCourseSchema>;

/* ============================================================
   EDIT COURSE VALIDATION
============================================================ */

const editCourseSchema = z.object({
  title: z.string().trim().min(2, "Course title is required").max(150),
  capacity: z.coerce
    .number()
    .finite()
    .int("Capacity must be a whole number")
    .min(1, "Capacity must be at least 1")
    .max(1000, "Capacity cannot exceed 1000"),
  fee: z.coerce
    .number()
    .finite("Enter a valid course fee")
    .positive("Course fee must be greater than 0")
    .max(10_000_000, "Course fee is too high"),
});

type EditCourseInput = z.input<typeof editCourseSchema>;
type EditCourseValues = z.output<typeof editCourseSchema>;

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.22 }}
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-cyan-400/15 bg-[#080d19] shadow-[0_0_80px_rgba(34,211,238,0.08)]"
        >
          <div className="flex items-start justify-between border-b border-white/10 p-6">
            <div>
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              {description && (
                <p className="mt-1 text-sm text-slate-400">{description}</p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ============================================================
   REUSABLE FORM SECTION
============================================================ */

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;

  return <p className="mt-1.5 text-xs text-red-400">{children}</p>;
}

/* ============================================================
   CREATE COURSE MODAL
============================================================ */

function CreateCourseModal({ onClose }: { onClose: () => void }) {
  const createMutation = useCreateCourse();

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
    formState: { errors },
  } = useForm<CreateCourseInput, unknown, CreateCourseValues>({
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
      fee: 1000,
    },
  });

  const pending = createMutation.isPending;
  const dependenciesLoading = departmentsLoading || facultiesLoading;
  const dependenciesError = departmentsError || facultiesError;

  const close = () => {
    if (pending) return;
    reset();
    onClose();
  };

  const onSubmit: SubmitHandler<CreateCourseValues> = async (values) => {
    try {
      await createMutation.mutateAsync({
        code: values.code.trim().toUpperCase(),
        title: values.title.trim(),
        description: values.description.trim(),
        credit: values.credit,
        departmentId: values.departmentId,
        facultyId: values.facultyId,
        semester: values.semester,
        capacity: values.capacity,
        fee: values.fee,
      });

      reset();
      onClose();
    } catch {
      // API error is displayed below.
    }
  };

  return (
    <Modal
      title="Create New Course"
      description="Add a new course to the academic registry"
      onClose={close}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section>
          <SectionHeading
            icon={Code2}
            title="Course Identity"
            description="Basic course information"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-300">
                Course Code
              </label>
              <input
                {...register("code")}
                placeholder="CSE-101"
                className={inputClass(Boolean(errors.code))}
              />
              <FieldError>{errors.code?.message}</FieldError>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-300">
                Course Title
              </label>
              <input
                {...register("title")}
                placeholder="Introduction to Programming"
                className={inputClass(Boolean(errors.title))}
              />
              <FieldError>{errors.title?.message}</FieldError>
            </div>
          </div>
        </section>

        <section>
          <label className="mb-2 block text-xs font-medium text-slate-300">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="Describe the course..."
            className={[
              "w-full resize-none rounded-xl border bg-white/[0.04] px-4 py-3",
              "text-sm text-white outline-none transition placeholder:text-slate-600",
              errors.description
                ? "border-red-400/50"
                : "border-white/10 focus:border-cyan-400/40",
            ].join(" ")}
          />
          <FieldError>{errors.description?.message}</FieldError>
        </section>

        <section>
          <SectionHeading
            icon={GraduationCap}
            title="Academic Assignment"
            description="Assign department and faculty"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-300">
                Department
              </label>
              <select
                {...register("departmentId")}
                disabled={departmentsLoading || departmentsError}
                className={selectClass(Boolean(errors.departmentId))}
              >
                <option value="">
                  {departmentsLoading ? "Loading departments..." : "Select department"}
                </option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                    {department.code ? ` (${department.code})` : ""}
                  </option>
                ))}
              </select>
              <FieldError>{errors.departmentId?.message}</FieldError>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-300">
                Faculty
              </label>
              <select
                {...register("facultyId")}
                disabled={facultiesLoading || facultiesError}
                className={selectClass(Boolean(errors.facultyId))}
              >
                <option value="">
                  {facultiesLoading ? "Loading faculty..." : "Select faculty"}
                </option>
                {faculties.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name}
                    {faculty.employeeId ? ` • ${faculty.employeeId}` : ""}
                  </option>
                ))}
              </select>
              <FieldError>{errors.facultyId?.message}</FieldError>
            </div>
          </div>
        </section>

        <section>
          <SectionHeading
            icon={Layers3}
            title="Course Configuration"
            description="Set academic limits and fee"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-300">
                Credit
              </label>
              <input
                {...register("credit")}
                type="number"
                min="0.5"
                max="10"
                step="0.5"
                className={inputClass(Boolean(errors.credit))}
              />
              <FieldError>{errors.credit?.message}</FieldError>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-300">
                Semester
              </label>
              <input
                {...register("semester")}
                type="number"
                min="1"
                max="20"
                className={inputClass(Boolean(errors.semester))}
              />
              <FieldError>{errors.semester?.message}</FieldError>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-300">
                Capacity
              </label>
              <input
                {...register("capacity")}
                type="number"
                min="1"
                max="1000"
                className={inputClass(Boolean(errors.capacity))}
              />
              <FieldError>{errors.capacity?.message}</FieldError>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-2 block text-xs font-medium text-slate-300">
                Course Fee (BDT)
              </label>
              <input
                {...register("fee")}
                type="number"
                min="0.01"
                max="10000000"
                step="0.01"
                placeholder="Enter course fee"
                className={inputClass(Boolean(errors.fee))}
              />
              <FieldError>{errors.fee?.message}</FieldError>
              <p className="mt-1 text-xs text-slate-500">
                Enter a fee greater than 0. This fee is sent to the backend.
              </p>
            </div>
          </div>
        </section>

        {dependenciesError && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-400/10 bg-red-400/[0.05] p-4">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-300" />
            <div>
              <p className="text-sm font-medium text-red-300">
                Academic data unavailable
              </p>
              <p className="mt-1 text-xs leading-5 text-red-300/70">
                Departments or faculty could not be loaded. Refresh and try again.
              </p>
            </div>
          </div>
        )}

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

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={close}
            disabled={pending}
            className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={pending || dependenciesLoading || dependenciesError}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? (
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
      <div className={`absolute -right-8 -top-8 size-24 rounded-full blur-3xl ${accent}`} />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Icon className="size-5 text-cyan-300" />
          </div>
          <Zap className="size-4 text-slate-600 transition group-hover:text-cyan-400" />
        </div>

        <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
        <p className="mt-1 text-sm text-slate-400">{label}</p>
      </div>
    </motion.div>
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
          <p className="text-xs text-slate-500">{label}</p>
          <p className="truncate text-sm font-medium text-slate-200">{value}</p>
        </div>
      </div>
    </div>
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
  const { data: course, isLoading, isError, refetch } = useCourse(courseId);

  if (isLoading) {
    return (
      <Modal title="Course Intelligence" onClose={onClose}>
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
      <Modal title="Unable to load course" onClose={onClose}>
        <div className="rounded-2xl border border-red-400/10 bg-red-400/5 p-5 text-sm text-red-300">
          <p>Course details could not be loaded.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-red-400/10 px-4 py-2 hover:bg-red-400/20"
          >
            Try Again
          </button>
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

              <h3 className="text-2xl font-bold text-white">{course.title}</h3>
              <p className="mt-2 text-sm text-slate-400">
                {course.description || "No course description available."}
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
              {course.isActive ? "ACTIVE" : "INACTIVE"}
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <InfoBox
            icon={CreditCard}
            label="Course Fee"
            value={formatFee(course.fee)}
          />
          <InfoBox
            icon={BookOpen}
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
            value={course.department?.name || course.departmentId}
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
                {course.faculty?.name || "Faculty not available"}
              </p>
              <p className="text-xs text-slate-500">
                {course.faculty?.designation ||
                  course.faculty?.employeeId ||
                  course.facultyId}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <p className="text-xs text-slate-500">Created</p>
            <p className="mt-1 text-sm font-medium text-slate-200">
              {formatDate(course.createdAt)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <p className="text-xs text-slate-500">Last Updated</p>
            <p className="mt-1 text-sm font-medium text-slate-200">
              {formatDate(course.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </Modal>
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
  const updateMutation = useUpdateCourse();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditCourseInput, unknown, EditCourseValues>({
    resolver: zodResolver(editCourseSchema),
    defaultValues: {
      title: course.title,
      capacity: course.capacity,
      fee: Number(course.fee),
    },
  });

  const onSubmit: SubmitHandler<EditCourseValues> = async (values) => {
    try {
      await updateMutation.mutateAsync({
        id: course.id,
        title: values.title.trim(),
        capacity: values.capacity,
        fee: values.fee,
      });

      onClose();
    } catch {
      // API error is displayed inside the modal.
    }
  };

  return (
    <Modal
      title="Edit Course"
      description="Update course title, capacity and fee"
      onClose={() => {
        if (!updateMutation.isPending) onClose();
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Course Title
          </label>
          <input
            {...register("title")}
            className={inputClass(Boolean(errors.title))}
            placeholder="Course title"
          />
          <FieldError>{errors.title?.message}</FieldError>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Capacity
          </label>
          <input
            {...register("capacity")}
            type="number"
            min="1"
            max="1000"
            className={inputClass(Boolean(errors.capacity))}
          />
          <FieldError>{errors.capacity?.message}</FieldError>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Course Fee (BDT)
          </label>
          <input
            {...register("fee")}
            type="number"
            min="0.01"
            max="10000000"
            step="0.01"
            className={inputClass(Boolean(errors.fee))}
          />
          <FieldError>{errors.fee?.message}</FieldError>
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
          disabled={updateMutation.isPending}
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
   COURSE SKELETON
============================================================ */

function CourseSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
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
      ))}
    </div>
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

  const deleteMutation = useDeleteCourse();
  const statusMutation = useUpdateCourseStatus();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return courses;

    return courses.filter((course) =>
      [
        course.code,
        course.title,
        course.description,
        course.department?.name,
        course.faculty?.name,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [courses, search]);

  const activeCourses = courses.filter((course) => course.isActive).length;
  const inactiveCourses = courses.filter((course) => !course.isActive).length;

  const totalCapacity = courses.reduce(
    (total, course) => total + Number(course.capacity || 0),
    0,
  );

  const handleToggleStatus = async (course: Course) => {
    try {
      await statusMutation.mutateAsync({
        id: course.id,
        isActive: !course.isActive,
      });
    } catch {
      // Mutation error handling is provided by the API hook.
    }
  };

  const handleDelete = async () => {
    if (!deletingCourse) return;

    try {
      await deleteMutation.mutateAsync(deletingCourse.id);
      setDeletingCourse(null);
    } catch {
      // Keep the confirmation modal open to display the error.
    }
  };

  return (
    <main className="min-h-full overflow-hidden">
      <div className="relative">
        <div className="pointer-events-none absolute -left-40 top-0 size-96 rounded-full bg-cyan-500/[0.06] blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-80 size-96 rounded-full bg-purple-500/[0.05] blur-[120px]" />

        <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
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
                  <BookOpen className="size-3.5" />
                  Academic Core
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Course <span className="gradient-text">Command Center</span>
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                  Manage academic courses, faculty assignments, fees, capacity
                  and course availability from one intelligent workspace.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(true)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5"
                >
                  <Plus className="size-4" />
                  New Course
                </button>

                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-slate-200 transition hover:border-cyan-400/20 disabled:opacity-50"
                >
                  <Clock3 className={isFetching ? "size-4 animate-spin" : "size-4"} />
                  Refresh Data
                </button>
              </div>
            </motion.div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={BookOpen}
                label="Total Courses"
                value={courses.length}
                accent="bg-cyan-400/20"
              />
              <StatCard
                icon={CheckCircle2}
                label="Active Courses"
                value={activeCourses}
                accent="bg-emerald-400/20"
              />
              <StatCard
                icon={AlertCircle}
                label="Inactive Courses"
                value={inactiveCourses}
                accent="bg-red-400/20"
              />
              <StatCard
                icon={Users}
                label="Total Capacity"
                value={totalCapacity}
                accent="bg-purple-400/20"
              />
            </div>
          </motion.section>

          {/* Search */}
          <motion.section
            initial="hidden"
            animate="show"
            variants={containerVariants}
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
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by course code, title, department or faculty..."
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/30"
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 text-xs text-slate-400 sm:min-w-36">
                  <span>Showing</span>
                  <span className="font-semibold text-cyan-300">
                    {filteredCourses.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* Course list */}
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
                Something went wrong while loading the academic course registry.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-6 rounded-xl bg-red-400/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/15"
              >
                Try Again
              </button>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-12 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-cyan-400/[0.07] text-cyan-300">
                <Search className="size-7" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-white">
                No courses found
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Try another search term.
              </p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {filteredCourses.map((course) => (
                <motion.article
                  key={course.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
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
                              {course.code}
                            </span>
                            <span
                              className={`size-1.5 rounded-full ${
                                course.isActive ? "bg-emerald-400" : "bg-red-400"
                              }`}
                            />
                          </div>
                          <p className="mt-0.5 text-xs text-slate-500">
                            Semester {course.semester}
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
                        {course.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <h2 className="mt-5 line-clamp-2 text-lg font-semibold text-white transition group-hover:text-cyan-100">
                      {course.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                      {course.description || "No description available for this course."}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                        <div className="flex items-center gap-2 text-slate-500">
                          <CreditCard className="size-3.5" />
                          <span className="text-[11px]">Credit</span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {course.credit}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Users className="size-3.5" />
                          <span className="text-[11px]">Capacity</span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {course.capacity}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-slate-400">
                          <CreditCard className="size-4 text-cyan-300" />
                          <span className="text-xs">Course Fee</span>
                        </div>
                        <p className="text-sm font-semibold text-cyan-200">
                          {formatFee(course.fee)}
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
                            {course.faculty?.name || "Faculty not assigned"}
                          </p>
                          <p className="truncate text-[11px] text-slate-600">
                            {course.department?.name || course.departmentId}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCourseId(course.id)}
                        className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-medium text-slate-300 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.06] hover:text-cyan-200"
                      >
                        <ChevronRight className="size-4" />
                        Details
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingCourse(course)}
                        className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-blue-400/20 hover:bg-blue-400/10 hover:text-blue-300"
                        title="Edit course"
                        aria-label={`Edit ${course.title}`}
                      >
                        <Edit3 className="size-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(course)}
                        disabled={statusMutation.isPending}
                        className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-emerald-400/20 hover:bg-emerald-400/10 hover:text-emerald-300 disabled:opacity-40"
                        title={course.isActive ? "Deactivate" : "Activate"}
                        aria-label={course.isActive ? "Deactivate course" : "Activate course"}
                      >
                        {statusMutation.isPending ? (
                          <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="size-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingCourse(course)}
                        className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-300"
                        title="Delete course"
                        aria-label={`Delete ${course.title}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}

          {!isLoading && !isError && courses.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-600">
              <Layers3 className="size-3.5" />
              Course registry synced with university API
            </div>
          )}
        </div>
      </div>

      {/* Create course */}
      {createModalOpen && (
        <CreateCourseModal onClose={() => setCreateModalOpen(false)} />
      )}

      {/* Course details */}
      {selectedCourseId && (
        <CourseDetails
          courseId={selectedCourseId}
          onClose={() => setSelectedCourseId(null)}
        />
      )}

      {/* Edit course */}
      {editingCourse && (
        <EditCourseModal
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
        />
      )}

      {/* Delete confirmation */}
      {deletingCourse && (
        <Modal
          title="Delete Course?"
          description="This action cannot be undone."
          onClose={() => {
            if (!deleteMutation.isPending) setDeletingCourse(null);
          }}
        >
          <div className="space-y-5">
            <div className="rounded-2xl border border-red-400/10 bg-red-400/[0.05] p-5">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
                  <Trash2 className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {deletingCourse.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {deletingCourse.code}
                  </p>
                  <p className="mt-2 text-sm text-cyan-300">
                    {formatFee(deletingCourse.fee)}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm leading-6 text-slate-400">
              Are you sure you want to permanently remove this course from the
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
                onClick={() => setDeletingCourse(null)}
                disabled={deleteMutation.isPending}
                className="h-11 flex-1 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
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