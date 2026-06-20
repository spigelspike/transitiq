"use client";

import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import dynamic from "next/dynamic";

function StatusChartContent() {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/shipments/stats");
        const json = await res.json();
        const apiData = json.data || json;
        if (apiData && apiData.byStatus) {
          const formattedData = [
            { name: "Delivered", value: apiData.byStatus.delivered, color: "#10B981" },
            { name: "In Transit", value: apiData.byStatus.in_transit, color: "#3B82F6" },
            { name: "Out for Delivery", value: apiData.byStatus.out_for_delivery, color: "#6366F1" },
            { name: "Pending", value: apiData.byStatus.pending, color: "#94A3B8" },
            { name: "Exceptions", value: apiData.byStatus.failed + apiData.byStatus.returned, color: "#EF4444" },
          ].sort((a, b) => b.value - a.value);
          setData(formattedData);
        }
      } catch (error) {
        console.error("Failed to fetch stats for chart", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !data) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col p-5">
        <Skeleton className="h-6 w-32 mb-8" />
        <div className="flex-1 flex flex-col justify-between">
          {["75%", "45%", "85%", "35%", "60%"].map((width, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="h-8 rounded-md" style={{ width }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-[400px] flex flex-col">
      <div className="p-5 border-b border-slate-100">
        <h3 className="font-bold text-slate-900">Shipments by Status</h3>
      </div>
      
      <div className="flex-1 p-5 pb-8 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#334155", fontSize: 13, fontWeight: 600 }} />
            <Tooltip 
              cursor={{ fill: "#F8FAFC" }}
              contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(StatusChartContent), { ssr: false });
