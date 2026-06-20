"use client";

import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CarrierName } from "@/types/shipment";
import dynamic from "next/dynamic";

interface CarrierStats {
  carrier: CarrierName;
  total: number;
  delivered: number;
  failed: number;
  successRate: number;
  avgDays: number;
}

function CarrierPerformanceContent() {
  const [performance, setPerformance] = useState<CarrierStats[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/shipments/stats");
        const json = await res.json();
        const data = json.data || json;
        if (data && data.carrierPerformance) {
          // Sort by success rate descending
          const sorted = [...data.carrierPerformance].sort((a, b) => b.successRate - a.successRate);
          setPerformance(sorted);
        }
      } catch (error) {
        console.error("Failed to fetch carrier performance", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !performance) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col p-5">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Carrier Performance</h3>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">This month</span>
      </div>

      <div className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Carrier</th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Volume</th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Success Rate</th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Avg Days</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {performance.map((stat, index) => {
              const isBest = index === 0;
              const isWorst = index === performance.length - 1 && stat.successRate < 80;
              
              // Determine progress bar color
              let barColor = "bg-emerald-500";
              if (stat.successRate < 75) barColor = "bg-red-500";
              else if (stat.successRate < 90) barColor = "bg-amber-500";

              return (
                <tr key={stat.carrier} className={`hover:bg-slate-50 transition-colors ${isBest ? "bg-emerald-50/30" : ""} ${isWorst ? "bg-red-50/30" : ""}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{stat.carrier}</span>
                      {isBest && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">Best</span>}
                      {isWorst && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">Watch</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-slate-600 text-right">
                    {stat.total.toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-700 min-w-[40px]">{stat.successRate.toFixed(1)}%</span>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${stat.successRate}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-slate-600 text-right">
                    {stat.avgDays.toFixed(1)}d
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(CarrierPerformanceContent), { ssr: false });
