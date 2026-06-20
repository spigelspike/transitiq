"use client";

import { useEffect } from "react";
import { AlertOctagon } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="text-center p-8 bg-white rounded-2xl border border-red-100 shadow-sm max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
        
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertOctagon className="w-8 h-8 text-red-500" />
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
        
        {/* Dev only error details (in real app, hide this in prod) */}
        <p className="text-sm text-slate-500 mb-8 break-words">
          {error.message || "An unexpected error occurred."}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            &larr; Dashboard
          </Link>
          <button 
            onClick={() => reset()} 
            className="px-6 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
