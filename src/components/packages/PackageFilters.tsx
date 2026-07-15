"use client";
import React, { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PackageFilters, PackageCategory } from "@/types";
import { cn } from "@/utils/helpers";

const CATEGORIES: PackageCategory[] = [
  "Adventure","Cultural","Beach & Island","Wildlife & Safari",
  "Luxury","Budget","Honeymoon","Family","Solo","Group Tour",
];
const COUNTRIES = [
  "Indonesia","Japan","Switzerland","Maldives","Greece","France",
  "Morocco","Peru","Iceland","UAE","Thailand","Brazil","Kenya",
  "New Zealand","Nepal","Vietnam","Canada","Spain","Turkey","India",
];
const DURATIONS = [
  {value:"1-3",label:"1–3 days"},{value:"4-7",label:"4–7 days"},
  {value:"8-14",label:"8–14 days"},{value:"15",label:"15+ days"},
];
const SORT_OPTIONS = [
  {value:"newest",     label:"Newest First"     },
  {value:"price_asc",  label:"Price: Low → High"},
  {value:"price_desc", label:"Price: High → Low"},
  {value:"rating_desc",label:"Highest Rated"    },
];
const RATINGS = [
  {value:"4.5",label:"4.5+ Stars"},{value:"4",label:"4.0+ Stars"},{value:"3.5",label:"3.5+ Stars"},
];

interface Props {
  filters:       PackageFilters;
  onChange:      (f: PackageFilters) => void;
  onReset:       () => void;
  totalResults:  number;
}

export default function PackageFiltersPanel({ filters, onChange, onReset, totalResults }: Props) {
  const [mobile, setMobile] = useState(false);
  const up = (k: keyof PackageFilters, v: string|number) => onChange({...filters, [k]:v, page:1});

  const hasActive = !!(filters.search || filters.country || filters.category ||
    filters.minRating || filters.duration || (filters.maxPrice && filters.maxPrice < 10000) ||
    (filters.sortBy && filters.sortBy !== "newest"));

  const sel = (label: string, key: keyof PackageFilters, opts: {value:string;label:string}[], placeholder: string) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
      <select value={(filters[key] as string) || ""} onChange={(e) => up(key, e.target.value)}
        className="input-field">
        <option value="">{placeholder}</option>
        {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  const FilterBody = () => (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
        <input type="text" value={filters.search||""} onChange={(e) => up("search", e.target.value)}
          placeholder="Search tours or destinations…"
          className="input-field pl-10"/>
      </div>
      {sel("Country",   "country",   COUNTRIES.map((c)=>({value:c,label:c})),  "All Countries"  )}
      {sel("Category",  "category",  CATEGORIES.map((c)=>({value:c,label:c})), "All Categories" )}
      {sel("Duration",  "duration",  DURATIONS,                                "Any Duration"   )}
      {sel("Min Rating","minRating", RATINGS,                                  "Any Rating"     )}
      {sel("Sort By",   "sortBy",    SORT_OPTIONS,                             "Sort"           )}
      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Max Price: <span className="text-secondary-DEFAULT font-bold">${filters.maxPrice||10000}</span>
        </label>
        <input type="range" min={500} max={10000} step={100}
          value={filters.maxPrice||10000}
          onChange={(e) => up("maxPrice", parseInt(e.target.value))}
          className="w-full accent-secondary-DEFAULT"/>
        <div className="flex justify-between text-xs text-slate-400 mt-1"><span>$500</span><span>$10,000</span></div>
      </div>
      {hasActive && (
        <button onClick={onReset}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-primary-700 text-sm text-slate-500 hover:border-red-300 hover:text-red-500 transition-colors">
          <X className="w-4 h-4"/> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="card p-5 sticky top-24">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary-700 dark:text-primary-300"/>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Filters</h3>
            </div>
            <span className="text-xs text-slate-500">{totalResults.toLocaleString()} results</span>
          </div>
          <FilterBody/>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <div className="lg:hidden">
        <button onClick={() => setMobile(true)}
          className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors",
            hasActive
              ? "border-secondary-DEFAULT bg-secondary-50 dark:bg-secondary-900/20 text-secondary-700"
              : "border-slate-200 dark:border-primary-700 bg-white dark:bg-navy-700 text-slate-600 dark:text-slate-300")}>
          <SlidersHorizontal className="w-4 h-4"/>
          Filters {hasActive && <span className="w-2 h-2 rounded-full bg-secondary-DEFAULT"/>}
        </button>

        {mobile && (
          <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobile(false)}/>
            <div className="relative ml-auto w-full max-w-sm bg-white dark:bg-navy-800 h-full overflow-y-auto p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 dark:text-white">Filters</h3>
                <button onClick={() => setMobile(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-primary-800">
                  <X className="w-5 h-5 text-slate-500"/>
                </button>
              </div>
              <FilterBody/>
              <button onClick={() => setMobile(false)}
                className="mt-5 w-full py-3 rounded-xl bg-primary-700 text-white text-sm font-semibold hover:bg-primary-600 transition-colors">
                Apply Filters ({totalResults} results)
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
