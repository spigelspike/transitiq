"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, CheckCircle2, ArrowLeft, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/auth/AuthLayout";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError("");

    if (!email) {
      setFieldError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError("Invalid email format");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setSent(true);
  };

  return (
    <AuthLayout title="Forgot password?" subtitle="No worries! Enter your email and we'll send you reset instructions.">
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Email */}
            <div>
              <label htmlFor="reset-email" className="text-sm font-medium text-gray-700 mb-1.5 block">
                Email address
              </label>
              <div className="relative">
                <Input
                  id="reset-email" type="email" value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldError(""); }}
                  placeholder="demo@transitiq.io"
                  className={`h-11 pr-10 ${fieldError ? "border-red-300" : ""}`}
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {fieldError && <p className="text-xs text-red-500 mt-1">{fieldError}</p>}
            </div>

            {/* Submit */}
            <Button type="submit" disabled={isLoading}
              className="w-full h-12 text-sm font-semibold rounded-xl"
              style={{ background: "linear-gradient(135deg, #3777fe, #8B5CF6)" }}
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" />Send reset link</>
              )}
            </Button>

            {/* Back link */}
            <Link href="/sign-in"
              className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mt-4">
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-4"
          >
            {/* Success checkmark */}
            <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #22C55E, #16A34A)" }}
            >
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Email sent!</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              We&apos;ve sent password reset instructions<br />
              to <span className="font-semibold text-gray-700">{email}</span>
            </p>
            <p className="text-xs text-gray-400 mb-8">
              The link expires in 30 minutes.
            </p>

            <Link href="/sign-in">
              <Button variant="outline" className="h-11 px-6 text-sm font-medium rounded-xl border-gray-200">
                Back to sign in
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
