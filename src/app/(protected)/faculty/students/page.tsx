"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
Search,
RefreshCw,
Users,
GraduationCap,
UserRound,
Mail,
Hash,
CalendarDays,
Phone,
MapPin,
BookOpen,
ChevronRight,
X,
AlertCircle,
ContactRound,
Sparkles,
Building2,
} from "lucide-react";

import { useStudents } from "@/hooks/api/useStudents";
import { getApiErrorMessage } from "@/lib/api";

type StudentRecord = NonNullable<
ReturnType<typeof useStudents>["data"]

> [number];

const containerVariants: Variants = {
hidden: { opacity: 0 },
show: {
opacity: 1,
transition: { staggerChildren: 0.06 },
},
};

const itemVariants: Variants = {
hidden: { opacity: 0, y: 16 },
show: {
opacity: 1,
y: 0,
transition: { duration: 0.35, ease: "easeOut" },
},
};

function getInitials(name?: string | null) {
if (!name?.trim()) return "ST";

return name
.trim()
.split(/\s+/)
.slice(0, 2)
.map((part) => part[0])
.join("")
.toUpperCase();
}

function formatDate(value?: string) {
if (!value) return "Not available";

const date = new Date(value);

if (Number.isNaN(date.getTime())) return "Not available";

return new Intl.DateTimeFormat("en-GB", {
day: "2-digit",
month: "short",
year: "numeric",
}).format(date);
}

function StudentSkeleton() {
return ( <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
{Array.from({ length: 6 }).map((_, index) => ( <div
       key={index}
       className="animate-pulse rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"
     > <div className="flex items-center gap-3"> <div className="h-14 w-14 rounded-2xl bg-white/[0.07]" /> <div className="flex-1 space-y-2"> <div className="h-4 w-2/3 rounded bg-white/[0.07]" /> <div className="h-3 w-1/2 rounded bg-white/[0.05]" /> </div> </div> <div className="mt-6 space-y-3"> <div className="h-10 rounded-xl bg-white/[0.05]" /> <div className="h-10 rounded-xl bg-white/[0.05]" /> </div> </div>
))} </div>
);
}

function StudentCard({
student,
onOpen,
}: {
student: StudentRecord;
onOpen: (student: StudentRecord) => void;
}) {
return (
<motion.article
variants={itemVariants}
layout
className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b1220]/80 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-[#0d1728]"
> <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-400/[0.04] blur-3xl transition group-hover:bg-cyan-400/[0.10]" />


  <div className="relative">
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/[0.15] to-violet-400/[0.10] text-lg font-semibold text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.05)]">
          {getInitials(student.name)}
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-semibold text-white">
            {student.name || "Unnamed student"}
          </h3>
          <p className="mt-1 truncate text-xs text-slate-500">
            {student.studentId || "Student ID unavailable"}
          </p>
        </div>
      </div>

      <span className="shrink-0 rounded-lg border border-cyan-300/15 bg-cyan-300/[0.06] px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-cyan-200">
        Student
      </span>
    </div>

    <div className="mt-5 space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
      <div className="flex min-w-0 items-center gap-2.5 text-sm text-slate-400">
        <Mail className="h-4 w-4 shrink-0 text-cyan-300/70" />
        <span className="truncate">
          {student.email || "Email unavailable"}
        </span>
      </div>

      <div className="flex items-center gap-2.5 text-sm text-slate-400">
        <CalendarDays className="h-4 w-4 shrink-0 text-violet-300/70" />
        <span>
          {student.batch
            ? `Batch ${student.batch}`
            : "Batch unavailable"}
        </span>
      </div>
    </div>

    <button
      type="button"
      onClick={() => onOpen(student)}
      className="mt-4 flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-300/25 hover:bg-cyan-300/[0.05] hover:text-cyan-200"
    >
      View student profile
      <ChevronRight className="h-4 w-4" />
    </button>
  </div>
</motion.article>


);
}

function DetailRow({
icon: Icon,
label,
value,
}: {
icon: typeof UserRound;
label: string;
value: string;
}) {
return ( <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"> <div className="rounded-lg border border-cyan-300/10 bg-cyan-300/[0.06] p-2"> <Icon className="h-4 w-4 text-cyan-300" /> </div> <div className="min-w-0 flex-1"> <p className="text-xs text-slate-500">{label}</p> <p className="mt-1 break-words text-sm font-medium text-slate-200">
{value} </p> </div> </div>
);
}

