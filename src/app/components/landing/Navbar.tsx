"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Atom, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const links = [
  { label: "Experience", href: "#experience" },
  { label: "Campus", href: "#campus" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070b14]/80 backdrop-blur-2xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 md:px-12 lg:px-16"
      >
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-200/20 bg-cyan-200/[0.07] text-cyan-200 transition duration-300 group-hover:rotate-6 group-hover:border-cyan-200/40">
            <Atom size={23} strokeWidth={1.5} />
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-[0.18em] text-white">
              NEXUS
            </span>
            <span className="mt-0.5 block text-[9px] tracking-[0.22em] text-slate-500">
              UNIVERSITY SYSTEM
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-slate-400 transition hover:text-cyan-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:border-cyan-200/30 hover:bg-cyan-200/[0.07]"
          >
            Sign in
            <ArrowUpRight
              size={16}
              className="text-cyan-200 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white md:hidden"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-white/[0.06] bg-[#070b14]/95 px-5 py-5 backdrop-blur-2xl md:hidden"
        >
          <div className="mx-auto flex max-w-[1440px] flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.05] hover:text-cyan-200"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center justify-between rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950"
            >
              Sign in to NEXUS
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}