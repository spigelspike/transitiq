"use client";

import React, { useMemo } from "react";
import { mockShipments, getCarrierPerformance, getDeliverySuccessRate, getAverageDeliveryDays } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, Package, Clock, CheckCircle2, AlertTriangle, BarChart3, ArrowUpRight } from "lucide-react";

const CARRIER_COLORS: Record<string, string> = {
  FedEx: "#7C3AED",
  UPS: "#D97706",
  DHL: "#DC2626",
  USPS: "#3777fe",
  BlueDart: "#0891B2",
};

export default function AnalyticsPage() {
  const carrierData = useMemo(() => getCarrierPerformance(mockShipments), []);
  const successRate = useMemo(() => getDeliverySuccessRate(mockShipments), []);
  const avgDays = useMemo(() => getAverageDeliveryDays(mockShipments), []);

  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    mockShipments.forEach((s) => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    return counts;
  }, []);

  const totalShipments = mockShipments.length;
  const deliveredCount = statusBreakdown["delivered"] || 0;
  const failedCount = (statusBreakdown["failed"] || 0) + (statusBreakdown["returned"] || 0);

  // Weekly volume simulation
  const weeklyVolume = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, i) => ({
      day,
      count: Math.floor(5 + Math.sin(i * 1.2) * 4 + Math.random() * 3),
    }));
  }, []);
  const maxWeeklyCount = Math.max(...weeklyVolume.map((d) => d.count));

  // Carrier volume for bar chart
  const maxCarrierTotal = Math.max(...carrierData.map((c) => c.total));

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight leading-tight">Analytics</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Performance metrics and insights across all carriers and shipments.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <ArrowUpRight className="w-3 h-3" /> 12%
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{totalShipments}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Total Shipments</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp className="w-3 h-3" /> 2.4%
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{successRate}%</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Delivery Success Rate</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#3777fe]" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{avgDays} <span className="text-base font-semibold text-slate-400">days</span></p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Avg. Delivery Time</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg">
              <TrendingDown className="w-3 h-3" /> 1.2%
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{failedCount}</p>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Failed / Returned</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">Status Breakdown</h3>
          <div className="space-y-4">
            {[
              { key: "delivered", label: "Delivered", color: "bg-emerald-500", textColor: "text-emerald-700" },
              { key: "in_transit", label: "In Transit", color: "bg-blue-500", textColor: "text-blue-700" },
              { key: "out_for_delivery", label: "Out for Delivery", color: "bg-indigo-500", textColor: "text-indigo-700" },
              { key: "pending", label: "Pending", color: "bg-slate-400", textColor: "text-slate-700" },
              { key: "failed", label: "Failed", color: "bg-red-500", textColor: "text-red-700" },
              { key: "returned", label: "Returned", color: "bg-orange-500", textColor: "text-orange-700" },
            ].map((s) => {
              const count = statusBreakdown[s.key] || 0;
              const pct = totalShipments > 0 ? ((count / totalShipments) * 100).toFixed(1) : "0";
              return (
                <div key={s.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-slate-700">{s.label}</span>
                    <span className={`text-sm font-bold ${s.textColor}`}>{count} <span className="text-slate-400 font-medium">({pct}%)</span></span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${s.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Volume */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">Weekly Volume</h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {weeklyVolume.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-slate-600">{d.count}</span>
                <div className="w-full flex justify-center">
                  <div
                    className="w-8 rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all duration-500 hover:from-indigo-700 hover:to-indigo-500"
                    style={{ height: `${(d.count / maxWeeklyCount) * 140}px` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carrier Performance Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4 md:mb-6">Carrier Performance</h3>
        
        {/* Mobile View */}
        <div className="md:hidden space-y-3">
          {carrierData.map((c) => (
            <div key={c.carrier} className="border border-slate-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold"
                  style={{ backgroundColor: `${CARRIER_COLORS[c.carrier]}15`, color: CARRIER_COLORS[c.carrier] }}
                >
                  {c.carrier}
                </span>
                <span className="text-xs font-bold text-slate-500">Total: {c.total}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Success Rate</p>
                  <p className={`text-sm font-bold ${c.successRate >= 70 ? "text-emerald-600" : c.successRate >= 40 ? "text-amber-600" : "text-red-600"}`}>
                    {c.successRate}%
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Avg. Time</p>
                  <p className="text-sm font-bold text-slate-700">{c.avgDays > 0 ? `${c.avgDays} days` : "—"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mb-2 px-1">
                <span className="font-semibold text-emerald-600">{c.delivered} Delivered</span>
                <span className="font-semibold text-red-500">{c.failed} Failed</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(c.total / maxCarrierTotal) * 100}%`, backgroundColor: CARRIER_COLORS[c.carrier] }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Carrier</th>
                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Total</th>
                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Delivered</th>
                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Failed</th>
                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Success Rate</th>
                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Avg. Days</th>
                <th className="pb-3 text-xs font-bold uppercase tracking-wider text-slate-400 w-36">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {carrierData.map((c) => (
                <tr key={c.carrier} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{ backgroundColor: `${CARRIER_COLORS[c.carrier]}15`, color: CARRIER_COLORS[c.carrier] }}
                    >
                      {c.carrier}
                    </span>
                  </td>
                  <td className="py-3.5 text-center text-sm font-bold text-slate-900">{c.total}</td>
                  <td className="py-3.5 text-center text-sm font-bold text-emerald-600">{c.delivered}</td>
                  <td className="py-3.5 text-center text-sm font-bold text-red-500">{c.failed}</td>
                  <td className="py-3.5 text-center">
                    <span className={`text-sm font-bold ${c.successRate >= 70 ? "text-emerald-600" : c.successRate >= 40 ? "text-amber-600" : "text-red-600"}`}>
                      {c.successRate}%
                    </span>
                  </td>
                  <td className="py-3.5 text-center text-sm font-bold text-slate-700">
                    {c.avgDays > 0 ? `${c.avgDays}d` : "—"}
                  </td>
                  <td className="py-3.5">
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(c.total / maxCarrierTotal) * 100}%`, backgroundColor: CARRIER_COLORS[c.carrier] }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
