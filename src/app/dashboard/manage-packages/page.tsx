"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link  from "next/link";
import { Eye, Trash2, PlusCircle, Package, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardSidebar, { MobileDashboardNav } from "@/components/dashboard/DashboardSidebar";
import { ConfirmDialog } from "@/components/ui/index";
import { TableRowSkeleton, StarRating } from "@/components/ui/index";
import { packagesApi } from "@/utils/api";
import { IPackage }     from "@/types";
import { formatCurrency } from "@/utils/helpers";
import toast from "react-hot-toast";

export default function ManagePackagesPage() {
  const [packages,  setPackages]  = useState<IPackage[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [deleteId,  setDeleteId]  = useState<string|null>(null);
  const [deleting,  setDeleting]  = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const r = await packagesApi.getAll({ limit:100 }) as { data: IPackage[] };
      setPackages(r.data ?? []);
    } catch { toast.error("Failed to load packages"); }
    finally   { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await packagesApi.delete(deleteId);
      setPackages((p) => p.filter((x) => x._id !== deleteId));
      toast.success("Package deleted");
      setDeleteId(null);
    } catch { toast.error("Failed to delete package"); }
    finally  { setDeleting(false); }
  };

  const filtered = packages.filter((p) =>
    !search ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-slate-50 dark:bg-navy-900 pt-20 pb-24 lg:pb-10">
        <div className="container-custom py-8">
          <div className="flex gap-8 items-start">
            <DashboardSidebar/>
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-xl font-extrabold text-primary-700 dark:text-white">Manage Packages</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{packages.length} total packages</p>
                </div>
                <Link href="/dashboard/add-package"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary-DEFAULT hover:bg-secondary-600 text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg">
                  <PlusCircle className="w-4 h-4"/> Add Package
                </Link>
              </div>

              {/* Search */}
              <div className="card p-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                  <input value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or country…" className="input-field pl-10"/>
                </div>
              </div>

              {/* Table */}
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-primary-800 bg-slate-50 dark:bg-primary-900/20">
                        {["Image","Package","Country","Price","Duration","Seats","Rating","Actions"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading
                        ? Array.from({length:6}).map((_,i) => <TableRowSkeleton key={i}/>)
                        : filtered.length === 0
                          ? (
                            <tr>
                              <td colSpan={8} className="px-4 py-16 text-center">
                                <Package className="w-10 h-10 text-slate-200 dark:text-primary-800 mx-auto mb-3"/>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  {search ? "No packages match your search" : "No packages yet. Add your first one!"}
                                </p>
                              </td>
                            </tr>
                          )
                          : filtered.map((pkg) => (
                            <tr key={pkg._id} className="border-b border-slate-50 dark:border-primary-900 hover:bg-slate-50 dark:hover:bg-primary-900/20 transition-colors">
                              {/* Image */}
                              <td className="px-4 py-3">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-primary-800 shrink-0">
                                  {pkg.images[0]
                                    ? <Image src={pkg.images[0]} alt={pkg.title} width={48} height={48} className="object-cover w-full h-full"/>
                                    : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-slate-300"/></div>
                                  }
                                </div>
                              </td>
                              {/* Name */}
                              <td className="px-4 py-3 max-w-[200px]">
                                <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">{pkg.title}</p>
                                <p className="text-xs text-slate-400 truncate">{pkg.category}</p>
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{pkg.country}</td>
                              <td className="px-4 py-3 text-sm font-bold text-primary-700 dark:text-secondary-DEFAULT whitespace-nowrap">{formatCurrency(pkg.price)}</td>
                              <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{pkg.duration}d</td>
                              <td className="px-4 py-3 text-sm whitespace-nowrap">
                                <span className={`font-medium ${pkg.availableSeats - pkg.bookedSeats <= 5 ? "text-orange-500" : "text-slate-600 dark:text-slate-300"}`}>
                                  {pkg.availableSeats - pkg.bookedSeats}/{pkg.availableSeats}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <StarRating rating={pkg.rating} showValue count={pkg.reviewCount} size="sm"/>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <Link href={`/packages/${pkg._id}`}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-100 text-xs font-medium transition-colors">
                                    <Eye className="w-3.5 h-3.5"/> View
                                  </Link>
                                  <button onClick={() => setDeleteId(pkg._id)}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 text-xs font-medium transition-colors">
                                    <Trash2 className="w-3.5 h-3.5"/> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ConfirmDialog
        isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Package"
        message="Are you sure you want to permanently delete this tour package? This action cannot be undone."
        confirmLabel="Delete Package" loading={deleting}
      />
      <MobileDashboardNav/>
      <Footer/>
    </>
  );
}
