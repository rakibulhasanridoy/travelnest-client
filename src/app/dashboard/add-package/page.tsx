"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Trash2, Plus } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardSidebar, { MobileDashboardNav } from "@/components/dashboard/DashboardSidebar";
import { packagesApi } from "@/utils/api";
import { PackageCategory } from "@/types";
import toast from "react-hot-toast";

const CATEGORIES: PackageCategory[] = [
  "Adventure","Cultural","Beach & Island","Wildlife & Safari",
  "Luxury","Budget","Honeymoon","Family","Solo","Group Tour",
];

const INIT = {
  title:"", country:"", city:"", category:"" as PackageCategory,
  price:"", originalPrice:"", duration:"", availableSeats:"",
  shortDescription:"", fullDescription:"",
  images:[""],
  included:[""], excluded:[""],
  itinerary:[{ day:1, title:"", description:"" }],
  isFeatured:false, isTrending:false,
};

export default function AddPackagePage() {
  const router  = useRouter();
  const [form,    setForm]    = useState(INIT);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState<Record<string,string>>({});

  const set  = (k: string, v: unknown) => { setForm((p) => ({ ...p, [k]:v })); setErrors((p) => ({ ...p, [k]:"" })); };
  const ec   = (k: string) => errors[k] ? "border-red-400 focus:ring-red-400" : "";
  const fCls = (k: string) => `input-field ${ec(k)}`;

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.title.trim())             e.title           = "Required";
    if (!form.country.trim())           e.country         = "Required";
    if (!form.city.trim())              e.city            = "Required";
    if (!form.category)                 e.category        = "Required";
    if (!form.price || isNaN(+form.price))         e.price          = "Valid price required";
    if (!form.duration || isNaN(+form.duration))   e.duration       = "Valid duration required";
    if (!form.availableSeats || isNaN(+form.availableSeats)) e.availableSeats = "Required";
    if (!form.shortDescription.trim())  e.shortDescription = "Required";
    if (!form.fullDescription.trim())   e.fullDescription  = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) { toast.error("Please fix the highlighted fields"); return; }
    setLoading(true);
    try {
      await packagesApi.create({
        ...form,
        price:          parseFloat(form.price),
        originalPrice:  form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        duration:       parseInt(form.duration),
        availableSeats: parseInt(form.availableSeats),
        images:         form.images.filter(Boolean),
        included:       form.included.filter(Boolean),
        excluded:       form.excluded.filter(Boolean),
        itinerary:      form.itinerary.filter((d) => d.title && d.description),
      });
      toast.success("Package published successfully!");
      router.push("/dashboard/manage-packages");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to create package"); }
    finally       { setLoading(false); }
  };

  // Dynamic array helpers
  const addItem    = (f: "images"|"included"|"excluded") => set(f, [...form[f], ""]);
  const removeItem = (f: "images"|"included"|"excluded", i: number) => set(f, (form[f] as string[]).filter((_,j) => j!==i));
  const updateItem = (f: "images"|"included"|"excluded", i: number, v: string) =>
    set(f, (form[f] as string[]).map((x,j) => j===i ? v : x));

  const addDay    = () => set("itinerary", [...form.itinerary, { day:form.itinerary.length+1, title:"", description:"" }]);
  const removeDay = (i: number) => set("itinerary", form.itinerary.filter((_,j) => j!==i).map((d,j) => ({ ...d, day:j+1 })));
  const updateDay = (i: number, k: string, v: string) => set("itinerary", form.itinerary.map((d,j) => j===i ? { ...d, [k]:v } : d));

  const Section = ({ title, children }: { title:string; children:React.ReactNode }) => (
    <div className="card p-6">
      <h2 className="font-bold text-primary-700 dark:text-white mb-5">{title}</h2>
      {children}
    </div>
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
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-secondary-gradient flex items-center justify-center">
                  <PlusCircle className="w-5 h-5 text-white"/>
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-primary-700 dark:text-white">Add New Package</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Create a new tour package listing</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col gap-6">

                  {/* Basic Info */}
                  <Section title="Basic Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Package Title <span className="text-red-500">*</span></label>
                        <input value={form.title} onChange={(e) => set("title", e.target.value)}
                          placeholder="e.g. Bali Paradise Experience – 7 Days" className={fCls("title")}/>
                        {errors.title && <p className="mt-1 text-xs text-red-500">⚠ {errors.title}</p>}
                      </div>

                      {[
                        { k:"country", label:"Country", ph:"e.g. Indonesia" },
                        { k:"city",    label:"City",    ph:"e.g. Ubud"      },
                      ].map(({ k, label, ph }) => (
                        <div key={k}>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label} <span className="text-red-500">*</span></label>
                          <input value={(form as Record<string, unknown>)[k] as string} onChange={(e) => set(k, e.target.value)}
                            placeholder={ph} className={fCls(k)}/>
                          {errors[k] && <p className="mt-1 text-xs text-red-500">⚠ {errors[k]}</p>}
                        </div>
                      ))}

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category <span className="text-red-500">*</span></label>
                        <select value={form.category} onChange={(e) => set("category", e.target.value)} className={fCls("category")}>
                          <option value="">Select category</option>
                          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {errors.category && <p className="mt-1 text-xs text-red-500">⚠ {errors.category}</p>}
                      </div>

                      {[
                        { k:"price",          label:"Price (USD)",              ph:"1299", type:"number" },
                        { k:"originalPrice",  label:"Original Price (optional)", ph:"1599", type:"number" },
                        { k:"duration",       label:"Duration (days)",           ph:"7",    type:"number" },
                        { k:"availableSeats", label:"Available Seats",           ph:"20",   type:"number" },
                      ].map(({ k, label, ph, type }) => (
                        <div key={k}>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label} {k!=="originalPrice" && <span className="text-red-500">*</span>}</label>
                          <input type={type} min="0" value={(form as Record<string, unknown>)[k] as string}
                            onChange={(e) => set(k, e.target.value)} placeholder={ph} className={fCls(k)}/>
                          {errors[k] && <p className="mt-1 text-xs text-red-500">⚠ {errors[k]}</p>}
                        </div>
                      ))}
                    </div>

                    {/* Badges */}
                    <div className="flex gap-6 mt-4">
                      {[{ k:"isFeatured", label:"⚡ Mark as Featured" },{ k:"isTrending", label:"📈 Mark as Trending" }].map(({ k, label }) => (
                        <label key={k} className="flex items-center gap-2.5 cursor-pointer">
                          <input type="checkbox" checked={form[k as "isFeatured"|"isTrending"]}
                            onChange={(e) => set(k, e.target.checked)} className="w-4 h-4 accent-secondary-DEFAULT"/>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
                        </label>
                      ))}
                    </div>
                  </Section>

                  {/* Descriptions */}
                  <Section title="Descriptions">
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Short Description <span className="text-red-500">*</span> <span className="text-slate-400 font-normal">(max 300 chars)</span></label>
                        <textarea rows={2} maxLength={300} value={form.shortDescription}
                          onChange={(e) => set("shortDescription", e.target.value)}
                          placeholder="A compelling one-liner summary of this tour…"
                          className={`${fCls("shortDescription")} resize-none`}/>
                        <div className="flex justify-between mt-1">
                          {errors.shortDescription ? <p className="text-xs text-red-500">⚠ {errors.shortDescription}</p> : <span/>}
                          <span className="text-xs text-slate-400">{form.shortDescription.length}/300</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Description <span className="text-red-500">*</span></label>
                        <textarea rows={7} value={form.fullDescription}
                          onChange={(e) => set("fullDescription", e.target.value)}
                          placeholder="Detailed tour description — highlights, experience, what makes this unique…"
                          className={`${fCls("fullDescription")} resize-y`}/>
                        {errors.fullDescription && <p className="mt-1 text-xs text-red-500">⚠ {errors.fullDescription}</p>}
                      </div>
                    </div>
                  </Section>

                  {/* Images */}
                  <Section title="Image URLs">
                    <div className="flex flex-col gap-3">
                      {form.images.map((img, i) => (
                        <div key={i} className="flex gap-2">
                          <input type="url" value={img} onChange={(e) => updateItem("images", i, e.target.value)}
                            placeholder="https://images.unsplash.com/photo-…?w=1200"
                            className="input-field flex-1"/>
                          {form.images.length > 1 && (
                            <button type="button" onClick={() => removeItem("images", i)}
                              className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors shrink-0">
                              <Trash2 className="w-4 h-4"/>
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => addItem("images")}
                        className="flex items-center gap-2 text-sm font-semibold text-secondary-DEFAULT hover:text-secondary-600 transition-colors">
                        <Plus className="w-4 h-4"/> Add Image
                      </button>
                    </div>
                  </Section>

                  {/* Included / Excluded */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(["included","excluded"] as const).map((field) => (
                      <Section key={field} title={field === "included" ? "✓ What's Included" : "✗ What's Excluded"}>
                        <div className="flex flex-col gap-2">
                          {form[field].map((item, i) => (
                            <div key={i} className="flex gap-2">
                              <input type="text" value={item} onChange={(e) => updateItem(field, i, e.target.value)}
                                placeholder={field === "included" ? "e.g. Airport transfers" : "e.g. International flights"}
                                className="input-field flex-1 text-sm"/>
                              {form[field].length > 1 && (
                                <button type="button" onClick={() => removeItem(field, i)}
                                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20 text-red-400 hover:bg-red-100 transition-colors shrink-0">
                                  <Trash2 className="w-3.5 h-3.5"/>
                                </button>
                              )}
                            </div>
                          ))}
                          <button type="button" onClick={() => addItem(field)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-secondary-DEFAULT hover:text-secondary-600 transition-colors">
                            <Plus className="w-3.5 h-3.5"/> Add Item
                          </button>
                        </div>
                      </Section>
                    ))}
                  </div>

                  {/* Itinerary */}
                  <Section title="Day-by-Day Itinerary">
                    <div className="flex flex-col gap-4">
                      {form.itinerary.map((day, i) => (
                        <div key={i} className="flex gap-3 items-start p-4 bg-slate-50 dark:bg-primary-900/20 rounded-xl">
                          <div className="w-8 h-8 rounded-lg bg-primary-700 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                            D{day.day}
                          </div>
                          <div className="flex-1 grid grid-cols-1 gap-3">
                            <input type="text" value={day.title} onChange={(e) => updateDay(i, "title", e.target.value)}
                              placeholder="Day title (e.g. Arrive in Bali & Explore Ubud)" className="input-field text-sm"/>
                            <textarea rows={2} value={day.description} onChange={(e) => updateDay(i, "description", e.target.value)}
                              placeholder="Describe the day's activities and highlights…"
                              className="input-field text-sm resize-none"/>
                          </div>
                          {form.itinerary.length > 1 && (
                            <button type="button" onClick={() => removeDay(i)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-400 hover:bg-red-100 transition-colors shrink-0 mt-1">
                              <Trash2 className="w-3.5 h-3.5"/>
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={addDay}
                        className="flex items-center gap-2 text-sm font-semibold text-secondary-DEFAULT hover:text-secondary-600 transition-colors">
                        <Plus className="w-4 h-4"/> Add Day
                      </button>
                    </div>
                  </Section>

                  {/* Submit */}
                  <div className="flex items-center gap-4 justify-end">
                    <button type="button" onClick={() => setForm(INIT)}
                      className="px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-primary-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:border-red-300 hover:text-red-500 transition-colors">
                      Reset Form
                    </button>
                    <button type="submit" disabled={loading}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl bg-secondary-DEFAULT hover:bg-secondary-600 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60">
                      {loading
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Publishing…</>
                        : <><PlusCircle className="w-4 h-4"/> Publish Package</>
                      }
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <MobileDashboardNav/>
      <Footer/>
    </>
  );
}
