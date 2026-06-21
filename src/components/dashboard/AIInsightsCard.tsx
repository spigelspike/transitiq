import React from "react";
import { TrendingUp, AlertTriangle, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AIInsightsCard() {
  const insights = [
    {
      icon: TrendingUp,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      text: "DHL Express is 14% faster than average this week",
      linkText: "View performance",
      href: "/dashboard/analytics",
    },
    {
      icon: AlertTriangle,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      text: "3 shipments may face delays due to weather conditions",
      linkText: "View affected",
      href: "/dashboard#shipments",
    },
    {
      icon: Calendar,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      text: "Tuesday shows highest volume this week",
      linkText: "Plan pickups",
      href: "/dashboard/analytics",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 md:p-6 h-full flex flex-col">
      <h3 className="font-bold text-slate-900 mb-4 md:mb-6">TransitIQ Intelligence</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 flex-1">
        {insights.map((insight, i) => (
          <div key={i} className="flex flex-col justify-between border border-slate-100 rounded-xl p-5 hover:border-slate-200 transition-colors">
            <div className="flex gap-4 items-start mb-6">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${insight.iconBg} ${insight.iconColor}`}>
                <insight.icon className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <p className="text-[13px] font-semibold text-slate-700 leading-snug pt-1">
                {insight.text}
              </p>
            </div>
            
            <Link 
              href={insight.href}
              className="text-[13px] font-bold text-[#3777fe] hover:text-blue-700 flex items-center gap-1 group w-max"
            >
              {insight.linkText}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
