"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { mockShipments, getCarrierPerformance } from "@/lib/mock-data";
import { Truck, TrendingUp, TrendingDown, Clock, CheckCircle2, XCircle, Package, ArrowRight, Star } from "lucide-react";

const CARRIER_COLORS: Record<string, { bg: string; text: string; accent: string; border: string }> = {
  FedEx: { bg: "bg-purple-50", text: "text-purple-700", accent: "#7C3AED", border: "border-purple-200" },
  UPS: { bg: "bg-amber-50", text: "text-amber-700", accent: "#D97706", border: "border-amber-200" },
  DHL: { bg: "bg-red-50", text: "text-red-700", accent: "#DC2626", border: "border-red-200" },
  USPS: { bg: "bg-blue-50", text: "text-blue-700", accent: "#2563EB", border: "border-blue-200" },
  BlueDart: { bg: "bg-cyan-50", text: "text-cyan-700", accent: "#0891B2", border: "border-cyan-200" },
};

export default function CarriersPage() {
  const router = useRouter();
  const carrierData = useMemo(() => getCarrierPerformance(mockShipments), []);

  // Calculate additional stats per carrier
  const carrierDetails = useMemo(() => {
    return carrierData.map((c) => {
      const shipments = mockShipments.filter((s) => s.carrier.name === c.carrier);
      const inTransit = shipments.filter((s) => s.status === "in_transit").length;
      const pending = shipments.filter((s) => s.status === "pending").length;
      const outForDelivery = shipments.filter((s) => s.status === "out_for_delivery").length;

      // Get unique services
      const services = [...new Set(shipments.map((s) => s.carrier.service))];

      // Top routes
      const routeCounts: Record<string, number> = {};
      shipments.forEach((s) => {
        const route = `${s.origin.city} → ${s.destination.city}`;
        routeCounts[route] = (routeCounts[route] || 0) + 1;
      });
      const topRoutes = Object.entries(routeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      return {
        ...c,
        inTransit,
        pending,
        outForDelivery,
        services,
        topRoutes,
        internationalCount: shipments.filter((s) => s.origin.country !== s.destination.country).length,
      };
    });
  }, [carrierData]);

  const bestCarrier = carrierData.reduce((best, c) => (c.successRate > best.successRate ? c : best), carrierData[0]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight leading-tight">Carriers</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Compare performance, volume, and reliability across all integrated carriers.
        </p>
      </div>

      {/* Top Performer Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-indigo-500/20">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Star className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white/80">Top Performer This Month</p>
          <p className="text-xl font-extrabold text-white">{bestCarrier.carrier} — {bestCarrier.successRate}% success rate</p>
        </div>
      </div>

      {/* Carrier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {carrierDetails.map((c) => {
          const colors = CARRIER_COLORS[c.carrier];
          return (
            <div 
              key={c.carrier} 
              onClick={() => router.push(`/dashboard/carriers/${c.carrier}`)}
              className={`bg-white border ${colors.border} rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer`}
            >
              {/* Card Header */}
              <div className={`${colors.bg} px-6 py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Truck className="w-5 h-5" style={{ color: colors.accent }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold" style={{ color: colors.accent }}>{c.carrier}</h3>
                    <p className="text-xs font-medium text-slate-500">{c.services[0]}</p>
                  </div>
                </div>
                <span className={`text-2xl font-extrabold ${c.successRate >= 70 ? "text-emerald-600" : c.successRate >= 40 ? "text-amber-600" : "text-red-600"}`}>
                  {c.successRate}%
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-5">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-xl font-extrabold text-slate-900">{c.total}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-extrabold text-emerald-600">{c.delivered}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Delivered</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-extrabold text-red-500">{c.failed}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Failed</p>
                  </div>
                </div>

                {/* Active Shipments */}
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Active Now</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-semibold text-blue-600">{c.inTransit} in transit</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-semibold text-indigo-600">{c.outForDelivery} out for delivery</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-semibold text-slate-500">{c.pending} pending</span>
                  </div>
                </div>

                {/* Avg Delivery Time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-500">Avg. Delivery</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {c.avgDays > 0 ? `${c.avgDays} days` : "No data"}
                  </span>
                </div>

                {/* International */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-500">International</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{c.internationalCount} shipments</span>
                </div>

                {/* Top Routes */}
                {c.topRoutes.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Top Routes</p>
                    <div className="space-y-1.5">
                      {c.topRoutes.map(([route, count]) => (
                        <div key={route} className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-600 truncate">{route}</span>
                          <span className="font-bold text-slate-400 text-xs">{count}x</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
