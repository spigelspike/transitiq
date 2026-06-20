import React from "react";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col items-center justify-center h-[70vh] text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <BarChart3 className="w-8 h-8 text-blue-500" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Analytics Dashboard</h1>
      <p className="text-slate-500 max-w-md">Detailed analytics and reporting features are coming soon in the next update.</p>
    </div>
  );
}
