"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { mockShipments } from "@/lib/mock-data";
import { format, isPast, isToday, differenceInDays } from "date-fns";
import { toast } from "sonner";
import {
  ArrowLeft, Copy, CheckCircle2, AlertCircle, Package, MapPin, Clock,
  Truck, ArrowRight, Weight, Ruler, FileText, Phone, Mail, Flag,
  RotateCcw, MessageSquare, AlertTriangle, ChevronRight, Building2
} from "lucide-react";

const statusConfig: Record<string, { color: string; bg: string; dot: string; label: string }> = {
  pending: { color: "text-slate-700", bg: "bg-slate-100", dot: "bg-slate-400", label: "Pending" },
  in_transit: { color: "text-blue-700", bg: "bg-blue-50", dot: "bg-blue-500", label: "In Transit" },
  out_for_delivery: { color: "text-indigo-700", bg: "bg-indigo-50", dot: "bg-indigo-500", label: "Out for Delivery" },
  delivered: { color: "text-emerald-700", bg: "bg-emerald-50", dot: "bg-emerald-500", label: "Delivered" },
  failed: { color: "text-red-700", bg: "bg-red-50", dot: "bg-red-500", label: "Failed" },
  returned: { color: "text-orange-700", bg: "bg-orange-50", dot: "bg-orange-500", label: "Returned" },
};

const progressMap: Record<string, number> = {
  pending: 15, in_transit: 45, out_for_delivery: 75, delivered: 100, failed: 60, returned: 90,
};

const progressColor: Record<string, string> = {
  delivered: "bg-emerald-500", failed: "bg-red-500", returned: "bg-orange-500",
  pending: "bg-indigo-500", in_transit: "bg-indigo-500", out_for_delivery: "bg-indigo-500",
};

// Mock facility data based on location
function getFacility(location: string, carrier: string) {
  const facilities: Record<string, { phone: string; email: string; manager: string; hours: string }> = {
    "Sender Facility": { phone: "+91 80 4567 8901", email: "origin@facility.in", manager: "Rajesh Kumar", hours: "8:00 AM – 8:00 PM" },
    "Destination": { phone: "+91 44 3456 7890", email: "dest@facility.in", manager: "Priya Sharma", hours: "9:00 AM – 6:00 PM" },
    "Return Center": { phone: "+91 22 2345 6789", email: "returns@facility.in", manager: "Amit Patel", hours: "9:00 AM – 5:00 PM" },
    "Local Facility": { phone: "+91 11 1234 5678", email: "local@facility.in", manager: "Suresh Nair", hours: "7:00 AM – 9:00 PM" },
  };
  const fallback = { phone: "+91 98765 43210", email: `hub@${carrier.toLowerCase()}.in`, manager: "Operations Desk", hours: "24/7" };
  return facilities[location] || fallback;
}

