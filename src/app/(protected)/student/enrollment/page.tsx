"use client";

import {
  AnimatePresence,
  motion,
  type Variants,
} from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  GraduationCap,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  useEnrollments,
  type Enrollment,
  type EnrollmentStatus,
} from "@/hooks/api/useEnrollments";

import {
  useMyPayments,
  useCreateStripeCheckout,
  type Payment,
  type PaymentStatus,
} from "@/hooks/api/usePayments";

import { getApiErrorMessage } from "@/lib/api";

/* ---------------------------------------------
   Animation
--------------------------------------------- */

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
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

/* ---------------------------------------------
   Status configuration
--------------------------------------------- */

type StatusFilter = "ALL" | EnrollmentStatus;

const statusConfig: Record<
  EnrollmentStatus,
  {
    label: string;
    icon: typeof Clock3;
    className: string;
    dotClass: string;
  }
> = {
  PENDING: {
    label: "Pending",
    icon: Clock3,
    className:
      "border-amber-400/20 bg-amber-400/[0.08] text-amber-300",
    dotClass: "bg-amber-300",
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    className:
      "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300",
    dotClass: "bg-emerald-300",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    className:
      "border-red-400/20 bg-red-400/[0.08] text-red-300",
    dotClass: "bg-red-300",
  },
};

const paymentStatusConfig: Record<
  PaymentStatus,
  {
    label: string;
    icon: typeof Clock3;
    className: string;
  }
> = {
  PENDING: {
    label: "Payment pending",
    icon: Clock3,
    className: "text-amber-300",
  },
  PAID: {
    label: "Paid",
    icon: CheckCircle2,
    className: "text-emerald-300",
  },
  FAILED: {
    label: "Payment failed",
    icon: XCircle,
    className: "text-red-300",
  },
  CANCELLED: {
    label: "Payment cancelled",
    icon: XCircle,
    className: "text-slate-400",
  },
  REFUNDED: {
    label: "Refunded",
    icon: CheckCircle2,
    className: "text-violet-300",
  },
};

