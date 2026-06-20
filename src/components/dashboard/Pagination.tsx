"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-1">
      {/* Left: Per-page select */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-500">Rows per page:</span>
        <Select
          value={limit.toString()}
          onValueChange={(val) => onLimitChange(Number(val))}
        >
          <SelectTrigger className="w-[70px] h-8 text-xs font-semibold bg-white border-slate-200">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Center: Page buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center pr-2"
        >
          <ChevronLeft className="w-4 h-4 mr-0.5" />
          <span className="text-xs font-semibold hidden sm:inline">Prev</span>
        </button>

        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((p, i) => (
            <React.Fragment key={i}>
              {p === "..." ? (
                <span className="px-2 text-slate-400 text-sm font-medium">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(p as number)}
                  className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold transition-colors ${
                    currentPage === p
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {p}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center pl-2"
        >
          <span className="text-xs font-semibold hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 ml-0.5" />
        </button>
      </div>

      {/* Right: Info */}
      <div className="text-sm font-medium text-slate-500 hidden md:block">
        Page {currentPage} of {Math.max(1, totalPages)} <span className="mx-1">·</span> {totalItems} shipments
      </div>
    </div>
  );
}
