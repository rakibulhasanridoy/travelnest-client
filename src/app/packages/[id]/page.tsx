"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link  from "next/link";
import {
  MapPin, Clock, Users, Check, X, ChevronLeft,
  Heart, Share2, Tag, Award, Send, Star,
} from "lucide-react";
import Navbar       from "@/components/layout/Navbar";
import Footer       from "@/components/layout/Footer";
import PackageCard   from "@/components/packages/PackageCard";
import { Skeleton, StarRating, Badge, Modal } from "@/components/ui/index";
import { packagesApi, reviewsApi, bookingsApi } from "@/utils/api";
import { IPackage, IReview, BookingFormData }    from "@/types";
import { formatCurrency, formatDate, formatRelativeDate, getCategoryColor } from "@/utils/helpers";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function PackageDetailPage() {
  const { id }     = useParams<{ id: string }>();
  const router     = useRouter();
  const { user }   = useAuth();

  const [pkg,          setPkg]          = useState<IPackage | null>(null);
  const [reviews,      setReviews]      = useState<IReview[]>([]);
  const [related,      setRelated]      = useState<IPackage[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [activeImg,    setActiveImg]    = useState(0);
  const [bookingOpen,  setBookingOpen]  = useState(false);
  const [reviewOpen,   setReviewOpen]   = useState(false);
  const [bForm,        setBForm]        = useState<BookingFormData>({ travelDate:"", travelers:1 });
  const [rForm,        setRForm]        = useState({ rating:5, comment:"" });
  const [submitting,   setSubmitting]   = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([packagesApi.getById(id), reviewsApi.getByPackage(id)])
      .then(([pRes, rRes]) => {
        const p = (pRes as { data: IPackage }).data;
        setPkg(p);
        setReviews((rRes as { data: IReview[] }).data ?? []);
        packagesApi.getAll({ search: p.country, limit: 4 })
          .then((r) => setRelated(((r as { data: IPackage[] }).data ?? []).filter((x) => x._id !== id)));
      })
      .catch(() => toast.error("Failed to load package"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    if (!bForm.travelDate) { toast.error("Please select a travel date"); return; }
    setSubmitting(true);
    try {
      await bookingsApi.create(id, bForm);
      toast.success("🎉 Booking confirmed! Check your dashboard.");
      setBookingOpen(false);
      setBForm({ travelDate:"", travelers:1 });
    } catch (err) { toast.error(err instanceof Error ? err.message : "Booking failed"); }
    finally       { setSubmitting(false); }
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    setSubmitting(true);
    try {
      const res = await reviewsApi.create(id, rForm.rating, rForm.comment) as { data: IReview };
      setReviews((p) => [res.data, ...p]);
      toast.success("Review submitted — thank you!");
      setReviewOpen(false);
    } catch (err) { toast.error(err instanceof Error ? err.message : "Review failed"); }
    finally       { setSubmitting(false); }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 bg-slate-50 dark:bg-navy-900">
          <div className="container-custom py-8">
            <Skeleton className="h-96 w-full rounded-2xl mb-6"/>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full"/>)}
              </div>
              <Skeleton className="h-96 w-full rounded-2xl"/>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  if (!pkg) return null;

  const remaining = pkg.availableSeats - pkg.bookedSeats;
  const imgs      = pkg.images.length ? pkg.images : ["https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80"];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-navy-900 pt-20">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-navy-800 border-b border-slate-100 dark:border-primary-800">
          <div className="container-custom py-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-primary-700 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/packages" className="hover:text-primary-700 transition-colors">Packages</Link>
            <span>/</span>
            <span className="text-slate-700 dark:text-white line-clamp-1">{pkg.title}</span>
          </div>
        </div>

        <div className="container-custom py-8">
          {/* Image Gallery */}
          <div className="grid grid-cols-4 gap-3 mb-8 h-80 sm:h-96">
            <div className="col-span-4 sm:col-span-3 relative rounded-2xl overflow-hidden">
              <Image src={imgs[activeImg]} alt={pkg.title} fill className="object-cover" priority/>
              {imgs.length > 1 && (
                <>
                  <button onClick={() => setActiveImg((i) => (i - 1 + imgs.length) % imgs.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-xl flex items-center justify-center">
                    <ChevronLeft className="w-5 h-5"/>
                  </button>
                  <button onClick={() => setActiveImg((i) => (i + 1) % imgs.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-xl flex items-center justify-center">
                    <ChevronLeft className="w-5 h-5 rotate-180"/>
                  </button>
                </>
              )}
            </div>
            {imgs.length > 1 && (
              <div className="hidden sm:flex flex-col gap-3">
                {imgs.slice(1, 4).map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i + 1)}
                    className={`relative flex-1 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i+1 ? "border-secondary" : "border-transparent"}`}>
                    <Image src={img} alt="" fill className="object-cover"/>
                    {i === 2 && imgs.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-bold">+{imgs.length - 4}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Title */}
              <div className="card p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`badge text-xs ${getCategoryColor(pkg.category)}`}>{pkg.category}</span>
                  {pkg.isFeatured && <Badge variant="secondary">Featured</Badge>}
                  {pkg.isTrending && <Badge variant="accent">Trending</Badge>}
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-primary-700 dark:text-white mb-3">{pkg.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-secondary"/> {pkg.city}, {pkg.country}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-secondary"/> {pkg.duration} days</span>
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-secondary"/> {remaining} seats left</span>
                </div>
                <StarRating rating={pkg.rating} count={pkg.reviewCount} size="md"/>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mt-4">{pkg.shortDescription}</p>
              </div>

              {/* About */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-primary-700 dark:text-white mb-3">About This Tour</h2>
                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{pkg.fullDescription}</div>
              </div>

              {/* Itinerary */}
              {pkg.itinerary.length > 0 && (
                <div className="card p-6">
                  <h2 className="text-lg font-bold text-primary-700 dark:text-white mb-5">Day-by-Day Itinerary</h2>
                  <div className="flex flex-col gap-4 relative">
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-100 dark:bg-primary-800"/>
                    {pkg.itinerary.map((day) => (
                      <div key={day.day} className="flex gap-4 relative">
                        <div className="w-10 h-10 rounded-full bg-primary-700 text-white text-xs font-bold flex items-center justify-center shrink-0 z-10 shadow-md">
                          D{day.day}
                        </div>
                        <div className="flex-1 pb-4">
                          <h4 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">{day.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{day.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Included / Excluded */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title:"What's Included", items:pkg.included, icon:Check, cls:"text-green-600 dark:text-green-400", iCls:"text-green-500" },
                  { title:"What's Excluded", items:pkg.excluded, icon:X,     cls:"text-red-500",                      iCls:"text-red-400"   },
                ].map(({ title, items, icon:Icon, cls, iCls }) => (
                  <div key={title} className="card p-5">
                    <h3 className={`font-bold text-sm flex items-center gap-2 mb-3 ${cls}`}><Icon className="w-4 h-4"/> {title}</h3>
                    <ul className="flex flex-col gap-2">
                      {items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${iCls}`}/> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Guide */}
              {pkg.guide && (
                <div className="card p-6 flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary-gradient flex items-center justify-center text-white font-bold text-xl shrink-0 overflow-hidden">
                    {pkg.guide.avatar
                      ? <Image src={pkg.guide.avatar} alt={pkg.guide.name} width={56} height={56} className="object-cover"/>
                      : pkg.guide.name?.charAt(0) ?? "G"
                    }
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800 dark:text-white text-sm">{pkg.guide.name}</h3>
                      <Badge variant="accent" size="sm"><Award className="w-3 h-3"/> Certified</Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{pkg.guide.experience}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.guide.languages.map((l) => <span key={l} className="tag-pill">{l}</span>)}
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-primary-700 dark:text-white">Reviews ({reviews.length})</h2>
                  <button onClick={() => user ? setReviewOpen(true) : router.push("/login")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-white text-xs font-semibold hover:bg-secondary-600 transition-colors">
                    <Star className="w-3.5 h-3.5"/> Write Review
                  </button>
                </div>
                {reviews.length === 0
                  ? <div className="py-8 text-center text-slate-400 text-sm">No reviews yet — be the first to share your experience!</div>
                  : (
                    <div className="flex flex-col gap-5">
                      {reviews.map((r) => {
                        const u = r.user as { name: string; avatar?: string };
                        return (
                          <div key={r._id} className="flex gap-3 pb-5 border-b border-slate-100 dark:border-primary-800 last:border-0 last:pb-0">
                            <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden">
                              {u.avatar ? <img src={u.avatar} alt={u.name} className="w-9 h-9 object-cover"/> : (u.name?.charAt(0) ?? "U")}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-slate-800 dark:text-white text-sm">{u.name ?? "Traveler"}</span>
                                <span className="text-xs text-slate-400">{formatRelativeDate(r.createdAt)}</span>
                              </div>
                              <StarRating rating={r.rating} showValue={false} size="sm"/>
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5">{r.comment}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                }
              </div>
            </div>

            {/* Right: Booking card */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <div className="mb-4">
                  {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                    <p className="text-sm text-slate-400 line-through">{formatCurrency(pkg.originalPrice)}</p>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-primary-700 dark:text-secondary">{formatCurrency(pkg.price)}</span>
                    <span className="text-sm text-slate-400">/person</span>
                  </div>
                  <StarRating rating={pkg.rating} count={pkg.reviewCount} size="sm" className="mt-2"/>
                </div>

                <div className="flex flex-col gap-3 py-4 border-y border-slate-100 dark:border-primary-800 mb-4 text-sm">
                  {[
                    { label:"Duration",         value:`${pkg.duration} days`,                    icon:Clock   },
                    { label:"Location",          value:`${pkg.city}, ${pkg.country}`,             icon:MapPin  },
                    { label:"Available Seats",   value:remaining > 0 ? `${remaining} seats` : "Sold Out", icon:Users },
                    { label:"Category",          value:pkg.category,                              icon:Tag     },
                  ].map(({ label, value, icon:Icon }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs"><Icon className="w-3.5 h-3.5"/> {label}</span>
                      <span className="font-medium text-slate-700 dark:text-white text-xs">{value}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => remaining > 0 ? setBookingOpen(true) : null} disabled={remaining <= 0}
                  className="w-full py-3.5 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-3">
                  {remaining > 0 ? "Book This Tour" : "Sold Out"}
                </button>
                <div className="flex gap-2">
                  {[{ icon:Heart, label:"Save" },{ icon:Share2, label:"Share" }].map(({ icon:Icon, label }) => (
                    <button key={label} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-primary-700 text-slate-500 dark:text-slate-400 hover:border-primary-700 hover:text-primary-700 transition-colors flex items-center justify-center gap-1.5 text-xs font-medium">
                      <Icon className="w-3.5 h-3.5"/> {label}
                    </button>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                  <p className="text-xs text-green-700 dark:text-green-400 font-medium flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5"/> Free cancellation up to 7 days before
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Packages */}
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-primary-700 dark:text-white mb-6">More Tours in {pkg.country}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {related.slice(0, 4).map((p) => <PackageCard key={p._id} pkg={p}/>)}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      <Modal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} title="Book This Tour" size="md">
        <form onSubmit={handleBook} className="flex flex-col gap-4">
          {[
            { label:"Travel Date", type:"date", key:"travelDate", min:new Date().toISOString().split("T")[0], required:true },
          ].map(({ label, type, key, min, required }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>
              <input type={type} min={min} required={required} value={(bForm as Record<string, string|number>)[key] as string}
                onChange={(e) => setBForm({ ...bForm, [key]: e.target.value })} className="input-field"/>
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Number of Travellers <span className="text-red-500">*</span></label>
            <input type="number" min={1} max={remaining} required value={bForm.travelers}
              onChange={(e) => setBForm({ ...bForm, travelers: parseInt(e.target.value) })} className="input-field"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Special Requests</label>
            <textarea rows={3} value={bForm.specialRequests||""} onChange={(e) => setBForm({ ...bForm, specialRequests: e.target.value })}
              placeholder="Dietary requirements, accessibility needs…" className="input-field resize-none"/>
          </div>
          <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-between">
            <span className="text-sm text-primary-700 dark:text-primary-300 font-medium">Total Price</span>
            <span className="text-xl font-extrabold text-primary-700 dark:text-secondary">
              {formatCurrency(pkg.price * bForm.travelers)}
            </span>
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold transition-all disabled:opacity-60">
            {submitting ? "Processing…" : "Confirm Booking"}
          </button>
        </form>
      </Modal>

      {/* Review Modal */}
      <Modal isOpen={reviewOpen} onClose={() => setReviewOpen(false)} title="Write a Review" size="sm">
        <form onSubmit={handleReview} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((s) => (
                <button key={s} type="button" onClick={() => setRForm({ ...rForm, rating:s })}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${s <= rForm.rating ? "bg-secondary text-white shadow-md" : "bg-slate-100 dark:bg-primary-800 text-slate-400"}`}>
                  <Star className="w-5 h-5"/>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Your Experience <span className="text-red-500">*</span></label>
            <textarea rows={4} required minLength={10} value={rForm.comment}
              onChange={(e) => setRForm({ ...rForm, comment: e.target.value })}
              placeholder="Share the highlights, tips, and what made this tour special…"
              className="input-field resize-none"/>
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-3 rounded-xl bg-primary-700 hover:bg-primary-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
            <Send className="w-4 h-4"/> {submitting ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      </Modal>
      <Footer />
    </>
  );
}