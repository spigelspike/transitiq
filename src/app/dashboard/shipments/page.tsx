"use client";

import React from "react";
import ShipmentsTable from "@/components/dashboard/ShipmentsTable";

export default function ShipmentsPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight leading-tight">Shipments</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Manage and track all your shipments in one place.
        </p>
      </div>
      <ShipmentsTable />
    </div>
  );
}
