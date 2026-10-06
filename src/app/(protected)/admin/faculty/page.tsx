"use client";

import {
  useMemo,
  useState,
} from "react";

import { motion, type Variants } from "framer-motion";

import {
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Edit3,
  GraduationCap,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import {
  useDeleteFaculty,
  useFaculty,
  useFaculties,
  useUpdateFaculty,
  type Faculty,
} from "@/hooks/api/useFaculties";

import {
  getApiErrorMessage,
} from "@/lib/api";

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

export default function AdminFacultyPage() {
  const {
    data: faculties = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useFaculties();

  const updateMutation =
    useUpdateFaculty();

  const deleteMutation =
    useDeleteFaculty();

  const [
    selectedFacultyId,
    setSelectedFacultyId,
  ] = useState<string | null>(null);

  const [
    editingFaculty,
    setEditingFaculty,
  ] = useState<Faculty | null>(null);

  const [
    deletingFaculty,
    setDeletingFaculty,
  ] = useState<Faculty | null>(null);

  const [
    search,
    setSearch,
  ] = useState("");

  const filteredFaculties =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return faculties;
      }

      return faculties.filter(
        (faculty) =>
          faculty.name
            .toLowerCase()
            .includes(query) ||
          faculty.employeeId
            .toLowerCase()
            .includes(query) ||
          faculty.email
            .toLowerCase()
            .includes(query) ||
          faculty.designation
            .toLowerCase()
            .includes(query),
      );
    }, [faculties, search]);

  const selectedFacultyQuery =
    useFaculty(selectedFacultyId);

  const handleUpdate = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!editingFaculty) {
      return;
    }

    await updateMutation.mutateAsync({
      id: editingFaculty.id,
      designation:
        editingFaculty.designation.trim(),
      specialization:
        editingFaculty.specialization?.trim() ??
        "",
    });

    setEditingFaculty(null);
  };

  const handleDelete = async () => {
    if (!deletingFaculty) {
      return;
    }

    await deleteMutation.mutateAsync(
      deletingFaculty.id,
    );

    setDeletingFaculty(null);
  };

  return (
    <main className="min-h-full space-y-8">
      {/* HEADER */}

      <motion.section
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs font-medium text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              Faculty Command Center
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Faculty{" "}
              <span className="gradient-text">
                Management
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Manage faculty profiles,
              academic roles and
              specialization from one
              centralized workspace.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-3">
              <p className="text-xs text-slate-500">
                Visible Faculty
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {filteredFaculties.length}
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] px-5 py-3">
              <p className="text-xs text-slate-500">
                Total Loaded
              </p>

              <p className="mt-1 text-2xl font-bold text-cyan-300">
                {faculties.length}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SEARCH */}

      <motion.section
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="glass-panel p-4"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by name, employee ID, email or designation..."
            className="form-input pl-11"
          />
        </div>
      </motion.section>

      {/* ERROR */}

      {isError && (
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-2xl border border-red-400/20 bg-red-500/5 p-6"
        >
          <p className="font-semibold text-red-300">
            Failed to load faculty
            members.
          </p>

          <p className="mt-2 text-sm text-red-300/70">
            {getApiErrorMessage(
              error,
              "Something went wrong.",
            )}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-xl border border-red-400/20 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
          >
            Try again
          </button>
        </motion.div>
      )}

      {/* LOADING */}

      {isLoading && (
        <div className="grid gap-4 xl:grid-cols-2">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-3xl border border-white/10 bg-white/[0.025] p-6"
            >
              <div className="h-12 w-12 rounded-2xl bg-white/10" />

              <div className="mt-5 h-5 w-1/2 rounded bg-white/10" />

              <div className="mt-3 h-4 w-3/4 rounded bg-white/5" />

              <div className="mt-6 h-20 rounded-2xl bg-white/5" />
            </div>
          ))}
        </div>
      )}

      {/* EMPTY */}

      {!isLoading &&
        !isError &&
        filteredFaculties.length === 0 && (
          <div className="glass-panel py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <UserRound className="h-7 w-7 text-slate-500" />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
              No faculty found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search
              query.
            </p>
          </div>
        )}

      {/* FACULTY GRID */}

      {!isLoading &&
        !isError &&
        filteredFaculties.length > 0 && (
          <motion.section
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.06,
                },
              },
            }}
            className="grid gap-5 xl:grid-cols-2"
          >
            {filteredFaculties.map(
              (faculty) => (
                <motion.article
                  key={faculty.id}
                  variants={itemVariants}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.04]"
                >
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-400/5 blur-3xl transition group-hover:bg-cyan-400/10" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/5 text-cyan-300">
                        <GraduationCap className="h-6 w-6" />
                      </div>

                      <div>
                        <h2 className="font-semibold text-white">
                          {faculty.name}
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          {faculty.employeeId}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full border border-emerald-400/15 bg-emerald-400/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                      Faculty
                    </span>
                  </div>

                  <div className="relative mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <Mail className="h-4 w-4 text-cyan-400/70" />
                      <span className="truncate">
                        {faculty.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <BriefcaseBusiness className="h-4 w-4 text-purple-400/70" />
                      <span>
                        {faculty.designation}
                      </span>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-black/20 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Specialization
                      </p>

                      <p className="mt-1 text-sm text-slate-300">
                        {faculty.specialization ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedFacultyId(
                          faculty.id,
                        )
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 transition hover:border-cyan-400/20 hover:text-cyan-300"
                    >
                      View
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setEditingFaculty(
                          faculty,
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:border-cyan-400/20 hover:text-cyan-300"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDeletingFaculty(
                          faculty,
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/10 bg-red-500/5 text-red-400 transition hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.article>
              ),
            )}
          </motion.section>
        )}

      {/* VIEW MODAL */}

      {selectedFacultyId && (
        <Modal
          onClose={() =>
            setSelectedFacultyId(null)
          }
          title="Faculty Profile"
        >
          {selectedFacultyQuery.isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-white/10" />
              <div className="h-5 w-1/2 rounded bg-white/10" />
              <div className="h-4 w-3/4 rounded bg-white/5" />
              <div className="h-20 rounded-2xl bg-white/5" />
            </div>
          ) : selectedFacultyQuery.error ? (
            <p className="text-sm text-red-300">
              {getApiErrorMessage(
                selectedFacultyQuery.error,
                "Failed to load faculty.",
              )}
            </p>
          ) : selectedFacultyQuery.data ? (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/5 text-cyan-300">
                  <GraduationCap />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    {
                      selectedFacultyQuery
                        .data.name
                    }
                  </h3>

                  <p className="text-sm text-slate-500">
                    {
                      selectedFacultyQuery
                        .data.employeeId
                    }
                  </p>
                </div>
              </div>

              <InfoRow
                label="Email"
                value={
                  selectedFacultyQuery.data
                    .email
                }
              />

              <InfoRow
                label="Designation"
                value={
                  selectedFacultyQuery.data
                    .designation
                }
              />

              <InfoRow
                label="Specialization"
                value={
                  selectedFacultyQuery.data
                    .specialization ||
                  "Not specified"
                }
              />

              <InfoRow
                label="Department ID"
                value={
                  selectedFacultyQuery.data
                    .departmentId
                }
              />
            </div>
          ) : null}
        </Modal>
      )}

      {/* EDIT MODAL */}

      {editingFaculty && (
        <Modal
          onClose={() =>
            setEditingFaculty(null)
          }
          title="Edit Faculty"
        >
          <form
            onSubmit={handleUpdate}
            className="space-y-5"
          >
            <Field
              label="Designation"
              value={
                editingFaculty.designation
              }
              onChange={(value) =>
                setEditingFaculty({
                  ...editingFaculty,
                  designation: value,
                })
              }
            />

            <Field
              label="Specialization"
              value={
                editingFaculty.specialization ??
                ""
              }
              onChange={(value) =>
                setEditingFaculty({
                  ...editingFaculty,
                  specialization:
                    value,
                })
              }
            />

            {updateMutation.isError && (
              <p className="text-sm text-red-300">
                {getApiErrorMessage(
                  updateMutation.error,
                  "Failed to update faculty.",
                )}
              </p>
            )}

            <button
              type="submit"
              disabled={
                updateMutation.isPending
              }
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                "Saving..."
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </Modal>
      )}

      {/* DELETE MODAL */}

      {deletingFaculty && (
        <Modal
          onClose={() =>
            setDeletingFaculty(null)
          }
          title="Delete Faculty"
        >
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <ShieldCheck className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
              Remove this faculty member?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              You are about to delete{" "}
              <span className="text-slate-300">
                {deletingFaculty.name}
              </span>
              .
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeletingFaculty(null)
                }
                className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={
                  deleteMutation.isPending
                }
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-50"
              >
                {deleteMutation.isPending
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </main>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
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
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#07111f] shadow-2xl shadow-black/50"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="font-semibold text-white">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
      <p className="text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 break-words text-sm text-slate-300">
        {value}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-slate-400">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="form-input"
      />
    </div>
  );
}