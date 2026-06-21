"use client";

import React, { useState, useEffect, useRef } from "react";
import { Package, Truck, TrendingUp, Clock, ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  total: number;
  byStatus: {
    pending: number;
    in_transit: number;
    out_for_delivery: number;
    delivered: number;
    failed: number;
    returned: number;
  };
  successRate: number;
  avgDeliveryDays: number;
}

// Utility to animate numbers up
function AnimatedNumber({ value, suffix = "", duration = 800 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    let animationFrame: number;
    const startValue = 0;
    const endValue = value;

    const step = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const current = startValue + (endValue - startValue) * easeProgress;
      
      // Handle decimals vs integers
      setCount(Number.isInteger(endValue) ? Math.floor(current) : Number(current.toFixed(1)));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count}{suffix}</span>;
}

export default function MetricsRow() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/shipments/stats");
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        } else {
          // If the API format differs slightly
          setStats(json);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    );
  }

  // Handle the case where stats are nested under data (based on route.ts implementation)
  const data = (stats as any).data || stats;

  const cards = [
    {
      title: "Total Shipments",
      value: data.total,
      suffix: "",
      icon: Package,
      iconBg: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      iconColor: "text-indigo-600",
      iconGlow: "shadow-[0_0_15px_rgba(79,70,229,0.15)]",
      trend: "+12 this week",
      trendColor: "text-emerald-600",
      trendIcon: <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
    },
    {
      title: "In Transit",
      value: data.byStatus?.in_transit || 0,
      suffix: "",
      icon: Truck,
      iconBg: "bg-gradient-to-br from-blue-50 to-cyan-50",
      iconColor: "text-[#3777fe]",
      iconGlow: "shadow-[0_0_15px_rgba(37,99,235,0.15)]",
      trend: "Across 3 carriers",
      trendColor: "text-slate-500",
      trendIcon: null
    },
    {
      title: "Success Rate",
      value: data.successRate || 0,
      suffix: "%",
      icon: TrendingUp,
      iconBg: "bg-gradient-to-br from-emerald-50 to-teal-50",
      iconColor: "text-emerald-600",
      iconGlow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
      trend: "+2.3% vs last month",
      trendColor: "text-emerald-600",
      trendIcon: <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
    },
    {
      title: "Avg. Delivery Time",
      value: data.avgDeliveryDays || 0,
      suffix: " days",
      icon: Clock,
      iconBg: "bg-gradient-to-br from-violet-50 to-purple-50",
      iconColor: "text-violet-600",
      iconGlow: "shadow-[0_0_15px_rgba(124,58,237,0.15)]",
      trend: "Industry avg: 4.2 days",
      trendColor: "text-slate-500",
      trendIcon: null
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
      {cards.map((card, i) => (
        <div key={i} className="group bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 relative overflow-hidden">
          {/* Subtle gradient background element on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-[13px] font-bold text-slate-500 mb-1 tracking-wide">{card.title}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                <AnimatedNumber value={card.value} suffix={card.suffix} />
              </h3>
            </div>
            <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center ${card.iconBg} ${card.iconColor} ${card.iconGlow} ring-1 ring-white/50 transition-transform group-hover:scale-110 duration-300`}>
              <card.icon className="w-5 h-5" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex items-center mt-4 pt-4 border-t border-slate-100/80 relative z-10">
            <span className={`flex items-center text-xs font-semibold ${card.trendColor}`}>
              {card.trendIcon}
              {card.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
