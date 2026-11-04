"use client";

import { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  type Variants,
} from "framer-motion";
import {
  AlertCircle,
  ArrowDownUp,
  CheckCircle2,
  Clock3,
  CreditCard,
  DollarSign,
  Eye,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

import {
  useAdminPayment,
  useAdminPayments,
  useUpdatePaymentStatus,
  type AdminPayment,
  type PaymentStatus,
  type PaymentType,
} from "@/hooks/api/usePayments";

import { getApiErrorMessage } from "@/lib/api";

type StatusFilter = "ALL" | PaymentStatus;
type TypeFilter = "ALL" | PaymentType;

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
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

function formatAmount(
  amount: number | string,
  currency: string,
) {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return `${amount} ${currency}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(numericAmount);
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getStudentName(payment: AdminPayment) {
  return (
    payment.student?.user?.name ||
    payment.student?.user?.email ||
    payment.student?.studentId ||
    payment.studentId ||
    "Unknown Student"
  );
}

function getStudentEmail(payment: AdminPayment) {
  return (
    payment.student?.user?.email ||
    "No email available"
  );
}

function statusConfig(status: PaymentStatus) {
  const config = {
    PENDING: {
      label: "Pending",
      icon: Clock3,
      className:
        "border-amber-400/20 bg-amber-400/10 text-amber-300",
    },

    PAID: {
      label: "Paid",
      icon: CheckCircle2,
      className:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    },

    FAILED: {
      label: "Failed",
      icon: XCircle,
      className:
        "border-rose-400/20 bg-rose-400/10 text-rose-300",
    },

    CANCELLED: {
      label: "Cancelled",
      icon: XCircle,
      className:
        "border-slate-400/20 bg-slate-400/10 text-slate-300",
    },

    REFUNDED: {
  label: "Refunded",
  icon: CheckCircle2,
  className:
    "border-purple-400/20 bg-purple-400/10 text-purple-300",
},
  } as const;

  return config[status];
}

function StatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const config = statusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function TypeBadge({
  type,
}: {
  type: PaymentType;
}) {
  return (
    <span className="rounded-full border border-violet-400/15 bg-violet-400/[0.06] px-3 py-1 text-[11px] font-semibold text-violet-300">
      {type.replaceAll("_", " ")}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  description,
}: {
  label: string;
  value: string;
  icon: typeof DollarSign;
  description: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="glass-panel relative overflow-hidden rounded-2xl p-5"
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06] p-3">
          <Icon className="h-5 w-5 text-cyan-300" />
        </div>
      </div>
    </motion.div>
  );
}

function PaymentDetailsModal({
  payment,
  onClose,
}: {
  payment: AdminPayment;
  onClose: () => void;
}) {
  const {
    data,
    isLoading,
    isError,
  } = useAdminPayment(payment.id);

  const record = data ?? payment;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.96,
            y: 20,
          }}
          onMouseDown={(event) =>
            event.stopPropagation()
          }
          className="glass-panel relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-cyan-400/10 p-6 shadow-2xl shadow-cyan-950/30"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Payment Record
              </div>

              <h2 className="text-2xl font-bold text-white">
                Payment Details
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Full payment information from the university system.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {isLoading ? (
            <div className="mt-8 space-y-4">
              <div className="h-28 animate-pulse rounded-2xl bg-white/[0.04]" />
              <div className="h-36 animate-pulse rounded-2xl bg-white/[0.04]" />
              <div className="h-32 animate-pulse rounded-2xl bg-white/[0.04]" />
            </div>
          ) : isError ? (
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/5 p-5 text-sm text-rose-200">
              <AlertCircle className="h-5 w-5" />
              Failed to load latest payment details.
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10">
                      <CreditCard className="h-5 w-5 text-cyan-300" />
                    </div>

                    <div>
                      <p className="font-semibold text-white">
                        {formatAmount(
                          record.amount,
                          record.currency,
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {record.method}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={record.status} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Student
                  </p>

                  <p className="mt-2 font-semibold text-white">
                    {getStudentName(record)}
                  </p>

                  <p className="mt-1 break-all text-sm text-slate-400">
                    {getStudentEmail(record)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Payment Type
                  </p>

                  <div className="mt-3">
                    <TypeBadge type={record.type} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Transaction
                </p>

                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs text-slate-600">
                      Transaction ID
                    </p>

                    <p className="mt-1 break-all font-mono text-xs text-cyan-300">
                      {record.transactionId || "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-600">
                      Stripe Session
                    </p>

                    <p className="mt-1 break-all font-mono text-xs text-violet-300">
                      {record.providerSessionId ||
                        "Not available"}
                    </p>
                  </div>

                  {record.failureReason && (
                    <div>
                      <p className="text-xs text-slate-600">
                        Failure Reason
                      </p>

                      <p className="mt-1 text-sm text-rose-300">
                        {record.failureReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Created
                  </p>

                  <p className="mt-2 text-sm text-white">
                    {formatDate(record.createdAt)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Paid At
                  </p>

                  <p className="mt-2 text-sm text-white">
                    {formatDate(record.paidAt)}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Payment ID
                </p>

                <p className="mt-2 break-all font-mono text-xs text-cyan-300">
                  {record.id}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AdminPaymentsPage() {
  const [status, setStatus] =
    useState<StatusFilter>("ALL");

  const [type, setType] =
    useState<TypeFilter>("ALL");

  const [search, setSearch] = useState("");

  const [selectedPayment, setSelectedPayment] =
    useState<AdminPayment | null>(null);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [actionError, setActionError] =
    useState("");

  const [actionSuccess, setActionSuccess] =
    useState("");

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdminPayments({
    page: 1,
    limit: 10,
    status:
      status === "ALL"
        ? undefined
        : status,
    type:
      type === "ALL"
        ? undefined
        : type,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const updateStatus =
    useUpdatePaymentStatus();

  const payments = data?.data ?? [];

  const filteredPayments = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    if (!keyword) {
      return payments;
    }

    return payments.filter((payment) => {
      const studentName =
        getStudentName(payment).toLowerCase();

      const studentEmail =
        getStudentEmail(payment).toLowerCase();

      const transactionId =
        payment.transactionId?.toLowerCase() ?? "";

      const paymentId =
        payment.id.toLowerCase();

      const typeName =
        payment.type.toLowerCase();

      return (
        studentName.includes(keyword) ||
        studentEmail.includes(keyword) ||
        transactionId.includes(keyword) ||
        paymentId.includes(keyword) ||
        typeName.includes(keyword)
      );
    });
  }, [payments, search]);

  const stats = useMemo(() => {
    const paid = payments.filter(
      (payment) => payment.status === "PAID",
    );

    const pending = payments.filter(
      (payment) => payment.status === "PENDING",
    );

    const failed = payments.filter(
      (payment) => payment.status === "FAILED",
    );

    const totalPaid = paid.reduce(
      (sum, payment) =>
        sum + Number(payment.amount),
      0,
    );

    return {
      total: payments.length,
      paid: paid.length,
      pending: pending.length,
      failed: failed.length,
      totalPaid,
    };
  }, [payments]);

  async function handleStatusUpdate(
    payment: AdminPayment,
    nextStatus: PaymentStatus,
  ) {
    setActionError("");
    setActionSuccess("");
    setUpdatingId(payment.id);

    try {
      await updateStatus.mutateAsync({
        id: payment.id,
        status: nextStatus,
      });

      setActionSuccess(
        `Payment status updated to ${nextStatus}.`,
      );

      window.setTimeout(() => {
        setActionSuccess("");
      }, 2500);
    } catch (mutationError) {
      setActionError(
        getApiErrorMessage(
          mutationError,
          "Unable to update payment status.",
        ),
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const displayError =
    actionError ||
    (isError
      ? getApiErrorMessage(
          error,
          "Unable to load payments.",
        )
      : "");

  return (
    <main className="min-h-full">
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Hero */}
        <motion.section
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-500/[0.08] via-violet-500/[0.04] to-transparent p-6 sm:p-8"
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                <Sparkles className="h-3.5 w-3.5" />
                Finance Command
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                Payment{" "}
                <span className="gradient-text">
                  Control Center
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Monitor university payments, inspect Stripe
                transaction data, and manage payment status from
                one centralized administrative workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isFetching
                    ? "animate-spin"
                    : ""
                }`}
              />
              Refresh
            </button>
          </div>
        </motion.section>

        {/* Stats */}
        <motion.section
          variants={containerVariants}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <StatCard
            label="Loaded Payments"
            value={String(stats.total)}
            icon={CreditCard}
            description="Current result set"
          />

          <StatCard
            label="Successful"
            value={String(stats.paid)}
            icon={CheckCircle2}
            description="Completed payments"
          />

          <StatCard
            label="Pending"
            value={String(stats.pending)}
            icon={Clock3}
            description="Awaiting completion"
          />

          <StatCard
            label="Paid Volume"
            value={
              payments[0]
                ? formatAmount(
                    stats.totalPaid,
                    payments[0].currency,
                  )
                : "—"
            }
            icon={DollarSign}
            description="Loaded successful volume"
          />
        </motion.section>

        {/* Feedback */}
        <AnimatePresence mode="wait">
          {displayError && (
            <motion.div
              initial={{
                opacity: 0,
                y: -8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              className="flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/5 p-4 text-sm text-rose-200"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              {displayError}
            </motion.div>
          )}

          {actionSuccess && (
            <motion.div
              initial={{
                opacity: 0,
                y: -8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              className="flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-emerald-200"
            >
              <CheckCircle2 className="h-5 w-5" />
              {actionSuccess}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <motion.section
          variants={itemVariants}
          className="glass-panel rounded-2xl p-4"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-lg">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search student, email, transaction or payment ID..."
                  className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/30"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Filter className="h-4 w-4" />
                Payment filters
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-600">
                  Status
                </p>

                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["ALL", "All"],
                      ["PENDING", "Pending"],
                      ["PAID", "Paid"],
                      ["FAILED", "Failed"],
                      ["CANCELLED", "Cancelled"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setStatus(value)
                      }
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        status === value
                          ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                          : "border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-600">
                  Type
                </p>

                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["ALL", "All"],
                      ["COURSE_FEE", "Course"],
                      ["TUITION_FEE", "Tuition"],
                      ["EXAM_FEE", "Exam"],
                      ["OTHER", "Other"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setType(value)
                      }
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        type === value
                          ? "border-violet-400/30 bg-violet-400/10 text-violet-300"
                          : "border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Desktop table */}
        <motion.section
          variants={itemVariants}
          className="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] lg:block"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.025] text-left">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Student
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Type
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Method
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Created
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading
                  ? Array.from({
                      length: 7,
                    }).map((_, index) => (
                      <tr
                        key={index}
                        className="border-b border-white/5"
                      >
                        {Array.from({
                          length: 7,
                        }).map(
                          (_, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-5 py-5"
                            >
                              <div className="h-4 animate-pulse rounded bg-white/[0.05]" />
                            </td>
                          ),
                        )}
                      </tr>
                    ))
                  : filteredPayments.map(
                      (payment) => (
                        <tr
                          key={payment.id}
                          className="border-b border-white/5 transition hover:bg-white/[0.025]"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06]">
                                <UserRound className="h-4 w-4 text-cyan-300" />
                              </div>

                              <div>
                                <p className="font-medium text-white">
                                  {getStudentName(
                                    payment,
                                  )}
                                </p>

                                <p className="text-xs text-slate-600">
                                  {getStudentEmail(
                                    payment,
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-semibold text-white">
                              {formatAmount(
                                payment.amount,
                                payment.currency,
                              )}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <TypeBadge
                              type={payment.type}
                            />
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-400">
                            {payment.method}
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge
                              status={
                                payment.status
                              }
                            />
                          </td>

                          <td className="px-5 py-4 text-xs text-slate-500">
                            {formatDate(
                              payment.createdAt,
                            )}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedPayment(
                                  payment,
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/20 hover:text-cyan-300"
                            >
                              <Eye className="h-4 w-4" />
                              Details
                            </button>
                          </td>
                        </tr>
                      ),
                    )}
              </tbody>
            </table>
          </div>

          {!isLoading &&
            filteredPayments.length === 0 && (
              <div className="p-12 text-center">
                <CreditCard className="mx-auto h-8 w-8 text-slate-700" />

                <p className="mt-4 font-medium text-white">
                  No payments found
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  Try changing your search or filters.
                </p>
              </div>
            )}
        </motion.section>

        {/* Mobile cards */}
        {!isLoading &&
          filteredPayments.length > 0 && (
            <motion.section
              variants={containerVariants}
              className="grid gap-4 lg:hidden"
            >
              {filteredPayments.map(
                (payment) => {
                  const isUpdating =
                    updatingId ===
                    payment.id;

                  return (
                    <motion.article
                      key={payment.id}
                      variants={itemVariants}
                      className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06]">
                            <CreditCard className="h-4 w-4 text-cyan-300" />
                          </div>

                          <div>
                            <p className="font-semibold text-white">
                              {formatAmount(
                                payment.amount,
                                payment.currency,
                              )}
                            </p>

                            <p className="text-xs text-slate-600">
                              {payment.method}
                            </p>
                          </div>
                        </div>

                        <StatusBadge
                          status={
                            payment.status
                          }
                        />
                      </div>

                      <div className="mt-5 rounded-xl border border-white/5 bg-black/10 p-4">
                        <p className="text-xs uppercase tracking-wider text-slate-600">
                          Student
                        </p>

                        <p className="mt-2 font-medium text-white">
                          {getStudentName(
                            payment,
                          )}
                        </p>

                        <p className="mt-1 break-all text-xs text-slate-500">
                          {getStudentEmail(
                            payment,
                          )}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <TypeBadge
                          type={payment.type}
                        />

                        <span className="text-xs text-slate-600">
                          {formatDate(
                            payment.createdAt,
                          )}
                        </span>
                      </div>

                      <div className="mt-5 flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPayment(
                              payment,
                            )
                          }
                          className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:text-white"
                        >
                          View Details
                        </button>

                        {payment.status ===
                          "PENDING" && (
                          <>
                            <button
                              type="button"
                              disabled={
                                isUpdating
                              }
                              onClick={() =>
                                handleStatusUpdate(
                                  payment,
                                  "PAID",
                                )
                              }
                              className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2.5 text-xs font-semibold text-emerald-300 disabled:opacity-50"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              disabled={
                                isUpdating
                              }
                              onClick={() =>
                                handleStatusUpdate(
                                  payment,
                                  "FAILED",
                                )
                              }
                              className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2.5 text-xs font-semibold text-rose-300 disabled:opacity-50"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </motion.article>
                  );
                },
              )}
            </motion.section>
          )}

        {/* Empty mobile */}
        {!isLoading &&
          filteredPayments.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="rounded-3xl border border-white/10 bg-white/[0.02] p-12 text-center lg:hidden"
            >
              <CreditCard className="mx-auto h-8 w-8 text-slate-700" />

              <h3 className="mt-4 font-semibold text-white">
                No payments found
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Try another search or filter.
              </p>
            </motion.div>
          )}

        {/* Pagination information */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.015] p-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            Showing {filteredPayments.length} loaded
            payment
            {filteredPayments.length === 1
              ? ""
              : "s"}
          </span>

          <span className="inline-flex items-center gap-2">
            <ArrowDownUp className="h-4 w-4 text-cyan-400" />
            Sorted by newest first
          </span>
        </motion.div>
      </motion.div>

      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() =>
            setSelectedPayment(null)
          }
        />
      )}
    </main>
  );
}