"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Package, BookOpen, Users, DollarSign, TrendingUp, ArrowRight, Clock, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardSidebar, { MobileDashboardNav } from "@/components/dashboard/DashboardSidebar";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import { Skeleton, StatCardSkeleton } from "@/components/ui/index";
import { useAuth }       from "@/context/AuthContext";
import { dashboardApi, bookingsApi } from "@/utils/api";
import { DashboardStats, IBooking }  from "@/types";
import { formatCurrency, formatDate, getStatusColor } from "@/utils/helpers";

const EMPTY_STATS: DashboardStats = {
  totalPackages:0, totalBookings:0, totalUsers:0, totalRevenue:0,
  recentBookings:[],
  packagesByCountry:  [{ country:"No data", count:0 }],
  bookingsByCategory: [{ category:"No data", count:0 }],
  monthlyBookings:    Array.from({length:6},(_,i)=>({ month:["Jan","Feb","Mar","Apr","May","Jun"][i], bookings:0, revenue:0 })),
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats,    setStats]    = useState<DashboardStats>(EMPTY_STATS);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        if (user.role === "admin") {
          const r = await dashboardApi.getStats() as { data: DashboardStats };
          setStats({ ...EMPTY_STATS, ...r.data });
        } else {
          const r = await bookingsApi.getMyBookings() as { data: IBooking[] };
          setBookings(r.data ?? []);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [user]);

  const STAT_CARDS = [
    { label:"Total Packages", value:stats.totalPackages.toLocaleString(), icon:Package,    color:"bg-primary-50 dark:bg-primary-900/30 text-primary-700" },
    { label:"Total Bookings", value:stats.totalBookings.toLocaleString(), icon:BookOpen,   color:"bg-secondary-50 dark:bg-secondary-900/30 text-secondary-700" },
    { label:"Total Users",    value:stats.totalUsers.toLocaleString(),    icon:Users,      color:"bg-accent-50 dark:bg-accent-900/30 text-accent-700" },
    { label:"Total Revenue",  value:formatCurrency(stats.totalRevenue),   icon:DollarSign, color:"bg-purple-50 dark:bg-purple-900/30 text-purple-700" },
  ];

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-slate-50 dark:bg-navy-900 pt-20 pb-24 lg:pb-10">
        <div className="container-custom py-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary-700 dark:text-white">
              {user?.role === "admin" ? "Analytics Dashboard" : `Welcome back, ${user?.name?.split(" ")[0]} 👋`}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {user?.role === "admin" ? "Real-time performance overview of TravelNest." : "Here's a summary of your travel activity."}
            </p>
          </div>

          <div className="flex gap-8 items-start">
            <DashboardSidebar/>
            <div className="flex-1 min-w-0 flex flex-col gap-6">

              {/* ── Admin View ─────────────────────────────────────────── */}
              {user?.role === "admin" && (
                <>
                  {/* Stat Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {loading
                      ? Array.from({length:4}).map((_,i) => <StatCardSkeleton key={i}/>)
                      : STAT_CARDS.map((c) => (
                          <div key={c.label} className="card p-5">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{c.label}</p>
                                <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">{c.value}</p>
                              </div>
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.color}`}>
                                <c.icon className="w-5 h-5"/>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                              <TrendingUp className="w-3.5 h-3.5"/> +12% this month
                            </div>
                          </div>
                        ))
                    }
                  </div>

                  {/* Charts */}
                  {loading
                    ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{Array.from({length:4}).map((_,i) => <Skeleton key={i} className="h-72 w-full"/>)}</div>
                    : <DashboardCharts stats={stats}/>
                  }

                  {/* Recent Bookings */}
                  <div className="card overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-primary-800">
                      <h3 className="font-bold text-slate-800 dark:text-white">Recent Bookings</h3>
                      <Link href="/dashboard/my-bookings" className="text-xs text-primary-700 dark:text-primary-300 hover:text-secondary-DEFAULT transition-colors flex items-center gap-1">
                        View all <ArrowRight className="w-3 h-3"/>
                      </Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-primary-800">
                            {["Package","Traveler","Date","Amount","Status"].map((h) => (
                              <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentBookings.length === 0
                            ? <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-400">No bookings yet</td></tr>
                            : stats.recentBookings.map((b) => {
                                const p = b.package as { title?: string };
                                const u = b.user as { name?: string };
                                return (
                                  <tr key={b._id} className="border-b border-slate-50 dark:border-primary-900 hover:bg-slate-50 dark:hover:bg-primary-900/20 transition-colors">
                                    <td className="px-5 py-3.5 text-sm font-medium text-slate-700 dark:text-white max-w-[160px] truncate">{p?.title ?? "—"}</td>
                                    <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300">{u?.name ?? "—"}</td>
                                    <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400">{formatDate(b.travelDate)}</td>
                                    <td className="px-5 py-3.5 text-sm font-bold text-primary-700 dark:text-secondary-DEFAULT">{formatCurrency(b.totalPrice)}</td>
                                    <td className="px-5 py-3.5"><span className={`badge border text-xs ${getStatusColor(b.status)}`}>{b.status}</span></td>
                                  </tr>
                                );
                              })
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* ── User View ──────────────────────────────────────────── */}
              {user?.role !== "admin" && (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { label:"Total Trips",  value:bookings.length,                                                                                 color:"text-primary-700 dark:text-primary-300" },
                      { label:"Upcoming",     value:bookings.filter((b) => b.status==="confirmed").length,                                            color:"text-green-600" },
                      { label:"Total Spent",  value:formatCurrency(bookings.filter((b) => b.status!=="cancelled").reduce((s,b) => s+b.totalPrice,0)), color:"text-secondary-DEFAULT" },
                    ].map((c) => (
                      <div key={c.label} className="card p-5 text-center">
                        <p className={`text-2xl font-extrabold ${c.color}`}>{c.value}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{c.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent bookings */}
                  <div className="card overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-primary-800">
                      <h3 className="font-bold text-slate-800 dark:text-white">Recent Bookings</h3>
                      <Link href="/dashboard/my-bookings" className="text-xs text-primary-700 dark:text-primary-300 hover:text-secondary-DEFAULT transition-colors flex items-center gap-1">
                        View all <ArrowRight className="w-3 h-3"/>
                      </Link>
                    </div>
                    {loading ? (
                      <div className="p-5 flex flex-col gap-3">{Array.from({length:3}).map((_,i) => <Skeleton key={i} className="h-16 w-full"/>)}</div>
                    ) : bookings.length === 0 ? (
                      <div className="py-12 text-center">
                        <BookOpen className="w-10 h-10 text-slate-200 dark:text-primary-800 mx-auto mb-3"/>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No bookings yet</p>
                        <Link href="/packages" className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-700 text-white text-xs font-semibold hover:bg-primary-600 transition-colors">
                          Explore Tours <ArrowRight className="w-3.5 h-3.5"/>
                        </Link>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-primary-800">
                        {bookings.slice(0,5).map((b) => {
                          const p = b.package as { title?: string; country?: string; images?: string[] };
                          return (
                            <div key={b._id} className="flex items-center gap-4 px-5 py-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-primary-800 overflow-hidden shrink-0">
                                {p?.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover"/>}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">{p?.title ?? "Tour"}</p>
                                <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {p?.country}</span>
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {formatDate(b.travelDate)}</span>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-bold text-primary-700 dark:text-secondary-DEFAULT text-sm">{formatCurrency(b.totalPrice)}</p>
                                <span className={`badge border text-xs mt-1 ${getStatusColor(b.status)}`}>{b.status}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="card p-6 bg-primary-gradient text-white">
                    <h3 className="font-bold text-lg mb-2">Ready for Your Next Adventure?</h3>
                    <p className="text-white/70 text-sm mb-4">Explore 200+ handpicked tours from the world's best destinations.</p>
                    <Link href="/packages" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary-DEFAULT hover:bg-secondary-600 text-white text-sm font-semibold transition-colors">
                      Browse All Tours <ArrowRight className="w-4 h-4"/>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <MobileDashboardNav/>
      <Footer/>
    </>
  );
}
