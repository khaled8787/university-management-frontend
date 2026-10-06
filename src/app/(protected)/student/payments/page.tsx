"use client";

import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Loader2,
  RefreshCw,
  ShieldCheck,
  X,
  XCircle,
  Clock3,
} from "lucide-react";

import {
  motion,
  type Variants,
} from "framer-motion";

import {
  useMemo,
  useState,
} from "react";

import {
  useCancelPayment,
  useCreateStripeCheckout,
  useMyPayments,
  type Payment,
} from "@/hooks/api/usePayments";

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

function statusStyle(
  status: Payment["status"],
) {
  switch (status) {
    case "PAID":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

    case "PENDING":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";

    case "FAILED":
      return "border-rose-400/20 bg-rose-400/10 text-rose-300";

    case "CANCELLED":
      return "border-slate-400/20 bg-slate-400/10 text-slate-400";
  }
}

function statusIcon(
  status: Payment["status"],
) {
  switch (status) {
    case "PAID":
      return CheckCircle2;

    case "PENDING":
      return Clock3;

    case "FAILED":
      return XCircle;

    case "CANCELLED":
      return X;
  }
}

function formatAmount(payment: Payment) {
  const amount =
    Number(payment.amount);

  if (!Number.isFinite(amount)) {
    return `${payment.amount} ${payment.currency}`;
  }

  return `${amount.toLocaleString()} ${payment.currency}`;
}

