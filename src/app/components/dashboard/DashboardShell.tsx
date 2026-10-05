"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import DashboardSidebar from "@/app/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/app/components/dashboard/DashboardTopbar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export default function DashboardShell({
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-cyan-500/[0.035] blur-[120px]" />

        <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-purple-500/[0.035] blur-[120px]" />

        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="relative flex min-h-screen">
        <DashboardSidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
        />

        <div className="min-w-0 flex-1">
          <DashboardTopbar
            onMenuClick={() => setMobileOpen(true)}
          />

          <motion.main
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}