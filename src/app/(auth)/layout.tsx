"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Truck, BarChart3, BrainCircuit, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const ONBOARDING_SLIDES = [
  { image: "/images/auth_assets/carousel1.webp" },
  { image: "/images/auth_assets/carousel2.webp" },
  { image: "/images/auth_assets/carousel3.webp" },
];

const CARRIERS = ["FedEx", "DHL", "UPS", "BlueDart", "USPS"];

export default function AuthGroupLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  const handleNext = useCallback(() => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide((s) => s + 1);
    } else {
      setShowWelcome(true);
    }
  }, [currentSlide]);

  const handleSkip = useCallback(() => {
    setShowWelcome(true);
  }, []);

  // ─── MOBILE ONBOARDING ───
  if (showOnboarding && !showWelcome) {
    return (
      <>
        {/* Desktop: skip onboarding, show auth directly */}
        <div className="hidden lg:block">{children}</div>

        {/* Mobile: show onboarding carousel — full-screen image */}
        <div className="lg:hidden relative h-screen w-screen overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              src={ONBOARDING_SLIDES[currentSlide].image}
              alt="Onboarding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Skip button — overlaid top-right */}
          <button onClick={handleSkip}
            className="absolute top-6 right-6 z-10 text-sm text-gray-500 hover:text-gray-800 font-medium bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full transition-colors"
          >
            Skip
          </button>

          {/* Bottom nav — overlaid */}
          <div className="absolute bottom-8 left-6 right-6 z-10 flex items-center justify-between">
            {/* Dots */}
            <div className="flex gap-2">
              {ONBOARDING_SLIDES.map((_, i) => (
                <div key={i} className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === currentSlide ? 24 : 8,
                    background: i === currentSlide ? "#4F46E5" : "#D1D5DB",
                  }}
                />
              ))}
            </div>
            {/* Next button */}
            <button onClick={handleNext}
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              style={{ background: "linear-gradient(135deg, #4F46E5, #8B5CF6)" }}
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </>
    );
  }

  // ─── MOBILE WELCOME SCREEN ───
  if (showOnboarding && showWelcome) {
    return (
      <>
        {/* Desktop: skip welcome, show auth directly */}
        <div className="hidden lg:block">{children}</div>

        {/* Mobile: welcome screen */}
        <div className="lg:hidden h-screen flex flex-col bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/auth_assets/sign_login.webp')" }}
        >
          <div className="flex-1" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full px-6 pb-28 mx-auto max-w-sm"
          >
            {/* CTA buttons */}
            <Button
              className="w-full h-14 text-[15px] font-semibold rounded-2xl mb-4 shadow-xl shadow-indigo-500/20 text-white transition-transform hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #4F46E5, #6366F1)" }}
              onClick={() => { setShowOnboarding(false); router.push("/sign-up"); }}
            >
              Create Account
            </Button>
            <Button
              className="w-full h-14 text-[15px] font-semibold rounded-2xl bg-white text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all hover:scale-[1.02]"
              onClick={() => { setShowOnboarding(false); router.push("/sign-in"); }}
            >
              Sign In
            </Button>
          </motion.div>
        </div>
      </>
    );
  }

  // ─── NORMAL AUTH VIEW (desktop always, mobile after onboarding) ───
  return <>{children}</>;
}
