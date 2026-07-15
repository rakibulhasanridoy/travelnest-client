"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link  from "next/link";
import { Clock, Tag, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { NewsletterSection } from "@/components/home/sections";
import { BlogCardSkeleton }   from "@/components/ui/index";
import { IBlog }               from "@/types";
import { formatDate }          from "@/utils/helpers";
import { blogsApi }            from "@/utils/api";

const CATS = ["All","Destination Guide","Travel Tips","Budget Travel","Safety","Food & Culture","Visa Guide","Solo Travel"];

const STATIC: Partial<IBlog>[] = [
  { _id:"1", slug:"best-places-japan-2025",        title:"Best Places to Visit in Japan in 2025",           excerpt:"From ancient temples to neon-lit arcades — your definitive 2025 Japan guide.",           coverImage:"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",  category:"Destination Guide", readTime:8,  tags:["Japan","Asia","Culture"],            author:{ name:"Hana Yoshida",  avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80" }, publishedAt:new Date("2025-03-15").toISOString() },
  { _id:"2", slug:"southeast-asia-budget-guide",   title:"Southeast Asia Under $50 a Day",                  excerpt:"Beaches, temples, street food and diving — without breaking the bank.",                 coverImage:"https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80",  category:"Budget Travel",     readTime:12, tags:["Budget","SE Asia","Backpacking"],   author:{ name:"Ryan Torres",   avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80" }, publishedAt:new Date("2025-02-28").toISOString() },
  { _id:"3", slug:"solo-female-travel-safety-2025",title:"Solo Female Travel: A Real Safety Guide for 2025", excerpt:"Field-tested advice from women who have explored the world alone.",                   coverImage:"https://images.unsplash.com/photo-1469796466635-7ada0d5ee5cf?w=800&q=80",  category:"Solo Travel",       readTime:10, tags:["Solo","Safety","Women"],             author:{ name:"Emma Clarke",   avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80" }, publishedAt:new Date("2025-02-10").toISOString() },
  { _id:"4", slug:"schengen-visa-checklist-2025",  title:"Complete Schengen Visa Checklist 2025",            excerpt:"The full document checklist, timelines, common refusal reasons, and how to appeal.",  coverImage:"https://images.unsplash.com/photo-1502602114-f9c15b65a7a9?w=800&q=80",  category:"Visa Guide",        readTime:9,  tags:["Visa","Europe","Planning"],         author:{ name:"Sophia Müller", avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80" }, publishedAt:new Date("2025-01-22").toISOString() },
  { _id:"5", slug:"insider-bali-travel-tips",      title:"Insider Bali Travel Tips: What Nobody Tells You",  excerpt:"Skip the tourist traps. Local knowledge that separates mediocre Bali from extraordinary.", coverImage:"https://images.unsplash.com/photo-1537996088602-50b28e3b6e0e?w=800&q=80", category:"Travel Tips",       readTime:7,  tags:["Bali","Indonesia","Tips"],          author:{ name:"Made Suartika", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80" }, publishedAt:new Date("2025-01-10").toISOString() },
  { _id:"6", slug:"street-food-guide-se-asia",     title:"The Ultimate Street Food Guide to Southeast Asia", excerpt:"Pad Thai in Bangkok, banh mi in Hoi An, nasi goreng in Jakarta — the world's greatest street food.", coverImage:"https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80", category:"Food & Culture",    readTime:11, tags:["Food","Street Food","Asia"],        author:{ name:"Lisa Chen",     avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80" }, publishedAt:new Date("2024-12-18").toISOString() },
];

export default function BlogPage() {
  const [blogs,    setBlogs]    = useState<Partial<IBlog>[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [category, setCategory] = useState("All");
  const [search,   setSearch]   = useState("");

  useEffect(() => {
    blogsApi.getAll()
      .then((r) => { const d = (r as { data: IBlog[] }).data; setBlogs(d?.length ? d : STATIC); })
      .catch(() => setBlogs(STATIC))
      .finally(() => setLoading(false));
  }, []);

  const filtered = blogs.filter((b) => {
    const matchCat = category === "All" || b.category === category;
    const matchSrc = !search || b.title?.toLowerCase().includes(search.toLowerCase()) || b.excerpt?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSrc;
  });

  const featured = filtered[0];
  const rest     = filtered.slice(1);

  return (
    <>
      <Navbar/>
      <main>
        {/* Hero */}
        <div className="bg-primary-gradient pt-28 pb-14 text-white">
          <div className="container-custom">
            <p className="text-secondary-DEFAULT text-sm font-semibold uppercase tracking-widest mb-2">Travel Journal</p>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3">Stories, Tips & Guides</h1>
            <p className="text-white/70 text-base max-w-xl">Expert travel advice, destination guides, and budget hacks — written by travellers, for travellers.</p>
          </div>
        </div>

        <section className="section-padding bg-slate-50 dark:bg-navy-900">
          <div className="container-custom">
            {/* Search + Category Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search articles…" className="input-field pl-10"/>
              </div>
              <div className="flex gap-2 flex-wrap">
                {CATS.slice(0, 5).map((c) => (
                  <button key={c} onClick={() => setCategory(c)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      category === c
                        ? "bg-primary-700 text-white shadow-md"
                        : "bg-white dark:bg-navy-700 border border-slate-200 dark:border-primary-700 text-slate-600 dark:text-slate-300 hover:border-primary-300"
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i}/>)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="card p-16 text-center">
                <p className="text-slate-500 dark:text-slate-400">No articles found. Try a different search or category.</p>
              </div>
            ) : (
              <>
                {/* Featured Article */}
                {featured && (
                  <Link href={`/blog/${featured.slug}`} className="group block card overflow-hidden mb-8 hover:-translate-y-1 transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="relative h-64 md:h-auto">
                        <Image src={featured.coverImage!} alt={featured.title!} fill className="object-cover group-hover:scale-105 transition-transform duration-500"/>
                        <span className="absolute top-4 left-4 badge bg-secondary-DEFAULT text-white text-xs">★ Featured</span>
                      </div>
                      <div className="p-8 flex flex-col justify-center">
                        <span className="badge bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs mb-4 inline-flex">
                          <Tag className="w-3 h-3 mr-1"/> {featured.category}
                        </span>
                        <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white mb-3 leading-snug group-hover:text-primary-700 dark:group-hover:text-secondary-DEFAULT transition-colors">
                          {featured.title}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed line-clamp-3">{featured.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {featured.author?.avatar && <img src={featured.author.avatar} alt={featured.author.name} className="w-8 h-8 rounded-full object-cover"/>}
                            <div>
                              <p className="text-xs font-semibold text-slate-700 dark:text-white">{featured.author?.name}</p>
                              <p className="text-xs text-slate-400">{formatDate(featured.publishedAt!)}</p>
                            </div>
                          </div>
                          <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {featured.readTime} min</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Grid */}
                {rest.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {rest.map((b) => (
                      <Link key={b._id} href={`/blog/${b.slug}`} className="card overflow-hidden group hover:-translate-y-1 transition-all duration-300 flex flex-col">
                        <div className="relative h-48 overflow-hidden">
                          <Image src={b.coverImage!} alt={b.title!} fill className="object-cover group-hover:scale-105 transition-transform duration-500"/>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
                          <span className="absolute top-3 left-3 badge bg-white/90 text-primary-700 text-xs"><Tag className="w-3 h-3"/> {b.category}</span>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-bold text-slate-800 dark:text-white text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary-700 dark:group-hover:text-secondary-DEFAULT transition-colors">
                            {b.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">{b.excerpt}</p>
                          {b.tags && b.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {b.tags.slice(0,3).map((t) => <span key={t} className="tag-pill">{t}</span>)}
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-primary-800">
                            <div className="flex items-center gap-2">
                              {b.author?.avatar && <img src={b.author.avatar} alt={b.author.name} className="w-7 h-7 rounded-full object-cover"/>}
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{b.author?.name}</span>
                            </div>
                            <span className="flex items-center gap-1 text-xs text-slate-400"><Clock className="w-3 h-3"/> {b.readTime} min</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
        <NewsletterSection/>
      </main>
      <Footer/>
    </>
  );
}
