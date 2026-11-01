
"use client";

import { useMemo, useState } from "react";
import {
  useQuery,
} from "@tanstack/react-query";
import {
  Activity,
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  ChevronDown,
  Clock3,
  Code2,
  Copy,
  Database,
  Eye,
  FileClock,
  Fingerprint,
  Loader2,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Terminal,
  UserRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion, type Variants } from "framer-motion";

import { api, getApiErrorMessage } from "@/lib/api";

interface AuditLog {
  id: string;
  action?: string | null;
  entity?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  resource?: string | null;
  userId?: string | null;
  ipAddress?: string | null;
  createdAt?: string | null;
  timestamp?: string | null;
  details?: unknown;
  metadata?: unknown;
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
  actor?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
  [key: string]: unknown;
}

interface AuditLogsResponse {
  success: boolean;
  message?: string;
  data?: {
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };
    data?: AuditLog[];
  };
}

interface AuditLogResponse {
  success: boolean;
  message?: string;
  data?: AuditLog;
}

const PAGE_SIZE = 20;

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.045 },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

function getAction(log: AuditLog) {
  return String(log.action ?? log.event ?? "Activity");
}

function getResource(log: AuditLog) {
  return String(
    log.entityType ??
      log.entity ??
      log.resource ??
      "System",
  );
}

function getActor(log: AuditLog) {
  return (
    log.user?.name ??
    log.actor?.name ??
    log.user?.email ??
    log.actor?.email ??
    log.userId ??
    log.actor?.id ??
    "System"
  );
}

function getActorEmail(log: AuditLog) {
  return (
    log.user?.email ??
    log.actor?.email ??
    log.userId ??
    "No user identifier"
  );
}

function getLogDate(log: AuditLog) {
  const value = log.createdAt ?? log.timestamp;
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value: Date | null) {
  if (!value) return "Date unavailable";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatTime(value: Date | null) {
  if (!value) return "--:--";

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(value);
}

function getInitials(name: string) {
  return name
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "SY";
}

function describeAction(action: string) {
  const normalized = action.toLowerCase();

  if (
    normalized.includes("delete") ||
    normalized.includes("remove")
  ) {
    return {
      icon: X,
      color: "text-rose-300",
      background: "bg-rose-400/10",
      border: "border-rose-400/20",
    };
  }

  if (
    normalized.includes("login") ||
    normalized.includes("auth")
  ) {
    return {
      icon: Fingerprint,
      color: "text-violet-300",
      background: "bg-violet-400/10",
      border: "border-violet-400/20",
    };
  }

  if (
    normalized.includes("create") ||
    normalized.includes("register")
  ) {
    return {
      icon: Check,
      color: "text-emerald-300",
      background: "bg-emerald-400/10",
      border: "border-emerald-400/20",
    };
  }

  if (
    normalized.includes("update") ||
    normalized.includes("patch")
  ) {
    return {
      icon: Code2,
      color: "text-sky-300",
      background: "bg-sky-400/10",
      border: "border-sky-400/20",
    };
  }

  return {
    icon: Activity,
    color: "text-cyan-300",
    background: "bg-cyan-400/10",
    border: "border-cyan-400/20",
  };
}

function prettyJson(value: unknown) {
  if (value === undefined || value === null) {
    return "No additional details were returned.";
  }

  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }

  try {
    return JSON.stringify(value, null, 2) ?? String(value);
  } catch {
    return String(value);
  }
}

async function fetchAuditLogs(
  page: number,
  search: string,
): Promise<AuditLogsResponse> {
  const response = await api.get<AuditLogsResponse>(
    "/audit-logs",
    {
      params: {
        page,
        limit: PAGE_SIZE,
        ...(search.trim()
          ? { search: search.trim() }
          : {}),
        sortOrder: "desc",
      },
    },
  );

  return response.data;
}

async function fetchAuditLog(id: string): Promise<AuditLog> {
  const response = await api.get<AuditLogResponse>(
    `/audit-logs/${id}`,
  );

  if (!response.data.data) {
    throw new Error("Audit log details were not returned.");
  }

  return response.data.data;
}

