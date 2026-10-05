"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getAuthUser,
  logout,
  type AuthUser,
} from "@/lib/auth";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const syncAuthState = () => {
      setUser(getAuthUser());
    };

    syncAuthState();

    window.addEventListener("storage", syncAuthState);
    window.addEventListener("focus", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("focus", syncAuthState);
    };
  }, []);

  const dashboardPath = user
    ? `/${user.role.toLowerCase()}/dashboard`
    : "/login";

  const displayName =
    user?.name?.trim() || user?.email?.split("@")[0] || "User";

  const roleLabel =
    user?.role === "ADMIN"
      ? "Administrator"
      : user?.role === "FACULTY"
        ? "Faculty"
        : "Student";

  const handleLogout = () => {
    logout();
    setUser(null);
    setProfileOpen(false);
    setMobileOpen(false);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6">
        <nav className="relative flex h-16 items-center justify-between rounded-2xl border border-white/[0.08] bg-[#080d18]/70 px-4 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:px-5">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute -left-20 top-0 h-32 w-32 rounded-full bg-cyan-400/[0.06] blur-3xl" />
            <div className="absolute -right-20 bottom-0 h-32 w-32 rounded-full bg-purple-500/[0.05] blur-3xl" />
          </div>

          {/* Logo */}
          <Link
            href="/"
            className="group relative flex items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07]">
              <div className="absolute inset-1.5 rounded-lg border border-cyan-300/10" />

              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
                className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]"
              />
            </div>

            <div>
              <p className="text-sm font-black tracking-[0.22em] text-white">
                NEXUS
              </p>

              <p className="hidden text-[8px] uppercase tracking-[0.18em] text-cyan-300/40 sm:block">
                University OS
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="relative hidden items-center gap-7 md:flex">
            <Link
              href="/"
              className="text-xs font-medium text-slate-400 transition hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/#features"
              className="text-xs font-medium text-slate-400 transition hover:text-white"
            >
              Features
            </Link>

            <Link
              href="/#about"
              className="text-xs font-medium text-slate-400 transition hover:text-white"
            >
              About
            </Link>
          </div>

          {/* Desktop actions */}
          <div className="relative hidden items-center gap-2 md:flex">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className="rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] px-4 py-2.5 text-xs font-semibold text-cyan-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/[0.13]"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={dashboardPath}
                  className="flex items-center gap-2 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.06] px-4 py-2.5 text-xs font-semibold text-cyan-200 transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.1]"
                >
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((value) => !value)}
                    className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 transition hover:border-white/[0.12]"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-300/20 to-purple-400/20 text-[10px] font-bold text-cyan-200">
                      {displayName.charAt(0).toUpperCase()}
                    </div>

                    <div className="max-w-24 text-left">
                      <p className="truncate text-[10px] font-semibold text-slate-300">
                        {displayName}
                      </p>

                      <p className="text-[8px] uppercase tracking-wider text-slate-600">
                        {roleLabel}
                      </p>
                    </div>

                    <ChevronDown
                      size={13}
                      className={`text-slate-600 transition ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        className="absolute right-0 top-12 w-56 rounded-2xl border border-white/[0.08] bg-[#0b111d]/95 p-2 shadow-2xl backdrop-blur-2xl"
                      >
                        <div className="border-b border-white/[0.06] px-3 py-3">
                          <p className="truncate text-xs font-semibold text-white">
                            {displayName}
                          </p>

                          <p className="mt-1 truncate text-[10px] text-slate-600">
                            {user.email}
                          </p>
                        </div>

                        <Link
                          href={dashboardPath}
                          onClick={() => setProfileOpen(false)}
                          className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                        >
                          <LayoutDashboard size={14} />
                          Open Dashboard
                        </Link>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-red-400/70 transition hover:bg-red-400/[0.06] hover:text-red-300"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Mobile button */}
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-400 transition hover:text-white md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute left-0 right-0 top-[calc(100%+8px)] rounded-2xl border border-white/[0.08] bg-[#0a101b]/95 p-3 shadow-2xl backdrop-blur-2xl md:hidden"
              >
                <div className="space-y-1">
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                  >
                    Home
                  </Link>

                  <Link
                    href="/#features"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                  >
                    Features
                  </Link>

                  <Link
                    href="/#about"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                  >
                    About
                  </Link>
                </div>

                <div className="mt-3 border-t border-white/[0.06] pt-3">
                  {!user ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl border border-white/[0.07] px-3 py-3 text-center text-xs font-semibold text-slate-300"
                      >
                        Sign In
                      </Link>

                      <Link
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-3 text-center text-xs font-semibold text-cyan-200"
                      >
                        Get Started
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 rounded-xl bg-white/[0.025] p-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-300/[0.08] text-cyan-200">
                          <UserRound size={16} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-white">
                            {displayName}
                          </p>

                          <p className="text-[9px] uppercase tracking-wider text-slate-600">
                            {roleLabel}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={dashboardPath}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-3 text-xs font-semibold text-cyan-200"
                      >
                        <LayoutDashboard size={14} />
                        Dashboard
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/10 bg-red-400/[0.04] px-3 py-3 text-xs font-semibold text-red-300/80"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </header>
  );
}