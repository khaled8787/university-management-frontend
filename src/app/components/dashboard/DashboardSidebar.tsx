"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  Library,
  LogOut,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

import {
  getAuthUser,
  logout,
  type UserRole,
} from "@/lib/auth";

type DashboardSidebarProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
  collapsed: boolean;
  onCollapsedChange: (value: boolean) => void;
};

type NavigationItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const navigationByRole: Record<UserRole, NavigationItem[]> = {
  ADMIN: [
    {
      label: "Overview",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Students",
      href: "/admin/students",
      icon: GraduationCap,
    },
    {
      label: "Faculty",
      href: "/admin/faculty",
      icon: Users,
    },
    {
      label: "Departments",
      href: "/admin/departments",
      icon: Library,
    },
    {
      label: "Courses",
      href: "/admin/courses",
      icon: BookOpen,
    },
    {
      label: "Enrollments",
      href: "/admin/enrollments",
      icon: ClipboardCheck,
    },
    {
      label: "Results",
      href: "/admin/results",
      icon: BarChart3,
    },
    {
      label: "Attendance",
      href: "/admin/attendance",
      icon: CalendarDays,
    },
    {
      label: "Payments",
      href: "/admin/payments",
      icon: ShieldCheck,
    },
  ],

  FACULTY: [
    {
      label: "Overview",
      href: "/faculty/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Courses",
      href: "/faculty/courses",
      icon: BookOpen,
    },
    {
      label: "Students",
      href: "/faculty/students",
      icon: GraduationCap,
    },
    {
      label: "Attendance",
      href: "/faculty/attendance",
      icon: CalendarDays,
    },
    {
      label: "Results",
      href: "/faculty/results",
      icon: BarChart3,
    },
  ],

  STUDENT: [
    {
      label: "Overview",
      href: "/student/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Courses",
      href: "/student/courses",
      icon: BookOpen,
    },
    {
      label: "Enrollment",
      href: "/student/enrollment",
      icon: ClipboardCheck,
    },
    {
      label: "Attendance",
      href: "/student/attendance",
      icon: CalendarDays,
    },
    {
      label: "Results",
      href: "/student/results",
      icon: BarChart3,
    },
    {
      label: "Payments",
      href: "/student/payments",
      icon: ShieldCheck,
    },
  ],
};

function getRoleLabel(role?: UserRole) {
  switch (role) {
    case "ADMIN":
      return "System Administrator";

    case "FACULTY":
      return "Faculty Member";

    case "STUDENT":
      return "Student";

    default:
      return "NEXUS User";
  }
}

export default function DashboardSidebar({
  mobileOpen,
  onMobileClose,
  collapsed,
  onCollapsedChange,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const user = getAuthUser();

  const navigation = useMemo(() => {
    if (!user) return [];

    return navigationByRole[user.role];
  }, [user]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            type="button"
            aria-label="Close navigation"
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 84 : 272,
        }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col
          border-r border-white/[0.07]
          bg-[#080d18]/95
          backdrop-blur-2xl
          lg:relative lg:z-30
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-24 h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-400/[0.08] blur-[80px]" />

        {/* Brand */}
        <div className="relative flex h-20 items-center border-b border-white/[0.06] px-5">
          <Link
            href={"/"}
            className="group flex min-w-0 items-center gap-3"
            onClick={onMobileClose}
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07]">
              <div className="absolute inset-1 rounded-lg border border-cyan-300/10" />

              <div className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.8)]" />
            </div>

            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="min-w-0"
                >
                  <p className="text-lg font-black tracking-[0.22em] text-white">
                    NEXUS
                  </p>

                  <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-cyan-300/50">
                    University OS
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          {/* Mobile close */}
          <button
            type="button"
            onClick={onMobileClose}
            className="ml-auto rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <div className="relative flex-1 overflow-y-auto px-3 py-6">
          <div
            className={`mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 ${
              collapsed ? "text-center" : ""
            }`}
          >
            {collapsed ? "•••" : "Workspace"}
          </div>

          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  title={collapsed ? item.label : undefined}
                  className={`
                    group relative flex items-center gap-3 rounded-xl
                    px-3 py-3 text-sm transition-all duration-200
                    ${
                      active
                        ? "bg-cyan-300/[0.09] text-cyan-200"
                        : "text-slate-500 hover:bg-white/[0.035] hover:text-slate-200"
                    }
                    ${collapsed ? "justify-center" : ""}
                  `}
                >
                  {active && (
                    <motion.span
                      layoutId="active-sidebar-indicator"
                      className="absolute left-0 h-6 w-[2px] rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]"
                    />
                  )}

                  <Icon
                    size={18}
                    strokeWidth={active ? 2 : 1.6}
                    className={
                      active
                        ? "text-cyan-300"
                        : "text-slate-500 group-hover:text-slate-200"
                    }
                  />

                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}

                  {active && !collapsed && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Secondary */}
          <div className="mt-8">
            <div
              className={`mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 ${
                collapsed ? "text-center" : ""
              }`}
            >
              {collapsed ? "•••" : "System"}
            </div>

            <Link
              href="/settings"
              onClick={onMobileClose}
              title={collapsed ? "Settings" : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 transition hover:bg-white/[0.035] hover:text-slate-200 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <Settings size={18} strokeWidth={1.6} />

              {!collapsed && <span>Settings</span>}
            </Link>
          </div>
        </div>

        {/* User */}
        <div className="border-t border-white/[0.06] p-3">
          <div
            className={`flex items-center gap-3 rounded-xl bg-white/[0.025] p-2.5 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-purple-300/20 bg-purple-300/[0.08] text-purple-200">
              <UserRound size={17} />
            </div>

            {!collapsed && user && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-200">
                  {user.name || user.email.split("@")[0]}
                </p>

                <p className="truncate text-[10px] text-slate-600">
                  {getRoleLabel(user.role)}
                </p>
              </div>
            )}

            {!collapsed && (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg p-2 text-slate-600 transition hover:bg-red-400/10 hover:text-red-300"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Collapse button desktop */}
        <button
          type="button"
          onClick={() => onCollapsedChange(!collapsed)}
          className="absolute -right-3 top-24 hidden h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#0d1422] text-slate-500 shadow-xl transition hover:border-cyan-300/30 hover:text-cyan-300 lg:flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </button>
      </motion.aside>
    </>
  );
}