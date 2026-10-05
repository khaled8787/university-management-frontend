"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Atom, LoaderCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

import {
  getAuthUser,
  getDashboardPath,
  isAuthenticated,
  type UserRole,
} from "@/lib/auth";

type AuthGuardProps = {
  children: React.ReactNode;
};

function getRequiredRole(pathname: string): UserRole | null {
  if (pathname.startsWith("/admin")) return "ADMIN";
  if (pathname.startsWith("/faculty")) return "FACULTY";
  if (pathname.startsWith("/student")) return "STUDENT";

  return null;
}

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const user = mounted ? getAuthUser() : null;
  const authenticated = mounted ? isAuthenticated() : false;
  const requiredRole = getRequiredRole(pathname);

  if (!mounted) {
    return <AuthLoading reduceMotion={reduceMotion} />;
  }

  if (!authenticated || !user) {
    if (typeof window !== "undefined") {
      router.replace(
        `/login?redirect=${encodeURIComponent(pathname)}`,
      );
    }

    return <AuthLoading reduceMotion={reduceMotion} />;
  }

  if (requiredRole && user.role !== requiredRole) {
    if (typeof window !== "undefined") {
      router.replace(getDashboardPath(user.role));
    }

    return <AuthLoading reduceMotion={reduceMotion} />;
  }

  return <>{children}</>;
}

function AuthLoading({
  reduceMotion,
}: {
  reduceMotion: boolean | null;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070b14] text-white">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center"
      >
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/[0.06] text-cyan-200">
          <Atom size={28} strokeWidth={1.4} />

          <span className="absolute -inset-2 animate-pulse rounded-2xl border border-cyan-200/10" />
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
          <LoaderCircle
            size={16}
            className="animate-spin text-cyan-200"
          />
          Verifying secure access...
        </div>
      </motion.div>
    </div>
  );
}