function StudentDetailsModal({
student,
onClose,
}: {
student: StudentRecord;
onClose: () => void;
}) {
return ( <AnimatePresence>
<motion.div
key="student-profile-backdrop"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
onMouseDown={(event) => {
if (event.target === event.currentTarget) onClose();
}}
className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md"
>
<motion.div
role="dialog"
aria-modal="true"
aria-labelledby="student-profile-title"
initial={{ opacity: 0, y: 22, scale: 0.97 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: 12, scale: 0.98 }}
transition={{ duration: 0.2 }}
className="my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0b1220] shadow-2xl shadow-cyan-950/30"
> <div className="relative overflow-hidden border-b border-white/[0.08] p-6"> <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-cyan-400/[0.10] blur-3xl" />


        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/[0.15] to-violet-400/[0.12] text-xl font-semibold text-cyan-200">
              {getInitials(student.name)}
            </div>
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-1.5 text-xs text-cyan-300">
                <Sparkles className="h-3.5 w-3.5" />
                STUDENT PROFILE
              </div>
              <h2
                id="student-profile-title"
                className="break-words text-xl font-semibold text-white"
              >
                {student.name || "Unnamed student"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {student.studentId || "Student ID unavailable"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close student profile"
            className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-3 p-6">
        <DetailRow
          icon={UserRound}
          label="Full name"
          value={student.name || "Not available"}
        />
        <DetailRow
          icon={Mail}
          label="Email address"
          value={student.email || "Not available"}
        />
        <DetailRow
          icon={Hash}
          label="Student ID"
          value={student.studentId || "Not available"}
        />
        <DetailRow
          icon={CalendarDays}
          label="Batch"
          value={student.batch ? String(student.batch) : "Not available"}
        />
        <DetailRow
          icon={Building2}
          label="Department reference"
          value={student.departmentId || "Not available"}
        />
        <DetailRow
          icon={Phone}
          label="Phone"
          value={student.phone || "Not available"}
        />
        <DetailRow
          icon={MapPin}
          label="Address"
          value={student.address || "Not available"}
        />

        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-300/[0.14]"
        >
          Close profile
        </button>
      </div>
    </motion.div>
  </motion.div>
</AnimatePresence>


);
}

export default function FacultyStudentsPage() {
const [search, setSearch] = useState("");
const [selectedStudent, setSelectedStudent] =
useState<StudentRecord | null>(null);

// Important: use the Faculty-specific endpoint.
const {
data: students = [],
isLoading,
isError,
error,
refetch,
isFetching,
} = useStudents("FACULTY");

const filteredStudents = useMemo(() => {
const query = search.trim().toLowerCase();


if (!query) return students;

return students.filter((student) => {
  const searchable = [
    student.name,
    student.email,
    student.studentId,
    student.batch == null ? "" : String(student.batch),
    student.departmentId,
  ];

  return searchable.some((value) =>
    value?.toLowerCase().includes(query),
  );
});


}, [students, search]);

const batchCount = new Set(
students
.map((student) =>
student.batch == null ? "" : String(student.batch),
)
.filter(Boolean),
).size;

return (
<motion.main
variants={containerVariants}
initial="hidden"
animate="show"
className="min-h-screen space-y-7 pb-10"
>
<motion.section
variants={itemVariants}
className="relative overflow-hidden rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-[#101c31] via-[#0b1220] to-[#17112a] p-6 sm:p-8 lg:p-10"
> <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/[0.10] blur-3xl" /> <div className="pointer-events-none absolute -bottom-28 right-1/3 h-64 w-64 rounded-full bg-violet-500/[0.09] blur-3xl" />

    <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1.5 text-xs font-medium tracking-wide text-cyan-200">
          <ContactRound className="h-3.5 w-3.5" />
          FACULTY WORKSPACE / STUDENTS
        </div>

        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Student{" "}
          <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
            Directory.
          </span>
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
          Your student discovery space. Find student records, review
          available profile information, and quickly access the details
          you need for academic coordination.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-slate-300">
            <Users className="h-4 w-4 text-cyan-300" />
            Student directory
          </div>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] px-4 py-3 text-sm font-medium text-cyan-200 transition hover:bg-cyan-300/[0.14] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh directory
          </button>
        </div>
      </div>

      <div className="relative mx-auto flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48">
        <div className="absolute inset-0 rounded-full border border-cyan-300/10" />
        <div className="absolute inset-3 rounded-full border border-dashed border-cyan-300/20" />
        <div className="absolute inset-7 rounded-full bg-gradient-to-br from-cyan-300/15 to-violet-400/10 blur-sm" />
        <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-3xl border border-cyan-300/20 bg-[#0c182a]/90 shadow-[0_0_55px_rgba(34,211,238,0.10)]">
          <GraduationCap className="h-8 w-8 text-cyan-300" />
          <span className="mt-2 text-2xl font-semibold text-white">
            {isLoading ? "—" : students.length}
          </span>
          <span className="text-[10px] tracking-widest text-slate-500">
            LOADED
          </span>
        </div>
        <span className="absolute right-3 top-6 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(103,232,249,0.8)]" />
        <span className="absolute bottom-5 left-5 h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_15px_rgba(196,181,253,0.8)]" />
      </div>
    </div>
  </motion.section>

  <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {[
      {
        title: "Loaded students",
        value: isLoading ? "—" : students.length,
        subtitle: "Records returned by the API",
        icon: Users,
      },
      {
        title: "Distinct batches",
        value: isLoading ? "—" : batchCount,
        subtitle: "Represented in loaded records",
        icon: CalendarDays,
      },
      {
        title: "Directory status",
        value: isError ? "Offline" : isLoading ? "Loading" : "Connected",
        subtitle: "Current request state",
        icon: BookOpen,
      },
    ].map((item) => (
      <motion.div
        key={item.title}
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b1220]/80 p-5"
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-cyan-400/[0.05] blur-3xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">{item.title}</p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {item.value}
            </p>
            <p className="mt-2 text-xs text-slate-500">{item.subtitle}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <item.icon className="h-5 w-5 text-cyan-300" />
          </div>
        </div>
      </motion.div>
    ))}
  </section>

  <motion.section
    variants={itemVariants}
    className="rounded-2xl border border-white/[0.08] bg-[#0b1220]/75 p-4 sm:p-5"
  >
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Explore students
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Search by name, email, student ID, batch, or department reference.
        </p>
      </div>

      <div className="relative sm:w-80">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search student directory..."
          aria-label="Search students"
          className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
        />
      </div>
    </div>
  </motion.section>

  {isLoading ? (
    <StudentSkeleton />
  ) : isError ? (
    <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.04] p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/[0.08]">
        <AlertCircle className="h-6 w-6 text-rose-300" />
      </div>
      <h3 className="mt-4 font-semibold text-white">
        Could not load students
      </h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">
        {getApiErrorMessage(
          error,
          "Please check your connection and try again.",
        )}
      </p>
      <button
        type="button"
        onClick={() => void refetch()}
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-rose-300/20 bg-rose-300/[0.08] px-4 py-2.5 text-sm text-rose-200 transition hover:bg-rose-300/[0.14]"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  ) : filteredStudents.length === 0 ? (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.05]">
        <Users className="h-7 w-7 text-cyan-300/70" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-white">
        {search ? "No matching students" : "No student records yet"}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {search
          ? "Try another name, email, ID, batch, or department reference."
          : "Student records available to your account will appear here."}
      </p>
      {search && (
        <button
          type="button"
          onClick={() => setSearch("")}
          className="mt-5 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.05]"
        >
          Clear search
        </button>
      )}
    </div>
  ) : (
    <>
      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="text-slate-400">
          Showing{" "}
          <span className="font-medium text-white">
            {filteredStudents.length}
          </span>{" "}
          loaded student{filteredStudents.length === 1 ? "" : "s"}
        </p>
        <span className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-xs text-slate-500">
          Read-only directory
        </span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onOpen={setSelectedStudent}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  )}

  {selectedStudent && (
    <StudentDetailsModal
      student={selectedStudent}
      onClose={() => setSelectedStudent(null)}
    />
  )}
</motion.main>


);
}
