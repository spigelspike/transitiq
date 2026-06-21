"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  BarChart3, 
  Settings, 
  Truck,
  Bell, 
  Search,
  Hexagon,
  LogOut,
  MessageSquareWarning,
  MessageSquare
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Shipments", href: "/dashboard/shipments", icon: Package },
  { label: "Tracking", href: "/dashboard/tracking", icon: Hexagon },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Carriers", href: "/dashboard/carriers", icon: Truck },
  { label: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { label: "Complaints", href: "/dashboard/complaints", icon: MessageSquareWarning },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

function SidebarContent() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] text-slate-700">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="TransitIQ Logo" className="h-8 w-auto" />
        </Link>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive 
                  ? "bg-blue-600/10 text-blue-700" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* User Section */}
      <div className="p-6 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full focus:outline-none">
            <div className="flex items-center gap-3 group text-left">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700 shrink-0 group-hover:ring-2 ring-blue-100 transition-all">
                AM
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">Alex Morgan</p>
                <p className="text-xs font-medium text-slate-500 truncate">Admin</p>
              </div>
              <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl">
            <div className="px-1.5 py-1.5">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold text-slate-900 leading-none">Alex Morgan</p>
                <p className="text-xs text-slate-500 leading-none text-muted-foreground">alex@transitiq.com</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer font-medium text-slate-700"
              onClick={() => router.push("/dashboard/profile")}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer font-medium text-slate-700"
              onClick={() => router.push("/dashboard/settings")}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer font-medium text-red-600 hover:text-red-700 focus:text-red-700 flex items-center"
              onClick={() => {
                toast.success("Signing out...", { duration: 1500 });
                // Simulate redirect
                setTimeout(() => window.location.href = "/sign-in", 1000);
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function ArrowRightIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Global search shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        document.getElementById("shipment-search")?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex selection:bg-blue-500/30">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 fixed inset-y-0 left-0 z-50 border-r border-slate-200/50">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen relative">
        {/* Mobile Header (replaces the desktop header which is now embedded in page.tsx) */}
        <header className="md:hidden h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-40 shadow-sm">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img src="/logo.png" alt="TransitIQ Logo" className="h-6 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push("/dashboard/alerts")}
              className="relative p-1.5 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 hover:ring-2 ring-blue-100 transition-all">
                  AM
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl">
                <div className="px-1.5 py-1.5">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold text-slate-900 leading-none">Alex Morgan</p>
                    <p className="text-xs text-slate-500 leading-none text-muted-foreground">alex@transitiq.com</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer font-medium text-slate-700"
                  onClick={() => router.push("/dashboard/profile")}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer font-medium text-slate-700"
                  onClick={() => router.push("/dashboard/settings")}
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer font-medium text-red-600 hover:text-red-700 focus:text-red-700 flex items-center"
                  onClick={() => {
                    toast.success("Signing out...", { duration: 1500 });
                    setTimeout(() => window.location.href = "/sign-in", 1000);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden pb-28 md:pb-0">
          {children}
        </main>
      </div>

      {/* ── MOBILE BOTTOM FLOATING DOCK ───────────────────────────── */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center pb-safe pointer-events-none">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-2 flex items-center gap-1 shadow-2xl border border-slate-200/50 w-max max-w-full overflow-x-auto pointer-events-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`relative flex flex-col items-center justify-center w-16 h-12 rounded-2xl shrink-0 snap-center transition-all ${
                  isActive ? "text-blue-700 bg-blue-50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <item.icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-blue-600" : ""}`} />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
