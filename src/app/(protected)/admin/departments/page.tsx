"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Building2,
  Check,
  Code2,
  Edit3,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  useCreateDepartment,
  useDeleteDepartment,
  useDepartments,
  useUpdateDepartment,
  type Department,
} from "@/hooks/api/useDepartments";

/* -------------------------------------------------------------------------- */
/* Schemas                                                                    */
/* -------------------------------------------------------------------------- */

const createDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Department name must be at least 2 characters.")
    .max(100, "Department name is too long."),

  code: z
    .string()
    .trim()
    .min(2, "Department code is required.")
    .max(20, "Department code is too long.")
    .regex(
      /^[A-Za-z0-9-]+$/,
      "Code can only contain letters, numbers and hyphens.",
    ),

  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters.")
    .max(500, "Description is too long."),
});

const updateDepartmentSchema = z.object({
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters.")
    .max(500, "Description is too long."),
});

type CreateDepartmentForm = z.infer<
  typeof createDepartmentSchema
>;

type UpdateDepartmentForm = z.infer<
  typeof updateDepartmentSchema
>;

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AdminDepartmentsPage() {
  const {
    data: departments = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useDepartments();

  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const deleteMutation = useDeleteDepartment();

  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [editingDepartment, setEditingDepartment] =
    useState<Department | null>(null);

  const [deletingDepartment, setDeletingDepartment] =
    useState<Department | null>(null);

  const [actionError, setActionError] = useState("");

  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: {
      errors: createErrors,
    },
  } = useForm<CreateDepartmentForm>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdate,
    formState: {
      errors: updateErrors,
    },
  } = useForm<UpdateDepartmentForm>({
    resolver: zodResolver(updateDepartmentSchema),
  });

  const filteredDepartments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return departments;
    }

    return departments.filter((department) => {
      return (
        department.name
          .toLowerCase()
          .includes(query) ||
        department.code
          .toLowerCase()
          .includes(query) ||
        department.description
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [departments, search]);

  const totalDepartments = departments.length;

  async function handleCreate(
    values: CreateDepartmentForm,
  ) {
    setActionError("");

    try {
      await createMutation.mutateAsync({
        name: values.name.trim(),
        code: values.code.trim().toUpperCase(),
        description: values.description.trim(),
      });

      resetCreate();

      setShowCreateModal(false);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to create department.",
      );
    }
  }

  function openEditModal(department: Department) {
    setActionError("");

    setEditingDepartment(department);

    resetUpdate({
      description: department.description ?? "",
    });
  }

  async function handleUpdate(
    values: UpdateDepartmentForm,
  ) {
    if (!editingDepartment) {
      return;
    }

    setActionError("");

    try {
      await updateMutation.mutateAsync({
        id: editingDepartment.id,
        description: values.description.trim(),
      });

      setEditingDepartment(null);
      resetUpdate();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to update department.",
      );
    }
  }

  async function handleDelete() {
    if (!deletingDepartment) {
      return;
    }

    setActionError("");

    try {
      await deleteMutation.mutateAsync(
        deletingDepartment.id,
      );

      setDeletingDepartment(null);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to delete department.",
      );
    }
  }

  function openCreateModal() {
    setActionError("");
    resetCreate();
    setShowCreateModal(true);
  }

  return (
    <main className="min-h-full">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <section className="mb-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <Building2 className="size-4 text-primary" />
              </div>

              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Academic Structure
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Departments
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Create and manage the academic departments
              available across the NEXUS university system.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
          >
            <Plus className="size-4 transition-transform duration-300 group-hover:rotate-90" />

            Create Department
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Stats                                                              */}
      {/* ------------------------------------------------------------------ */}

      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Building2}
          label="Total Departments"
          value={totalDepartments}
          description="Academic departments"
        />

        <StatCard
          icon={Code2}
          label="Active Structure"
          value={totalDepartments}
          description="Currently available"
        />

        <StatCard
          icon={RefreshCw}
          label="Data Status"
          value={isFetching ? "SYNC" : "LIVE"}
          description={
            isFetching
              ? "Synchronizing data"
              : "Connected to backend"
          }
        />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Main Panel                                                         */}
      {/* ------------------------------------------------------------------ */}

      <section className="glass-panel overflow-hidden rounded-[2rem] border border-white/10">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold">
              Department Directory
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {filteredDepartments.length} department
              {filteredDepartments.length !== 1
                ? "s"
                : ""}{" "}
              displayed
            </p>
          </div>

          <div className="flex gap-3">
            <div className="relative min-w-0 flex-1 lg:w-72">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search departments..."
                className="h-11 w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label="Refresh departments"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:opacity-50"
            >
              <RefreshCw
                className={`size-4 ${
                  isFetching ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Global action error */}
        <AnimatePresence>
          {actionError && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="border-b border-red-500/20 bg-red-500/5 px-5 py-4 sm:px-6"
            >
              <div className="flex items-start gap-3 text-sm text-red-300">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />

                <span>{actionError}</span>

                <button
                  type="button"
                  onClick={() => setActionError("")}
                  className="ml-auto text-red-300/60 transition hover:text-red-200"
                >
                  <X className="size-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error state */}
        {isError ? (
          <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
              <AlertCircle className="size-6 text-red-400" />
            </div>

            <h3 className="mt-5 font-bold">
              Unable to load departments
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Something went wrong while loading departments."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold transition hover:border-primary/30 hover:bg-primary/5"
            >
              <RefreshCw className="size-4" />
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <DepartmentSkeleton />
        ) : filteredDepartments.length === 0 ? (
          <EmptyState
            hasSearch={Boolean(search.trim())}
            onCreate={openCreateModal}
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Department
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Code
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Description
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDepartments.map(
                    (department, index) => (
                      <DepartmentRow
                        key={department.id}
                        department={department}
                        index={index}
                        onEdit={openEditModal}
                        onDelete={setDeletingDepartment}
                      />
                    ),
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 p-4 md:hidden">
              {filteredDepartments.map(
                (department, index) => (
                  <DepartmentCard
                    key={department.id}
                    department={department}
                    index={index}
                    onEdit={openEditModal}
                    onDelete={setDeletingDepartment}
                  />
                ),
              )}
            </div>
          </>
        )}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Create Modal                                                       */}
      {/* ------------------------------------------------------------------ */}

      <AnimatePresence>
        {showCreateModal && (
          <Modal
            title="Create Department"
            description="Add a new academic department to the university."
            icon={Plus}
            onClose={() => {
              if (!createMutation.isPending) {
                setShowCreateModal(false);
              }
            }}
          >
            <form
              onSubmit={handleCreateSubmit(handleCreate)}
              className="space-y-5"
            >
              <FormInput
                label="Department name"
                placeholder="Computer Science & Engineering"
                icon={Building2}
                error={createErrors.name?.message}
                disabled={createMutation.isPending}
                {...registerCreate("name")}
              />

              <FormInput
                label="Department code"
                placeholder="CSE"
                icon={Code2}
                error={createErrors.code?.message}
                disabled={createMutation.isPending}
                {...registerCreate("code")}
              />

              <FormTextarea
                label="Description"
                placeholder="Department of Computer Science and Engineering"
                error={createErrors.description?.message}
                disabled={createMutation.isPending}
                {...registerCreate("description")}
              />

              <ModalActions
                loading={createMutation.isPending}
                submitText="Create Department"
                onCancel={() =>
                  setShowCreateModal(false)
                }
              />
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* Edit Modal                                                         */}
      {/* ------------------------------------------------------------------ */}

      <AnimatePresence>
        {editingDepartment && (
          <Modal
            title="Edit Department"
            description={`Update the description for ${editingDepartment.name}.`}
            icon={Edit3}
            onClose={() => {
              if (!updateMutation.isPending) {
                setEditingDepartment(null);
              }
            }}
          >
            <form
              onSubmit={handleUpdateSubmit(handleUpdate)}
              className="space-y-5"
            >
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Department
                </p>

                <p className="mt-1 font-bold">
                  {editingDepartment.name}
                </p>

                <span className="mt-2 inline-flex rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  {editingDepartment.code}
                </span>
              </div>

              <FormTextarea
                label="Description"
                placeholder="Department description"
                error={updateErrors.description?.message}
                disabled={updateMutation.isPending}
                {...registerUpdate("description")}
              />

              <ModalActions
                loading={updateMutation.isPending}
                submitText="Save Changes"
                onCancel={() =>
                  setEditingDepartment(null)
                }
              />
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* Delete Confirmation                                                */}
      {/* ------------------------------------------------------------------ */}

      <AnimatePresence>
        {deletingDepartment && (
          <Modal
            title="Delete Department"
            description="This action will remove the department from the active university structure."
            icon={Trash2}
            danger
            onClose={() => {
              if (!deleteMutation.isPending) {
                setDeletingDepartment(null);
              }
            }}
          >
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-sm text-muted-foreground">
                You are about to delete:
              </p>

              <p className="mt-1 font-bold text-white">
                {deletingDepartment.name}
              </p>

              <span className="mt-2 inline-flex rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-300">
                {deletingDepartment.code}
              </span>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setDeletingDepartment(null)
                }
                disabled={deleteMutation.isPending}
                className="h-11 rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm font-semibold transition hover:bg-white/[0.06] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-500 px-5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-400 disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4" />
                    Delete Department
                  </>
                )}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat Card                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof Building2;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="glass-panel rounded-2xl border border-white/10 p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
          <Icon className="size-4 text-primary" />
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Department Row                                                             */
/* -------------------------------------------------------------------------- */

function DepartmentRow({
  department,
  index,
  onEdit,
  onDelete,
}: {
  department: Department;
  index: number;
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}) {
  return (
    <motion.tr
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.03,
      }}
      className="group border-b border-white/[0.06] transition-colors hover:bg-white/[0.025]"
    >
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
            <Building2 className="size-4 text-primary" />
          </div>

          <div>
            <p className="font-semibold">
              {department.name}
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              ID: {department.id.slice(0, 12)}...
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <span className="inline-flex rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-bold tracking-wider text-primary">
          {department.code}
        </span>
      </td>

      <td className="max-w-md px-6 py-5">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {department.description ||
            "No description available."}
        </p>
      </td>

      <td className="px-6 py-5">
        <div className="flex justify-end gap-2 opacity-70 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(department)}
            aria-label={`Edit ${department.name}`}
            className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
          >
            <Edit3 className="size-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(department)}
            aria-label={`Delete ${department.name}`}
            className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-muted-foreground transition hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

/* -------------------------------------------------------------------------- */
/* Department Card                                                            */
/* -------------------------------------------------------------------------- */

function DepartmentCard({
  department,
  index,
  onEdit,
  onDelete,
}: {
  department: Department;
  index: number;
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.04,
      }}
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
          <Building2 className="size-4 text-primary" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold">
              {department.name}
            </h3>

            <span className="rounded-lg border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-bold tracking-wider text-primary">
              {department.code}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {department.description ||
              "No description available."}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2 border-t border-white/[0.06] pt-4">
        <button
          type="button"
          onClick={() => onEdit(department)}
          className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-semibold transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
        >
          <Edit3 className="size-3.5" />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(department)}
          className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-semibold transition hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400"
        >
          <Trash2 className="size-3.5" />
          Delete
        </button>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                    */
/* -------------------------------------------------------------------------- */

function DepartmentSkeleton() {
  return (
    <div className="divide-y divide-white/[0.06]">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-4 px-6 py-5"
        >
          <div className="size-10 rounded-xl bg-white/[0.06]" />

          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 rounded bg-white/[0.06]" />
            <div className="h-3 w-28 rounded bg-white/[0.04]" />
          </div>

          <div className="hidden h-7 w-16 rounded-lg bg-white/[0.06] sm:block" />

          <div className="hidden h-4 w-64 rounded bg-white/[0.04] lg:block" />

          <div className="h-9 w-20 rounded-lg bg-white/[0.06]" />
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty State                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState({
  hasSearch,
  onCreate,
}: {
  hasSearch: boolean;
  onCreate: () => void;
}) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
        <Building2 className="size-6 text-primary" />
      </div>

      <h3 className="mt-5 font-bold">
        {hasSearch
          ? "No departments found"
          : "No departments yet"}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {hasSearch
          ? "Try searching with a different department name or code."
          : "Create your first academic department to make it available for students and faculty registration."}
      </p>

      {!hasSearch && (
        <button
          type="button"
          onClick={onCreate}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5"
        >
          <Plus className="size-4" />
          Create Department
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Modal                                                                      */
/* -------------------------------------------------------------------------- */

function Modal({
  title,
  description,
  icon: Icon,
  danger = false,
  onClose,
  children,
}: {
  title: string;
  description: string;
  icon: typeof Plus;
  danger?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
          y: 15,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.95,
          y: 15,
        }}
        transition={{
          duration: 0.2,
        }}
        className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#0a0f1d]/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-7"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${
                danger
                  ? "border-red-500/20 bg-red-500/10 text-red-400"
                  : "border-primary/20 bg-primary/10 text-primary"
              }`}
            >
              <Icon className="size-5" />
            </div>

            <div>
              <h2 className="text-xl font-black">
                {title}
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-white/[0.05] hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        {children}
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Modal Actions                                                              */
/* -------------------------------------------------------------------------- */

function ModalActions({
  loading,
  submitText,
  onCancel,
}: {
  loading: boolean;
  submitText: string;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="h-11 rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm font-semibold transition hover:bg-white/[0.06] disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Check className="size-4" />
            {submitText}
          </>
        )}
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Form Input                                                                 */
/* -------------------------------------------------------------------------- */

type FormInputProps =
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    icon?: typeof Building2;
    error?: string;
  };

function FormInput({
  label,
  icon: Icon,
  error,
  ...props
}: FormInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        )}

        <input
          {...props}
          className={`h-12 w-full rounded-xl border bg-black/20 ${
            Icon ? "pl-11" : "px-4"
          } pr-4 text-sm outline-none transition placeholder:text-muted-foreground/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/10 ${
            error
              ? "border-red-500/50"
              : "border-white/10"
          }`}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Form Textarea                                                              */
/* -------------------------------------------------------------------------- */

type FormTextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    error?: string;
  };

function FormTextarea({
  label,
  error,
  ...props
}: FormTextareaProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <textarea
        {...props}
        rows={4}
        className={`w-full resize-none rounded-xl border bg-black/20 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-muted-foreground/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/10 ${
          error
            ? "border-red-500/50"
            : "border-white/10"
        }`}
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}