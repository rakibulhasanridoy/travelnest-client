"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IPackage }   from "@/types";
import PackageCard     from "@/components/packages/PackageCard";
import { PackageCardSkeleton } from "@/components/ui/index";
import { packagesApi } from "@/utils/api";

export default function FeaturedPackages() {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    packagesApi.getAll({ sortBy:"rating_desc", limit:8 })
      .then((r) => setPackages((r as {data:IPackage[]}).data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding bg-white dark:bg-navy-800">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-secondary-DEFAULT text-sm font-semibold uppercase tracking-widest mb-2">Handpicked For You</p>
            <h2 className="section-title">Featured Tour Packages</h2>
            <p className="section-subtitle">Our top-rated packages — chosen by experienced travelers and crafted by local experts.</p>
          </div>
          <Link href="/packages" className="flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-300 hover:text-secondary-DEFAULT transition-colors whitespace-nowrap group">
            Explore all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({length:8}).map((_,i) => <PackageCardSkeleton key={i}/>)
            : packages.map((p) => <PackageCard key={p._id} pkg={p}/>)
          }
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/packages" className="btn-primary text-sm px-8">
            Browse All Packages <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
      </div>
    </section>
  );
}
