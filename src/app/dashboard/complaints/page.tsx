"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { mockShipments } from "@/lib/mock-data";
import { format, differenceInDays, differenceInHours } from "date-fns";
import { toast } from "sonner";
import {
  Search, Filter, AlertTriangle, AlertCircle, Clock, CheckCircle2,
  Package, MessageSquare, ChevronRight, X, Send, User, ArrowUpRight
} from "lucide-react";

// Types
type ComplaintType = "delayed" | "damaged" | "lost" | "wrong_item" | "not_received" | "other";
type ComplaintPriority = "low" | "medium" | "high" | "critical";
type ComplaintStatus = "open" | "in_progress" | "awaiting_customer" | "resolved" | "closed";

interface ComplaintMessage {
  id: string;
  sender: "customer" | "agent";
  senderName: string;
  text: string;
  timestamp: string;
}

interface Complaint {
  id: string;
  shipmentId: string;
  trackingNumber: string;
  carrier: string;
  customerName: string;
  customerEmail: string;
  type: ComplaintType;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  subject: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
  messages: ComplaintMessage[];
}

// Config
const typeConfig: Record<ComplaintType, { label: string; color: string }> = {
  delayed: { label: "Delayed", color: "bg-amber-100 text-amber-700" },
  damaged: { label: "Damaged", color: "bg-red-100 text-red-700" },
  lost: { label: "Lost", color: "bg-red-100 text-red-800" },
  wrong_item: { label: "Wrong Item", color: "bg-purple-100 text-purple-700" },
  not_received: { label: "Not Received", color: "bg-orange-100 text-orange-700" },
  other: { label: "Other", color: "bg-slate-100 text-slate-700" },
};

const priorityConfig: Record<ComplaintPriority, { label: string; color: string; dot: string }> = {
  low: { label: "Low", color: "text-slate-600", dot: "bg-slate-400" },
  medium: { label: "Medium", color: "text-amber-600", dot: "bg-amber-500" },
  high: { label: "High", color: "text-orange-600", dot: "bg-orange-500" },
  critical: { label: "Critical", color: "text-red-600", dot: "bg-red-500" },
};

const statusConfig: Record<ComplaintStatus, { label: string; color: string }> = {
  open: { label: "Open", color: "bg-blue-100 text-blue-700" },
  in_progress: { label: "In Progress", color: "bg-indigo-100 text-indigo-700" },
  awaiting_customer: { label: "Awaiting Customer", color: "bg-amber-100 text-amber-700" },
  resolved: { label: "Resolved", color: "bg-emerald-100 text-emerald-700" },
  closed: { label: "Closed", color: "bg-slate-100 text-slate-600" },
};

const AGENTS = ["Alex Morgan", "Priya Sharma", "Rajesh Kumar", "Suresh Nair"];
const COMPLAINT_TYPES: ComplaintType[] = ["delayed", "damaged", "lost", "wrong_item", "not_received", "other"];
const SUBJECTS: Record<ComplaintType, string[]> = {
  delayed: ["Package not delivered on time", "Shipment stuck in transit", "Delivery date keeps changing"],
  damaged: ["Package arrived damaged", "Contents broken on arrival", "Box was crushed"],
  lost: ["Package missing in transit", "No updates for 7+ days", "Carrier says delivered but not received"],
  wrong_item: ["Received wrong item", "Package contents don't match order", "Someone else's package delivered"],
  not_received: ["Package marked delivered but not received", "Left at wrong address", "Stolen from doorstep"],
  other: ["Need to change delivery address", "Request for redelivery", "Carrier not responding"],
};

