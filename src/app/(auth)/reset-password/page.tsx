"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!password) errs.password = "New password is required";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters";
    else if (strength.score < 2) errs.password = "Password is too weak";
    if (!confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);

    toast.success("Password updated successfully", {
      description: "You can now sign in with your new password.",
    });

    setTimeout(() => router.push("/sign-in"), 2000);
  };

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your new password below">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New password */}
        <div>
          <label htmlFor="new-password" className="text-sm font-medium text-gray-700 mb-1.5 block">
            New password
          </label>
          <div className="relative">
            <Input
              id="new-password" type={showPassword ? "text" : "password"} value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: "" })); }}
              placeholder="••••••••"
              className={`h-11 pr-10 ${fieldErrors.password ? "border-red-300" : ""}`}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}

          {/* Strength bar */}
          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-300"
                    style={{ background: i <= strength.score ? strength.color : "#E5E7EB" }}
                  />
                ))}
              </div>
              <p className="text-xs mt-1 font-medium" style={{ color: strength.color }}>
                {strength.label}
              </p>
            </div>
          )}
        </div>

        {/* Confirm new password */}
        <div>
          <label htmlFor="confirm-new-password" className="text-sm font-medium text-gray-700 mb-1.5 block">
            Confirm new password
          </label>
          <div className="relative">
            <Input
              id="confirm-new-password" type={showConfirm ? "text" : "password"} value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors((p) => ({ ...p, confirmPassword: "" })); }}
              placeholder="••••••••"
              className={`h-11 pr-10 ${fieldErrors.confirmPassword ? "border-red-300" : ""}`}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {fieldErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>}
        </div>

        {/* Submit */}
        <Button type="submit" disabled={isLoading}
          className="w-full h-12 text-sm font-semibold rounded-xl"
          style={{ background: "linear-gradient(135deg, #3777fe, #8B5CF6)" }}
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Resetting...</>
          ) : "Reset Password"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Remember your password?{" "}
        <Link href="/sign-in" className="font-semibold hover:underline" style={{ color: "#3777fe" }}>
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
