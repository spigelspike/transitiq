"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center p-8 bg-white rounded-2xl border border-slate-200/60 shadow-sm max-w-md w-full">
        <h1 className="text-8xl font-bold text-slate-400/20 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h2>
        <p className="text-slate-500 mb-8">This page doesn't exist or has been moved.</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            &larr; Back
          </button>
          <Link href="/dashboard" className="px-6 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
