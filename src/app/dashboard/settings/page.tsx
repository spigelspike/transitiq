import React from "react";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col items-center justify-center h-[70vh] text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Settings className="w-8 h-8 text-slate-500" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Platform Settings</h1>
      <p className="text-slate-500 max-w-md">Configuration options and account settings will be available here shortly.</p>
    </div>
  );
}
