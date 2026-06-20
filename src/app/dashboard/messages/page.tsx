"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  MessageSquare, Send, Mail, Phone, Search, Users, Building2,
  FileText, Clock, CheckCircle2, ChevronRight, CornerDownRight, Plus
} from "lucide-react";

// Mock Data
const CONTACTS = [
  { id: "c1", name: "Alex Morgan", type: "Customer", email: "alex@example.com", phone: "+1 555-0101" },
  { id: "c2", name: "Priya Sharma", type: "Customer", email: "priya@example.com", phone: "+1 555-0102" },
  { id: "f1", name: "FedEx North Hub", type: "Facility", email: "north@fedex.com", phone: "+1 555-0201" },
  { id: "f2", name: "UPS Regional Center", type: "Facility", email: "region@ups.com", phone: "+1 555-0202" },
];

const TEMPLATES = [
  { id: "t1", title: "Delay Notification", subject: "Update on your TransitIQ Shipment", body: "Hi [Name],\n\nWe wanted to let you know that your shipment [Tracking] is experiencing a slight delay due to [Reason]. We are actively monitoring the situation and expect delivery by [Date].\n\nApologies for the inconvenience.\n\nTransitIQ Support" },
  { id: "t2", title: "Delivery Confirmation", subject: "Your package has been delivered!", body: "Hi [Name],\n\nGood news! Your shipment [Tracking] was successfully delivered on [Date]. \n\nIf you have any questions, please reply to this message.\n\nTransitIQ Support" },
  { id: "t3", title: "Facility Inquiry", subject: "Status Request: [Tracking]", body: "Hello,\n\nI am requesting a status update for shipment [Tracking], which was last scanned at your facility on [Date]. Can you please confirm if this has been dispatched?\n\nThank you,\nTransitIQ Operations" },
];

const HISTORY = [
  { id: "m1", to: "Alex Morgan", type: "Customer", subject: "Update on your TransitIQ Shipment", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), status: "sent" },
  { id: "m2", to: "FedEx North Hub", type: "Facility", subject: "Status Request: 7840000108", timestamp: new Date(Date.now() - 86400000).toISOString(), status: "replied" },
  { id: "m3", to: "Priya Sharma", type: "Customer", subject: "Your package has been delivered!", timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), status: "read" },
];

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<"compose" | "history">("compose");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [composeData, setComposeData] = useState({ to: "", subject: "", body: "" });

  const handleTemplateSelect = (id: string) => {
    const template = TEMPLATES.find((t) => t.id === id);
    if (template) {
      setSelectedTemplate(id);
      setComposeData({ ...composeData, subject: template.subject, body: template.body });
    }
  };

  const handleSend = () => {
    if (!composeData.to || !composeData.subject || !composeData.body) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Message sent successfully!", { icon: <CheckCircle2 className="w-4 h-4" /> });
    setComposeData({ to: "", subject: "", body: "" });
    setSelectedTemplate(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight">Communication Hub</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Send messages to customers and facilities.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("compose")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "compose" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
        >
          <Send className="w-4 h-4" /> Compose
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "history" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
        >
          <Clock className="w-4 h-4" /> History
        </button>
      </div>

      {activeTab === "compose" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Compose Area */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">New Message</h3>
            </div>
            <div className="p-6 space-y-4 flex-1">
              {/* To Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">To</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={composeData.to}
                    onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                    placeholder="Email address or contact name..."
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    list="contacts"
                  />
                  <datalist id="contacts">
                    {CONTACTS.map((c) => (
                      <option key={c.id} value={c.email}>{c.name} ({c.type})</option>
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Subject Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Subject</label>
                <input
                  value={composeData.subject}
                  onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                  placeholder="Message subject..."
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Body Field */}
              <div className="flex-1 flex flex-col">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Message</label>
                <textarea
                  value={composeData.body}
                  onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                  placeholder="Type your message here..."
                  className="w-full flex-1 min-h-[300px] p-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Save Draft</button>
              <button onClick={handleSend} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-indigo-500/20">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </div>
          </div>

          {/* Sidebar Area (Templates & Contacts) */}
          <div className="space-y-6">
            {/* Templates */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" /> Templates
              </h3>
              <div className="space-y-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTemplateSelect(t.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${selectedTemplate === t.id ? "border-indigo-500 bg-indigo-50" : "border-slate-100 hover:border-slate-300 bg-white"}`}
                  >
                    <p className={`text-sm font-bold ${selectedTemplate === t.id ? "text-indigo-700" : "text-slate-900"}`}>{t.title}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{t.subject}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Contacts */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" /> Quick Contacts
              </h3>
              <div className="space-y-3">
                {CONTACTS.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${c.type === "Customer" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                      {c.type === "Customer" ? <Users className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{c.name}</p>
                      <p className="text-xs text-slate-500 truncate">{c.type}</p>
                    </div>
                    <button onClick={() => setComposeData({ ...composeData, to: c.email })} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* History View */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input placeholder="Search history..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white" />
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {HISTORY.map((h) => (
              <div key={h.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${h.type === "Customer" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                  {h.type === "Customer" ? <Users className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-900">{h.to}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{h.type}</span>
                  </div>
                  <p className="text-sm text-slate-600 truncate">{h.subject}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold text-slate-500">{format(new Date(h.timestamp), "MMM d, h:mm a")}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    {h.status === "sent" && <span className="text-xs font-medium text-slate-400">Sent</span>}
                    {h.status === "read" && <span className="text-xs font-medium text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Read</span>}
                    {h.status === "replied" && <span className="text-xs font-medium text-indigo-600 flex items-center gap-1"><CornerDownRight className="w-3 h-3" /> Replied</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
