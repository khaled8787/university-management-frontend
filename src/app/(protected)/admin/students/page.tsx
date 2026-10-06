"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  GraduationCap,
  Mail,
  MapPin,
  Pencil,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useDeleteStudent,
  useStudent,
  useStudents,
  useUpdateStudent,
  type Student,
} from "@/hooks/api/useStudents";

const updateStudentSchema = z.object({
  phone: z
    .string()
    .trim()
    .max(30, "Phone number is too long."),
  address: z
    .string()
    .trim()
    .max(300, "Address is too long."),
});

type UpdateStudentForm = z.infer<
  typeof updateStudentSchema
>;

export default function AdminStudentsPage() {
  const reduceMotion = useReducedMotion();

  const {
    data: students = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useStudents();

  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();

  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] =
    useState<string | null>(null);

  const [editingStudent, setEditingStudent] =
    useState<Student | null>(null);

  const [deletingStudent, setDeletingStudent] =
    useState<Student | null>(null);

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return students;
    }

    return students.filter((student) => {
      return (
        student.name?.toLowerCase().includes(term) ||
        student.email?.toLowerCase().includes(term) ||
        student.studentId?.toLowerCase().includes(term) ||
        student.batch?.toLowerCase().includes(term)
      );
    });
  }, [students, search]);

  const handleDelete = async () => {
    if (!deletingStudent) return;

    try {
      await deleteMutation.mutateAsync(
        deletingStudent.id,
      );

      setDeletingStudent(null);
    } catch {
      // Mutation error is already exposed by React Query.
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <motion.section
        initial={
          reduceMotion
            ? false
            : { opacity: 0, y: 15 }
        }
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-cyan-300/70">
              <GraduationCap size={14} />
              Academic Directory
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Student{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
                Management
              </span>
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Manage student records, inspect profiles, update
              contact information, and maintain a clean academic
              directory.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm font-medium text-slate-200 transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.06] disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                isLoading ? "animate-spin" : ""
              }
            />
            Refresh
          </button>
        </div>
      </motion.section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <InfoCard
          icon={GraduationCap}
          label="Loaded Students"
          value={students.length}
        />

        <InfoCard
          icon={Search}
          label="Search Results"
          value={filteredStudents.length}
        />

        <InfoCard
          icon={UserRound}
          label="Directory"
          value="ACTIVE"
        />
      </div>

      {/* Toolbar */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by name, student ID, email or batch..."
            className="h-12 w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-300/30 focus:bg-white/[0.04]"
          />
        </div>
      </section>

      {/* Error */}
      {isError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-4 text-sm text-red-200">
          <AlertTriangle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-medium">
              Failed to load students.
            </p>

            <p className="mt-1 text-red-200/60">
              {error instanceof Error
                ? error.message
                : "Please try again."}
            </p>
          </div>
        </div>
      )}

      {/* Desktop table */}
      <section className="hidden overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-6 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Student
                </th>

                <th className="px-6 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Student ID
                </th>

                <th className="px-6 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Batch
                </th>

                <th className="px-6 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Department
                </th>

                <th className="px-6 py-4 text-right text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.06]">
              {isLoading ? (
                <TableSkeleton />
              ) : filteredStudents.length === 0 ? (
                <EmptyTable />
              ) : (
                filteredStudents.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 8,
                          }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.035,
                    }}
                    className="group transition hover:bg-white/[0.025]"
                  >
                    <td className="px-6 py-4">
                      <StudentIdentity
                        student={student}
                      />
                    </td>

                    <td className="px-6 py-4 text-sm font-mono text-cyan-200/80">
                      {student.studentId}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {student.batch || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-400">
                        {student.departmentId
                          ? student.departmentId.slice(
                              0,
                              8,
                            )
                          : "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <ActionButton
                          icon={Eye}
                          label="View"
                          onClick={() =>
                            setSelectedStudentId(
                              student.id,
                            )
                          }
                        />

                        <ActionButton
                          icon={Pencil}
                          label="Edit"
                          onClick={() =>
                            setEditingStudent(student)
                          }
                        />

                        <ActionButton
                          icon={Trash2}
                          label="Delete"
                          danger
                          onClick={() =>
                            setDeletingStudent(
                              student,
                            )
                          }
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mobile */}
      <section className="space-y-3 md:hidden">
        {isLoading ? (
          <MobileSkeleton />
        ) : filteredStudents.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-10 text-center">
            <GraduationCap
              size={30}
              className="mx-auto text-slate-600"
            />
            <p className="mt-3 text-sm text-slate-500">
              No students found.
            </p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <motion.article
              key={student.id}
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, y: 10 }
              }
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
            >
              <StudentIdentity
                student={student}
              />

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <Meta label="Student ID">
                  {student.studentId}
                </Meta>

                <Meta label="Batch">
                  {student.batch || "—"}
                </Meta>

                <Meta label="Department">
                  {student.departmentId
                    ? student.departmentId.slice(0, 8)
                    : "—"}
                </Meta>

                <Meta label="Email">
                  {student.email}
                </Meta>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <ActionButton
                  icon={Eye}
                  label="View"
                  full
                  onClick={() =>
                    setSelectedStudentId(
                      student.id,
                    )
                  }
                />

                <ActionButton
                  icon={Pencil}
                  label="Edit"
                  full
                  onClick={() =>
                    setEditingStudent(student)
                  }
                />

                <ActionButton
                  icon={Trash2}
                  label="Delete"
                  danger
                  full
                  onClick={() =>
                    setDeletingStudent(student)
                  }
                />
              </div>
            </motion.article>
          ))
        )}
      </section>

      {/* Pagination visual shell */}
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3">
        <p className="text-xs text-slate-500">
          Showing {filteredStudents.length} loaded records
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            disabled
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-600"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-cyan-300/10 px-3 text-xs font-medium text-cyan-200">
            1
          </span>

          <button
            type="button"
            disabled
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-600"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Details modal */}
      {selectedStudentId && (
        <StudentDetailsModal
          studentId={selectedStudentId}
          onClose={() =>
            setSelectedStudentId(null)
          }
        />
      )}

      {/* Edit modal */}
      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          isSubmitting={updateMutation.isPending}
          error={
            updateMutation.error instanceof Error
              ? updateMutation.error.message
              : ""
          }
          onClose={() =>
            setEditingStudent(null)
          }
          onSubmit={async (values) => {
            await updateMutation.mutateAsync({
              id: editingStudent.id,
              ...values,
            });

            setEditingStudent(null);
          }}
        />
      )}

      {/* Delete modal */}
      {deletingStudent && (
        <DeleteStudentModal
          student={deletingStudent}
          isDeleting={deleteMutation.isPending}
          error={
            deleteMutation.error instanceof Error
              ? deleteMutation.error.message
              : ""
          }
          onCancel={() =>
            setDeletingStudent(null)
          }
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function StudentIdentity({
  student,
}: {
  student: Student;
}) {
  const initials =
    student.name
      ?.split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "ST";

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.06] text-xs font-semibold text-cyan-200">
        {initials}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-200">
          {student.name}
        </p>

        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
          <Mail size={11} />
          {student.email}
        </p>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/[0.07] text-cyan-300">
        <Icon size={18} />
      </div>

      <p className="mt-4 text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function Meta({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-black/10 p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 truncate text-slate-300">
        {children}
      </p>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  danger = false,
  full = false,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  danger?: boolean;
  full?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-2.5 text-xs transition ${
        full ? "w-full" : ""
      } ${
        danger
          ? "border-red-400/10 text-red-300 hover:border-red-400/25 hover:bg-red-400/[0.06]"
          : "border-white/10 text-slate-400 hover:border-cyan-300/20 hover:bg-cyan-300/[0.05] hover:text-cyan-200"
      }`}
    >
      <Icon size={14} />
      <span className="hidden lg:inline">
        {label}
      </span>
    </button>
  );
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <tr key={index}>
          {Array.from({ length: 5 }).map(
            (_, cellIndex) => (
              <td
                key={cellIndex}
                className="px-6 py-5"
              >
                <div className="h-4 animate-pulse rounded bg-white/[0.07]" />
              </td>
            ),
          )}
        </tr>
      ))}
    </>
  );
}

function MobileSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
        >
          <div className="h-10 w-40 animate-pulse rounded-xl bg-white/[0.07]" />
          <div className="mt-4 h-16 animate-pulse rounded-xl bg-white/[0.05]" />
        </div>
      ))}
    </>
  );
}

function EmptyTable() {
  return (
    <tr>
      <td
        colSpan={5}
        className="px-6 py-16 text-center"
      >
        <GraduationCap
          size={32}
          className="mx-auto text-slate-600"
        />

        <p className="mt-3 text-sm text-slate-500">
          No students found.
        </p>
      </td>
    </tr>
  );
}

function StudentDetailsModal({
  studentId,
  onClose,
}: {
  studentId: string;
  onClose: () => void;
}) {
  const {
    data: student,
    isLoading,
    isError,
    error,
  } = useStudent(studentId);

  return (
    <ModalShell onClose={onClose}>
      <ModalHeader
        title="Student Profile"
        subtitle="Detailed academic record"
        onClose={onClose}
      />

      {isLoading ? (
        <div className="space-y-4 p-6">
          <div className="h-16 animate-pulse rounded-2xl bg-white/[0.06]" />
          <div className="h-20 animate-pulse rounded-2xl bg-white/[0.06]" />
          <div className="h-20 animate-pulse rounded-2xl bg-white/[0.06]" />
        </div>
      ) : isError || !student ? (
        <div className="p-8 text-center">
          <AlertTriangle
            size={28}
            className="mx-auto text-red-300"
          />

          <p className="mt-3 text-sm text-red-200">
            {error instanceof Error
              ? error.message
              : "Unable to load student."}
          </p>
        </div>
      ) : (
        <div className="space-y-4 p-6">
          <StudentIdentity student={student} />

          <div className="grid gap-3 sm:grid-cols-2">
            <DetailItem
              icon={GraduationCap}
              label="Student ID"
              value={student.studentId}
            />

            <DetailItem
              icon={GraduationCap}
              label="Batch"
              value={student.batch || "—"}
            />

            <DetailItem
              icon={Mail}
              label="Email"
              value={student.email}
            />

            <DetailItem
              icon={Phone}
              label="Phone"
              value={student.phone || "—"}
            />

            <DetailItem
              icon={MapPin}
              label="Address"
              value={student.address || "—"}
            />

            <DetailItem
              icon={GraduationCap}
              label="Department ID"
              value={student.departmentId || "—"}
            />
          </div>
        </div>
      )}
    </ModalShell>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={14} />
        <span className="text-[10px] uppercase tracking-[0.15em]">
          {label}
        </span>
      </div>

      <p className="mt-2 break-words text-sm text-slate-200">
        {value}
      </p>
    </div>
  );
}

function EditStudentModal({
  student,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: {
  student: Student;
  isSubmitting: boolean;
  error: string;
  onClose: () => void;
  onSubmit: (
    values: UpdateStudentForm,
  ) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateStudentForm>({
    resolver: zodResolver(
      updateStudentSchema,
    ),
    defaultValues: {
      phone: student.phone || "",
      address: student.address || "",
    },
  });

  return (
    <ModalShell onClose={onClose}>
      <ModalHeader
        title="Edit Student"
        subtitle={`${student.studentId} · ${student.name}`}
        onClose={onClose}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 p-6"
      >
        <Field
          label="Phone"
          error={errors.phone?.message}
        >
          <input
            {...register("phone")}
            placeholder="Student phone number"
            className="form-input"
          />
        </Field>

        <Field
          label="Address"
          error={errors.address?.message}
        >
          <textarea
            {...register("address")}
            rows={4}
            placeholder="Student address"
            className="form-input resize-none py-3"
          />
        </Field>

        {error && (
          <p className="rounded-xl border border-red-400/15 bg-red-400/[0.05] p-3 text-xs text-red-200">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl border border-white/10 px-5 text-sm text-slate-400 transition hover:bg-white/[0.04]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-cyan-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-50"
          >
            {isSubmitting && (
              <RefreshCw
                size={15}
                className="animate-spin"
              />
            )}
            Save changes
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function DeleteStudentModal({
  student,
  isDeleting,
  error,
  onCancel,
  onConfirm,
}: {
  student: Student;
  isDeleting: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) {
  return (
    <ModalShell onClose={onCancel}>
      <ModalHeader
        title="Remove Student"
        subtitle="This action cannot be undone."
        onClose={onCancel}
      />

      <div className="p-6">
        <div className="rounded-2xl border border-red-400/15 bg-red-400/[0.05] p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
            <Trash2 size={19} />
          </div>

          <h3 className="mt-4 text-base font-semibold text-white">
            Delete {student.name}?
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            You are about to delete student{" "}
            <span className="text-slate-300">
              {student.studentId}
            </span>
            . Please confirm this action.
          </p>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-400/15 bg-red-400/[0.05] p-3 text-xs text-red-200">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 rounded-xl border border-white/10 px-5 text-sm text-slate-400"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-red-400/10 px-5 text-sm font-semibold text-red-300 transition hover:bg-red-400/15 disabled:opacity-50"
          >
            {isDeleting && (
              <RefreshCw
                size={15}
                className="animate-spin"
              />
            )}
            Delete student
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function ModalShell({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0a101c] shadow-2xl shadow-black/50">
        {children}
      </div>
    </div>
  );
}

function ModalHeader({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between border-b border-white/10 p-6">
      <div>
        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          {subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
        {label}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}