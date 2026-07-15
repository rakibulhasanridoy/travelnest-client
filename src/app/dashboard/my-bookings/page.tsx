"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link  from "next/link";
import { BookOpen, MapPin, Clock, Users, ArrowRight, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardSidebar, { MobileDashboardNav } from "@/components/dashboard/DashboardSidebar";
import { ConfirmDialog, Skeleton } from "@/components/ui/index";
import { bookingsApi }  from "@/utils/api";
import { IBooking }      from "@/types";
import { formatCurrency, formatDate, getStatusColor } from "@/utils/helpers";
import { useAuth }       from "@/context/AuthContext";
import { cn }            from "@/utils/helpers";
import toast from "react-hot-toast";

const TABS = ["All","confirmed","pending","completed","cancelled"] as const;
type Tab = typeof TABS[number];

export default function MyBookingsPage() {
  const { user }  = useAuth();
  const [bookings,   setBookings]   = useState<IBooking[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState<Tab>("All");
  const [cancelId,   setCancelId]   = useState<string|null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const r = await bookingsApi.getMyBookings() as { data: IBooking[] };
      setBookings(r.data ?? []);
    } catch { toast.error("Failed to load bookings"); }
    finally  { setLoading(false); }
  };

  const handleCancel = async () => {
    if (!cancelId) return;
    setCancelling(true);
    try {
      await bookingsApi.cancel(cancelId);
      setBookings((p) => p.map((b) => b._id === cancelId ? { ...b, status:"cancelled" } : b));
      toast.success("Booking cancelled");
      setCancelId(null);
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed"); }
    finally       { setCancelling(false); }
  };

  const filtered = tab === "All" ? bookings : bookings.filter((b) => b.status === tab);
  const counts   = TABS.reduce((acc, t) => ({
    ...acc,
    [t]: t === "All" ? bookings.length : bookings.filter((b) => b.status === t).length,
  }), {} as Record<Tab,number>);

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-slate-50 dark:bg-navy-900 pt-20 pb-24 lg:pb-10">
        <div className="container-custom py-8">
          <div className="flex gap-8 items-start">
            <DashboardSidebar/>
            <div className="flex-1 min-w-0">
              <div className="mb-6">
                <h1 className="text-xl font-extrabold text-primary-700 dark:text-white">
                  {user?.role === "admin" ? "All Bookings" : "My Bookings"}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{bookings.length} total booking{bookings.length !== 1 ? "s":""}</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                {TABS.map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                      tab === t
                        ? "bg-primary-700 text-white shadow-md"
                        : "bg-white dark:bg-navy-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-primary-700 hover:border-primary-300")}>
                    <span className="capitalize">{t}</span>
                    <span className={cn("px-1.5 py-0.5 rounded-full text-xs font-bold",
                      tab === t ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-primary-800 text-slate-500")}>
                      {counts[t]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Booking List */}
              {loading ? (
                <div className="flex flex-col gap-4">
                  {Array.from({length:4}).map((_,i) => <Skeleton key={i} className="h-36 w-full rounded-2xl"/>)}
                </div>
              ) : filtered.length === 0 ? (
                <div className="card p-16 text-center">
                  <BookOpen className="w-12 h-12 text-slate-200 dark:text-primary-800 mx-auto mb-4"/>
                  <h3 className="text-lg font-bold text-slate-600 dark:text-slate-400 mb-2">No bookings found</h3>
                  <p className="text-sm text-slate-400 mb-6">{tab === "All" ? "You haven't booked any tours yet." : `No ${tab} bookings.`}</p>
                  <Link href="/packages" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-700 text-white text-sm font-semibold hover:bg-primary-600 transition-colors">
                    Explore Tours <ArrowRight className="w-4 h-4"/>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filtered.map((b) => {
                    const pkg = b.package as { _id?: string; title?: string; country?: string; city?: string; price?: number; duration?: number; images?: string[] };
                    const canCancel = b.status === "confirmed" || b.status === "pending";
                    return (
                      <div key={b._id} className="card overflow-hidden">
                        <div className="flex flex-col sm:flex-row gap-4 p-5">
                          {/* Image */}
                          <div className="w-full sm:w-28 h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-primary-800 shrink-0">
                            {pkg?.images?.[0]
                              ? <Image src={pkg.images[0]} alt={pkg?.title ?? ""} width={112} height={96} className="object-cover w-full h-full"/>
                              : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-8 h-8 text-slate-300"/></div>
                            }
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="font-bold text-slate-800 dark:text-white text-base truncate">{pkg?.title ?? "Tour Package"}</h3>
                                <div className="flex flex-wrap items-center gap-3 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> {pkg?.city}, {pkg?.country}</span>
                                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {pkg?.duration} days</span>
                                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5"/> {b.travelers} traveler{b.travelers > 1 ? "s":""}</span>
                                </div>
                              </div>
                              <span className={`badge border text-xs shrink-0 capitalize ${getStatusColor(b.status)}`}>{b.status}</span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-primary-800">
                              <div className="flex flex-wrap gap-4 text-sm">
                                {[
                                  { label:"Travel Date",  value:formatDate(b.travelDate)  },
                                  { label:"Booked On",    value:formatDate(b.createdAt)   },
                                  { label:"Total Paid",   value:formatCurrency(b.totalPrice), bold:true },
                                ].map(({ label, value, bold }) => (
                                  <div key={label}>
                                    <p className="text-xs text-slate-400">{label}</p>
                                    <p className={cn("font-semibold text-slate-700 dark:text-white", bold && "text-base text-primary-700 dark:text-secondary-DEFAULT font-bold")}>{value}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                {pkg?._id && (
                                  <Link href={`/packages/${pkg._id}`}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold hover:bg-primary-100 transition-colors">
                                    View Tour
                                  </Link>
                                )}
                                {canCancel && (
                                  <button onClick={() => setCancelId(b._id)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors">
                                    <X className="w-3.5 h-3.5"/> Cancel
                                  </button>
                                )}
                              </div>
                            </div>
                            {b.specialRequests && (
                              <p className="mt-3 text-xs text-slate-400 italic">📝 {b.specialRequests}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ConfirmDialog
        isOpen={!!cancelId} onClose={() => setCancelId(null)} onConfirm={handleCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? Cancellations are free up to 7 days before departure."
        confirmLabel="Cancel Booking" loading={cancelling}
      />
      <MobileDashboardNav/>
      <Footer/>
    </>
  );
}
