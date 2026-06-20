import React from "react";
import ShipmentHealth from "@/components/dashboard/ShipmentHealth";
import AIInsightsCard from "@/components/dashboard/AIInsightsCard";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import ShipmentsTable from "@/components/dashboard/ShipmentsTable";
import GlobalSearch from "@/components/dashboard/GlobalSearch";
import { Search } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight leading-tight">Good morning, Alex</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Here's what's happening with your shipments today.
          </p>
        </div>
        
        {/* Global Search Input */}
        <GlobalSearch />
      </div>

      {/* Row 1: Shipment Health */}
      <div id="tracking">
        <ShipmentHealth />
      </div>

      {/* Row 2: Insights & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2" id="alerts">
          <AIInsightsCard />
        </div>
        <div className="lg:col-span-1" id="carriers">
          <RecentActivityFeed />
        </div>
      </div>

      {/* Row 3: Shipments */}
      <div id="shipments">
        <ShipmentsTable />
      </div>
    </div>
  );
}
