"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  CheckCircle2,
  Clock3,
  CreditCard,
  GraduationCap,
  HelpCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useMyPayments } from "@/hooks/api/usePayments";

function PaymentCancelledContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");

  const {
    data: payments = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useMyPayments();

  const payment = useMemo(() => {
    if (!paymentId || !Array.isArray(payments)) return undefined;

    return payments.find((item) => item.id === paymentId);
  }, [paymentId, payments]);

  const isPaid = payment?.status === "PAID";
  const isPending = payment?.status === "PENDING";
  const isFailed = payment?.status === "FAILED";
  const isCancelled = payment?.status === "CANCELLED";

  const amount = payment
    ? new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: payment.currency || "BDT",
        maximumFractionDigits: 2,
      }).format(Number(payment.amount))
    : null;

  const handleBackToEnrollments = () => {
    router.push("/student/enrollments");
  };

  const handlePaymentHistory = () => {
    router.push("/student/payments");
  };

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]"
        />

        <div className="absolute bottom-[-140px] left-[-100px] h-[350px] w-[350px] rounded-full bg-cyan-500/[0.09] blur-[120px]" />

        <div className="absolute bottom-[-120px] right-[-80px] h-[300px] w-[300px] rounded-full bg-rose-500/[0.06] blur-[110px]" />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-12 sm:px-6">
        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="w-full max-w-2xl"
        >
          <div className="relative overflow-hidden rounded-[32px] border border-white/[0.09] bg-white/[0.045] p-6 shadow-[0_0_100px_rgba(139,92,246,0.07)] backdrop-blur-2xl sm:p-10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/70 to-transparent" />

            {/* Top label */}
            <div className="mb-9 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.07]">
                  <GraduationCap className="h-6 w-6 text-cyan-300" />
                </div>

                <div>
                  <p className="text-sm font-semibold tracking-wide text-white">
                    Student Portal
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Secure payment center
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-slate-400 sm:flex">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                Secure checkout
              </div>
            </div>

            {/* Main icon */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.65, rotate: 10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 170,
                  damping: 13,
                  delay: 0.1,
                }}
                className={`relative mb-7 flex h-24 w-24 items-center justify-center rounded-full border ${
                  isPaid
                    ? "border-emerald-300/25 bg-emerald-300/[0.08]"
                    : isPending
                      ? "border-amber-300/25 bg-amber-300/[0.08]"
                      : "border-violet-300/25 bg-violet-300/[0.08]"
                }`}
              >
                <div className="absolute inset-[-9px] rounded-full border border-white/[0.06]" />

                {isPaid ? (
                  <CheckCircle2 className="h-14 w-14 text-emerald-300" strokeWidth={1.5} />
                ) : isPending ? (
                  <Clock3 className="h-14 w-14 text-amber-300" strokeWidth={1.5} />
                ) : (
                  <Ban className="h-12 w-12 text-violet-300" strokeWidth={1.5} />
                )}

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -right-1 -top-1"
                >
                  <Sparkles className="h-6 w-6 text-cyan-300" />
                </motion.div>
              </motion.div>

              <div
                className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium tracking-wide ${
                  isPaid
                    ? "border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-300"
                    : isPending
                      ? "border-amber-300/20 bg-amber-300/[0.07] text-amber-200"
                      : "border-violet-300/20 bg-violet-300/[0.07] text-violet-200"
                }`}
              >
                {isPaid ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : isPending ? (
                  <Clock3 className="h-4 w-4" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )}

                {isPaid
                  ? "PAYMENT CONFIRMED"
                  : isPending
                    ? "PAYMENT STILL PENDING"
                    : isFailed
                      ? "PAYMENT FAILED"
                      : isCancelled
                        ? "PAYMENT CANCELLED"
                        : "CHECKOUT INTERRUPTED"}
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
                {isPaid
                  ? "You're all set!"
                  : isPending
                    ? "Still processing"
                    : isFailed
                      ? "Payment unsuccessful"
                      : isCancelled
                        ? "Payment cancelled"
                        : "No worries."}

                <span className="mt-2 block bg-gradient-to-r from-violet-300 via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                  {isPaid
                    ? "Your payment is complete."
                    : isPending
                      ? "Let's check your status."
                      : "You're in control."}
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
                {isPaid
                  ? "Your payment has been confirmed by our system. You can safely return to your enrollments."
                  : isPending
                    ? "Your payment has not been marked as complete yet. Check the latest status before trying to pay again."
                    : isFailed
                      ? "The payment could not be completed. Review your payment history before trying again."
                      : isCancelled
                        ? "You left the Stripe checkout before completing the payment. No new payment is needed just to revisit this page."
                        : "You returned from checkout before we could confirm the result. Check your payment status before starting another payment."}
              </p>
            </div>

            {/* Payment details */}
            <div className="mt-9 rounded-2xl border border-white/[0.08] bg-black/20 p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-300/[0.07]">
                  <CreditCard className="h-5 w-5 text-violet-200" />
                </div>

                <div>
                  <p className="text-sm font-medium text-white">
                    Payment details
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Latest available information
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t border-white/[0.07] pt-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-400">
                    Amount
                  </span>
                  <span className="text-base font-semibold text-white">
                    {amount ?? "Not available"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-400">
                    Payment method
                  </span>
                  <span className="text-sm text-slate-200">
                    Stripe
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-400">
                    Current status
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      isPaid
                        ? "text-emerald-300"
                        : isPending
                          ? "text-amber-300"
                          : isFailed || isCancelled
                            ? "text-rose-300"
                            : "text-slate-300"
                    }`}
                  >
                    {payment?.status ?? "Not verified"}
                  </span>
                </div>

                {payment?.id && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-slate-400">
                      Payment ID
                    </span>
                    <span className="max-w-[60%] break-all text-right font-mono text-xs text-slate-300">
                      {payment.id}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Error / loading notes */}
            {!paymentId && (
              <div className="mt-5 flex gap-3 rounded-xl border border-amber-300/15 bg-amber-300/[0.045] p-4 text-left">
                <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <p className="text-sm leading-6 text-slate-300">
                  The payment ID is missing from this URL. Your payment
                  status cannot be matched here; check your payment history.
                </p>
              </div>
            )}

            {paymentId && isLoading && !payment && (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.04] p-4 text-sm text-slate-300">
                <RefreshCw className="h-4 w-4 animate-spin text-cyan-300" />
                Loading payment information...
              </div>
            )}

            {isError && (
              <div className="mt-5 rounded-xl border border-amber-300/15 bg-amber-300/[0.045] p-4 text-sm leading-6 text-slate-300">
                We couldn&apos;t load your payment status. Please refresh
                or check your payment history before retrying.
              </div>
            )}

            {/* Actions */}
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={handleBackToEnrollments}
                className="group flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-[#080b18] transition hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-[#050816]"
              >
                <GraduationCap className="h-5 w-5" />
                My enrollments
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={handlePaymentHistory}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
              >
                Payment history
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isFetching}
              className="mx-auto mt-5 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-medium text-slate-400 transition hover:text-cyan-200 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  isFetching ? "animate-spin" : ""
                }`}
              />
              Refresh payment status
            </button>

            <div className="mt-7 flex items-center justify-center gap-2 border-t border-white/[0.07] pt-6 text-center text-xs leading-5 text-slate-500">
              <ShieldCheck className="h-4 w-4 shrink-0 text-cyan-300/70" />
              <span>
                Always verify your payment status before trying again.
              </span>
            </div>

            <button
              onClick={() => router.push("/")}
              className="mx-auto mt-4 flex items-center gap-2 text-xs text-slate-500 transition hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to home
            </button>
          </div>

          <p className="mt-5 text-center text-xs text-slate-600">
            Your learning journey is waiting for you.
          </p>
        </motion.section>
      </div>
    </main>
  );
}

function CancelledFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
      <div className="flex items-center gap-3 text-sm text-slate-300">
        <RefreshCw className="h-5 w-5 animate-spin text-cyan-300" />
        Loading payment status...
      </div>
    </main>
  );
}

export default function PaymentCancelledPage() {
  return (
    <Suspense fallback={<CancelledFallback />}>
      <PaymentCancelledContent />
    </Suspense>
  );
}