// Generate mock complaints from shipments
function generateComplaints(): Complaint[] {
  const complaints: Complaint[] = [];
  const problemShipments = mockShipments.filter(
    (s) => s.status === "failed" || s.status === "returned" || s.status === "in_transit" || s.status === "out_for_delivery"
  );

  const statuses: ComplaintStatus[] = ["open", "open", "in_progress", "in_progress", "awaiting_customer", "resolved", "closed"];
  const priorities: ComplaintPriority[] = ["low", "medium", "medium", "high", "high", "critical"];

  problemShipments.slice(0, 18).forEach((s, i) => {
    const type = COMPLAINT_TYPES[i % COMPLAINT_TYPES.length];
    const status = statuses[i % statuses.length];
    const priority = s.status === "failed" ? "critical" : priorities[i % priorities.length];
    const subjects = SUBJECTS[type];
    const subject = subjects[i % subjects.length];
    const daysAgo = Math.floor(Math.random() * 10) + 1;
    const created = new Date(Date.now() - daysAgo * 86400000);

    const messages: ComplaintMessage[] = [
      {
        id: `msg-${i}-1`,
        sender: "customer",
        senderName: s.recipient,
        text: `Hi, I'm having an issue with my shipment ${s.trackingNumber}. ${subject.toLowerCase()}. Please help resolve this as soon as possible.`,
        timestamp: created.toISOString(),
      },
    ];

    if (status !== "open") {
      messages.push({
        id: `msg-${i}-2`,
        sender: "agent",
        senderName: AGENTS[i % AGENTS.length],
        text: `Thank you for reaching out. I'm looking into your shipment ${s.trackingNumber} with ${s.carrier.name}. I'll update you shortly with the status.`,
        timestamp: new Date(created.getTime() + 3600000).toISOString(),
      });
    }

    if (status === "resolved" || status === "closed") {
      messages.push({
        id: `msg-${i}-3`,
        sender: "agent",
        senderName: AGENTS[i % AGENTS.length],
        text: `Good news! The issue has been resolved. Your shipment should be back on track. Please let us know if you need anything else.`,
        timestamp: new Date(created.getTime() + 86400000).toISOString(),
      });
    }

    complaints.push({
      id: `CMP${(i + 1).toString().padStart(3, "0")}`,
      shipmentId: s.id,
      trackingNumber: s.trackingNumber,
      carrier: s.carrier.name,
      customerName: s.recipient,
      customerEmail: `${s.recipient.split(" ")[0].toLowerCase()}@email.com`,
      type,
      priority,
      status,
      subject,
      description: `Customer reported: ${subject.toLowerCase()}. Shipment ${s.trackingNumber} via ${s.carrier.name} from ${s.origin.city} to ${s.destination.city}.`,
      createdAt: created.toISOString(),
      updatedAt: new Date(created.getTime() + (status === "open" ? 0 : 3600000 * 4)).toISOString(),
      assignedTo: status === "open" ? "Unassigned" : AGENTS[i % AGENTS.length],
      messages,
    });
  });

  return complaints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export default function ComplaintsPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>(() => generateComplaints());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ComplaintType | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const selected = complaints.find((c) => c.id === selectedId);

  const filtered = useMemo(() => {
    let result = complaints;
    if (statusFilter !== "all") result = result.filter((c) => c.status === statusFilter);
    if (typeFilter !== "all") result = result.filter((c) => c.type === typeFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) => c.customerName.toLowerCase().includes(q) || c.trackingNumber.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
      );
    }
    return result;
  }, [complaints, statusFilter, typeFilter, searchQuery]);

  const kpis = useMemo(() => {
    const open = complaints.filter((c) => c.status === "open" || c.status === "in_progress").length;
    const resolved = complaints.filter((c) => c.status === "resolved" || c.status === "closed").length;
    const critical = complaints.filter((c) => c.priority === "critical" && c.status !== "closed" && c.status !== "resolved").length;
    const avgHours = complaints
      .filter((c) => c.status === "resolved" || c.status === "closed")
      .reduce((acc, c) => acc + differenceInHours(new Date(c.updatedAt), new Date(c.createdAt)), 0);
    const avgResolution = resolved > 0 ? Math.round(avgHours / resolved) : 0;
    return { open, resolved, critical, avgResolution, total: complaints.length };
  }, [complaints]);

  const handleStatusChange = (id: string, newStatus: ComplaintStatus) => {
    setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus, updatedAt: new Date().toISOString() } : c));
    toast.success(`Status updated to ${statusConfig[newStatus].label}`);
  };

  const handleReply = () => {
    if (!replyText.trim() || !selectedId) return;
    const newMsg: ComplaintMessage = {
      id: `msg-reply-${Date.now()}`,
      sender: "agent",
      senderName: "Alex Morgan",
      text: replyText.trim(),
      timestamp: new Date().toISOString(),
    };
    setComplaints((prev) =>
      prev.map((c) => c.id === selectedId ? { ...c, messages: [...c.messages, newMsg], updatedAt: new Date().toISOString(), status: c.status === "open" ? "in_progress" : c.status } : c)
    );
    setReplyText("");
    toast.success("Reply sent");
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight">Complaints</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage customer complaints linked to shipments.</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Open", value: kpis.open, icon: <AlertCircle className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50" },
          { label: "Critical", value: kpis.critical, icon: <AlertTriangle className="w-5 h-5 text-red-500" />, bg: "bg-red-50" },
          { label: "Resolved", value: kpis.resolved, icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
          { label: "Avg. Resolution", value: `${kpis.avgResolution}h`, icon: <Clock className="w-5 h-5 text-indigo-600" />, bg: "bg-indigo-50" },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 ${k.bg} rounded-xl flex items-center justify-center shrink-0`}>{k.icon}</div>
            <div>
              <p className="text-xl font-extrabold text-slate-900">{k.value}</p>
              <p className="text-xs font-semibold text-slate-500">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-3 w-full">
        <div className="relative w-full md:flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search complaints..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="flex-1 md:flex-none h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:border-indigo-500">
            <option value="all">All Statuses</option>
            {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className="flex-1 md:flex-none h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:border-indigo-500">
            <option value="all">All Types</option>
            {Object.entries(typeConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      {/* Split View: List + Detail */}
      <div className="flex gap-6 min-h-[500px]">
        {/* Complaint List */}
        <div className={`${selected ? "hidden lg:block lg:w-[40%]" : "w-full"} space-y-2 overflow-y-auto max-h-[600px] pr-1`}>
          {filtered.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-900">No complaints found</p>
              <p className="text-sm text-slate-500 mt-1">Try adjusting your filters.</p>
            </div>
          ) : (
            filtered.map((c) => {
              const isSelected = c.id === selectedId;
              const pCfg = priorityConfig[c.priority];
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`bg-white border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${isSelected ? "border-indigo-400 ring-2 ring-indigo-100 shadow-md" : "border-slate-200 hover:border-slate-300"}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${pCfg.dot}`} />
                      <h4 className="text-sm font-bold text-slate-900 truncate">{c.subject}</h4>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0 ${statusConfig[c.status].color}`}>{statusConfig[c.status].label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-slate-700">{c.customerName}</span>
                    <span>·</span>
                    <span className="font-mono">{c.trackingNumber.slice(-8)}</span>
                    <span>·</span>
                    <span>{c.carrier}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${typeConfig[c.type].color}`}>{typeConfig[c.type].label}</span>
                    <span className="text-[11px] text-slate-400">{differenceInDays(new Date(), new Date(c.createdAt))}d ago</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* Detail Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-400">{selected.id}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${typeConfig[selected.type].color}`}>{typeConfig[selected.type].label}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${statusConfig[selected.status].color}`}>{statusConfig[selected.status].label}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{selected.subject}</h3>
                <p className="text-xs text-slate-500 mt-1">{selected.customerName} · {selected.customerEmail}</p>
              </div>
              <button onClick={() => setSelectedId(null)} className="p-1 text-slate-400 hover:text-slate-600 lg:hidden"><X className="w-5 h-5" /></button>
            </div>

            {/* Linked Shipment */}
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-slate-400" />
                <span className="font-mono font-semibold text-slate-700">{selected.trackingNumber}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500">{selected.carrier}</span>
              </div>
              <button onClick={() => router.push(`/dashboard/shipments/${selected.shipmentId}`)} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View Shipment <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            {/* Actions Row */}
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400 mr-1">Status:</span>
              {(["open", "in_progress", "awaiting_customer", "resolved", "closed"] as ComplaintStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(selected.id, st)}
                  className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg transition-all ${selected.status === st ? statusConfig[st].color + " ring-2 ring-offset-1 ring-indigo-300" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}
                >
                  {statusConfig[st].label}
                </button>
              ))}
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[300px]">
              {selected.messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === "agent" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${msg.sender === "agent" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`}>
                    {msg.senderName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className={`max-w-[75%] ${msg.sender === "agent" ? "text-right" : ""}`}>
                    <div className={`p-3 rounded-2xl text-sm ${msg.sender === "agent" ? "bg-indigo-50 text-indigo-900 rounded-tr-sm" : "bg-slate-50 text-slate-800 rounded-tl-sm"}`}>
                      {msg.text}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.senderName} · {format(new Date(msg.timestamp), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <div className="flex gap-2">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReply()}
                  placeholder="Type a reply..."
                  className="flex-1 h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                <button onClick={handleReply} className="h-10 px-4 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5">
                  <Send className="w-4 h-4" /> Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
