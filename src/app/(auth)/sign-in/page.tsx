"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/auth/AuthLayout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type SignInValues = z.infer<typeof signInSchema>;

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "demo@transitiq.io",
      password: "Demo@1234",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: SignInValues) => {
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (resData.success) {
        router.push(from);
      } else {
        setError(resData.message || "Invalid email or password. Try demo credentials.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account">
      {/* Demo credentials banner */}
      <div className="flex items-start gap-3 rounded-2xl bg-cyan-50/50 border border-cyan-100 p-3 mb-6">
        <Lightbulb className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-[13px] font-semibold text-cyan-900 mb-1">Demo credentials (pre-filled)</p>
          <p className="text-[13px] text-cyan-700 font-mono-tracking">
            demo@transitiq.io / Demo@1234
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="text-[13px] font-bold text-slate-700 mb-1.5 block">
            Email address
          </label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="you@company.com"
              className={`h-11 rounded-xl border-slate-200 bg-white pr-10 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 ${errors.email ? "border-red-300 focus-visible:ring-red-500" : ""}`}
            />
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="text-[13px] font-bold text-slate-700 mb-1.5 block">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="••••••••"
              className={`h-11 rounded-xl border-slate-200 bg-white pr-10 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 ${errors.password ? "border-red-300 focus-visible:ring-red-500" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1.5">{errors.password.message}</p>}
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between pt-1 pb-2">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="w-4 h-4 rounded border-slate-300 accent-[#4F46E5] cursor-pointer"
              />
            </div>
            <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-[13px] font-bold text-[#4F46E5] hover:text-indigo-700 transition-colors">
            Forgot password?
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-[13px] font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 text-[14px] font-bold rounded-2xl shadow-xl shadow-indigo-500/20 text-white transition-transform hover:scale-[1.02] mt-1"
          style={{ background: "linear-gradient(135deg, #4F46E5, #6366F1)" }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {/* Social login divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100" />
        </div>
        <div className="relative flex justify-center text-[13px] font-medium">
          <span className="bg-white px-4 text-slate-400">or continue with</span>
        </div>
      </div>

      {/* Social buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button variant="outline" className="h-11 text-[13px] font-bold rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
          <svg className="w-[18px] h-[18px] mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </Button>
        <Button variant="outline" className="h-11 text-[13px] font-bold rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
          <svg className="w-[18px] h-[18px] mr-2" viewBox="0 0 24 24"><path fill="#00A4EF" d="M11.4 24H0V12.6h11.4V24z"/><path fill="#FFB900" d="M11.4 11.4H0V0h11.4v11.4z"/><path fill="#F25022" d="M24 11.4H12.6V0H24v11.4z"/><path fill="#7FBA00" d="M24 24H12.6V12.6H24V24z"/></svg>
          Microsoft
        </Button>
      </div>

      {/* Footer link */}
      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-semibold hover:underline" style={{ color: "#4F46E5" }}>
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>}>
      <SignInContent />
    </Suspense>
  );
}
