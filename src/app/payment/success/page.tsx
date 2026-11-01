"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  GraduationCap,
  AlertCircle,
  ReceiptText,
  Sparkles,
  LoaderCircle,
} from "lucide-react";

import { useMyPayments } from "@/hooks/api/usePayments";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const {
    data: payments = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useMyPayments();

  const [elapsed, setElapsed] = useState(0);
  const [manuallyRefreshing, setManuallyRefreshing] = useState(false);

  // The backend's payment list contains providerSessionId.
  // Never trust the URL alone to confirm a successful payment.
  const payment = useMemo(() => {
    if (!sessionId || !Array.isArray(payments)) return undefined;

    return payments.find(
      (item) => item.providerSessionId === sessionId
    );
  }, [payments, sessionId]);

  const paymentStatus = payment?.status;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsed((previous) => previous + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  // Refresh the payment list while waiting for the Stripe webhook.
  useEffect(() => {
    if (
      !sessionId ||
      paymentStatus === "PAID" ||
      paymentStatus === "FAILED" ||
      paymentStatus === "CANCELLED" ||
      paymentStatus === "REFUNDED" ||
      elapsed >= 120
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      void refetch();
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [sessionId, paymentStatus, elapsed, refetch]);

  const handleRefresh = async () => {
    setManuallyRefreshing(true);

    try {
      await refetch();
    } finally {
      setManuallyRefreshing(false);
    }
  };

  const amount = payment
    ? new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: payment.currency || "BDT",
        maximumFractionDigits: 2,
      }).format(Number(payment.amount))
    : null;

  const isPaid = paymentStatus === "PAID";
  const isPending =
    !!sessionId &&
    !isPaid &&
    (paymentStatus === "PENDING" ||
      (!payment && elapsed < 120));

  const isFailed =
    paymentStatus === "FAILED" ||
    paymentStatus === "CANCELLED";

  const isRefunded = paymentStatus === "REFUNDED";

  const verificationTimedOut =
    !!sessionId &&
    !payment &&
    elapsed >= 120;

  const showError =
    !sessionId ||
    isError ||
    isFailed ||
    isRefunded ||
    verificationTimedOut;

  const goToEnrollments = () => {
    router.push("/student/enrollments");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[430px] w-[430px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-120px] right-[-80px] h-[320px] w-[320px] rounded-full bg-cyan-500/10 blur-[110px]" />
        <div className="absolute left-[-100px] top-1/2 h-[280px] w-[280px] rounded-full bg-blue-600/10 blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-12 sm:px-6">
        <AnimatePresence mode="wait">
          {isPaid ? (
            <motion.section
              key="paid"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="w-full max-w-2xl"
            >
              <div className="relative overflow-hidden rounded-[32px] border border-emerald-400/20 bg-white/[0.045] p-6 shadow-[0_0_100px_rgba(16,185,129,0.08)] backdrop-blur-2xl sm:p-10">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/80 to-transparent" />

                <div className="flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0.5, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 12,
                      delay: 0.1,
                    }}
                    className="relative mb-7 flex h-24 w-24 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/10"
                  >
                    <div className="absolute inset-[-9px] rounded-full border border-emerald-300/10" />
                    <CheckCircle2
                      className="h-14 w-14 text-emerald-300"
                      strokeWidth={1.5}
                    />

                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute -right-1 -top-1"
                    >
                      <Sparkles className="h-6 w-6 text-cyan-300" />
                    </motion.div>
                  </motion.div>

                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5 text-xs font-medium tracking-wide text-emerald-300">
                    <ShieldCheck className="h-4 w-4" />
                    PAYMENT VERIFIED
                  </div>

                  <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
                    Payment successful
                    <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                      You&apos;re all set!
                    </span>
                  </h1>

                  <p className="mt-5 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
                    Your payment has been confirmed by our system.
                    Thank you for taking the next step in your learning
                    journey.
                  </p>

                  <div className="mt-8 w-full rounded-2xl border border-white/[0.08] bg-black/20 p-5 text-left sm:p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-300/15 bg-emerald-300/[0.08]">
                          <ReceiptText className="h-5 w-5 text-emerald-300" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            Payment receipt
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Transaction summary
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-300">
                        PAID
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4 border-t border-white/[0.07] pt-4">
                        <span className="text-sm text-slate-400">
                          Amount paid
                        </span>
                        <span className="text-lg font-semibold text-white">
                          {amount ?? "Confirmed"}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span className="text-sm text-slate-400">
                          Payment type
                        </span>
                        <span className="text-right text-sm text-slate-200">
                          {payment?.type?.replaceAll("_", " ") ??
                            "Course fee"}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span className="text-sm text-slate-400">
                          Payment method
                        </span>
                        <span className="text-sm text-slate-200">
                          Stripe
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

                  <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
                    <button
                      onClick={goToEnrollments}
                      className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-semibold text-[#04110e] transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-[#050816]"
                    >
                      <GraduationCap className="h-5 w-5" />
                      View my enrollments
                      <ArrowLeft className="h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
                    </button>

                    <button
                      onClick={() => router.push("/")}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
                    >
                      Back to home
                    </button>
                  </div>

                  <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    Payment status confirmed by the server
                  </p>
                </div>
              </div>
            </motion.section>
          ) : isPending && !isError ? (
            <motion.section
              key="pending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-xl rounded-[32px] border border-cyan-300/15 bg-white/[0.045] p-7 text-center shadow-2xl backdrop-blur-2xl sm:p-10"
            >
              <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/[0.08]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Clock3 className="h-10 w-10 text-cyan-300" />
                </motion.div>
              </div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-1.5 text-xs text-cyan-200">
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                VERIFYING PAYMENT
              </div>

              <h1 className="text-3xl font-semibold sm:text-4xl">
                Almost there!
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400">
                Your payment is being processed. We&apos;re checking
                for confirmation from our server. Please don&apos;t
                make another payment while we verify this one.
              </p>

              <div className="mt-8 rounded-2xl border border-white/[0.08] bg-black/20 p-4 text-left">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Payment status</span>
                  <span className="font-medium text-amber-300">
                    {paymentStatus ?? "Awaiting confirmation"}
                  </span>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div
                    animate={{ x: ["-100%", "250%"] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="h-full w-1/3 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-300"
                  />
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  This page checks for updates automatically.
                </p>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isFetching || manuallyRefreshing}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isFetching || manuallyRefreshing
                      ? "animate-spin"
                      : ""
                  }`}
                />
                Check status
              </button>
            </motion.section>
          ) : (
            <motion.section
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-xl rounded-[32px] border border-white/10 bg-white/[0.045] p-7 text-center backdrop-blur-2xl sm:p-10"
            >
              <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-amber-300/20 bg-amber-300/[0.08]">
                <AlertCircle className="h-10 w-10 text-amber-300" />
              </div>

              <h1 className="text-3xl font-semibold sm:text-4xl">
                {isRefunded
                  ? "Payment refunded"
                  : isFailed
                    ? "Payment not completed"
                    : "Unable to verify payment"}
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400">
                {!sessionId
                  ? "The Stripe session ID is missing from this URL. Open your payment history to check the latest status."
                  : isRefunded
                    ? "This payment has been refunded. Check your payment history for the latest details."
                    : isFailed
                      ? "The payment was not completed. Check your payment history before attempting another payment."
                      : isError
                        ? "We couldn't retrieve your payment status right now. Your payment may still have been processed, so please check again before retrying."
                        : "We couldn't match this Stripe session to a payment in your account. Your payment may still be processing. Check your payment history before trying again."}
              </p>

              {payment?.failureReason && (
                <div className="mt-6 rounded-xl border border-amber-300/15 bg-amber-300/[0.05] p-4 text-left text-sm text-amber-100/80">
                  {payment.failureReason}
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleRefresh}
                  disabled={isFetching || manuallyRefreshing}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-medium transition hover:bg-white/[0.08] disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      isFetching || manuallyRefreshing
                        ? "animate-spin"
                        : ""
                    }`}
                  />
                  Refresh status
                </button>

                <button
                  onClick={goToEnrollments}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                  My enrollments
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function PaymentSuccessFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
      <div className="flex items-center gap-3 text-sm text-slate-300">
        <LoaderCircle className="h-5 w-5 animate-spin text-cyan-300" />
        Loading payment status...
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
