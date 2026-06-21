"use client";

import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TrackingEvent } from "@/types/shipment";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ActivityItem extends TrackingEvent {
  carrier: string;
  trackingNumber: string;
  recipient: string;
}

export default function RecentActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchActivity = async () => {
    try {
      const res = await fetch("/api/shipments/stats");
      const json = await res.json();
      const data = json.data || json;
      if (data && data.recentActivity) {
        setActivities(data.recentActivity);
      }
    } catch (error) {
      console.error("Failed to fetch activity", error);
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getRelativeTime = (dateString: string) => {
    const diff = new Date().getTime() - new Date(dateString).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 60) return `${Math.max(1, mins)}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-emerald-500";
      case "in_transit": return "bg-blue-500";
      case "out_for_delivery": return "bg-purple-500";
      case "returned": return "bg-orange-500";
      case "failed": return "bg-red-500";
      default: return "bg-slate-300";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered": return "bg-emerald-50 text-emerald-700";
      case "in_transit": return "bg-blue-50 text-blue-700";
      case "out_for_delivery": return "bg-purple-50 text-purple-700";
      case "returned": return "bg-orange-50 text-orange-700";
      case "failed": return "bg-red-50 text-red-700";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const formatLocation = (loc: string) => {
    if (!loc) return "Unknown";
    // "City Sorting Center" -> "City, XX" mock
    const city = loc.replace(" Sorting Center", "");
    // mock some states based on name length for visual variety
    const states = ["TX", "FL", "GA", "WA", "CA", "NY"];
    const state = states[city.length % states.length];
    return `${city}, ${state}`;
  };

  if (loading || !activities) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm h-full flex flex-col p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-2 h-2 rounded-full shrink-0 mt-1.5" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm h-full flex flex-col p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900">Recent Activity</h3>
        <Link href="/dashboard#shipments" className="text-[13px] font-bold text-[#3777fe] hover:text-blue-700 flex items-center group">
          View all <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-5">
          {activities.slice(0, 4).map((activity, i) => {
            return (
              <div key={activity.id + i} className="flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(activity.status)}`} />
                  <p className="text-[13px] font-bold text-slate-900 truncate">
                    {activity.recipient} <span className="text-slate-400 font-medium px-1">·</span> 
                    {typeof activity.carrier === "string" ? activity.carrier : (activity.carrier as any).name} {activity.trackingNumber.slice(-6)}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-4 shrink-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getStatusBadge(activity.status)}`}>
                    {activity.status.replace(/_/g, " ")}
                  </span>
                  <span className="text-[13px] font-medium text-slate-500 w-20 text-right truncate hidden sm:block">
                    {formatLocation(activity.location)}
                  </span>
                  <span className="text-[13px] font-medium text-slate-400 w-14 text-right">
                    {getRelativeTime(activity.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