function formatType(
  type: Payment["type"],
) {
  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

export default function StudentPaymentsPage() {
  const [selectedPayment, setSelectedPayment] =
    useState<Payment | null>(null);

  const [cancelPaymentId, setCancelPaymentId] =
    useState<string | null>(null);

  const {
    data: payments = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useMyPayments();

  const checkoutMutation =
    useCreateStripeCheckout();

  const cancelMutation =
    useCancelPayment();

  const stats = useMemo(() => {
    const paid = payments.filter(
      (payment) =>
        payment.status === "PAID",
    );

    const pending = payments.filter(
      (payment) =>
        payment.status === "PENDING",
    );

    const totalPaid = paid.reduce(
      (sum, payment) =>
        sum + Number(payment.amount || 0),
      0,
    );

    return {
      total: payments.length,
      paid: paid.length,
      pending: pending.length,
      totalPaid,
    };
  }, [payments]);

  const handleCheckout = async (
    payment: Payment,
  ) => {
    const response =
      await checkoutMutation.mutateAsync(
        payment.id,
      );

    const checkoutUrl =
      response.data?.checkout
        ?.checkoutUrl;

    if (!checkoutUrl) {
      throw new Error(
        "Stripe checkout URL was not returned.",
      );
    }

    window.location.assign(
      checkoutUrl,
    );
  };

  const handleCancel = async () => {
    if (!cancelPaymentId) {
      return;
    }

    await cancelMutation.mutateAsync(
      cancelPaymentId,
    );

    setCancelPaymentId(null);
  };

  return (
    <main className="min-h-full space-y-6">
      {/* HERO */}
      <motion.section
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-xl md:p-8"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure Payments
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
              Payment{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Manage your university payments,
              track transaction status, and securely
              complete pending fees through Stripe.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10 disabled:opacity-60"
          >
            <RefreshCw
              className={
                isFetching
                  ? "h-4 w-4 animate-spin"
                  : "h-4 w-4"
              }
            />

            Refresh
          </button>
        </div>
      </motion.section>

      {/* STATS */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={CreditCard}
          label="Transactions"
          value={String(stats.total)}
          text="Payment records"
        />

        <Stat
          icon={CheckCircle2}
          label="Paid"
          value={String(stats.paid)}
          text="Successful payments"
        />

        <Stat
          icon={Clock3}
          label="Pending"
          value={String(stats.pending)}
          text="Awaiting payment"
        />

        <Stat
          icon={DollarSign}
          label="Paid Amount"
          value={`${stats.totalPaid.toLocaleString()} BDT`}
          text="Completed payments"
        />
      </section>

      {/* PAYMENT LIST */}
      <motion.section
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="rounded-3xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-xl md:p-6"
      >
        <div className="mb-5">
          <h2 className="text-xl font-black text-white">
            Payment History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your latest payment records and transaction status.
          </p>
        </div>

        {isLoading ? (
          <PaymentSkeleton />
        ) : isError ? (
          <State
            icon={AlertCircle}
            title="Unable to load payments"
            description="Payment records could not be retrieved from the backend."
            action={
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300"
              >
                Try again
              </button>
            }
          />
        ) : payments.length === 0 ? (
          <State
            icon={CreditCard}
            title="No payments yet"
            description="Your payment history will appear here when a payment record is created."
          />
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => {
              const StatusIcon =
                statusIcon(
                  payment.status,
                );

              return (
                <motion.div
                  key={payment.id}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition hover:border-cyan-400/20 hover:bg-white/[0.04] md:p-5"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/10 p-3">
                        <CreditCard className="h-5 w-5 text-cyan-300" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-white">
                            {formatType(
                              payment.type,
                            )}
                          </h3>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusStyle(
                              payment.status,
                            )}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {payment.status}
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-slate-600">
                          Transaction ID:{" "}
                          {payment.transactionId ||
                            payment.id}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          {payment.createdAt
                            ? new Date(
                                payment.createdAt,
                              ).toLocaleString()
                            : "Date unavailable"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="sm:text-right">
                        <p className="text-xl font-black text-white">
                          {formatAmount(
                            payment,
                          )}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          via {payment.method}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPayment(
                              payment,
                            )
                          }
                          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:text-white"
                        >
                          Details
                        </button>

                        {payment.status ===
                          "PENDING" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleCheckout(
                                  payment,
                                )
                              }
                              disabled={
                                checkoutMutation.isPending
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-cyan-500/10 disabled:opacity-60"
                            >
                              {checkoutMutation.isPending ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              )}

                              Pay with Stripe
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setCancelPaymentId(
                                  payment.id,
                                )
                              }
                              className="rounded-xl border border-rose-400/10 bg-rose-400/5 px-3 py-2.5 text-xs font-bold text-rose-300"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* DETAILS MODAL */}
      {selectedPayment && (
        <Modal
          title="Payment Details"
          onClose={() =>
            setSelectedPayment(null)
          }
        >
          <div className="space-y-3">
            <Detail
              label="Payment Type"
              value={formatType(
                selectedPayment.type,
              )}
            />

            <Detail
              label="Amount"
              value={formatAmount(
                selectedPayment,
              )}
            />

            <Detail
              label="Method"
              value={selectedPayment.method}
            />

            <Detail
              label="Status"
              value={selectedPayment.status}
            />

            <Detail
              label="Transaction ID"
              value={
                selectedPayment.transactionId ||
                selectedPayment.id
              }
            />

            {selectedPayment.failureReason && (
              <Detail
                label="Failure Reason"
                value={
                  selectedPayment.failureReason
                }
              />
            )}

            <Detail
              label="Created"
              value={
                selectedPayment.createdAt
                  ? new Date(
                      selectedPayment.createdAt,
                    ).toLocaleString()
                  : "Unavailable"
              }
            />

            {selectedPayment.paidAt && (
              <Detail
                label="Paid At"
                value={new Date(
                  selectedPayment.paidAt,
                ).toLocaleString()}
              />
            )}
          </div>
        </Modal>
      )}

      {/* CANCEL MODAL */}
      {cancelPaymentId && (
        <Modal
          title="Cancel Payment"
          onClose={() =>
            setCancelPaymentId(null)
          }
        >
          <div className="space-y-5">
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4">
              <p className="font-bold text-rose-200">
                Cancel this pending payment?
              </p>

              <p className="mt-2 text-sm leading-6 text-rose-200/60">
                This action will mark the pending payment
                as cancelled.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setCancelPaymentId(null)
                }
                className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] py-3 text-sm font-bold text-slate-300"
              >
                Keep Payment
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-500/90 py-3 text-sm font-black text-white disabled:opacity-60"
              >
                {cancelMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                Cancel Payment
              </button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  text,
}: {
  icon: typeof CreditCard;
  label: string;
  value: string;
  text: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="show"
      className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-2xl font-black text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {text}
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/10 p-3">
          <Icon className="h-5 w-5 text-cyan-300" />
        </div>
      </div>
    </motion.div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 break-all text-sm leading-6 text-slate-300">
        {value}
      </p>
    </div>
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 12,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#07101f]/95 p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black text-white">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {children}
      </motion.div>
    </div>
  );
}

function State({
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
    <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <Icon className="h-7 w-7 text-cyan-300" />
      </div>

      <h3 className="mt-5 text-lg font-black text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
}

function PaymentSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map(
        (_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-2xl bg-white/[0.045]"
          />
        ),
      )}
    </div>
  );
}