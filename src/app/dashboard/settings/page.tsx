"use client";

import React, { useState } from "react";
import { User, Bell, Shield, Palette, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [profileData, setProfileData] = useState({
    name: "Alex Morgan",
    email: "alex@transitiq.com",
    role: "Admin",
    company: "TransitIQ Corp",
    timezone: "Asia/Kolkata",
  });
  const [notifications, setNotifications] = useState({
    emailDelivery: true,
    emailFailed: true,
    emailWeekly: false,
    pushDelivery: true,
    pushFailed: true,
    pushDelayed: true,
  });

  const handleSave = () => {
    toast.success("Settings saved successfully!", { icon: <CheckCircle2 className="w-4 h-4" /> });
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8 pb-20">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight leading-tight">Settings</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Manage your account preferences and platform configuration.
        </p>
      </div>

      {/* ── PROFILE ──────────────────────────────────────────── */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Profile Information</h2>
            <p className="text-xs text-slate-500">Update your personal details and company info.</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-bold text-indigo-700">
              AM
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{profileData.name}</p>
              <p className="text-xs text-slate-500">{profileData.role} · {profileData.company}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Company</label>
              <input
                type="text"
                value={profileData.company}
                onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Timezone</label>
              <select
                value={profileData.timezone}
                onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-indigo-500/20"
          >
            <Save className="w-4 h-4" />
            Save Profile
          </button>
        </div>
      </section>

      {/* ── NOTIFICATIONS ────────────────────────────────────── */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Bell className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Notifications</h2>
            <p className="text-xs text-slate-500">Choose how you want to be notified about shipment updates.</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Email */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-3">Email Notifications</h4>
            <div className="space-y-0.5">
              {[
                { key: "emailDelivery", label: "Delivery confirmations", desc: "Get notified when a package is delivered" },
                { key: "emailFailed", label: "Failed deliveries", desc: "Immediate alerts for failed delivery attempts" },
                { key: "emailWeekly", label: "Weekly digest", desc: "Summary of all shipment activity each week" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      notifications[item.key as keyof typeof notifications] ? "bg-indigo-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Push */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-3">Push Notifications</h4>
            <div className="space-y-0.5">
              {[
                { key: "pushDelivery", label: "Delivery updates", desc: "Real-time delivery status changes" },
                { key: "pushFailed", label: "Failed attempts", desc: "Instant push for failed deliveries" },
                { key: "pushDelayed", label: "Delay warnings", desc: "Alerts when shipments are running late" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      notifications[item.key as keyof typeof notifications] ? "bg-indigo-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-indigo-500/20"
          >
            <Save className="w-4 h-4" />
            Save Preferences
          </button>
        </div>
      </section>

      {/* ── APPEARANCE ───────────────────────────────────────── */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
            <Palette className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Appearance</h2>
            <p className="text-xs text-slate-500">Customize how the dashboard looks and feels.</p>
          </div>
        </div>

        <div className="p-6 space-y-6">


          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-3">Dashboard Density</h4>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl border-2 border-indigo-500 bg-indigo-50 text-sm font-bold text-indigo-700">
                Comfortable
              </button>
              <button className="px-4 py-2 rounded-xl border-2 border-slate-200 bg-white text-sm font-bold text-slate-600 hover:border-slate-300">
                Compact
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-indigo-500/20"
          >
            <Save className="w-4 h-4" />
            Save Appearance
          </button>
        </div>
      </section>

      {/* ── SECURITY ─────────────────────────────────────────── */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Security</h2>
            <p className="text-xs text-slate-500">Manage your password and account security settings.</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500">Add an extra layer of security to your account</p>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">Not Enabled</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-indigo-500/20"
          >
            <Shield className="w-4 h-4" />
            Update Security
          </button>
        </div>
      </section>
    </div>
  );
}
