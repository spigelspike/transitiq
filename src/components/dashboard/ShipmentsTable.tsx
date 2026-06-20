"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, X, Download, Columns, ArrowRight, AlertCircle, Copy, CheckCircle2, 
  ChevronUp, ChevronDown, PackageX
} from "lucide-react";
import { toast } from "sonner";
import { format, isPast, isToday } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "./Pagination";
import { Shipment, ShipmentStatus } from "@/types/shipment";

// Utility to get status colors
const getStatusBadge = (status: ShipmentStatus) => {
  switch (status) {
    case "pending": return { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400", label: "Pending" };
    case "in_transit": return { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", label: "In Transit" };
    case "out_for_delivery": return { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500", label: "Out for Delivery" };
    case "delivered": return { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Delivered" };
    case "failed": return { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "Failed" };
    case "returned": return { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500", label: "Returned" };
    default: return { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400", label: "Unknown" };
  }
};

const getCarrierColor = (carrier: string) => {
  switch (carrier) {
    case "FedEx": return "bg-purple-100 text-purple-800";
    case "UPS": return "bg-amber-100 text-amber-800";
    case "DHL": return "bg-red-100 text-red-800";
    case "USPS": return "bg-blue-100 text-blue-800";
    case "BlueDart": return "bg-cyan-100 text-cyan-800";
    default: return "bg-slate-100 text-slate-800";
  }
};

const ShipmentRow = React.memo(({ shipment, onCopy }: { shipment: Shipment; onCopy: (e: React.MouseEvent, text: string) => void }) => {
  const s = getStatusBadge(shipment.status);
  const estDate = new Date(shipment.estimatedDelivery);
  const isOverdue = shipment.status !== "delivered" && shipment.status !== "returned" && isPast(estDate) && !isToday(estDate);
  
  return (
    <TableRow className="group cursor-pointer hover:bg-slate-50 border-b-slate-50 transition-colors">
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold text-slate-700">
            {shipment.trackingNumber}
          </span>
          <button 
            onClick={(e) => onCopy(e, shipment.trackingNumber)}
            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-600 transition-all rounded hover:bg-indigo-50"
            title="Copy tracking number"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </TableCell>
      <TableCell>
        <p className="font-bold text-sm text-slate-900">{shipment.recipient}</p>
        <p className="text-xs font-medium text-slate-500">
          {shipment.destination.city}, {shipment.destination.state}
        </p>
      </TableCell>
      <TableCell>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${getCarrierColor(shipment.carrier.name)}`}>
          {shipment.carrier.name}
        </span>
        <p className="text-xs font-medium text-slate-500 truncate max-w-[120px]">
          {shipment.carrier.service}
        </p>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <span className="truncate max-w-[80px]">{shipment.origin.city}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate max-w-[80px]">{shipment.destination.city}</span>
        </div>
        {shipment.origin.country !== shipment.destination.country && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
            {shipment.origin.country} → {shipment.destination.country}
          </p>
        )}
      </TableCell>
      <TableCell>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${s.bg} ${s.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {s.label}
        </span>
      </TableCell>
      <TableCell>
        {shipment.status === "delivered" && shipment.actualDelivery ? (
          <span className="text-sm font-bold text-emerald-600">
            {format(new Date(shipment.actualDelivery), "MMM d, yyyy")}
          </span>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-bold ${isOverdue ? "text-red-600" : "text-slate-700"}`}>
              {format(estDate, "MMM d, yyyy")}
            </span>
            {isOverdue && <AlertCircle className="w-4 h-4 text-red-500" title="Overdue" />}
          </div>
        )}
      </TableCell>
      <TableCell>
        <span className="text-sm font-medium text-slate-500" title={format(new Date(shipment.createdAt), "PPpp")}>
          {format(new Date(shipment.createdAt), "MMM d")}
        </span>
      </TableCell>
    </TableRow>
  );
});
ShipmentRow.displayName = "ShipmentRow";

export default function ShipmentsTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL State extraction with defaults
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const order = searchParams.get("order") || "desc";

  // Local state for debounced search
  const [searchInput, setSearchInput] = useState(search);
  const [searchFocused, setSearchFocused] = useState(false);

  // Sync URL search back to local input if URL changes externally
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Debounce search input to URL
  useEffect(() => {
    const handler = setTimeout(() => {
      updateUrlParams({ search: searchInput, page: 1 }); // reset to page 1 on search
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateUrlParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      updateUrlParams({ order: order === "asc" ? "desc" : "asc", page: 1 });
    } else {
      updateUrlParams({ sortBy: column, order: "desc", page: 1 });
    }
  };

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ['shipments', { page, limit, search, status, sortBy, order }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        status,
        sortBy,
        order,
      });
      const res = await fetch(`/api/shipments?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 10000,
  });

  const shipments: Shipment[] = React.useMemo(() => data?.data || [], [data?.data]);
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong. Please try again.");
    }
  }, [isError]);

  const handleExportCSV = () => {
    if (!shipments.length) {
      toast.error("No shipments to export.");
      return;
    }
    
    const headers = ["Tracking Number", "Recipient", "Origin", "Destination", "Carrier", "Service", "Status", "Estimated Delivery"];
    const csvContent = [
      headers.join(","),
      ...shipments.map(s => [
        s.trackingNumber,
        `"${s.recipient}"`,
        `"${s.origin.city}, ${s.origin.state} ${s.origin.country}"`,
        `"${s.destination.city}, ${s.destination.state} ${s.destination.country}"`,
        s.carrier.name,
        s.carrier.service,
        s.status,
        format(new Date(s.estimatedDelivery), "yyyy-MM-dd")
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `shipments_export_${format(new Date(), "yyyyMMdd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Exported successfully", { icon: <CheckCircle2 className="w-4 h-4" /> });
  };

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success("Tracking number copied!", { icon: <CheckCircle2 className="w-4 h-4" /> });
  };

  const clearFilters = () => {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mt-8">
      {/* Header Row */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Shipments</h2>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
            {meta.total} total
          </span>
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Controls Row */}
      <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="shipment-search"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search tracking number, recipient..."
              className="w-full h-9 pl-9 pr-14 rounded-lg border border-slate-200 bg-white shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium"
            />
            {!searchFocused && !searchInput && (
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 font-mono text-[10px] font-bold">Press /</kbd>
              </div>
            )}
            {searchInput && (
              <button 
                onClick={() => setSearchInput("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <Select value={status} onValueChange={(v) => updateUrlParams({ status: v, page: 1 })}>
            <SelectTrigger className="w-full sm:w-44 h-9 font-medium bg-white border-slate-200 text-sm">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Select value={sortBy} onValueChange={(v) => updateUrlParams({ sortBy: v, order: "desc", page: 1 })}>
            <SelectTrigger className="w-40 h-9 font-medium bg-white border-slate-200 text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest first</SelectItem>
              <SelectItem value="trackingNumber">Tracking #</SelectItem>
              <SelectItem value="status">Status A→Z</SelectItem>
              <SelectItem value="estimatedDelivery">Delivery date</SelectItem>
            </SelectContent>
          </Select>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 hidden sm:flex">
            <Columns className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[400px]">
        {isError ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Failed to load shipments</h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">There was a problem connecting to the server.</p>
            <button 
              onClick={() => refetch()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : isFetching ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b-slate-100">
                <TableHead className="w-48"><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead className="w-48"><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead className="w-32"><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead className="w-48"><Skeleton className="h-4 w-32" /></TableHead>
                <TableHead className="w-44"><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead className="w-36"><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead className="w-28"><Skeleton className="h-4 w-16" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(10)].map((_, i) => (
                <TableRow key={i} className="border-b-slate-50 hover:bg-transparent">
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28 mb-1.5" />
                    <Skeleton className="h-3 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full mb-1.5" />
                    <Skeleton className="h-3 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-36 mb-1.5" />
                    <Skeleton className="h-3 w-16" />
                  </TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : shipments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <PackageX className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {(search || status !== "all") ? "No shipments match your filters" : "No shipments yet"}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              {(search || status !== "all") 
                ? "Try adjusting your search terms or clearing the status filter to find what you're looking for." 
                : "Shipments will appear here once they are created in the system."}
            </p>
            {(search || status !== "all") && (
              <button 
                onClick={clearFilters}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-b-slate-100">
                <TableHead 
                  className="w-48 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort("trackingNumber")}
                >
                  <div className="flex items-center gap-1 font-bold">
                    Tracking #
                    {sortBy === "trackingNumber" && (order === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </TableHead>
                <TableHead 
                  className="w-48 cursor-pointer hover:text-slate-900 transition-colors font-bold"
                  onClick={() => handleSort("recipient")}
                >
                  <div className="flex items-center gap-1">
                    Recipient
                    {sortBy === "recipient" && (order === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </TableHead>
                <TableHead className="w-32 font-bold">Carrier</TableHead>
                <TableHead className="w-48 font-bold">Route</TableHead>
                <TableHead 
                  className="w-44 cursor-pointer hover:text-slate-900 transition-colors font-bold"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Status
                    {sortBy === "status" && (order === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </TableHead>
                <TableHead 
                  className="w-36 cursor-pointer hover:text-slate-900 transition-colors font-bold"
                  onClick={() => handleSort("estimatedDelivery")}
                >
                  <div className="flex items-center gap-1">
                    Est. Delivery
                    {sortBy === "estimatedDelivery" && (order === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </TableHead>
                <TableHead 
                  className="w-28 cursor-pointer hover:text-slate-900 transition-colors font-bold"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-1">
                    Created
                    {sortBy === "createdAt" && (order === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.map((shipment) => (
                <ShipmentRow key={shipment.id} shipment={shipment} onCopy={handleCopy} />
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination Footer */}
      {shipments.length > 0 && !isFetching && !isError && (
        <div className="border-t border-slate-100 px-4 bg-slate-50/30">
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            totalItems={meta.total}
            limit={meta.limit}
            onPageChange={(p) => updateUrlParams({ page: p })}
            onLimitChange={(l) => updateUrlParams({ limit: l, page: 1 })}
          />
        </div>
      )}
    </div>
  );
}