export default function ShipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const shipment = useMemo(() => mockShipments.find((s) => s.id === id), [id]);

  const [notes, setNotes] = useState<{ text: string; time: string }[]>([]);
  const [noteInput, setNoteInput] = useState("");
  const [showFacilityPanel, setShowFacilityPanel] = useState(false);
  const [actionModal, setActionModal] = useState<string | null>(null);
  const [actionReason, setActionReason] = useState("");

  if (!shipment) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center mt-20">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Shipment not found</h2>
        <p className="text-sm text-slate-500 mb-6">No shipment exists with ID "{id}".</p>
        <button onClick={() => router.back()} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  const s = statusConfig[shipment.status];
  const estDate = new Date(shipment.estimatedDelivery);
  const isOverdue = shipment.status !== "delivered" && shipment.status !== "returned" && isPast(estDate) && !isToday(estDate);
  const lastEvent = shipment.events[shipment.events.length - 1];
  const lastFacility = getFacility(lastEvent?.location || "Local Facility", shipment.carrier.name);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!", { icon: <CheckCircle2 className="w-4 h-4" /> });
  };

  const addNote = () => {
    if (!noteInput.trim()) return;
    setNotes((prev) => [{ text: noteInput.trim(), time: new Date().toISOString() }, ...prev]);
    setNoteInput("");
    toast.success("Note added");
  };

  const handleAction = (action: string) => {
    toast.success(`${action} submitted successfully`, { icon: <CheckCircle2 className="w-4 h-4" /> });
    setActionModal(null);
    setActionReason("");
    setNotes((prev) => [{ text: `[Action] ${action}: ${actionReason || "No reason provided"}`, time: new Date().toISOString() }, ...prev]);
  };

  // Route steps
  const routeSteps = [
    { label: "Picked Up", location: `${shipment.origin.city}, ${shipment.origin.state}`, done: true },
    { label: "In Transit", location: "Carrier Network", done: ["in_transit", "out_for_delivery", "delivered", "returned"].includes(shipment.status) },
    { label: "Out for Delivery", location: `${shipment.destination.city}`, done: ["out_for_delivery", "delivered"].includes(shipment.status) },
    { label: "Delivered", location: `${shipment.destination.city}, ${shipment.destination.state}`, done: shipment.status === "delivered" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <button onClick={() => router.back()} className="flex items-center gap-1 hover:text-indigo-600 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <ChevronRight className="w-3 h-3" />
        <Link href="/dashboard/shipments" className="hover:text-indigo-600 transition-colors font-medium">Shipments</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="font-bold text-slate-900">{shipment.id}</span>
      </div>

      {/* ── STATUS HERO ───────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-mono text-xl font-bold text-slate-900">{shipment.trackingNumber}</h1>
              <button onClick={() => handleCopy(shipment.trackingNumber)} className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-all">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm font-medium text-slate-500">{shipment.carrier.name} · {shipment.carrier.service}</p>
          </div>
          <div className="flex items-center gap-3">
            {isOverdue && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-700">
                <AlertTriangle className="w-3 h-3" /> {differenceInDays(new Date(), estDate)}d Overdue
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${s.bg} ${s.color}`}>
              <span className={`w-2 h-2 rounded-full ${s.dot}`} />
              {s.label}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
          <div className={`h-2.5 rounded-full transition-all duration-700 ${progressColor[shipment.status]}`} style={{ width: `${progressMap[shipment.status]}%` }} />
        </div>

        {/* Route Steps */}
        <div className="flex items-center justify-between relative">
          {routeSteps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center text-center relative z-10 flex-1 min-w-0 px-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step.done ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                {step.done ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
              </div>
              <p className={`text-[10px] sm:text-xs font-bold ${step.done ? "text-slate-900" : "text-slate-400"}`}>{step.label}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 hidden md:block truncate w-full px-2">{step.location}</p>
            </div>
          ))}
          {/* Connector line */}
          <div className="absolute top-4 left-[12%] right-[12%] h-0.5 bg-slate-100 -z-0" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT COLUMN ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Package & Route Info */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Shipment Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-4">
              {[
                { icon: <Package className="w-4 h-4" />, label: "Recipient", value: shipment.recipient },
                { icon: <FileText className="w-4 h-4" />, label: "Sender", value: shipment.sender },
                { icon: <Truck className="w-4 h-4" />, label: "Carrier", value: `${shipment.carrier.name} — ${shipment.carrier.service}` },
                { icon: <Weight className="w-4 h-4" />, label: "Weight", value: shipment.weight },
                { icon: <Ruler className="w-4 h-4" />, label: "Dimensions", value: shipment.dimensions },
                { icon: <FileText className="w-4 h-4" />, label: "Contents", value: shipment.description },
              ].map((d) => (
                <div key={d.label}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5 flex items-center gap-1"><span className="text-slate-300">{d.icon}</span>{d.label}</p>
                  <p className="text-sm font-semibold text-slate-900">{d.value}</p>
                </div>
              ))}
            </div>

            {/* Route */}
            <div className="mt-5 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Origin</p>
                  <p className="text-sm font-bold text-slate-900">{shipment.origin.city}, {shipment.origin.state}</p>
                  <p className="text-xs text-slate-500">{shipment.origin.street}, {shipment.origin.zip}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 shrink-0" />
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Destination</p>
                  <p className="text-sm font-bold text-slate-900">{shipment.destination.city}, {shipment.destination.state}</p>
                  <p className="text-xs text-slate-500">{shipment.destination.street}, {shipment.destination.zip}</p>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Created</p>
                <p className="text-sm font-bold text-slate-900">{format(new Date(shipment.createdAt), "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Est. Delivery</p>
                <p className={`text-sm font-bold ${isOverdue ? "text-red-600" : "text-slate-900"}`}>{format(estDate, "MMM d, yyyy")}</p>
              </div>
              {shipment.actualDelivery && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Delivered On</p>
                  <p className="text-sm font-bold text-emerald-600">{format(new Date(shipment.actualDelivery), "MMM d, yyyy")}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-6">Tracking History</h3>
            <div className="relative">
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100" />
              <div className="space-y-5">
                {[...shipment.events].reverse().map((event, i) => {
                  const isLatest = i === 0;
                  const cfg = statusConfig[event.status] || statusConfig.pending;
                  return (
                    <div key={event.id} className="flex gap-4 relative">
                      <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 z-10 border-2 border-white ${isLatest ? cfg.bg : "bg-slate-50"}`}>
                        {event.status === "delivered" ? <CheckCircle2 className={`w-4 h-4 ${isLatest ? "text-emerald-600" : "text-slate-400"}`} />
                          : event.status === "failed" ? <AlertCircle className={`w-4 h-4 ${isLatest ? "text-red-600" : "text-slate-400"}`} />
                          : <Package className={`w-4 h-4 ${isLatest ? "text-indigo-600" : "text-slate-400"}`} />}
                      </div>
                      <div className="flex-1 min-w-0 pb-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`text-sm font-bold ${isLatest ? "text-slate-900" : "text-slate-600"}`}>{event.description}</p>
                            <p className="text-xs text-slate-500 mt-0.5"><MapPin className="w-3 h-3 inline mr-1" />{event.location || "Unknown"}</p>
                          </div>
                          <span className="text-xs font-medium text-slate-400 whitespace-nowrap">{format(new Date(event.timestamp), "MMM d, h:mm a")}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────── */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: "Escalate", icon: <AlertTriangle className="w-4 h-4" />, color: "text-amber-600 bg-amber-50 hover:bg-amber-100", key: "Escalation" },
                { label: "Flag Issue", icon: <Flag className="w-4 h-4" />, color: "text-red-600 bg-red-50 hover:bg-red-100", key: "Issue Flag" },
                { label: "Request Return", icon: <RotateCcw className="w-4 h-4" />, color: "text-orange-600 bg-orange-50 hover:bg-orange-100", key: "Return Request" },
              ].map((a) => (
                <button key={a.label} onClick={() => setActionModal(a.key)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${a.color}`}>
                  {a.icon} {a.label}
                </button>
              ))}
              <button onClick={() => setShowFacilityPanel(!showFacilityPanel)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#3777fe] bg-blue-50 hover:bg-blue-100 transition-colors">
                <Building2 className="w-4 h-4" /> Contact Last Facility
              </button>
            </div>
          </div>

          {/* Facility Panel */}
          {showFacilityPanel && (
            <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Last Facility</h3>
              <p className="text-xs text-slate-500 mb-4">{lastEvent?.location || "Unknown"} · {shipment.carrier.name}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <a href={`tel:${lastFacility.phone}`} className="text-sm font-semibold text-indigo-600 hover:underline">{lastFacility.phone}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a href={`mailto:${lastFacility.email}`} className="text-sm font-semibold text-indigo-600 hover:underline">{lastFacility.email}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">Manager: {lastFacility.manager}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{lastFacility.hours}</span>
                </div>
              </div>
            </div>
          )}

          {/* Internal Notes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Internal Notes</h3>
            <div className="flex gap-2 mb-3">
              <input
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNote()}
                placeholder="Add a note..."
                className="flex-1 h-9 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <button onClick={addNote} className="px-3 h-9 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors">Add</button>
            </div>
            {notes.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-3">No notes yet.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {notes.map((n, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-lg">
                    <p className="text-xs font-medium text-slate-700">{n.text}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{format(new Date(n.time), "MMM d, h:mm a")}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Info */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Customer</h3>
            <p className="text-sm font-bold text-slate-900">{shipment.recipient}</p>
            <p className="text-xs text-slate-500 mt-1">{shipment.destination.street}</p>
            <p className="text-xs text-slate-500">{shipment.destination.city}, {shipment.destination.state} {shipment.destination.zip}</p>
            <p className="text-xs text-slate-500">{shipment.destination.country}</p>
          </div>
        </div>
      </div>

      {/* ── ACTION MODAL ────────────────────────────── */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setActionModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{actionModal}</h3>
            <p className="text-sm text-slate-500 mb-4">Provide a reason for this action on shipment {shipment.trackingNumber}.</p>
            <textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              rows={3}
              placeholder="Enter reason or details..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 mb-4 resize-none"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setActionModal(null)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button onClick={() => handleAction(actionModal)} className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
