"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/auth/AuthLayout";

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["", "Weak", "Fair", "Good", "Strong"] as const;
  const colors = ["", "#EF4444", "#F97316", "#EAB308", "#22C55E"];

  return { score, label: labels[score] || "", color: colors[score] || "" };
}

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required";
    if (!email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Invalid email format";
    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters";
    else if (strength.score < 2) errs.password = "Password is too weak";
    if (!confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (!agreed) errs.agreed = "You must agree to the terms";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/dashboard");
      } else {
        setError(data.message || "Failed to create account.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join thousands of teams shipping smarter">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Full name */}
        <div>
          <label htmlFor="name" className="text-[13px] font-bold text-slate-700 mb-1 block">Full name</label>
          <div className="relative">
            <Input
              id="name" value={name}
              onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: "" })); }}
              placeholder="John Doe"
              className={`h-10 rounded-xl border-slate-200 bg-white pr-10 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 ${fieldErrors.name ? "border-red-300 focus-visible:ring-red-500" : ""}`}
            />
            <User className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
          </div>
          {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="signup-email" className="text-[13px] font-bold text-slate-700 mb-1 block">Email address</label>
          <div className="relative">
            <Input
              id="signup-email" type="email" value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: "" })); }}
              placeholder="john.doe@company.com"
              className={`h-10 rounded-xl border-slate-200 bg-white pr-10 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 ${fieldErrors.email ? "border-red-300 focus-visible:ring-red-500" : ""}`}
            />
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
          </div>
          {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="signup-password" className="text-[13px] font-bold text-slate-700 mb-1 block">Password</label>
          <div className="relative">
            <Input
              id="signup-password" type={showPassword ? "text" : "password"} value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: "" })); }}
              placeholder="••••••••"
              className={`h-10 rounded-xl border-slate-200 bg-white pr-10 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 ${fieldErrors.password ? "border-red-300 focus-visible:ring-red-500" : ""}`}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
              {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
            </button>
          </div>
          {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}

          {/* Strength bar */}
          {password.length > 0 && (
            <div className="mt-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                    style={{ background: i <= strength.score ? strength.color : "#E5E7EB" }}
                  />
                ))}
              </div>
              <p className="text-[11px] mt-0.5 font-medium" style={{ color: strength.color }}>
                {strength.label}
              </p>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="confirm-password" className="text-[13px] font-bold text-slate-700 mb-1 block">Confirm password</label>
          <div className="relative">
            <Input
              id="confirm-password" type={showConfirm ? "text" : "password"} value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors((p) => ({ ...p, confirmPassword: "" })); }}
              placeholder="••••••••"
              className={`h-10 rounded-xl border-slate-200 bg-white pr-10 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 ${fieldErrors.confirmPassword ? "border-red-300 focus-visible:ring-red-500" : ""}`}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
              {showConfirm ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
            </button>
          </div>
          {fieldErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>}
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2.5 cursor-pointer pt-0.5">
          <input type="checkbox" checked={agreed}
            onChange={(e) => { setAgreed(e.target.checked); setFieldErrors((p) => ({ ...p, agreed: "" })); }}
            className="w-4 h-4 rounded border-slate-300 accent-[#4F46E5] mt-0.5 cursor-pointer"
          />
          <span className="text-[12px] text-slate-600 leading-tight">
            I agree to the{" "}
            <Link href="#" className="font-bold text-[#4F46E5] hover:text-indigo-700 transition-colors">Terms of Service</Link>
            {" "}and{" "}
            <Link href="#" className="font-bold text-[#4F46E5] hover:text-indigo-700 transition-colors">Privacy Policy</Link>
          </span>
        </label>
        {fieldErrors.agreed && <p className="text-xs text-red-500 -mt-2">{fieldErrors.agreed}</p>}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-2.5 text-[13px] font-medium text-red-600">{error}</div>
        )}

        {/* Submit */}
        <Button type="submit" disabled={isLoading}
          className="w-full h-11 text-[14px] font-bold rounded-xl shadow-xl shadow-indigo-500/20 text-white transition-transform hover:scale-[1.02] mt-1"
          style={{ background: "linear-gradient(135deg, #4F46E5, #6366F1)" }}
        >
          {isLoading ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Creating account...</>
          ) : "Create Account"}
        </Button>
      </form>

      {/* Social login divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
        <div className="relative flex justify-center text-[12px] font-medium"><span className="bg-white px-4 text-slate-400">or continue with</span></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Button variant="outline" className="h-10 text-[13px] font-bold rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
          <svg className="w-[16px] h-[16px] mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </Button>
        <Button variant="outline" className="h-10 text-[13px] font-bold rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
          <svg className="w-[16px] h-[16px] mr-2" viewBox="0 0 24 24"><path fill="#00A4EF" d="M11.4 24H0V12.6h11.4V24z"/><path fill="#FFB900" d="M11.4 11.4H0V0h11.4v11.4z"/><path fill="#F25022" d="M24 11.4H12.6V0H24v11.4z"/><path fill="#7FBA00" d="M24 24H12.6V12.6H24V24z"/></svg>
          Microsoft
        </Button>
      </div>

      <p className="text-center text-[13px] text-slate-500">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-bold text-[#4F46E5] hover:text-indigo-700 transition-colors">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
