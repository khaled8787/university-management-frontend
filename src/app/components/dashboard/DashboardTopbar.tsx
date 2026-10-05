"use client";

import { motion } from "framer-motion";
import {
  Bell,
  Command,
  Menu,
  Search,
  Sparkles,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { getAuthUser } from "@/lib/auth";

type DashboardTopbarProps = {
  onMenuClick: () => void;
};

function getPageTitle(pathname: string) {
  if (pathname.includes("/students")) return "Students";
  if (pathname.includes("/faculty")) return "Faculty";
  if (pathname.includes("/departments")) return "Departments";
  if (pathname.includes("/courses")) return "Courses";
  if (pathname.includes("/enrollments")) return "Enrollments";
  if (pathname.includes("/attendance")) return "Attendance";
  if (pathname.includes("/results")) return "Results";
  if (pathname.includes("/payments")) return "Payments";
  if (pathname.includes("/settings")) return "Settings";

  return "Overview";
}

export default function DashboardTopbar({
  onMenuClick,
}: DashboardTopbarProps) {
  const pathname = usePathname();
  const user = getAuthUser();

  const pageTitle = useMemo(
    () => getPageTitle(pathname),
    [pathname],
  );

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-white/[0.06] bg-[#070b14]/75 px-4 backdrop-blur-2xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-2.5 text-slate-400 transition hover:border-cyan-300/20 hover:text-cyan-300 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={19} />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Sparkles
              size={14}
              className="shrink-0 text-cyan-300"
            />

            <p className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
              NEXUS / {user?.role || "USER"}
            </p>
          </div>

          <h1 className="mt-0.5 truncate text-lg font-semibold text-white sm:text-xl">
            {pageTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <button
          type="button"
          className="hidden h-10 items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-slate-500 transition hover:border-cyan-300/20 hover:text-slate-300 md:flex"
        >
          <Search size={16} />

          <span className="text-xs">Search anything...</span>

          <span className="ml-4 flex items-center gap-1 rounded-md border border-white/[0.07] px-1.5 py-0.5 text-[9px] text-slate-600">
            <Command size={9} /> K
          </span>
        </button>

        {/* Mobile search */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-500 transition hover:text-cyan-300 md:hidden"
          aria-label="Search"
        >
          <Search size={17} />
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-500 transition hover:border-cyan-300/20 hover:text-cyan-300"
          aria-label="Notifications"
        >
          <Bell size={17} />

          <motion.span
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)]"
          />
        </button>

        {/* Profile */}
        <div className="hidden h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-2 sm:flex">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-300/20 to-purple-400/20 text-[10px] font-bold text-cyan-200">
            {(user?.name || user?.email || "N")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="max-w-28">
            <p className="truncate text-[11px] font-semibold text-slate-300">
              {user?.name || user?.email?.split("@")[0] || "User"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}