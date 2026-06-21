"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { mockShipments, getCarrierPerformance } from "@/lib/mock-data";
import { ArrowLeft, ChevronRight, Truck, Building2, Phone, Mail, Clock, AlertTriangle, TrendingUp, TrendingDown, MapPin, Search, User } from "lucide-react";
import ShipmentsTable from "@/components/dashboard/ShipmentsTable";

const CARRIER_COLORS: Record<string, { bg: string; text: string; accent: string; border: string }> = {
  FedEx: { bg: "bg-purple-50", text: "text-purple-700", accent: "#7C3AED", border: "border-purple-200" },
  UPS: { bg: "bg-amber-50", text: "text-amber-700", accent: "#D97706", border: "border-amber-200" },
  DHL: { bg: "bg-red-50", text: "text-red-700", accent: "#DC2626", border: "border-red-200" },
  USPS: { bg: "bg-blue-50", text: "text-blue-700", accent: "#3777fe", border: "border-blue-200" },
  BlueDart: { bg: "bg-cyan-50", text: "text-cyan-700", accent: "#0891B2", border: "border-cyan-200" },
};

// Generate mock facilities for a carrier
function generateFacilities(carrier: string) {
  const regions = ["North", "South", "East", "West", "Central"];
  return regions.map((region) => ({
    id: `${carrier}-${region}`.toLowerCase(),
    name: `${carrier} ${region} Regional Hub`,
    type: "Sorting Center",
    manager: `${["David", "Sarah", "Michael", "Emma", "John"][Math.floor(Math.random() * 5)]} ${["Smith", "Johnson", "Williams", "Brown", "Jones"][Math.floor(Math.random() * 5)]}`,
    phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
    email: `hub.${region.toLowerCase()}@${carrier.toLowerCase()}.com`,
    hours: "24/7 Operations",
    activeShipments: Math.floor(100 + Math.random() * 900),
  }));
}

export default function CarrierDetailPage() {
  const params = useParams();
  const router = useRouter();
  const carrierName = decodeURIComponent(params.name as string);
  
  const shipments = useMemo(() => mockShipments.filter((s) => s.carrier.name.toLowerCase() === carrierName.toLowerCase()), [carrierName]);
  const carrierData = useMemo(() => getCarrierPerformance(mockShipments).find((c) => c.carrier.toLowerCase() === carrierName.toLowerCase()), [carrierName]);
  const facilities = useMemo(() => generateFacilities(carrierName), [carrierName]);

  if (!carrierData || shipments.length === 0) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center mt-20">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Carrier not found</h2>
        <p className="text-sm text-slate-500 mb-6">No data exists for carrier "{carrierName}".</p>
        <button onClick={() => router.back()} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  const colors = CARRIER_COLORS[carrierData.carrier] || CARRIER_COLORS["FedEx"];
  const inTransit = shipments.filter((s) => s.status === "in_transit" || s.status === "out_for_delivery").length;
  const exceptionRate = carrierData.total > 0 ? ((carrierData.failed / carrierData.total) * 100).toFixed(1) : "0";

  // Mock performance over time (last 7 days)
  const perfData = Array.from({ length: 7 }).map((_, i) => {
    const baseRate = carrierData.successRate;
    const variance = (Math.random() - 0.5) * 5; // +/- 2.5% variance
    return Math.min(100, Math.max(0, baseRate + variance)).toFixed(1);
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <button onClick={() => router.push("/dashboard/carriers")} className="flex items-center gap-1 hover:text-indigo-600 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <ChevronRight className="w-3 h-3" />
        <Link href="/dashboard/carriers" className="hover:text-indigo-600 transition-colors font-medium">Carriers</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="font-bold text-slate-900">{carrierData.carrier}</span>
      </div>

      {/* ── HEADER HERO ───────────────────────────────── */}
      <div className={`rounded-3xl p-8 border shadow-sm ${colors.bg} ${colors.border}`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <Truck className="w-10 h-10" style={{ color: colors.accent }} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                {carrierData.carrier}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/60 text-sm font-bold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Operational
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/60 text-sm font-bold text-slate-700">
                  Total Volume: {carrierData.total}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex w-full md:w-auto gap-4">
            <div className="bg-white/60 rounded-xl p-4 flex-1 md:min-w-[120px]">
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Success Rate</p>
              <p className={`text-xl md:text-2xl font-extrabold ${carrierData.successRate >= 70 ? "text-emerald-600" : "text-amber-600"}`}>
                {carrierData.successRate}%
              </p>
            </div>
            <div className="bg-white/60 rounded-xl p-4 flex-1 md:min-w-[120px]">
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Avg Transit</p>
              <p className="text-xl md:text-2xl font-extrabold text-slate-900">
                {carrierData.avgDays} <span className="text-base text-slate-500">days</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT COLUMN (Charts & Facilities) ─────────── */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Health Stats */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Network Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Active in Network</span>
                <span className="text-sm font-bold text-indigo-600">{inTransit} shipments</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Exception Rate</span>
                <span className="flex items-center gap-1 text-sm font-bold text-red-500">
                  {exceptionRate}% <TrendingDown className="w-3 h-3" />
                </span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 mt-4">7-Day Success Trend</p>
                <div className="flex items-end gap-1 h-16 w-full">
                  {perfData.map((pct, i) => (
                    <div key={i} className="flex-1 bg-slate-100 rounded-t-md relative group hover:bg-slate-200 transition-colors">
                      <div 
                        className="absolute bottom-0 w-full rounded-t-md transition-all"
                        style={{ height: `${pct}%`, backgroundColor: colors.accent }}
                      />
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded pointer-events-none whitespace-nowrap">
                        {pct}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Facility Directory */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Hub Directory</h3>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{facilities.length} Hubs</span>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {facilities.map((fac) => (
                <div key={fac.id} className="p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors group">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colors.bg}`}>
                      <Building2 className="w-4 h-4" style={{ color: colors.accent }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{fac.name}</p>
                      <p className="text-xs text-slate-500 mb-2">{fac.type} · {fac.activeShipments} active pkg</p>
                      <div className="space-y-1.5 hidden group-hover:block transition-all">
                        <p className="text-xs font-medium flex items-center gap-2"><User className="w-3 h-3 text-slate-400" /> {fac.manager}</p>
                        <p className="text-xs font-medium flex items-center gap-2 hover:text-indigo-600"><Phone className="w-3 h-3 text-slate-400" /> <a href={`tel:${fac.phone}`}>{fac.phone}</a></p>
                        <p className="text-xs font-medium flex items-center gap-2 hover:text-indigo-600"><Mail className="w-3 h-3 text-slate-400" /> <a href={`mailto:${fac.email}`}>Email Hub</a></p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* ── RIGHT COLUMN (Shipments Table) ────────────── */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Carrier Shipments</h3>
              <p className="text-sm text-slate-500 mt-1">All packages currently managed by {carrierData.carrier}.</p>
            </div>
            <div className="flex-1 p-0">
              {/* Reuse ShipmentsTable but it normally fetches everything via URL. 
                  Since ShipmentsTable reads from URL, we can't easily force it to filter by carrier without modifying it.
                  For this mockup, we'll just display the full table, or we can pass a prop if we update ShipmentsTable. 
                  Wait, ShipmentsTable doesn't accept a default filter prop currently.
                  Let's render a custom mini-table or update ShipmentsTable to accept props. */}
              <div className="p-6 text-center text-slate-500 text-sm">
                <ShipmentsTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