export default function AdminAuditLogsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedLogId, setSelectedLogId] =
    useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const logsQuery = useQuery({
    queryKey: ["audit-logs", { page, limit: PAGE_SIZE, search }],
    queryFn: () => fetchAuditLogs(page, search),
  });

  const logs = logsQuery.data?.data?.data ?? [];
  const meta = logsQuery.data?.data?.meta;

  const total = meta?.total ?? logs.length;
  const totalPages = Math.max(
    1,
    meta?.totalPages ?? Math.ceil(total / PAGE_SIZE),
  );

  const detailsQuery = useQuery({
    queryKey: ["audit-log", selectedLogId],
    queryFn: () => fetchAuditLog(selectedLogId as string),
    enabled: Boolean(selectedLogId),
  });

  const visibleRange = useMemo(() => {
    if (logs.length === 0) {
      return { start: 0, end: 0 };
    }

    return {
      start: (page - 1) * PAGE_SIZE + 1,
      end: (page - 1) * PAGE_SIZE + logs.length,
    };
  }, [logs.length, page]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCopy = async (log: AuditLog) => {
    try {
      await navigator.clipboard.writeText(prettyJson(log));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden pb-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-40 -top-40 size-[440px] rounded-full bg-cyan-500/[0.07] blur-[110px]" />
        <div className="absolute -left-40 top-[430px] size-[380px] rounded-full bg-violet-500/[0.06] blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="relative mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-6 sm:py-9 xl:px-9"
      >
        {/* Header */}
        <header className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1.5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-300 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-cyan-300" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">
                Security observability
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl xl:text-[44px]">
              Audit{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
                command center
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Explore recorded system activity with a searchable,
              chronological view of the audit trail.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.035] px-3 text-xs text-slate-300">
              <ShieldCheck className="size-4 text-emerald-300" />
              Read-only access
            </div>

            <button
              type="button"
              onClick={() => void logsQuery.refetch()}
              disabled={logsQuery.isFetching}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] px-4 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/[0.14] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`size-4 ${
                  logsQuery.isFetching ? "animate-spin" : ""
                }`}
              />
              Refresh logs
            </button>
          </div>
        </header>

        {/* Overview strip */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            icon={Activity}
            label="Loaded events"
            value={logsQuery.isPending ? "—" : logs.length.toString()}
            note="Current result page"
            tone="cyan"
          />
          <OverviewCard
            icon={Database}
            label="Matching records"
            value={logsQuery.isPending ? "—" : total.toLocaleString()}
            note="Backend-reported total when available"
            tone="violet"
          />
          <OverviewCard
            icon={CalendarClock}
            label="Current page"
            value={`${page} / ${totalPages}`}
            note="Server-side pagination"
            tone="blue"
          />
          <OverviewCard
            icon={Shield}
            label="Ordering"
            value="Newest first"
            note="sortOrder: desc"
            tone="emerald"
          />
        </section>

        {/* Search */}
        <section className="mb-5 rounded-2xl border border-white/[0.09] bg-[#0b1220]/80 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-cyan-200">
                <Search className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Search activity
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Search is sent to the backend.
                </p>
              </div>
            </div>

            <div className="relative w-full md:max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Search logs, e.g. login..."
                aria-label="Search audit logs"
                className="h-11 w-full rounded-xl border border-white/10 bg-[#060b14] pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => handleSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Activity panel */}
        <section className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b1220]/85 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="flex flex-col gap-3 border-b border-white/[0.07] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-200">
                <FileClock className="size-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Activity stream
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {search
                    ? `Results for “${search}”`
                    : "Latest recorded system events"}
                </p>
              </div>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[11px] text-slate-400">
              <ArrowDown className="size-3.5 text-cyan-300" />
              Descending by time
            </div>
          </div>

          {logsQuery.isPending ? (
            <AuditSkeleton />
          ) : logsQuery.isError ? (
            <StatePanel
              icon={AlertCircle}
              title="Unable to load audit logs"
              description={getApiErrorMessage(
                logsQuery.error,
                "The backend could not return audit activity. Check your connection and try again.",
              )}
              action={
                <button
                  type="button"
                  onClick={() => void logsQuery.refetch()}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/15"
                >
                  <RefreshCw className="size-4" />
                  Try again
                </button>
              }
            />
          ) : logs.length === 0 ? (
            <StatePanel
              icon={Search}
              title="No matching activity"
              description={
                search
                  ? "Try a different search term or clear the search to view recent logs."
                  : "The backend returned no audit records for this page."
              }
              action={
                search ? (
                  <button
                    type="button"
                    onClick={() => handleSearch("")}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.08]"
                  >
                    <X className="size-4" />
                    Clear search
                  </button>
                ) : undefined
              }
            />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/[0.07] bg-white/[0.018]">
                      <TableHeading>Activity</TableHeading>
                      <TableHeading>Actor</TableHeading>
                      <TableHeading>Resource</TableHeading>
                      <TableHeading>Timestamp</TableHeading>
                      <TableHeading align="right">Details</TableHeading>
                    </tr>
                  </thead>
                  <motion.tbody
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {logs.map((log) => (
                      <motion.tr
                        key={log.id}
                        variants={rowVariants}
                        className="group border-b border-white/[0.045] transition-colors hover:bg-cyan-300/[0.025]"
                      >
                        <td className="px-5 py-4">
                          <ActivityCell log={log} />
                        </td>
                        <td className="px-5 py-4">
                          <ActorCell log={log} />
                        </td>
                        <td className="px-5 py-4">
                          <ResourceCell log={log} />
                        </td>
                        <td className="px-5 py-4">
                          <TimeCell log={log} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedLogId(log.id)}
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.025] px-3 text-xs font-medium text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.07] hover:text-cyan-100"
                          >
                            <Eye className="size-3.5" />
                            Inspect
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              </div>

              {/* Mobile and tablet cards */}
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-white/[0.06] lg:hidden"
              >
                {logs.map((log) => (
                  <motion.article
                    key={log.id}
                    variants={rowVariants}
                    className="p-4 transition-colors hover:bg-white/[0.02] sm:p-5"
                  >
                    <div className="flex items-start gap-3">
                      <ActionIcon action={getAction(log)} />
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-semibold text-white">
                          {getAction(log)}
                        </p>
                        <p className="mt-1 break-all text-xs text-slate-500">
                          {getResource(log)}
                          {log.entityId ? ` · ${log.entityId}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <MiniInfo
                        icon={UserRound}
                        label="Actor"
                        value={getActor(log)}
                      />
                      <MiniInfo
                        icon={Clock3}
                        label="Time"
                        value={formatTime(getLogDate(log))}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="truncate text-[11px] text-slate-500">
                        {formatDate(getLogDate(log))}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedLogId(log.id)}
                        className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.07] px-3 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/[0.13]"
                      >
                        <Eye className="size-3.5" />
                        Inspect log
                      </button>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </>
          )}

          {/* Pagination */}
          {!logsQuery.isPending &&
            !logsQuery.isError &&
            logs.length > 0 && (
              <div className="flex flex-col gap-4 border-t border-white/[0.07] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-300">
                    {visibleRange.start}–{visibleRange.end}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-300">
                    {total}
                  </span>{" "}
                  records
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1 || logsQuery.isFetching}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.025] px-3 text-xs font-medium text-slate-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ArrowLeft className="size-3.5" />
                    Previous
                  </button>

                  <span className="min-w-16 text-center text-xs tabular-nums text-slate-400">
                    {page} / {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={page >= totalPages || logsQuery.isFetching}
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.025] px-3 text-xs font-medium text-slate-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Next
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>
            )}
        </section>

        <footer className="mt-5 flex flex-col gap-2 text-[11px] leading-5 text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-emerald-400/70" />
            Audit trail is displayed as returned by the API.
          </span>
          <span className="inline-flex items-center gap-2">
            <Terminal className="size-3.5" />
            Source: /api/v1/audit-logs
          </span>
        </footer>
      </motion.div>

      <AnimatePresence>
        {selectedLogId && (
          <LogDetailsModal
            key={selectedLogId}
            log={detailsQuery.data}
            isLoading={detailsQuery.isPending}
            error={detailsQuery.error}
            isError={detailsQuery.isError}
            copied={copied}
            onCopy={() => {
              if (detailsQuery.data) {
                void handleCopy(detailsQuery.data);
              }
            }}
            onRetry={() => void detailsQuery.refetch()}
            onClose={() => setSelectedLogId(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function OverviewCard({
  icon: Icon,
  label,
  value,
  note,
  tone,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  note: string;
  tone: "cyan" | "violet" | "blue" | "emerald";
}) {
  const tones = {
    cyan: {
      icon: "text-cyan-200",
      box: "bg-cyan-400/10",
      glow: "from-cyan-400/[0.09]",
    },
    violet: {
      icon: "text-violet-200",
      box: "bg-violet-400/10",
      glow: "from-violet-400/[0.09]",
    },
    blue: {
      icon: "text-sky-200",
      box: "bg-sky-400/10",
      glow: "from-sky-400/[0.09]",
    },
    emerald: {
      icon: "text-emerald-200",
      box: "bg-emerald-400/10",
      glow: "from-emerald-400/[0.09]",
    },
  }[tone];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b1220]/80 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-white/[0.14]">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tones.glow} via-transparent to-transparent opacity-80`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {value}
          </p>
          <p className="mt-2 text-[11px] text-slate-500">{note}</p>
        </div>
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tones.box} ${tones.icon}`}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}

function TableHeading({
  children,
  align,
}: {
  children: React.ReactNode;
  align?: "right";
}) {
  return (
    <th
      className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 ${
        align === "right" ? "text-right" : ""
      }`}
    >
      {children}
    </th>
  );
}

function ActionIcon({ action }: { action: string }) {
  const config = describeAction(action);
  const Icon = config.icon;

  return (
    <div
      className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${config.border} ${config.background} ${config.color}`}
    >
      <Icon className="size-4.5" />
    </div>
  );
}

function ActivityCell({ log }: { log: AuditLog }) {
  return (
    <div className="flex min-w-[230px] items-center gap-3">
      <ActionIcon action={getAction(log)} />
      <div className="min-w-0">
        <p className="max-w-[250px] truncate text-sm font-semibold text-slate-100">
          {getAction(log)}
        </p>
        <p className="mt-1 max-w-[250px] truncate font-mono text-[10px] text-slate-500">
          ID: {log.id}
        </p>
      </div>
    </div>
  );
}

function ActorCell({ log }: { log: AuditLog }) {
  const actor = getActor(log);

  return (
    <div className="flex min-w-[170px] items-center gap-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.045] text-[10px] font-bold text-slate-300">
        {getInitials(actor)}
      </div>
      <div className="min-w-0">
        <p className="max-w-[190px] truncate text-xs font-medium text-slate-200">
          {actor}
        </p>
        <p className="mt-1 max-w-[190px] truncate text-[10px] text-slate-500">
          {getActorEmail(log)}
        </p>
      </div>
    </div>
  );
}

function ResourceCell({ log }: { log: AuditLog }) {
  return (
    <div className="min-w-[120px]">
      <span className="inline-flex max-w-[190px] items-center gap-1.5 rounded-md border border-white/[0.07] bg-white/[0.025] px-2 py-1 text-[11px] text-slate-300">
        <Database className="size-3 shrink-0 text-sky-300" />
        <span className="truncate">{getResource(log)}</span>
      </span>
      {log.entityId && (
        <p className="mt-1.5 max-w-[190px] truncate font-mono text-[10px] text-slate-600">
          {log.entityId}
        </p>
      )}
    </div>
  );
}

function TimeCell({ log }: { log: AuditLog }) {
  const date = getLogDate(log);

  return (
    <div className="min-w-[130px]">
      <p className="text-xs font-medium tabular-nums text-slate-200">
        {formatTime(date)}
      </p>
      <p className="mt-1 text-[10px] text-slate-500">
        {formatDate(date)}
      </p>
    </div>
  );
}

function MiniInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
        <Icon className="size-3.5" />
        {label}
      </div>
      <p className="mt-1.5 truncate text-xs font-medium text-slate-300">
        {value}
      </p>
    </div>
  );
}

function AuditSkeleton() {
  return (
    <div className="space-y-0 p-4 sm:p-6">
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-4 border-b border-white/[0.045] py-5 last:border-0"
        >
          <div className="size-10 shrink-0 rounded-xl bg-white/[0.06]" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-36 max-w-full rounded bg-white/[0.07]" />
            <div className="h-2.5 w-52 max-w-full rounded bg-white/[0.04]" />
          </div>
          <div className="hidden w-28 space-y-2 sm:block">
            <div className="h-3 w-full rounded bg-white/[0.06]" />
            <div className="h-2.5 w-3/4 rounded bg-white/[0.04]" />
          </div>
          <div className="hidden h-8 w-20 rounded-lg bg-white/[0.05] lg:block" />
        </div>
      ))}
    </div>
  );
}

function StatePanel({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof AlertCircle;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[330px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035] text-slate-300">
        <Icon className="size-6" />
      </div>
      <h3 className="mt-5 text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function LogDetailsModal({
  log,
  isLoading,
  isError,
  error,
  copied,
  onCopy,
  onRetry,
  onClose,
}: {
  log: AuditLog | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  copied: boolean;
  onCopy: () => void;
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-0 backdrop-blur-md sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.section
        initial={{ opacity: 0, y: 24, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.985 }}
        transition={{ duration: 0.22 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-details-title"
        className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-t-3xl border border-white/[0.1] bg-[#0a101c] shadow-2xl shadow-black/50 sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] bg-gradient-to-r from-cyan-400/[0.06] via-transparent to-violet-400/[0.06] px-5 py-5 sm:px-7">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
              <Fingerprint className="size-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">
                Audit record
              </p>
              <h2
                id="audit-details-title"
                className="mt-1.5 text-lg font-semibold text-white"
              >
                Event details
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Full record retrieved from the backend.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close audit details"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-[calc(92vh-90px)] overflow-y-auto p-5 sm:p-7">
          {isLoading ? (
            <div className="flex min-h-56 flex-col items-center justify-center gap-3">
              <Loader2 className="size-7 animate-spin text-cyan-300" />
              <p className="text-sm text-slate-400">
                Fetching event details...
              </p>
            </div>
          ) : isError ? (
            <StatePanel
              icon={AlertCircle}
              title="Could not load this record"
              description={getApiErrorMessage(
                error,
                "The audit log details could not be retrieved.",
              )}
              action={
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 text-xs font-semibold text-cyan-100"
                >
                  <RefreshCw className="size-4" />
                  Retry request
                </button>
              }
            />
          ) : log ? (
            <>
              <div className="mb-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    Action
                  </p>
                  <p className="mt-2 break-words text-sm font-semibold text-white">
                    {getAction(log)}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    Resource
                  </p>
                  <p className="mt-2 break-words text-sm font-semibold text-white">
                    {getResource(log)}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    Actor
                  </p>
                  <p className="mt-2 break-all text-sm font-semibold text-white">
                    {getActor(log)}
                  </p>
                  <p className="mt-1 break-all text-xs text-slate-500">
                    {getActorEmail(log)}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    Recorded at
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {formatDate(getLogDate(log))}
                  </p>
                  <p className="mt-1 font-mono text-xs text-slate-400">
                    {formatTime(getLogDate(log))}
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#050a12]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <Code2 className="size-4 text-cyan-300" />
                    <span className="text-xs font-semibold text-slate-200">
                      Raw audit payload
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onCopy}
                    className="inline-flex h-8 items-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.035] px-3 text-[11px] font-medium text-slate-300 transition hover:bg-white/[0.08]"
                  >
                    {copied ? (
                      <Check className="size-3.5 text-emerald-300" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    {copied ? "Copied" : "Copy JSON"}
                  </button>
                </div>

                <pre className="max-h-[360px] overflow-auto p-4 text-[11px] leading-6 text-cyan-100/80 sm:p-5">
                  <code>{prettyJson(log)}</code>
                </pre>
              </div>

              <p className="mt-4 text-[11px] leading-5 text-slate-600">
                Record ID: <span className="break-all font-mono text-slate-400">{log.id}</span>
              </p>
            </>
          ) : null}
        </div>
      </motion.section>
    </motion.div>
  );
}
