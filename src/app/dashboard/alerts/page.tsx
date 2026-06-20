"use client";

import React, { useMemo, useState } from "react";
import { mockShipments } from "@/lib/mock-data";
import { AlertTriangle, AlertCircle, CheckCircle2, Clock, Bell, BellOff, Package, ArrowRight, Filter } from "lucide-react";
import { format, isPast, isToday, differenceInDays } from "date-fns";

interface Alert {
  id: string;
  type: "warning" | "danger" | "info" | "success";
  title: string;
  message: string;
  shipmentId: string;
  trackingNumber: string;
  carrier: string;
  timestamp: string;
  read: boolean;
}

const alertTypeConfig = {
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconColor: "text-amber-500",
    badge: "bg-amber-100 text-amber-700",
    label: "Warning",
  },
  danger: {
    icon: AlertCircle,
    bg: "bg-red-50",
    border: "border-red-200",
    iconColor: "text-red-500",
    badge: "bg-red-100 text-red-700",
    label: "Critical",
  },
  info: {
    icon: Bell,
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconColor: "text-blue-500",
    badge: "bg-blue-100 text-blue-700",
    label: "Info",
  },
  success: {
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    iconColor: "text-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
    label: "Resolved",
  },
};

export default function AlertsPage() {
  const [filter, setFilter] = useState<"all" | "warning" | "danger" | "info" | "success">("all");
  const [readState, setReadState] = useState<Record<string, boolean>>({});

  const alerts: Alert[] = useMemo(() => {
    const generated: Alert[] = [];

    mockShipments.forEach((s) => {
      const estDate = new Date(s.estimatedDelivery);

      // Overdue shipments
      if (s.status !== "delivered" && s.status !== "returned" && isPast(estDate) && !isToday(estDate)) {
        const daysOverdue = differenceInDays(new Date(), estDate);
        generated.push({
          id: `alert-overdue-${s.id}`,
          type: daysOverdue > 5 ? "danger" : "warning",
          title: `Shipment ${s.trackingNumber.slice(-8)} is ${daysOverdue} day${daysOverdue > 1 ? "s" : ""} overdue`,
          message: `Package to ${s.recipient} via ${s.carrier.name} was expected by ${format(estDate, "MMM d")}. Current status: ${s.status.replace(/_/g, " ")}.`,
          shipmentId: s.id,
          trackingNumber: s.trackingNumber,
          carrier: s.carrier.name,
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(),
          read: false,
        });
      }

      // Failed deliveries
      if (s.status === "failed") {
        generated.push({
          id: `alert-failed-${s.id}`,
          type: "danger",
          title: `Delivery failed for ${s.trackingNumber.slice(-8)}`,
          message: `Delivery attempt to ${s.recipient} in ${s.destination.city} was unsuccessful. Action may be required.`,
          shipmentId: s.id,
          trackingNumber: s.trackingNumber,
          carrier: s.carrier.name,
          timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          read: false,
        });
      }

      // Returned
      if (s.status === "returned") {
        generated.push({
          id: `alert-returned-${s.id}`,
          type: "warning",
          title: `Shipment ${s.trackingNumber.slice(-8)} returned to sender`,
          message: `Package for ${s.recipient} was returned via ${s.carrier.name}. Please review and decide next steps.`,
          shipmentId: s.id,
          trackingNumber: s.trackingNumber,
          carrier: s.carrier.name,
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
          read: false,
        });
      }

      // Recently delivered (success)
      if (s.status === "delivered" && s.actualDelivery) {
        const daysSinceDelivery = differenceInDays(new Date(), new Date(s.actualDelivery));
        if (daysSinceDelivery <= 3) {
          generated.push({
            id: `alert-delivered-${s.id}`,
            type: "success",
            title: `Shipment ${s.trackingNumber.slice(-8)} delivered successfully`,
            message: `Package delivered to ${s.recipient} in ${s.destination.city} on ${format(new Date(s.actualDelivery), "MMM d")}.`,
            shipmentId: s.id,
            trackingNumber: s.trackingNumber,
            carrier: s.carrier.name,
            timestamp: s.actualDelivery,
            read: false,
          });
        }
      }
    });

    // Sort by timestamp, newest first
    return generated.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, []);

  const filteredAlerts = filter === "all" ? alerts : alerts.filter((a) => a.type === filter);

  const counts = useMemo(() => {
    const c = { all: alerts.length, warning: 0, danger: 0, info: 0, success: 0 };
    alerts.forEach((a) => c[a.type]++);
    return c;
  }, [alerts]);

  const markAllRead = () => {
    const newState: Record<string, boolean> = {};
    alerts.forEach((a) => (newState[a.id] = true));
    setReadState(newState);
  };

  const toggleRead = (id: string) => {
    setReadState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getRelativeTime = (dateString: string) => {
    const diff = new Date().getTime() - new Date(dateString).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 60) return `${Math.max(1, mins)}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight leading-tight">Alerts</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Stay on top of delivery issues, delays, and important updates.
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 rounded-xl hover:bg-indigo-50 transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
          Mark all read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "danger", "warning", "success", "info"] as const).map((type) => {
          const isActive = filter === type;
          const label = type === "all" ? "All" : alertTypeConfig[type].label;
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {label}
              <span className={`ml-1.5 text-xs ${isActive ? "text-indigo-200" : "text-slate-400"}`}>{counts[type]}</span>
            </button>
          );
        })}
      </div>

      {/* Alert List */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BellOff className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No alerts</h3>
          <p className="text-sm text-slate-500">
            {filter === "all" ? "Everything is running smoothly." : `No ${alertTypeConfig[filter as keyof typeof alertTypeConfig]?.label.toLowerCase()} alerts right now.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const config = alertTypeConfig[alert.type];
            const isRead = readState[alert.id];
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                onClick={() => toggleRead(alert.id)}
                className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                  isRead
                    ? "bg-white border-slate-100 opacity-60"
                    : `${config.bg} ${config.border} shadow-sm hover:shadow-md`
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isRead ? "bg-slate-100" : config.bg}`}>
                  <Icon className={`w-5 h-5 ${isRead ? "text-slate-400" : config.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`text-sm font-bold ${isRead ? "text-slate-500" : "text-slate-900"}`}>
                      {alert.title}
                    </h4>
                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                      {getRelativeTime(alert.timestamp)}
                    </span>
                  </div>
                  <p className={`text-[13px] ${isRead ? "text-slate-400" : "text-slate-600"} leading-relaxed mb-2`}>
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${config.badge}`}>
                      {config.label}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {alert.carrier} · {alert.trackingNumber.slice(-8)}
                    </span>
                  </div>
                </div>
                {!isRead && (
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
