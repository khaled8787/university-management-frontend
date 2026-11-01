"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  GraduationCap,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { api } from "@/lib/api";
interface Department {
  id: string;
  name: string;
  code?: string | null;
}

interface Course {
  id: string;
  title?: string;
  name?: string;
  code?: string | null;
  description?: string | null;
  credits?: number;
  department?: {
    name?: string;
    code?: string;
  } | null;
}

interface PaginatedData<T> {
  data?: T[];
  meta?: {
    total?: number;
  };
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T | T[];
}

function extractList<T>(
  response: ApiResponse<T[] | PaginatedData<T>>,
): T[] {
  const payload = response.data;

  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    const nested = payload.data;

    if (Array.isArray(nested)) {
      return nested as T[];
    }
  }

  return [];
}

export default function PlatformOverview() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadOverview() {
      setLoading(true);
      setError(null);

      try {
        const [courseResponse, departmentResponse] = await Promise.all([
          api.get<ApiResponse<Course[] | PaginatedData<Course>>>(
            "/courses?page=1&limit=4",
          ),
          api.get<ApiResponse<Department[] | PaginatedData<Department>>>(
            "/departments?page=1&limit=4",
          ),
        ]);

        if (!active) return;

        setCourses(extractList(courseResponse.data));
        setDepartments(extractList(departmentResponse.data));
      } catch (err: unknown) {
        if (!active) return;

        const message =
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof err.response === "object" &&
          err.response !== null &&
          "status" in err.response &&
          typeof err.response.status === "number"
            ? err.response.status === 401 ||
              err.response.status === 403
              ? "These academic records require authorized access. A public read-only endpoint is needed for the landing page."
              : err.response.status === 429
                ? "The API is temporarily rate-limited. Please try again shortly."
                : "Academic information could not be loaded from the backend."
            : "The backend could not be reached. Please check the API connection.";

        setError(message);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadOverview();

    return () => {
      active = false;
    };
  }, [retryKey]);

  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-white/[0.015]">
      <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-3/4 -translate-x-1/2 bg-cyan-400/[0.035] blur-[100px]" />

      <div className="relative mx-auto grid max-w-[1440px] gap-12 px-5 py-20 sm:px-8 md:px-12 lg:grid-cols-2 lg:items-center lg:px-16 lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
            <GraduationCap size={16} />
            The NEXUS ecosystem
          </span>

          <h2 className="mt-5 max-w-xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Your university,
            <span className="block bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
              connected in one place.
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-base leading-8 text-slate-400">
            Explore academic information through a connected university
            management experience built for students, faculty, and
            administrators.
          </p>

          <Link
            href="/about"
            className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition hover:text-white"
          >
            Discover NEXUS
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0b111d] p-6 transition hover:border-cyan-300/25">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-300">
              <BookOpen size={24} />
            </div>

            <p className="mt-6 text-sm text-slate-400">
              Courses returned by API
            </p>

            <div className="mt-2 text-3xl font-black">
              {loading ? (
                <LoaderCircle className="animate-spin text-cyan-300" />
              ) : error ? (
                <span className="text-lg text-slate-500">Unavailable</span>
              ) : (
                courses.length
              )}
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              {error
                ? "Waiting for authorized backend access"
                : "Records retrieved in this request"}
            </p>

            <Link
              href="/features"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300"
            >
              Explore features
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#0b111d] p-6 transition hover:border-violet-300/25 sm:translate-y-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-300/[0.08] text-violet-300">
              <Building2 size={24} />
            </div>

            <p className="mt-6 text-sm text-slate-400">
              Departments returned by API
            </p>

            <div className="mt-2 text-3xl font-black">
              {loading ? (
                <LoaderCircle className="animate-spin text-violet-300" />
              ) : error ? (
                <span className="text-lg text-slate-500">Unavailable</span>
              ) : (
                departments.length
              )}
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              {error
                ? "Waiting for authorized backend access"
                : "Records retrieved in this request"}
            </p>

            <Link
              href="/about"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-300"
            >
              About NEXUS
              <ArrowRight size={15} />
            </Link>
          </div>

          {error && (
            <div
              role="status"
              className="rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-4 text-sm leading-6 text-amber-200 sm:col-span-2"
            >
              <p>{error}</p>

              <button
                type="button"
                onClick={() => setRetryKey((key) => key + 1)}
                className="mt-3 inline-flex items-center gap-2 font-semibold hover:text-white"
              >
                <RefreshCw size={15} />
                Retry connection
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}