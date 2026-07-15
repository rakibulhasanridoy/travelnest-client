"use client";
import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import Navbar           from "@/components/layout/Navbar";
import Footer           from "@/components/layout/Footer";
import PackageCard       from "@/components/packages/PackageCard";
import PackageFiltersPanel from "@/components/packages/PackageFilters";
import { PackageCardSkeleton } from "@/components/ui/index";
import { usePackages }   from "@/hooks/usePackages";
import { PackageFilters } from "@/types";
import { cn }             from "@/utils/helpers";

const DEFAULT: PackageFilters = {
  search:"", country:"", category:"", minRating:0,
  maxPrice:10000, duration:"", sortBy:"newest", page:1, limit:12,
};

export default function PackagesPage() {
  const [filters, setFilters] = useState<PackageFilters>(DEFAULT);
  const { packages, loading, error, total, pages } = usePackages(filters);

  const onChange  = useCallback((f: PackageFilters) => setFilters(f), []);
  const onReset   = useCallback(() => setFilters(DEFAULT), []);
  const goToPage  = (p: number) => {
    setFilters((prev) => ({ ...prev, page: p }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const cur = filters.page ?? 1;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-navy-900 pt-20">
        {/* Header */}
        <div className="bg-primary-gradient py-14 text-white">
          <div className="container-custom">
            <p className="text-secondary-light text-sm font-semibold uppercase tracking-widest mb-2">Explore</p>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3">Tour Packages</h1>
            <p className="text-white/70 text-base max-w-xl">
              {total > 0 ? `Showing ${total.toLocaleString()} tours across 50+ destinations.` : "Discover handpicked tours across 50+ incredible destinations."}
            </p>
          </div>
        </div>

        <div className="container-custom py-10">
          <div className="flex gap-8 items-start">
            {/* Filters */}
            <PackageFiltersPanel filters={filters} onChange={onChange} onReset={onReset} totalResults={total}/>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Top bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {loading ? "Loading packages…" : total > 0 ? `${total.toLocaleString()} packages found` : "No packages found"}
                </p>
                <div className="lg:hidden">
                  <PackageFiltersPanel filters={filters} onChange={onChange} onReset={onReset} totalResults={total}/>
                </div>
              </div>

              {error && (
                <div className="card p-8 text-center">
                  <p className="text-red-500 font-medium">{error}</p>
                  <button onClick={onReset} className="mt-3 text-sm text-primary-700 underline">Reset filters</button>
                </div>
              )}

              {!error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {loading
                    ? Array.from({ length: 12 }).map((_, i) => <PackageCardSkeleton key={i}/>)
                    : packages.map((p) => <PackageCard key={p._id} pkg={p}/>)
                  }
                </div>
              )}

              {!loading && !error && packages.length === 0 && (
                <div className="card p-16 text-center">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-4"/>
                  <h3 className="text-lg font-bold text-slate-700 dark:text-white mb-2">No packages found</h3>
                  <p className="text-sm text-slate-500 mb-5">Try adjusting your filters or search for a different destination.</p>
                  <button onClick={onReset} className="px-5 py-2.5 rounded-xl bg-primary-700 text-white text-sm font-semibold hover:bg-primary-600 transition-colors">
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {!loading && pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button onClick={() => goToPage(cur - 1)} disabled={cur <= 1}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-primary-700 text-slate-500 hover:border-primary-700 hover:text-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft className="w-4 h-4"/>
                  </button>
                  {Array.from({ length: pages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === pages || Math.abs(p - cur) <= 1)
                    .reduce<(number | "…")[]>((acc, p, i, arr) => {
                      if (i > 0 && p - (arr[i-1] as number) > 1) acc.push("…");
                      acc.push(p); return acc;
                    }, [])
                    .map((p, i) =>
                      p === "…"
                        ? <span key={`e${i}`} className="text-slate-400 px-1">…</span>
                        : (
                          <button key={p} onClick={() => goToPage(p as number)}
                            className={cn("w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all",
                              p === cur
                                ? "bg-primary-700 text-white shadow-md"
                                : "border border-slate-200 dark:border-primary-700 text-slate-600 dark:text-slate-400 hover:border-primary-700 hover:text-primary-700")}>
                            {p}
                          </button>
                        )
                    )
                  }
                  <button onClick={() => goToPage(cur + 1)} disabled={cur >= pages}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-primary-700 text-slate-500 hover:border-primary-700 hover:text-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <ChevronRight className="w-4 h-4"/>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
