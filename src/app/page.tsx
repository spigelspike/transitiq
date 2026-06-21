"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView, Variants } from "framer-motion";
import { Search, Package, Truck, LayoutDashboard, Sparkles, BarChart3, Users2, CheckCircle2, AlertCircle, ArrowRight, Star, MapPin, Calendar, Navigation, Copy, ShieldCheck, Bell, Check, CalendarDays } from "lucide-react";
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

const getCarrierLogo = (name: string) => {
  const map: Record<string, string> = {
    'UPS': '/logos/ups.svg',
    'FedEx': '/logos/fedex.svg',
    'DHL': '/logos/dhl.svg',
    'USPS': '/logos/usps.svg',
    'BlueDart': '/logos/bluedart.png'
  };
  return map[name] || '/box.png';
};

export default function LandingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [searchResult, setSearchResult] = useState<Shipment | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [billingCurrency, setBillingCurrency] = useState<"USD" | "INR">("USD");

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

            <div className="mb-10 flex items-center justify-center gap-3 md:gap-5">
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -15 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              >
                <img src="/box.png" alt="TransitIQ Box Logo" className="h-16 md:h-24 w-auto object-contain" />
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 1 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.4,
                    }
                  }
                }}
                className="flex text-6xl md:text-[5.5rem] tracking-tight text-slate-900"
                style={{ fontFamily: '"Futura", "Futura Medium", sans-serif', fontWeight: 500 }}
              >
                {"TransitIQ".split("").map((char, index) => {
                  const isIQ = index >= 7; // 'I' and 'Q'
                  return (
                    <motion.span
                      key={index}
                      variants={{
                        hidden: { opacity: 0, x: -10, filter: "blur(4px)" },
                        visible: { opacity: 1, x: 0, filter: "blur(0px)" }
                      }}
                      transition={{ duration: 0.3 }}
                      className={isIQ ? "text-[#3777fe]" : ""}
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </motion.div>
            </div>

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
              <Link href="/sign-in" className="w-full sm:w-auto flex items-center justify-center text-[15px] font-bold text-slate-700 bg-white border border-slate-200 px-8 py-3.5 rounded-2xl shadow-sm hover:bg-slate-50 hover:-translate-y-1 transition-all">
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
                    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-slate-200/50 w-full max-w-4xl mx-auto mt-6 text-left relative z-20">

                      {/* HEADER */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center justify-center p-2.5 shrink-0">
                            <img src={getCarrierLogo(searchResult.carrier.name)} className="max-w-full max-h-full object-contain" alt={searchResult.carrier.name} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-xl font-bold text-slate-900 tracking-tight">{searchResult.carrier.name} Ground</h3>
                              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md ${statusColors[searchResult.status]}`}>
                                {searchResult.status.replace(/_/g, " ")}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">To {searchResult.recipient}</p>
                          </div>
                        </div>
                        <div className="text-left md:text-right">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center md:justify-end gap-1">Tracking ID</div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xl font-black text-slate-900 tracking-tight">{searchResult.trackingNumber}</span>
                            <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1"><Copy className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>

                      {/* MAIN STATUS BLOCK */}
                      <div className="border border-slate-100 rounded-[1.5rem] p-6 md:p-8 mb-5 shadow-sm bg-white">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                              <Truck className="w-8 h-8 text-indigo-600" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-indigo-600 capitalize mb-1 tracking-tight">{searchResult.status.replace(/_/g, " ")}</h2>
                              <p className="text-slate-500 font-medium text-sm">Your package is on the way to <span className="text-indigo-600 font-bold">{searchResult.destination.city}, {searchResult.destination.state}</span></p>
                            </div>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 min-w-[150px]">
                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">ETA</div>
                            <div className="flex items-center gap-2 font-black text-indigo-600 text-lg mb-1">
                              <CalendarDays className="w-5 h-5" />
                              {new Date(searchResult.estimatedDelivery).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium">2 days remaining</div>
                          </div>
                        </div>

                        {/* STEPPER */}
                        <div className="relative pt-4 pb-2 px-2 md:px-8 max-w-3xl mx-auto hidden sm:block">
                          {/* Line background */}
                          <div className="absolute top-[26px] left-[10%] right-[10%] h-[3px] bg-slate-100 z-0"></div>
                          {/* Line foreground (dynamic width) */}
                          <div className="absolute top-[26px] left-[10%] h-[3px] bg-indigo-600 z-0 transition-all duration-1000" style={{ width: searchResult.status === 'delivered' ? '80%' : searchResult.status === 'out_for_delivery' ? '60%' : searchResult.status === 'in_transit' ? '40%' : searchResult.status === 'pending' ? '0%' : '100%' }}></div>

                          <div className="flex justify-between relative z-10">
                            {[
                              { label: "Label Created", status: "completed", date: "Jun 24" },
                              { label: "Dispatched", status: searchResult.status !== 'pending' ? "completed" : "upcoming", date: "Jun 25" },
                              { label: "In Transit", status: searchResult.status === 'in_transit' ? 'current' : (searchResult.status === 'out_for_delivery' || searchResult.status === 'delivered' ? 'completed' : 'upcoming'), date: "Jun 26" },
                              { label: "Out for Delivery", status: searchResult.status === 'out_for_delivery' ? 'current' : (searchResult.status === 'delivered' ? 'completed' : 'upcoming'), date: "Jun 29" },
                              { label: "Delivered", status: searchResult.status === 'delivered' ? 'current' : 'upcoming', date: "Jun 29" },
                            ].map((step, idx) => (
                              <div key={idx} className="flex flex-col items-center w-24">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-3 ring-[6px] ring-white transition-colors duration-500 ${step.status === 'completed' ? 'bg-indigo-600 text-white' : step.status === 'current' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-300 border-[3px] border-slate-200'}`}>
                                  {step.status === 'completed' && <Check className="w-4 h-4 stroke-[3]" />}
                                  {step.status === 'current' && <Truck className="w-3.5 h-3.5" />}
                                </div>
                                <div className={`text-[11px] font-bold text-center mb-1 transition-colors duration-500 ${step.status === 'current' ? 'text-indigo-600' : step.status === 'completed' ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</div>
                                <div className="text-[10px] text-slate-400 font-medium">{step.date}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>


                      {/* FOOTER ALERT */}
                      <div className="bg-slate-50/80 border border-slate-100 rounded-[1.25rem] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                        <div className="flex items-start md:items-center gap-4">
                          <div className="text-blue-600 bg-blue-100 p-2 rounded-xl shrink-0"><ShieldCheck className="w-5 h-5" /></div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm mb-0.5 tracking-tight">Shipment is safe</div>
                            <div className="text-slate-500 text-xs font-medium">We'll notify you when your package is out for delivery.</div>
                          </div>
                        </div>
                        <button className="flex items-center gap-2 bg-white border border-slate-200 text-indigo-600 font-bold text-xs px-5 py-3 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors shrink-0 shadow-sm">
                          <Bell className="w-4 h-4" /> Get Notifications
                        </button>
                      </div>

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

          {/* Floating Logos (Desktop Only) */}
          <div className="hidden md:block absolute inset-0 pointer-events-none z-0 lg:z-10 max-w-[90rem] mx-auto overflow-hidden lg:overflow-visible opacity-100">
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
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-8">Trusted across all major carriers</p>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
              <img src="/logos/fedex.svg" alt="FedEx" className="h-7 md:h-9 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" />
              <img src="/logos/ups.svg" alt="UPS" className="h-10 md:h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" />
              <img src="/logos/dhl.svg" alt="DHL" className="h-6 md:h-8 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" />
              <img src="/logos/armex.svg" alt="Aramex" className="h-7 md:h-9 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" />
              <img src="/logos/bluedart.png" alt="BlueDart" className="h-6 md:h-8 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" />
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

        {/* ── SECTION 4: FEATURES (BENTO UI) ─────────────────────────────────── */}
        <section id="features" className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-6 max-w-[80rem]">
            {/* Header */}
            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
              <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-wider mb-6">
                <Users2 className="w-3.5 h-3.5" /> Built for logistics teams
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Built for logistics teams that move fast</h2>
              <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">Everything you need to monitor, analyze, and optimize your delivery network.</p>
            </motion.div>

            {/* Bento Grid */}
            <div className="flex flex-col gap-6">

              {/* Row 1: Real-Time Tracking (Spans Full Width) */}
              <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                className="bg-white border border-slate-200/80 shadow-xl shadow-slate-200/40 rounded-[2rem] p-8 md:p-12 flex flex-col lg:flex-row gap-12 overflow-hidden relative"
              >
                {/* Left side text */}
                <div className="lg:w-1/3 flex flex-col justify-center z-10">
                  <div className="text-[11px] font-bold text-indigo-600 tracking-widest uppercase mb-6 flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Real-time tracking
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">Know every shipment at every moment</h3>
                  <p className="text-slate-500 mb-8 text-base font-medium leading-relaxed">Get live status updates every 30 seconds from all your carriers in one place.</p>
                  <ul className="space-y-4 mb-10">
                    <li className="flex items-center gap-3 text-[15px] text-slate-700 font-bold">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500" /> 30s auto-updates
                    </li>
                    <li className="flex items-center gap-3 text-[15px] text-slate-700 font-bold">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500" /> Exception & delay alerts
                    </li>
                    <li className="flex items-center gap-3 text-[15px] text-slate-700 font-bold">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500" /> Delivery timeline view
                    </li>
                  </ul>
                  <Link href="/sign-in" className="inline-flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3 px-6 rounded-xl transition-colors self-start">
                    Explore tracking <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Right side mock UI (Shipments table) */}
                <div className="lg:w-2/3 bg-white border border-slate-100 rounded-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col text-sm z-10">
                  <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50/50 gap-4">
                    <div className="font-bold text-slate-900">Shipments</div>
                    <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                      <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-400 text-xs flex items-center gap-2 whitespace-nowrap min-w-[200px]"><Search className="w-3 h-3" /> Search by tracking ID...</div>
                      <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 text-xs font-medium whitespace-nowrap">All Carriers</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-100">
                    <div className="p-4 border-r border-b sm:border-b-0 border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Total Shipments</div>
                      <div className="text-xl font-black text-slate-900 flex items-center gap-2">24,532 <span className="text-[10px] text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded hidden xl:inline-block">↑ 12.5%</span></div>
                    </div>
                    <div className="p-4 border-r sm:border-r border-b sm:border-b-0 border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">In Transit</div>
                      <div className="text-xl font-black text-slate-900 flex items-center gap-2">18,760 <span className="text-[10px] text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded hidden xl:inline-block">↑ 8.2%</span></div>
                    </div>
                    <div className="p-4 border-r border-slate-100">
                      <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Delivered</div>
                      <div className="text-xl font-black text-slate-900 flex items-center gap-2">5,312 <span className="text-[10px] text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded hidden xl:inline-block">↑ 15.1%</span></div>
                    </div>
                    <div className="p-4">
                      <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Exceptions</div>
                      <div className="text-xl font-black text-slate-900 flex items-center gap-2">460 <span className="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded hidden xl:inline-block">↑ 6.3%</span></div>
                    </div>
                  </div>
                  <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600 min-w-[600px]">
                      <thead className="bg-slate-50/50 text-slate-400 font-semibold border-b border-slate-100">
                        <tr>
                          <th className="px-5 py-3 font-medium">Tracking ID</th>
                          <th className="px-5 py-3 font-medium">Carrier</th>
                          <th className="px-5 py-3 font-medium">Status</th>
                          <th className="px-5 py-3 font-medium">Delivery ETA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3 font-mono">TRK784068843408</td>
                          <td className="px-5 py-3"><img src="/logos/fedex.svg" className="h-3" alt="FedEx" /></td>
                          <td className="px-5 py-3"><span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase">In Transit</span></td>
                          <td className="px-5 py-3 text-slate-900">May 22, 09:30 AM</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3 font-mono">1Z999AA10123456784</td>
                          <td className="px-5 py-3"><img src="/logos/ups.svg" className="h-4" alt="UPS" /></td>
                          <td className="px-5 py-3"><span className="text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase">Out for Delivery</span></td>
                          <td className="px-5 py-3 text-slate-900">May 21, 02:15 PM</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3 font-mono">JD014600012345678901</td>
                          <td className="px-5 py-3"><img src="/logos/dhl.svg" className="h-2.5" alt="DHL" /></td>
                          <td className="px-5 py-3"><span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase">In Transit</span></td>
                          <td className="px-5 py-3 text-slate-900">May 23, 11:20 AM</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3 font-mono">9400111206212345678901</td>
                          <td className="px-5 py-3"><img src="/logos/usps.svg" className="h-2.5" alt="USPS" /></td>
                          <td className="px-5 py-3"><span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase">Delivered</span></td>
                          <td className="px-5 py-3 text-slate-900">May 20, 12:45 PM</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>

              {/* Row 2: 4 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Card 1: Carrier Analytics */}
                <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="bg-white border border-slate-200/80 shadow-xl shadow-slate-200/40 rounded-[2rem] p-8 flex flex-col"
                >
                  <div className="text-[11px] font-bold text-indigo-600 tracking-widest uppercase mb-5 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> Carrier Analytics
                  </div>
                  <h4 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight">Compare.<br />Analyze.<br />Optimize.</h4>
                  <p className="text-slate-500 mb-8 text-sm font-medium">Track SLA performance, on-time delivery, and cost efficiency across all your carriers.</p>

                  <div className="mt-auto bg-slate-50 rounded-xl p-4 border border-slate-100 relative h-36 overflow-hidden flex flex-col justify-end group">
                    <div className="absolute top-4 left-4">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">On-time Delivery</div>
                      <div className="text-xl font-black text-slate-900 flex items-center gap-1">92.6% <span className="text-[10px] text-emerald-500 bg-emerald-50 px-1 py-0.5 rounded">↑ 8.7%</span></div>
                    </div>
                    <svg className="w-full h-16 stroke-indigo-500 stroke-2 fill-none group-hover:scale-[1.02] transition-transform duration-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <path d="M0,28 C20,25 30,28 50,15 C70,2 80,10 100,5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="25" cy="26" r="1.5" className="fill-indigo-500" />
                      <circle cx="50" cy="15" r="1.5" className="fill-indigo-500" />
                      <circle cx="75" cy="8" r="1.5" className="fill-indigo-500" />
                      <circle cx="100" cy="5" r="1.5" className="fill-indigo-500" />
                    </svg>
                  </div>
                </motion.div>

                {/* Card 2: AI Insights */}
                <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="bg-white border border-slate-200/80 shadow-xl shadow-slate-200/40 rounded-[2rem] p-8 flex flex-col"
                >
                  <div className="text-[11px] font-bold text-indigo-600 tracking-widest uppercase mb-5 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> AI Insights
                  </div>
                  <h4 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight">AI that spots issues early</h4>
                  <p className="text-slate-500 mb-8 text-sm font-medium">Predict delays, flag exceptions, and get actionable recommendations with AI.</p>

                  <div className="mt-auto bg-white border border-red-100 shadow-[0_4px_20px_-4px_rgba(239,68,68,0.1)] rounded-xl p-5 relative">
                    <div className="flex items-start gap-3">
                      <div className="bg-red-50 p-2 rounded-lg text-red-500 shrink-0"><AlertCircle className="w-4 h-4" /></div>
                      <div>
                        <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1">High risk of delay</div>
                        <div className="font-mono text-[11px] font-bold text-slate-900 mb-1.5">TRK784068843408</div>
                        <p className="text-[11px] text-slate-500 leading-tight font-medium">Delivery delayed by 1-2 days due to weather conditions.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Card 3: Team Workspace */}
                <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="bg-white border border-slate-200/80 shadow-xl shadow-slate-200/40 rounded-[2rem] p-8 flex flex-col"
                >
                  <div className="text-[11px] font-bold text-indigo-600 tracking-widest uppercase mb-5 flex items-center gap-2">
                    <Users2 className="w-4 h-4" /> Team Workspace
                  </div>
                  <h4 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight">Collaborate with your team</h4>
                  <p className="text-slate-500 mb-8 text-sm font-medium">Role-based access, shipment notes, and real-time updates keep everyone aligned.</p>

                  <div className="mt-auto bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col gap-4">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recent Activity</div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-[9px] flex items-center justify-center font-bold text-blue-700 shrink-0">SJ</div>
                      <div className="text-[11px] font-semibold text-slate-700 truncate">Sarah updated a shipment</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-[9px] flex items-center justify-center font-bold text-emerald-700 shrink-0">DC</div>
                      <div className="text-[11px] font-semibold text-slate-700 truncate">David added a note</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-violet-100 text-[9px] flex items-center justify-center font-bold text-violet-700 shrink-0">ER</div>
                      <div className="text-[11px] font-semibold text-slate-700 truncate">Elena marked as delivered</div>
                    </div>
                  </div>
                </motion.div>

                {/* Card 4: Multi-Carrier Unified */}
                <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="bg-white border border-slate-200/80 shadow-xl shadow-slate-200/40 rounded-[2rem] p-8 flex flex-col"
                >
                  <div className="text-[11px] font-bold text-indigo-600 tracking-widest uppercase mb-5 flex items-center gap-2">
                    <Package className="w-4 h-4" /> Multi-Carrier Unified
                  </div>
                  <h4 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight">One API.<br />All major carriers.</h4>
                  <p className="text-slate-500 mb-8 text-sm font-medium">Connect with FedEx, UPS, DHL, USPS, BlueDart and more seamlessly.</p>

                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl h-14 flex items-center justify-center p-3 hover:bg-white hover:border-slate-200 transition-colors"><img src="/logos/fedex.svg" className="h-3.5" alt="FedEx" /></div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl h-14 flex items-center justify-center p-3 hover:bg-white hover:border-slate-200 transition-colors"><img src="/logos/ups.svg" className="h-5" alt="UPS" /></div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl h-14 flex items-center justify-center p-3 hover:bg-white hover:border-slate-200 transition-colors"><img src="/logos/dhl.svg" className="h-3" alt="DHL" /></div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl h-14 flex items-center justify-center p-3 hover:bg-white hover:border-slate-200 transition-colors text-[10px] font-bold text-slate-500 uppercase">+ More</div>
                  </div>
                </motion.div>

              </div>

              {/* Trust Badge Footer */}
              <div className="text-center mt-10 flex flex-wrap items-center justify-center gap-3 text-[13px] font-bold text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-slate-300" /> Enterprise-grade security <span className="hidden sm:inline">·</span> 99.9% uptime <span className="hidden sm:inline">·</span> Scalable for any volume
              </div>

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

        {/* ── SECTION 6: PRICING ────────────────────────────────────────── */}
        <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-[80rem]">
            <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Simple, transparent pricing</h2>
              <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto mb-10">Choose the perfect plan for your logistics volume. No hidden fees.</p>

              {/* Currency Toggle */}
              <div className="inline-flex items-center p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm relative z-20">
                <button
                  onClick={() => setBillingCurrency("USD")}
                  className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${billingCurrency === "USD" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700"}`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setBillingCurrency("INR")}
                  className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${billingCurrency === "INR" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700"}`}
                >
                  INR (₹)
                </button>
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
              {[
                {
                  name: "Starter",
                  desc: "Perfect for small e-commerce stores just starting out.",
                  priceUSD: 0, priceINR: 0,
                  features: ["Up to 500 shipments/mo", "Basic tracking page", "Email support", "Standard integrations"],
                  popular: false
                },
                {
                  name: "Pro",
                  desc: "For growing logistics teams needing advanced visibility.",
                  priceUSD: 49, priceINR: 3999,
                  features: ["Up to 10,000 shipments/mo", "Branded tracking page", "SMS & Email notifications", "API access", "Priority support"],
                  popular: true
                },
                {
                  name: "Enterprise",
                  desc: "For high-volume operations requiring custom setups.",
                  priceUSD: 199, priceINR: 15999,
                  features: ["Unlimited shipments", "Custom carrier integrations", "Dedicated success manager", "99.99% uptime SLA", "Advanced analytics"],
                  popular: false
                }
              ].map((plan, i) => (
                <motion.div
                  key={i} variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                  className={`bg-white rounded-[2.5rem] p-8 md:p-10 border ${plan.popular ? 'border-indigo-600 shadow-2xl shadow-indigo-600/20 relative lg:scale-105 z-10' : 'border-slate-200 shadow-xl shadow-slate-200/50 mt-0 lg:mt-4 mb-0 lg:mb-4'} flex flex-col`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <span className="bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-widest py-1.5 px-5 rounded-full shadow-lg shadow-indigo-600/30">Most Popular</span>
                    </div>
                  )}
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">{plan.name}</h3>
                  <p className="text-[15px] text-slate-500 font-medium mb-8 min-h-[44px]">{plan.desc}</p>
                  <div className="mb-8 flex items-baseline gap-2">
                    <span className="text-5xl font-black text-slate-900 tracking-tight">
                      {billingCurrency === "USD" ? `$${plan.priceUSD}` : `₹${plan.priceINR}`}
                    </span>
                    <span className="text-sm font-bold text-slate-400">/mo</span>
                  </div>
                  <div className="h-px w-full bg-slate-100 mb-8"></div>
                  <ul className="space-y-5 mb-10 flex-1">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span className="text-[15px] font-semibold text-slate-700 leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-4 rounded-xl font-bold text-[15px] transition-all mt-auto ${plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 hover:-translate-y-1' : 'bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200 hover:-translate-y-1'}`}>
                    Get Started
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 7: CTA ────────────────────────────────────────────── */}
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

      {/* ── SECTION 8: FOOTER ────────────────────────────────────────── */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 pb-24 md:pb-12">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="TransitIQ Logo" className="h-6 w-auto" />
          </div>
          <p className="text-sm font-semibold text-slate-400">
            © {new Date().getFullYear()} TransitIQ. All rights reserved.
          </p>
          <p className="text-sm font-semibold text-slate-400">

          </p>
        </div>
      </footer>
    </div>
  );
}
