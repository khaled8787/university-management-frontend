"use client";
import { setAuthSession } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Atom,
  Eye,
  EyeOff,
  Fingerprint,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),
  password: z
    .string()
    .min(1, "Password is required.")
    .max(128, "Password is too long."),
});

type LoginValues = z.infer<typeof loginSchema>;

type UserRole = "ADMIN" | "FACULTY" | "STUDENT";

type AuthUser = {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
};

type LoginResponse = {
  success?: boolean;
  message?: string;
  data?: {
    user?: AuthUser;
    accessToken?: string;
    refreshToken?: string;
  };
};

function getDashboardPath(role: UserRole) {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";

    case "FACULTY":
      return "/faculty/dashboard";

    case "STUDENT":
      return "/student/dashboard";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  async function onSubmit(values: LoginValues) {
    setApiError("");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

    if (!baseUrl) {
      setApiError(
        "Backend URL is not configured. Add NEXT_PUBLIC_API_URL to .env.local and restart the development server.",
      );
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
        cache: "no-store",
      });

      const result = (await response.json()) as LoginResponse;

      if (!response.ok) {
        throw new Error(
          result.message || "Login failed. Please check your credentials.",
        );
      }

      const user = result.data?.user;
      const accessToken = result.data?.accessToken;
      const refreshToken = result.data?.refreshToken;

      if (!user || !accessToken || !refreshToken) {
        throw new Error(
          "The backend returned an incomplete login response. Please check the API response format.",
        );
      }

      if (!["ADMIN", "FACULTY", "STUDENT"].includes(user.role)) {
        throw new Error("Your account has an unsupported user role.");
      }

      setAuthSession(accessToken, refreshToken, user);

      router.push(getDashboardPath(user.role));
    } catch (error) {
      setApiError(
        error instanceof TypeError
          ? "Cannot connect to the backend. Check the API URL, backend status, and CORS configuration."
          : error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#070b14] text-white">
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="grid-background pointer-events-none absolute inset-0 -z-20"
      />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-cyan-400/[0.10] blur-[130px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-[480px] w-[480px] rounded-full bg-violet-500/[0.12] blur-[140px]"
      />

      {/* Header */}
      <header className="relative z-10 mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-16">
        <Link
          href="/"
          className="group inline-flex items-center gap-3"
          aria-label="NEXUS home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-200/20 bg-cyan-200/[0.07] text-cyan-200 transition group-hover:rotate-6">
            <Atom size={23} strokeWidth={1.5} />
          </span>

          <span>
            <span className="block text-lg font-semibold tracking-[0.18em]">
              NEXUS
            </span>

            <span className="mt-0.5 block text-[9px] tracking-[0.22em] text-slate-500">
              UNIVERSITY SYSTEM
            </span>
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-200"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </header>

      {/* Main */}
      <div className="relative mx-auto grid w-full max-w-[1440px] items-center gap-12 px-5 pb-16 pt-8 sm:px-8 md:px-12 lg:min-h-[calc(100vh-80px)] lg:grid-cols-[1fr_0.92fr] lg:gap-20 lg:px-16 lg:pb-20 lg:pt-4">
        {/* Left content */}
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto w-full max-w-xl"
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[0.05] px-3.5 py-2 text-xs font-medium text-cyan-100">
            <Sparkles size={14} />
            YOUR CAMPUS. RECONNECTED.
          </div>

          <h1 className="text-[clamp(3rem,7vw,5.8rem)] font-semibold leading-[0.96] tracking-[-0.075em]">
            Your next
            <br />
            chapter
            <br />
            <span className="gradient-text">starts here.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-8 text-slate-400 sm:text-lg">
            Sign in to discover a more connected university experience. Your
            courses, campus community, and academic journey — all in one
            place.
          </p>

          {/* Features */}
          <div className="mt-9 hidden space-y-4 sm:block">
            {[
              {
                icon: Fingerprint,
                title: "One secure identity",
                detail: "Your access follows your assigned role.",
              },
              {
                icon: Users,
                title: "One campus community",
                detail: "A connected experience for every role.",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.15 + index * 0.12,
                    duration: 0.5,
                  }}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-cyan-200">
                    <Icon size={20} strokeWidth={1.6} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      {feature.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {feature.detail}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 hidden items-center gap-3 text-xs text-slate-500 lg:flex">
            <span className="h-px w-10 bg-gradient-to-r from-cyan-300/70 to-transparent" />
            BUILT FOR THE NEXT GENERATION
          </div>
        </motion.section>

        {/* Login card */}
        <motion.section
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 24,
                  scale: 0.98,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.75,
            delay: 0.1,
            ease: "easeOut",
          }}
          className="mx-auto w-full max-w-[500px]"
        >
          <div className="glass-panel relative overflow-hidden rounded-[28px] p-5 sm:rounded-[32px] sm:p-8 lg:p-9">
            {/* Top accent */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/4 top-0 h-px w-1/2 bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent"
            />

            {/* Card heading */}
            <div className="mb-8">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-200/15 bg-cyan-200/[0.06] text-cyan-200">
                <ShieldCheck size={21} strokeWidth={1.5} />
              </div>

              <p className="text-xs font-medium tracking-[0.22em] text-cyan-200">
                MEMBER ACCESS
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Enter your credentials to access your campus.
              </p>
            </div>

            {/* API error */}
            {apiError && (
              <div
                role="alert"
                className="mb-5 flex gap-3 rounded-2xl border border-rose-300/20 bg-rose-300/[0.06] p-4 text-sm text-rose-100"
              >
                <AlertCircle
                  size={19}
                  className="mt-0.5 shrink-0 text-rose-300"
                />

                <p className="leading-6">{apiError}</p>
              </div>
            )}

            {/* Login form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@university.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "email-error" : undefined
                  }
                  disabled={isSubmitting}
                  {...register("email")}
                  className="min-h-12 w-full rounded-xl border border-white/[0.10] bg-[#080d18]/80 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-200/50 focus:ring-4 focus:ring-cyan-200/[0.06] disabled:opacity-60"
                />

                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-2 text-xs text-rose-300"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-200"
                  >
                    Password
                  </label>

                  <span className="text-xs text-slate-500">
                    Secure sign-in
                  </span>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    disabled={isSubmitting}
                    {...register("password")}
                    className="min-h-12 w-full rounded-xl border border-white/[0.10] bg-[#080d18]/80 px-4 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-200/50 focus:ring-4 focus:ring-cyan-200/[0.06] disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-cyan-200"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p
                    id="password-error"
                    className="mt-2 text-xs text-rose-300"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex min-h-13 w-full items-center justify-center gap-3 rounded-xl bg-cyan-300 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(103,232,249,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-[0_0_40px_rgba(103,232,249,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign in to your campus
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Security note */}
            <div className="mt-7 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <ShieldCheck
                size={17}
                className="shrink-0 text-cyan-200/80"
              />

              <p className="text-[11px] leading-5 text-slate-500">
                Your access level is determined securely by your account
                role.
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-slate-600">
            Protected by role-based access · NEXUS University System
          </p>
        </motion.section>
      </div>
    </main>
  );
}