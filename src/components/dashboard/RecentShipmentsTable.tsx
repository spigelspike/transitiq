"use client";

import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Shipment } from "@/types/shipment";

export default function RecentShipmentsTable() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await fetch("/api/shipments?limit=5");
        const json = await res.json();
        if (json.data) {
          setShipments(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch shipments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShipments();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered": return "bg-emerald-50 text-emerald-700";
      case "in_transit": return "bg-blue-50 text-blue-700";
      case "out_for_delivery": return "bg-purple-50 text-purple-700";
      case "returned": return "bg-orange-50 text-orange-700";
      case "failed": return "bg-red-50 text-red-700";
      case "delayed": return "bg-orange-50 text-orange-700"; // Mocking delayed
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const getCarrierLogo = (carrier: string) => {
    // Since we don't have actual SVG files yet, use colored text as a placeholder
    // The user mentioned they will add the logos later.
    switch (carrier) {
      case "FedEx": return <span className="font-bold text-purple-700 tracking-tight">FedEx</span>;
      case "UPS": return <span className="font-bold text-amber-700 tracking-tight">UPS</span>;
      case "DHL": return <span className="font-black text-red-600 italic tracking-tighter">DHL</span>;
      case "USPS": return <span className="font-bold text-blue-700 tracking-tighter">USPS</span>;
      case "BlueDart": return <span className="font-bold text-cyan-700 tracking-tight">BlueDart</span>;
      default: return <span className="font-bold text-slate-700">{carrier}</span>;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 w-full mt-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm w-full mt-6 flex flex-col">
      <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100">
        <h3 className="font-bold text-slate-900">Recent Shipments</h3>
        <Link href="/dashboard#shipments" className="text-[13px] font-bold text-[#3777fe] hover:text-blue-700 flex items-center group">
          View all shipments <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">Tracking Number</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">Carrier</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">Origin</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">Destination</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">Est. Delivery</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment, i) => (
              <tr key={shipment.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-[13px] font-medium text-slate-900 whitespace-nowrap">
                  {shipment.trackingNumber}
                </td>
                <td className="px-6 py-4 text-[13px] whitespace-nowrap">
                  {getCarrierLogo(typeof shipment.carrier === 'string' ? shipment.carrier : shipment.carrier.name)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${getStatusBadge(shipment.status)}`}>
                    {shipment.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">
                  {shipment.origin.city}, {shipment.origin.state}
                </td>
                <td className="px-6 py-4 text-[13px] text-slate-700 whitespace-nowrap">
                  {shipment.destination.city}, {shipment.destination.state}
                </td>
                <td className="px-6 py-4 text-[13px] text-slate-900 font-medium whitespace-nowrap">
                  {format(new Date(shipment.estimatedDelivery), "MMM dd, yyyy")}
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <button className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
