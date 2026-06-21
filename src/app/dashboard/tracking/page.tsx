"use client";

import React, { useState } from "react";
import { Search, Package, MapPin, Clock, CheckCircle2, AlertCircle, ArrowRight, Truck, Copy } from "lucide-react";
import { mockShipments } from "@/lib/mock-data";
import { Shipment } from "@/types/shipment";
import { toast } from "sonner";
import { format } from "date-fns";

const statusConfig: Record<string, { color: string; bg: string; dot: string; label: string }> = {
  pending: { color: "text-slate-700", bg: "bg-slate-100", dot: "bg-slate-400", label: "Pending" },
  in_transit: { color: "text-blue-700", bg: "bg-blue-50", dot: "bg-blue-500", label: "In Transit" },
  out_for_delivery: { color: "text-indigo-700", bg: "bg-indigo-50", dot: "bg-indigo-500", label: "Out for Delivery" },
  delivered: { color: "text-emerald-700", bg: "bg-emerald-50", dot: "bg-emerald-500", label: "Delivered" },
  failed: { color: "text-red-700", bg: "bg-red-50", dot: "bg-red-500", label: "Failed" },
  returned: { color: "text-orange-700", bg: "bg-orange-50", dot: "bg-orange-500", label: "Returned" },
};

function getProgressWidth(status: string) {
  switch (status) {
    case "pending": return "15%";
    case "in_transit": return "45%";
    case "out_for_delivery": return "75%";
    case "delivered": return "100%";
    case "failed": return "60%";
    case "returned": return "90%";
    default: return "0%";
  }
}

function getProgressColor(status: string) {
  switch (status) {
    case "delivered": return "bg-emerald-500";
    case "failed": return "bg-red-500";
    case "returned": return "bg-orange-500";
    default: return "bg-indigo-500";
  }
}

export default function TrackingPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Shipment | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setHasSearched(true);
    const normalizedQuery = query.trim().toLowerCase();
    const found = mockShipments.find(
      (s) =>
        s.trackingNumber.toLowerCase() === normalizedQuery ||
        s.trackingNumber.toLowerCase().includes(normalizedQuery)
    );
    setResult(found || null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", { icon: <CheckCircle2 className="w-4 h-4" /> });
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight leading-tight">Track a Shipment</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Enter a tracking number to get real-time shipment status and delivery history.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter tracking number (e.g. 784000000108)..."
          className="w-full h-14 pl-12 pr-32 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-900 placeholder:text-slate-400 transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors"
        >
          Track
        </button>
      </form>

      {/* Quick suggestions */}
      {!hasSearched && (
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400 mb-8">
          <span>Try:</span>
          {mockShipments.slice(0, 4).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setQuery(s.trackingNumber);
                setHasSearched(true);
                setResult(s);
              }}
              className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors font-mono text-[11px]"
            >
              {s.trackingNumber}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {hasSearched && !result && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Shipment not found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            No shipment matches the tracking number "{query}". Please double-check and try again.
          </p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-lg font-bold text-slate-900">{result.trackingNumber}</span>
                  <button
                    onClick={() => handleCopy(result.trackingNumber)}
                    className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-all"
                    title="Copy tracking number"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-sm font-medium text-slate-500">
                  {result.carrier.name} · {result.carrier.service}
                </p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${statusConfig[result.status]?.bg} ${statusConfig[result.status]?.color}`}>
                <span className={`w-2 h-2 rounded-full ${statusConfig[result.status]?.dot}`} />
                {statusConfig[result.status]?.label}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
              <div
                className={`h-2.5 rounded-full transition-all duration-700 ${getProgressColor(result.status)}`}
                style={{ width: getProgressWidth(result.status) }}
              />
            </div>

            {/* Route info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#3777fe]" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Origin</p>
                  <p className="text-sm font-bold text-slate-900">{result.origin.city}, {result.origin.state}</p>
                  <p className="text-xs text-slate-500">{result.origin.country}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Destination</p>
                  <p className="text-sm font-bold text-slate-900">{result.destination.city}, {result.destination.state}</p>
                  <p className="text-xs text-slate-500">{result.destination.country}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    {result.status === "delivered" ? "Delivered On" : "Est. Delivery"}
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {result.status === "delivered" && result.actualDelivery
                      ? format(new Date(result.actualDelivery), "MMM d, yyyy")
                      : format(new Date(result.estimatedDelivery), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipment Details Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Shipment Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Recipient</p>
                <p className="text-sm font-semibold text-slate-900">{result.recipient}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Sender</p>
                <p className="text-sm font-semibold text-slate-900">{result.sender}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Weight</p>
                <p className="text-sm font-semibold text-slate-900">{result.weight}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Dimensions</p>
                <p className="text-sm font-semibold text-slate-900">{result.dimensions}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Contents</p>
                <p className="text-sm font-semibold text-slate-900">{result.description}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Created</p>
                <p className="text-sm font-semibold text-slate-900">{format(new Date(result.createdAt), "MMM d, yyyy")}</p>
              </div>
            </div>
          </div>

          {/* Timeline Events */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-6">Tracking History</h3>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100" />

              <div className="space-y-6">
                {[...result.events].reverse().map((event, i) => {
                  const isLatest = i === 0;
                  const cfg = statusConfig[event.status] || statusConfig.pending;
                  return (
                    <div key={event.id} className="flex gap-4 relative">
                      <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 z-10 border-2 border-white ${isLatest ? cfg.bg : "bg-slate-50"}`}>
                        {event.status === "delivered" ? (
                          <CheckCircle2 className={`w-4 h-4 ${isLatest ? "text-emerald-600" : "text-slate-400"}`} />
                        ) : event.status === "failed" ? (
                          <AlertCircle className={`w-4 h-4 ${isLatest ? "text-red-600" : "text-slate-400"}`} />
                        ) : (
                          <Package className={`w-4 h-4 ${isLatest ? "text-indigo-600" : "text-slate-400"}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`text-sm font-bold ${isLatest ? "text-slate-900" : "text-slate-600"}`}>
                              {event.description}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              <MapPin className="w-3 h-3 inline mr-1" />
                              {event.location || "Unknown"}
                            </p>
                          </div>
                          <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                            {format(new Date(event.timestamp), "MMM d, h:mm a")}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