/* ---------------------------------------------
   Helpers
--------------------------------------------- */

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatAmount(
  amount?: number | string | null,
  currency = "BDT",
) {
  if (amount === undefined || amount === null || amount === "") {
    return "—";
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "—";
  }

  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${numericAmount.toFixed(2)} ${currency.toUpperCase()}`;
  }
}

function StatusBadge({
  status,
}: {
  status: EnrollmentStatus;
}) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] ${config.className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`}
      />
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function PaymentBadge({
  payment,
}: {
  payment?: Payment;
}) {
  if (!payment) {
    return (
      <span className="inline-flex items-center gap-2 text-xs text-slate-500">
        <AlertCircle className="h-3.5 w-3.5" />
        Payment record unavailable
      </span>
    );
  }

  const config = paymentStatusConfig[payment.status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-medium ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function EnrollmentSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5"
        >
          <div className="animate-pulse space-y-5">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-2xl bg-white/[0.08]" />
              <div className="h-6 w-24 rounded-full bg-white/[0.08]" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-24 rounded bg-white/[0.08]" />
              <div className="h-6 w-3/4 rounded bg-white/[0.08]" />
              <div className="h-3 w-full rounded bg-white/[0.06]" />
            </div>
            <div className="h-14 rounded-2xl bg-white/[0.05]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof GraduationCap;
  accent: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl"
    >
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40 ${accent}`}
      />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.05]">
          <Icon className="h-5 w-5 text-cyan-300" />
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------
   Enrollment card
--------------------------------------------- */

function EnrollmentCard({
  enrollment,
  payment,
  checkoutPending,
  onOpen,
  onPay,
}: {
  enrollment: Enrollment;
  payment?: Payment;
  checkoutPending: boolean;
  onOpen: (enrollment: Enrollment) => void;
  onPay: (payment: Payment) => void;
}) {
  const course = enrollment.course;

  const canPay =
    enrollment.status === "PENDING" &&
    payment?.type === "COURSE_FEE" &&
    payment.method === "STRIPE" &&
    payment.status === "PENDING";

  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl transition-colors hover:border-cyan-400/20 hover:bg-white/[0.04]"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.07]">
            <BookOpen className="h-5 w-5 text-cyan-300" />
          </div>

          <StatusBadge status={enrollment.status} />
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/70">
            {course?.code ?? "COURSE"}
          </p>

          <h3 className="mt-2 line-clamp-2 min-h-14 text-lg font-semibold text-white">
            {course?.title ?? course?.name ?? "Unknown course"}
          </h3>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
              Credit
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-200">
              {course?.credit ?? "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
              Semester
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-200">
              {course?.semester ?? "—"}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/[0.06] bg-black/20 p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Course fee payment
            </span>
            <PaymentBadge payment={payment} />
          </div>

          {payment && (
            <p className="mt-2 text-sm font-semibold text-slate-200">
              {formatAmount(payment.amount, payment.currency)}
            </p>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(enrollment.createdAt)}
          </div>

          <button
            type="button"
            onClick={() => onOpen(enrollment)}
            className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300/80 transition hover:text-cyan-200"
          >
            Details
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {canPay && payment && (
          <button
            type="button"
            disabled={checkoutPending}
            onClick={() => onPay(payment)}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-gradient-to-r from-cyan-400/15 to-blue-500/15 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/40 hover:from-cyan-400/20 hover:to-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {checkoutPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Preparing secure checkout...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Pay course fee
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        )}

        {payment?.status === "PAID" && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] px-4 py-3 text-xs font-medium text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            Payment recorded
          </div>
        )}

        {payment &&
          (payment.status === "FAILED" ||
            payment.status === "CANCELLED") && (
            <p className="mt-3 text-xs leading-5 text-slate-500">
              This payment is {payment.status.toLowerCase()}.
              Contact support or use the supported payment retry flow
              to continue.
            </p>
          )}

        {!payment && enrollment.status === "PENDING" && (
          <p className="mt-3 text-xs leading-5 text-amber-300/80">
            No linked payment record was returned. Refresh the page
            or contact support; a new payment has not been created.
          </p>
        )}
      </div>
    </motion.article>
  );
}

/* ---------------------------------------------
   Enrollment details modal
--------------------------------------------- */

function EnrollmentDetailsModal({
  enrollment,
  payment,
  onClose,
  onPay,
  checkoutPending,
}: {
  enrollment: Enrollment | null;
  payment?: Payment;
  onClose: () => void;
  onPay: (payment: Payment) => void;
  checkoutPending: boolean;
}) {
  if (!enrollment) return null;

  const course = enrollment.course;

  const canPay =
    enrollment.status === "PENDING" &&
    payment?.type === "COURSE_FEE" &&
    payment.method === "STRIPE" &&
    payment.status === "PENDING";

  return (
    <AnimatePresence>
      <motion.div
        key={enrollment.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-md"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="enrollment-modal-title"
          className="relative my-6 w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/[0.1] bg-[#07111f] shadow-2xl shadow-cyan-950/30"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

          <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300/70">
                Enrollment details
              </p>
              <h2
                id="enrollment-modal-title"
                className="mt-1 text-xl font-semibold text-white"
              >
                {course?.code ?? "Course"}
              </h2>
            </div>

            <button
              type="button"
              aria-label="Close details"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-5 p-6">
            <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.04] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-cyan-300/60">
                    Course title
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {course?.title ?? course?.name ?? "Unknown course"}
                  </h3>
                </div>

                <StatusBadge status={enrollment.status} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  label: "Course code",
                  value: course?.code ?? "—",
                },
                {
                  label: "Credit",
                  value: course?.credit ?? "—",
                },
                {
                  label: "Semester",
                  value: course?.semester ?? "—",
                },
                {
                  label: "Enrolled on",
                  value: formatDate(enrollment.createdAt),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"
                >
                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 font-semibold text-slate-200">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05]">
                  <CreditCard className="h-4 w-4 text-cyan-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200">
                    Course fee payment
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {payment
                      ? formatAmount(payment.amount, payment.currency)
                      : "No linked payment record"}
                  </p>
                </div>
                <PaymentBadge payment={payment} />
              </div>

              {canPay && payment && (
                <button
                  type="button"
                  disabled={checkoutPending}
                  onClick={() => onPay(payment)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {checkoutPending ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Preparing checkout...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Continue to secure payment
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Enrollment status
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Enrollment approval is determined by the
                    university backend after payment verification.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------------------------------------------
   Main page
--------------------------------------------- */

export default function StudentEnrollmentPage() {
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [search, setSearch] = useState("");
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);

  const [checkoutError, setCheckoutError] =
    useState<string | null>(null);

  const {
    data: enrollments = [],
    isLoading: enrollmentsLoading,
    isFetching: enrollmentsFetching,
    isError: enrollmentsError,
    error: enrollmentError,
    refetch: refetchEnrollments,
  } = useEnrollments("STUDENT");

  const {
    data: payments = [],
    isLoading: paymentsLoading,
    isFetching: paymentsFetching,
    isError: paymentsError,
    error: paymentError,
    refetch: refetchPayments,
  } = useMyPayments();

  const checkoutMutation = useCreateStripeCheckout();

  const isRefreshing =
    enrollmentsFetching || paymentsFetching;

  const isLoading =
    enrollmentsLoading || paymentsLoading;

  const refreshAll = useCallback(async () => {
    setCheckoutError(null);

    await Promise.all([
      refetchEnrollments(),
      refetchPayments(),
    ]);
  }, [refetchEnrollments, refetchPayments]);

  const paymentsByEnrollment = useMemo(() => {
    const map = new Map<string, Payment>();

    for (const payment of payments) {
      if (!payment.enrollmentId) continue;
      if (payment.type !== "COURSE_FEE") continue;

      const existing = map.get(payment.enrollmentId);

      // Prefer a paid payment. Otherwise keep the most recent
      // matching payment returned by the API.
      if (!existing || payment.status === "PAID") {
        map.set(payment.enrollmentId, payment);
      }
    }

    return map;
  }, [payments]);

  const filteredEnrollments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return enrollments.filter((enrollment) => {
      const course = enrollment.course;

      const matchesStatus =
        statusFilter === "ALL" ||
        enrollment.status === statusFilter;

      if (!matchesStatus) return false;

      if (!normalizedSearch) return true;

      const searchableText = [
        course?.code,
        course?.title,
        course?.name,
        enrollment.status,
        paymentsByEnrollment.get(enrollment.id)?.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [
    enrollments,
    search,
    statusFilter,
    paymentsByEnrollment,
  ]);

  const counts = useMemo(
    () => ({
      total: enrollments.length,
      pending: enrollments.filter(
        (item) => item.status === "PENDING",
      ).length,
      approved: enrollments.filter(
        (item) => item.status === "APPROVED",
      ).length,
      rejected: enrollments.filter(
        (item) => item.status === "REJECTED",
      ).length,
    }),
    [enrollments],
  );

  const handleCheckout = useCallback(
    async (payment: Payment) => {
      if (checkoutMutation.isPending) return;

      if (
        payment.type !== "COURSE_FEE" ||
        payment.method !== "STRIPE" ||
        payment.status !== "PENDING"
      ) {
        setCheckoutError(
          "This payment is not currently eligible for checkout.",
        );
        return;
      }

      setCheckoutError(null);

      try {
        const result =
          await checkoutMutation.mutateAsync(payment.id);

        const checkoutUrl =
          result.data?.checkout?.checkoutUrl;

        if (!result.success || !checkoutUrl) {
          throw new Error(
            result.message ||
              "The checkout session could not be created.",
          );
        }

        // Only redirect to HTTPS Stripe checkout URLs.
        const parsedUrl = new URL(checkoutUrl);

        if (
          parsedUrl.protocol !== "https:" ||
          !(
            parsedUrl.hostname === "checkout.stripe.com" ||
            parsedUrl.hostname.endsWith(".stripe.com")
          )
        ) {
          throw new Error(
            "The server returned an invalid checkout URL.",
          );
        }

        window.location.assign(parsedUrl.toString());
      } catch (error) {
        setCheckoutError(
          getApiErrorMessage(
            error,
            "Unable to start checkout. Please try again.",
          ),
        );

        await refetchPayments();
      }
    },
    [
      checkoutMutation,
      refetchPayments,
    ],
  );

  const selectedPayment = selectedEnrollment
    ? paymentsByEnrollment.get(selectedEnrollment.id)
    : undefined;

  return (
    <main className="min-h-screen pb-10">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-gradient-to-br from-cyan-500/[0.08] via-white/[0.02] to-violet-500/[0.06] p-6 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-[100px]" />

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              Academic enrollment
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Your{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                enrollments
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Track course enrollment, monitor payment progress,
              and manage your academic activity from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshAll}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/20 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label="Total enrollments"
          value={counts.total}
          icon={GraduationCap}
          accent="bg-cyan-400"
        />

        <StatCard
          label="Approved"
          value={counts.approved}
          icon={CheckCircle2}
          accent="bg-emerald-400"
        />

        <StatCard
          label="Pending"
          value={counts.pending}
          icon={Clock3}
          accent="bg-amber-400"
        />

        <StatCard
          label="Rejected"
          value={counts.rejected}
          icon={XCircle}
          accent="bg-red-400"
        />
      </motion.section>

      {/* Search and filters */}
      <section className="mt-6 rounded-3xl border border-white/[0.07] bg-white/[0.025] p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by course, status or payment..."
              aria-label="Search enrollments"
              className="h-11 w-full rounded-2xl border border-white/[0.07] bg-black/20 pl-11 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-600 transition focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ["ALL", "All"],
                ["APPROVED", "Approved"],
                ["PENDING", "Pending"],
                ["REJECTED", "Rejected"],
              ] as [StatusFilter, string][]
            ).map(([value, label]) => {
              const active = statusFilter === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatusFilter(value)}
                  aria-pressed={active}
                  className={`rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
                    active
                      ? "border-cyan-400/25 bg-cyan-400/[0.1] text-cyan-300"
                      : "border-white/[0.07] bg-white/[0.025] text-slate-500 hover:bg-white/[0.06] hover:text-slate-300"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Checkout error */}
      {checkoutError && (
        <div
          role="alert"
          className="mt-5 flex items-start gap-3 rounded-2xl border border-red-400/15 bg-red-400/[0.05] p-4"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-red-200">
              Checkout could not be started
            </p>
            <p className="mt-1 text-xs leading-5 text-red-200/70">
              {checkoutError}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCheckoutError(null)}
            aria-label="Dismiss checkout error"
            className="rounded-lg p-1 text-red-200/70 hover:bg-red-400/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Payment loading/error notices */}
      {!paymentsLoading && paymentsError && (
        <div
          role="alert"
          className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] p-4"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-200">
              Payment information unavailable
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              {getApiErrorMessage(
                paymentError,
                "Payment status could not be loaded.",
              )}
            </p>
            <button
              type="button"
              onClick={() => refetchPayments()}
              className="mt-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Retry payment status
            </button>
          </div>
        </div>
      )}

      {/* Enrollment list */}
      <section className="mt-6">
        {isLoading ? (
          <EnrollmentSkeleton />
        ) : enrollmentsError ? (
          <div className="rounded-3xl border border-red-400/15 bg-red-400/[0.04] p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/15 bg-red-400/[0.08]">
              <AlertCircle className="h-5 w-5 text-red-300" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-white">
              Could not load enrollments
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {getApiErrorMessage(
                enrollmentError,
                "Something went wrong while loading your enrollments.",
              )}
            </p>

            <button
              type="button"
              onClick={refreshAll}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.09]"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
              <BookOpen className="h-6 w-6 text-slate-500" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              No enrollments found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {search || statusFilter !== "ALL"
                ? "Try changing your search or status filter."
                : "Your enrollment activity will appear here once you enroll in a course."}
            </p>

            {(search || statusFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                }}
                className="mt-5 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06] px-4 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/[0.1]"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">
                Showing{" "}
                <span className="text-slate-300">
                  {filteredEnrollments.length}
                </span>{" "}
                enrollment
                {filteredEnrollments.length === 1 ? "" : "s"}
              </p>

              {isRefreshing && (
                <LoaderCircle className="h-4 w-4 animate-spin text-cyan-300" />
              )}
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              {filteredEnrollments.map((enrollment) => (
                <EnrollmentCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  payment={paymentsByEnrollment.get(enrollment.id)}
                  checkoutPending={checkoutMutation.isPending}
                  onOpen={setSelectedEnrollment}
                  onPay={handleCheckout}
                />
              ))}
            </motion.div>
          </>
        )}
      </section>

      {/* Details modal */}
      <EnrollmentDetailsModal
        enrollment={selectedEnrollment}
        payment={selectedPayment}
        onClose={() => setSelectedEnrollment(null)}
        onPay={handleCheckout}
        checkoutPending={checkoutMutation.isPending}
      />
    </main>
  );
}