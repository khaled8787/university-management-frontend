"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  GraduationCap,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDepartments } from "@/hooks/api/useDepartments";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

type RegisterRole = "STUDENT" | "FACULTY";

interface Department {
  id: string;
  name: string;
  code: string;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    role: z.enum(["STUDENT", "FACULTY"]),
    studentId: z.string().optional(),
    batch: z.string().optional(),
    employeeId: z.string().optional(),
    designation: z.string().optional(),
    departmentId: z.string().min(1, "Please select a department."),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }

    if (data.role === "STUDENT") {
      if (!data.studentId?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["studentId"],
          message: "Student ID is required.",
        });
      }

      if (!data.batch?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["batch"],
          message: "Batch is required.",
        });
      }
    }

    if (data.role === "FACULTY") {
      if (!data.employeeId?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["employeeId"],
          message: "Employee ID is required.",
        });
      }

      if (!data.designation?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["designation"],
          message: "Designation is required.",
        });
      }
    }
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const {
  data: departments = [],
  isLoading: departmentLoading,
  isError: departmentIsError,
  error: departmentQueryError,
} = useDepartments();

const departmentError = departmentIsError
  ? departmentQueryError instanceof Error
    ? departmentQueryError.message
    : "Failed to load departments."
  : "";

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "STUDENT",
      departmentId: "",
    },
  });

  const role = watch("role");

  

  const onSubmit = async (values: RegisterFormData) => {
    try {
      setServerError("");
      setSuccessMessage("");

      if (!API_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not configured.",
        );
      }

      const payload =
        values.role === "STUDENT"
          ? {
              name: values.name.trim(),
              email: values.email.trim(),
              password: values.password,
              role: "STUDENT",
              studentId: values.studentId!.trim(),
              batch: values.batch!.trim(),
              departmentId: values.departmentId,
            }
          : {
              name: values.name.trim(),
              email: values.email.trim(),
              password: values.password,
              role: "FACULTY",
              employeeId: values.employeeId!.trim(),
              designation: values.designation!.trim(),
              departmentId: values.departmentId,
            };

      const response = await fetch(
        `${API_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result: ApiResponse<unknown> =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Registration failed.",
        );
      }

      setSuccessMessage(
        result.message ||
          "Registration successful. You can now sign in.",
      );
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-10%] h-80 w-80 rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-96 w-96 rounded-full bg-secondary/15 blur-[140px]" />

        <div className="grid-background absolute inset-0 opacity-30" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          {/* Left */}
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
                <Sparkles className="size-5 text-primary" />
              </div>

              <div>
                <p className="text-xl font-black tracking-[0.2em]">
                  NEXUS
                </p>

                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  University OS
                </p>
              </div>
            </Link>

            <div className="mt-16 max-w-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                Join the network
              </p>

              <h1 className="mt-5 text-5xl font-black leading-[1.05] tracking-tight">
                Build your
                <span className="gradient-text block">
                  academic identity.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
                Create your university account and enter the
                NEXUS ecosystem with a role-based experience
                designed for the modern campus.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              <Feature
                icon={ShieldCheck}
                title="Secure access"
                description="Protected role-based university experience."
              />

              <Feature
                icon={Users}
                title="Connected campus"
                description="Students and faculty stay connected through one system."
              />

              <Feature
                icon={GraduationCap}
                title="Academic control"
                description="Courses, attendance, results and enrollment in one place."
              />
            </div>
          </motion.section>

          {/* Register card */}
          <motion.section
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto w-full max-w-2xl"
          >
            <div className="glass-panel rounded-[2rem] border border-white/10 p-5 shadow-2xl shadow-primary/10 sm:p-8">
              {/* Mobile logo */}
              <div className="mb-7 lg:hidden">
                <Link
                  href="/"
                  className="inline-flex items-center gap-3"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                    <Sparkles className="size-5 text-primary" />
                  </div>

                  <span className="font-black tracking-[0.2em]">
                    NEXUS
                  </span>
                </Link>
              </div>

              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                  Create account
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  Enter the NEXUS
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Select your role and complete your university
                  profile.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {serverError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
                  >
                    <X className="mt-0.5 size-4 shrink-0" />
                    <span>{serverError}</span>
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300"
                  >
                    <Check className="mt-0.5 size-4 shrink-0" />

                    <div>
                      <p>{successMessage}</p>

                      <Link
                        href="/login"
                        className="mt-2 inline-flex font-semibold text-emerald-200 underline underline-offset-4"
                      >
                        Continue to sign in
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Role */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Account type
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <RoleButton
                      active={role === "STUDENT"}
                      icon={GraduationCap}
                      title="Student"
                      onClick={() =>
                        setValue("role", "STUDENT", {
                          shouldValidate: true,
                        })
                      }
                    />

                    <RoleButton
                      active={role === "FACULTY"}
                      icon={Users}
                      title="Faculty"
                      onClick={() =>
                        setValue("role", "FACULTY", {
                          shouldValidate: true,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Name */}
                <Input
                  label="Full name"
                  icon={User}
                  placeholder="Your full name"
                  error={errors.name?.message}
                  {...register("name")}
                />

                {/* Email */}
                <Input
                  label="Email address"
                  icon={Mail}
                  type="email"
                  placeholder="you@university.com"
                  error={errors.email?.message}
                  {...register("email")}
                />

                {/* Role-specific */}
                <AnimatePresence mode="wait">
                  {role === "STUDENT" ? (
                    <motion.div
                      key="student"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid gap-5 sm:grid-cols-2"
                    >
                      <Input
                        label="Student ID"
                        placeholder="STU-1001"
                        error={errors.studentId?.message}
                        {...register("studentId")}
                      />

                      <Input
                        label="Batch"
                        placeholder="2026"
                        error={errors.batch?.message}
                        {...register("batch")}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="faculty"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid gap-5 sm:grid-cols-2"
                    >
                      <Input
                        label="Employee ID"
                        placeholder="FAC-1001"
                        error={errors.employeeId?.message}
                        {...register("employeeId")}
                      />

                      <Input
                        label="Designation"
                        placeholder="Lecturer"
                        error={errors.designation?.message}
                        {...register("designation")}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Department */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Department
                  </label>

                  <div className="relative">
                    <select
                      {...register("departmentId")}
                      disabled={
                        departmentLoading ||
                        departments.length === 0
                      }
                      className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-4 pr-11 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="">
                        {departmentLoading
                          ? "Loading departments..."
                          : departments.length === 0
                            ? "No departments available"
                            : "Select your department"}
                      </option>

                      {departments.map((department) => (
                        <option
                          key={department.id}
                          value={department.id}
                          className="bg-slate-950"
                        >
                          {department.name} ({department.code})
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  </div>

                  {errors.departmentId?.message && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.departmentId.message}
                    </p>
                  )}

                  {departmentError && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {departmentError}
                    </p>
                  )}
                </div>

                {/* Password */}
                <Input
                  label="Password"
                  icon={LockKeyhole}
                  type="password"
                  placeholder="Minimum 8 characters"
                  error={errors.password?.message}
                  {...register("password")}
                />

                {/* Confirm password */}
                <Input
                  label="Confirm password"
                  icon={LockKeyhole}
                  type="password"
                  placeholder="Repeat your password"
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                />

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    departmentLoading ||
                    departments.length === 0
                  }
                  className="group flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 disabled:pointer-events-none disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-7 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
        <Icon className="size-5 text-primary" />
      </div>

      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function RoleButton({
  active,
  icon: Icon,
  title,
  onClick,
}: {
  active: boolean;
  icon: typeof GraduationCap;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-16 items-center gap-3 rounded-2xl border px-4 text-left transition-all ${
        active
          ? "border-primary/50 bg-primary/10 text-primary shadow-lg shadow-primary/10"
          : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20 hover:bg-white/[0.04]"
      }`}
    >
      <div
        className={`flex size-9 items-center justify-center rounded-xl ${
          active ? "bg-primary/15" : "bg-white/5"
        }`}
      >
        <Icon className="size-4" />
      </div>

      <div>
        <p className="text-sm font-semibold">{title}</p>

        {active && (
          <p className="text-[10px] uppercase tracking-wider opacity-70">
            Selected
          </p>
        )}
      </div>
    </button>
  );
}

const Input = ({
  label,
  icon: Icon,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: typeof User;
  error?: string;
}) => {
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
          } pr-4 text-sm outline-none transition placeholder:text-muted-foreground/50 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 ${
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
};