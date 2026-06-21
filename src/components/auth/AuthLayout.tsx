"use client";

import React from "react";
import Link from "next/link";
import { Package, Check, ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50 relative selection:bg-indigo-500/30">
      {/* ── FULL SCREEN BACKGROUND (desktop only) ────────────────────────── */}
      <div className="hidden lg:block absolute inset-0 z-0 overflow-hidden">
        <img 
          src="/auth_assets/auth_bg.webp" 
          alt="TransitIQ Platform" 
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* ── CONTENT CONTAINER ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row lg:justify-end relative z-10 h-screen overflow-y-auto">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm shrink-0">
          <Link href="/" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="TransitIQ Logo" className="h-6 w-auto" />
          </Link>
          <div className="w-5" /> {/* Spacer */}
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col p-4 lg:py-4 lg:pr-20 xl:pr-32 lg:w-[50%]">
          <div className="w-full max-w-[400px] bg-white rounded-3xl lg:rounded-[1.5rem] shadow-xl lg:shadow-2xl p-5 lg:px-8 lg:py-6 m-auto">
            <div className="mb-4 hidden lg:block">
              <h1 className="text-2xl font-extrabold text-slate-900 mb-0.5 tracking-tight">{title}</h1>
              <p className="text-slate-500 text-[13px] font-medium">{subtitle}</p>
            </div>
            <div className="mb-4 lg:hidden text-center">
              <h1 className="text-2xl font-extrabold text-slate-900 mb-0.5 tracking-tight">{title}</h1>
              <p className="text-slate-500 text-[13px] font-medium">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
