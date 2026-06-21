"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Info, ArrowUpRight, Truck } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShipmentHealth() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['shipmentStats'],
    queryFn: async () => {
      const res = await fetch("/api/shipments/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    staleTime: 30000,
  });

  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 md:p-6 w-full">
        <div className="flex items-center gap-1.5 mb-4 md:mb-6">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="w-4 h-4 rounded-full" />
        </div>
        
        {/* Mobile Skeleton */}
        <div className="md:hidden space-y-4">
          <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-12 rounded-lg" />
          </div>
          <Skeleton className="h-[120px] w-full rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-8 flex-1 rounded-lg" />
            <Skeleton className="h-8 flex-1 rounded-lg" />
            <Skeleton className="h-8 flex-1 rounded-lg" />
          </div>
        </div>

        {/* Desktop Skeleton */}
        <div className="hidden md:flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex flex-col shrink-0 min-w-[140px] space-y-2">
            <Skeleton className="h-12 w-28 mb-1" />
            <Skeleton className="h-4 w-24 mb-6" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex-1 h-[140px] w-full min-w-[300px]">
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
          <div className="flex items-center gap-6 shrink-0 lg:w-[320px] justify-end">
            <Skeleton className="w-[120px] h-[120px] rounded-full shrink-0" />
            <div className="flex flex-col gap-3 w-full max-w-[160px]">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = data.data;
  const trendData = stats?.trendData || [];
  const successRate = stats?.successRate?.toFixed(1) || "0.0";
  
  // Compute pieData dynamically
  const delivered = stats?.byStatus?.delivered || 0;
  const inTransit = (stats?.byStatus?.in_transit || 0) + (stats?.byStatus?.out_for_delivery || 0);
  const exceptions = (stats?.byStatus?.failed || 0) + (stats?.byStatus?.returned || 0);
  
  const pieData = [
    { name: "Delivered", value: delivered, color: "#1D4ED8" },
    { name: "In Transit", value: inTransit, color: "#60A5FA" },
    { name: "Exceptions", value: exceptions, color: "#EF4444" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 md:p-6 w-full">
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-4 md:mb-6">
        <h3 className="font-bold text-slate-900">Shipment Health</h3>
        <Info className="w-4 h-4 text-slate-400" />
      </div>

      {/* Mobile layout: stacked cards */}
      <div className="md:hidden space-y-4">
        {/* KPI card */}
        <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-3xl font-bold text-blue-600 tracking-tight">{successRate}%</span>
            <p className="text-xs font-medium text-slate-500 mt-0.5">On-time delivery</p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            <ArrowUpRight className="w-3 h-3" />
            2.4%
          </div>
        </div>

        {/* Area chart */}
        <div className="h-[120px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValueMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94A3B8' }} 
                dy={5}
              />
              <YAxis hide />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#2563EB" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorValueMobile)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend row */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {pieData.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-100 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-[11px] font-medium text-slate-600 whitespace-nowrap">{item.name}</span>
              <span className="text-[11px] font-bold text-slate-900 ml-0.5">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop layout: horizontal */}
      <div className="hidden md:flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left Stats */}
        <div className="flex flex-col shrink-0 min-w-[140px]">
          <span className="text-5xl font-bold text-blue-600 tracking-tight mb-1">{successRate}%</span>
          <span className="text-sm font-medium text-slate-500 mb-6">On-time delivery</span>
          
          <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
            <ArrowUpRight className="w-4 h-4" />
            <span>2.4% <span className="text-slate-400 font-medium">vs last 7 days</span></span>
          </div>
        </div>

        {/* Center Area Chart */}
        <div className="flex-1 h-[140px] w-full min-w-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#94A3B8' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                tickFormatter={(val) => `${val}%`}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#1E293B', fontWeight: 600 }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#2563EB" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                activeDot={{ r: 6, fill: "#2563EB", stroke: "#FFF", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Right Donut Chart & Legend */}
        <div className="flex items-center gap-6 shrink-0 lg:w-[320px] justify-end">
          {/* Donut */}
          <div className="relative w-[120px] h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={60}
                  stroke="none"
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
