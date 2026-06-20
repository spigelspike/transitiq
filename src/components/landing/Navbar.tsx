"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Home, LayoutGrid, Building2, CreditCard, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for top nav
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── DESKTOP TOP NAV ────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`hidden md:flex fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm py-3" 
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 max-w-6xl flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
              style={{ background: "linear-gradient(135deg, #4F46E5, #8B5CF6)" }}
            >
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Transit<span style={{ color: "#4F46E5" }}>IQ</span>
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-8">
            <Link href="#features" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Platform</Link>
            <Link href="#carriers" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Carriers</Link>
            <Link href="#enterprise" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Enterprise</Link>
            <Link href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Pricing</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors px-3 py-2">
              Sign in
            </Link>
            <Link href="/sign-up" className="flex items-center text-sm font-bold text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #4F46E5, #6366F1)" }}
            >
              Get Started
              <ChevronRight className="w-4 h-4 ml-1 -mr-1" />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── MOBILE TOP HEADER (Just Logo & Sign In) ──────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center shadow-md"
            style={{ background: "linear-gradient(135deg, #4F46E5, #8B5CF6)" }}
          >
            <Package className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            Transit<span style={{ color: "#4F46E5" }}>IQ</span>
          </span>
        </Link>
        <Link href="/sign-in" className="text-sm font-bold text-[#4F46E5]">
          Log in
        </Link>
      </div>

      {/* ── MOBILE BOTTOM FLOATING DOCK ───────────────────────────── */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 px-4 pointer-events-none flex justify-center">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
          className="bg-slate-900/90 backdrop-blur-xl pointer-events-auto rounded-[2rem] p-2 flex items-center gap-1 shadow-2xl shadow-indigo-900/20 border border-white/10"
        >
          <Link href="#" className="flex flex-col items-center justify-center w-14 h-12 rounded-2xl bg-white/10 text-white">
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link href="#features" className="flex flex-col items-center justify-center w-14 h-12 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <LayoutGrid className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Platform</span>
          </Link>
          <Link href="#carriers" className="flex flex-col items-center justify-center w-14 h-12 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <Building2 className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Carriers</span>
          </Link>
          <Link href="#pricing" className="flex flex-col items-center justify-center w-14 h-12 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <CreditCard className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Pricing</span>
          </Link>
        </motion.div>
      </div>
    </>
  );
}
