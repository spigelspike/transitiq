"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView, Variants } from "framer-motion";
import { Search, Package, Truck, LayoutDashboard, Sparkles, BarChart3, Users2, CheckCircle2, AlertCircle, ArrowRight, Star } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import BoxSequence from "@/components/landing/BoxSequence";
import { mockShipments } from "@/lib/mock-data";
import { Shipment } from "@/types/shipment";

// Utility for counter animation
function Counter({ from, to, duration = 2 }: { from: number; to: number; duration?: number }) {
  const [count, setCount] = useState(from);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * (to - from) + from));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{count}</span>;
}

export default function LandingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [searchResult, setSearchResult] = useState<Shipment | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const executeSearch = (query: string) => {
    if (!query.trim()) return;
    setHasSearched(true);
    const normalizedQuery = query.trim().toLowerCase();
    const found = mockShipments.find(s => s.trackingNumber.toLowerCase() === normalizedQuery);
    setSearchResult(found || null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(trackingNumber);
  };

  const statusColors = {
    pending: "bg-slate-100 text-slate-700",
    in_transit: "bg-blue-100 text-blue-700",
    out_for_delivery: "bg-indigo-100 text-indigo-700",
    delivered: "bg-emerald-100 text-emerald-700",
    failed: "bg-red-100 text-red-700",
    returned: "bg-orange-100 text-orange-700",
  };

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-500/20 flex flex-col relative pb-20 md:pb-0">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <main className="flex-grow pt-24 md:pt-0">
        {/* ── SECTION 1: HERO ──────────────────────────────────────── */}
        <section className="relative pt-12 pb-20 md:pt-40 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
          <div className="absolute inset-0 dot-grid z-0"></div>
          {/* Radial fade to solid slate-50 at edges */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(248,250,252,1)_70%)] z-0 pointer-events-none"></div>

          <div className="container relative z-10 mx-auto px-6 max-w-5xl flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-8"
            >
              <span className="text-sm"></span> Now supporting BlueDart
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="mb-6 flex justify-center"
            >
              <img src="/logo.png" alt="TransitIQ Logo" className="h-20 md:h-28 w-auto object-contain" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 font-medium"
            >
              TransitIQ gives logistics teams real-time visibility across every carrier, shipment, and delivery — in one intelligent dashboard.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
            >
              <Link href="/sign-up" className="w-full sm:w-auto flex items-center justify-center text-[15px] font-bold text-white px-8 py-3.5 rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:-translate-y-1"
                style={{ background: "linear-gradient(135deg, #4F46E5, #6366F1)" }}
              >
                Start for free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto flex items-center justify-center text-[15px] font-bold text-slate-700 bg-white border border-slate-200 px-8 py-3.5 rounded-2xl shadow-sm hover:bg-slate-50 hover:-translate-y-1 transition-all">
                See live demo
              </Link>
            </motion.div>

            {/* Tracking Search Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="mt-16 w-full max-w-xl"
            >
              <form onSubmit={handleSearch} className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter any tracking number..."
                  className="w-full h-14 pl-12 pr-32 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                />
                <button type="submit" className="absolute right-2 h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors">
                  Track
                </button>
              </form>

              {hasSearched && (
                <div className="mt-4 text-left">
                  {searchResult ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xl shadow-slate-200/50">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-mono text-lg font-bold text-slate-900 tracking-tight">{searchResult.trackingNumber}</span>
                        <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-md ${statusColors[searchResult.status]}`}>
                          {searchResult.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 font-medium mb-4">
                        {searchResult.carrier.name} · To {searchResult.recipient}
                      </p>
                      <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: searchResult.status === "delivered" ? "100%" : "60%" }}></div>
                      </div>
                      <p className="text-xs font-bold text-slate-500">
                        Est. delivery: {new Date(searchResult.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-red-500 text-sm font-bold bg-red-50 py-2 px-4 rounded-lg border border-red-100 text-center">
                      No shipment found for this tracking number.
                    </p>
                  )}
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-400">
                <span>Try:</span>
                {mockShipments.slice(0, 3).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setTrackingNumber(s.trackingNumber);
                      executeSearch(s.trackingNumber);
                    }}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                  >
                    {s.trackingNumber}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Floating Logos (Mobile & Desktop) */}
          <div className="absolute inset-0 pointer-events-none z-0 lg:z-10 max-w-[90rem] mx-auto overflow-hidden lg:overflow-visible opacity-40 lg:opacity-100">
            {[
              { src: "/logos/fedex.svg", top: "45%", left: "12%", delay: 0, duration: 5, rotate: -5, w: "w-28" },
              { src: "/logos/ups.svg", top: "45%", right: "18%", delay: 1, duration: 6, rotate: 5, w: "w-16" },
              { src: "/logos/dhl.svg", top: "65%", left: "18%", delay: 2, duration: 5.5, rotate: -2, w: "w-32" },
              { src: "/logos/armex.svg", top: "28%", right: "22%", delay: 0.5, duration: 6.5, rotate: 3, w: "w-28" },
              { src: "/logos/bluedart.png", top: "20%", left: "15%", delay: 1.5, duration: 4.8, rotate: -4, w: "w-36" },
            ].map((logo, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: logo.duration, repeat: Infinity, ease: "easeInOut", delay: logo.delay }}
                className={`absolute flex items-center justify-center ${logo.w}`}
                style={{ top: logo.top, left: logo.left, right: logo.right, rotate: `${logo.rotate}deg` }}
              >
                <img src={logo.src} alt="Carrier Logo" className="w-full h-auto object-contain mix-blend-multiply opacity-80" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── BOX SEQUENCE ANIMATION ──────────────────────────────────── */}
        <BoxSequence />

        {/* ── SECTION 2: CARRIERS ──────────────────────────────────────── */}
        <section id="carriers" className="py-10 bg-white border-y border-slate-100">
          <div className="container mx-auto px-6 max-w-6xl text-center">
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-6">Trusted across all major carriers</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-xl md:text-2xl font-black text-[#4D148C]">FedEx</span>
              <span className="text-xl md:text-2xl font-black text-[#351C15]">UPS</span>
              <span className="text-xl md:text-2xl font-black text-[#D40511]">DHL</span>
              <span className="text-xl md:text-2xl font-black text-[#004B87]">USPS</span>
              <span className="text-xl md:text-2xl font-black text-[#0033A0]">BlueDart</span>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: STATS ──────────────────────────────────────── */}
        <section id="stats" className="py-24 bg-slate-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: 99.9, label: "Uptime guaranteed", suffix: "%", color: "text-indigo-600" },
                { value: 50, label: "Shipments tracked", suffix: "M+", color: "text-violet-600" },
                { value: 150, label: "Countries covered", suffix: "+", color: "text-cyan-600" },
                { value: 30, label: "Average refresh rate", prefix: "< ", suffix: "s", color: "text-indigo-600" }
              ].map((stat, i) => (
                <motion.div
                  key={i} variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                  className="bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-lg shadow-slate-200/30"
                >
                  <h3 className={`text-3xl md:text-5xl font-black tracking-tight mb-2 ${stat.color}`}>
                    {stat.prefix}<Counter from={0} to={stat.value} duration={2} />{stat.suffix}
                  </h3>
                  <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 4: FEATURES ──────────────────────────────────────── */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Built for logistics teams that move fast</h2>
              <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">Everything you need to monitor, analyze, and optimize your delivery network.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: <Truck />, title: "Real-time tracking", desc: "Status updates every 30 seconds from all carrier APIs.", color: "text-indigo-600 bg-indigo-50" },
                { icon: <Package />, title: "Multi-carrier unified", desc: "One dashboard for FedEx, UPS, DHL, USPS, and BlueDart.", color: "text-violet-600 bg-violet-50" },
                { icon: <LayoutDashboard />, title: "Intelligent dashboard", desc: "Search, filter, sort — with URL-based state so views are shareable.", color: "text-cyan-600 bg-cyan-50" },
                { icon: <Sparkles />, title: "AI delivery insights", desc: "Predictive alerts when a shipment may miss its delivery window.", color: "text-indigo-600 bg-indigo-50" },
                { icon: <BarChart3 />, title: "Carrier analytics", desc: "Compare carrier performance, SLAs, and on-time rates.", color: "text-violet-600 bg-violet-50" },
                { icon: <Users2 />, title: "Team workspace", desc: "Role-based access so every team member sees what matters.", color: "text-cyan-600 bg-cyan-50" }
              ].map((f, i) => (
                <motion.div
                  key={i} variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                  className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${f.color}`}>
                    {React.cloneElement(f.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h4>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 5: CUSTOMER REVIEWS ────────────────────────────── */}
        <section className="py-24 bg-slate-50 overflow-hidden relative">
          <div className="container relative z-10 mx-auto px-6 max-w-6xl text-center">
            <motion.h2 variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Loved by logistics teams</motion.h2>
            <motion.p variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-lg text-slate-500 font-medium mb-16 max-w-2xl mx-auto">See how top companies are using TransitIQ to streamline their supply chain and improve delivery times.</motion.p>

            <div className="relative w-full overflow-hidden flex py-10 mt-8">
              {/* Fade Gradients for Marquee edges */}
              <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

              <motion.div
                className="flex gap-6 pr-6 w-max text-left"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ ease: "linear", duration: 45, repeat: Infinity }}
              >
                {[
                  { name: "Sarah Jenkins", role: "Logistics Director, TechFlow", text: "TransitIQ completely changed how we manage our shipments. We used to check 5 different portals daily. Now it's all in one beautiful dashboard." },
                  { name: "David Chen", role: "Operations Manager, Lumina", text: "The predictive alerts have saved us thousands in potential refund claims. It flags delayed shipments before the customer even notices." },
                  { name: "Elena Rodriguez", role: "Supply Chain Lead, AutoParts Co", text: "Finally, a tracking tool that doesn't look like it was built in 2005. The UI is stunning and the carrier integrations are flawless." },
                  { name: "Michael Chang", role: "E-commerce Founder, Nova", text: "Integration took exactly 5 minutes. The API is robust and the webhook events trigger instantly. Best decision we've made this year." },
                  { name: "Rachel Adams", role: "Fulfillment Specialist, Zenith", text: "The cross-carrier unified view is a total game-changer for our team. I can search across FedEx and DHL simultaneously without thinking." },
                  { name: "Tom Hollander", role: "Warehouse Manager, Prime", text: "No more juggling 6 different tracking portals. Flawless execution. The visualization helps us spot delays instantly." },
                  // Duplicated for seamless loop
                  { name: "Sarah Jenkins", role: "Logistics Director, TechFlow", text: "TransitIQ completely changed how we manage our shipments. We used to check 5 different portals daily. Now it's all in one beautiful dashboard." },
                  { name: "David Chen", role: "Operations Manager, Lumina", text: "The predictive alerts have saved us thousands in potential refund claims. It flags delayed shipments before the customer even notices." },
                  { name: "Elena Rodriguez", role: "Supply Chain Lead, AutoParts Co", text: "Finally, a tracking tool that doesn't look like it was built in 2005. The UI is stunning and the carrier integrations are flawless." },
                  { name: "Michael Chang", role: "E-commerce Founder, Nova", text: "Integration took exactly 5 minutes. The API is robust and the webhook events trigger instantly. Best decision we've made this year." },
                  { name: "Rachel Adams", role: "Fulfillment Specialist, Zenith", text: "The cross-carrier unified view is a total game-changer for our team. I can search across FedEx and DHL simultaneously without thinking." },
                  { name: "Tom Hollander", role: "Warehouse Manager, Prime", text: "No more juggling 6 different tracking portals. Flawless execution. The visualization helps us spot delays instantly." },
                ].map((review, i) => (
                  <div
                    key={i}
                    className="w-[350px] shrink-0 bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col group cursor-default"
                  >
                    <div className="flex items-center gap-1 mb-6 group-hover:scale-105 origin-left transition-transform">
                      {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed mb-8 flex-1">"{review.text}"</p>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg shrink-0">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{review.name}</p>
                        <p className="text-sm font-medium text-slate-500">{review.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: CTA ────────────────────────────────────────────── */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="container relative z-10 mx-auto px-6 max-w-5xl">
            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-indigo-900 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-900/30"
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(79,70,229,0.8),rgba(139,92,246,0.8))] z-0"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0 mix-blend-overlay"></div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Ready to unify your logistics operations?</h2>
                <p className="text-lg md:text-xl text-indigo-100 font-medium mb-10 max-w-2xl mx-auto">Set up in minutes. No integration required. Start tracking immediately.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                  <Link href="/sign-up" className="w-full sm:w-auto text-[15px] font-bold text-indigo-900 bg-white px-8 py-4 rounded-2xl shadow-xl hover:bg-slate-50 hover:scale-105 transition-all">
                    Get started free
                  </Link>
                  <Link href="#" className="w-full sm:w-auto text-[15px] font-bold text-white bg-indigo-950/30 border border-white/20 px-8 py-4 rounded-2xl hover:bg-white/10 transition-all">
                    Schedule a demo
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── SECTION 7: FOOTER ────────────────────────────────────────── */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 pb-24 md:pb-12">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="TransitIQ Logo" className="h-6 w-auto" />
          </div>
          <p className="text-sm font-semibold text-slate-400">
            © {new Date().getFullYear()} TransitIQ. All rights reserved.
          </p>
          <p className="text-sm font-semibold text-slate-400">
            Built with Next.js & Tailwind
          </p>
        </div>
      </footer>
    </div>
  );
}
