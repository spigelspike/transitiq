"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GlobalSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [query, setQuery] = useState(initialSearch);

  // Sync with URL if it changes from elsewhere (e.g. from ShipmentsTable's own search)
  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("search", query.trim());
      params.set("page", "1");
    } else {
      params.delete("search");
    }
    // Update URL and scroll to shipments table smoothly if possible
    router.push(`/dashboard?${params.toString()}#shipments`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full md:w-80">
      <input 
        id="global-shipment-search"
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tracking number..." 
        className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200/60 bg-white shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-medium transition-shadow"
      />
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <button type="submit" className="hidden">Search</button>
    </form>
  );
}
