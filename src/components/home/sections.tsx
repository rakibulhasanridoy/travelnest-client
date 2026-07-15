"use client";
import React, { useState, useEffect, useRef } from "react";
import Image     from "next/image";
import Link      from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, MapPin, Star, ArrowRight, Shield, DollarSign,
  HeadphonesIcon, Award, Globe, Clock, Quote, ChevronDown, Send,
  Tag,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { cn, getCountryFlag, formatDate } from "@/utils/helpers";
import { blogsApi, newsletterApi }         from "@/utils/api";
import { IBlog }                            from "@/types";
import { BlogCardSkeleton }                 from "@/components/ui/index";
import toast from "react-hot-toast";

/* ══════════════════════════════════════════════════════════════════════════════
   HERO SECTION
══════════════════════════════════════════════════════════════════════════════ */
const HERO_IMGS = [
  "https://images.unsplash.com/photo-1537996088602-50b28e3b6e0e?w=1800&q=85",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=85",
  "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1800&q=85",
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1800&q=85",
];
const TYPED_WORDS = ["Bali","Tokyo","Maldives","Switzerland","Santorini","Iceland","Morocco","Nepal"];

export function HeroSection() {
  const router = useRouter();
  const [q,       setQ]       = useState("");
  const [imgIdx,  setImgIdx]  = useState(0);
  const [word,    setWord]    = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting,setDeleting]= useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { const t = setInterval(() => setImgIdx((i) => (i+1) % HERO_IMGS.length), 5000); return () => clearInterval(t); }, []);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const w = TYPED_WORDS[wordIdx];
    const speed = deleting ? 60 : 120;
    const t = setTimeout(() => {
      if (!deleting && word === w)  { setTimeout(() => setDeleting(true), 1400); return; }
      if (deleting  && word === "") { setDeleting(false); setWordIdx((i) => (i+1) % TYPED_WORDS.length); return; }
      setWord(deleting ? w.slice(0, word.length-1) : w.slice(0, word.length+1));
    }, speed);
    return () => clearTimeout(t);
  }, [word, deleting, wordIdx]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(q.trim() ? `/packages?search=${encodeURIComponent(q.trim())}` : "/packages");
  };

  return (
    <section className="relative h-[88vh] min-h-[600px] max-h-[900px] flex items-center overflow-hidden">
      {HERO_IMGS.map((src, i) => (
        <div key={i} className={cn("absolute inset-0 transition-opacity duration-1000", i===imgIdx ? "opacity-100":"opacity-0")}>
          <Image src={src} alt="Destination" fill className="object-cover" priority={i===0}/>
        </div>
      ))}
      <div className="absolute inset-0 hero-overlay"/>
      <div className="container-custom relative z-10 text-white pt-20">
        <div className={cn("max-w-3xl transition-all duration-700", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-sm font-medium text-white/90 mb-6">
            <Star className="w-3.5 h-3.5 fill-secondary-DEFAULT text-secondary-DEFAULT"/>
            Trusted by 50,000+ travelers worldwide
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4">
            Discover the Magic of{" "}
            <span className="text-secondary-DEFAULT">{word}</span>
            <span className="animate-pulse text-secondary-DEFAULT">|</span>
          </h1>
          <p className="text-lg md:text-xl text-white/75 max-w-xl mb-10 leading-relaxed">
            Handpicked tours across 50+ countries. Expert guides, unbeatable prices, and memories that last a lifetime.
          </p>
          <form onSubmit={handleSearch} className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-2 flex gap-2 max-w-xl mb-8 shadow-2xl">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60"/>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Where do you want to go?"
                className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder:text-white/50 text-sm focus:outline-none"/>
            </div>
            <button type="submit" className="flex items-center gap-2 px-5 py-3 bg-secondary-DEFAULT hover:bg-secondary-600 text-white text-sm font-semibold rounded-xl transition-all shadow-md shrink-0">
              <Search className="w-4 h-4"/> Search
            </button>
          </form>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-white/60">Popular:</span>
            {["Bali","Japan","Maldives","Greece"].map((d) => (
              <button key={d} onClick={() => router.push(`/packages?search=${d}`)}
                className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-medium transition-all">
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className={cn("absolute bottom-8 right-4 sm:right-8 transition-all duration-700 delay-300", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 flex flex-col gap-2">
            {[{v:"50K+",l:"Happy Travelers"},{v:"200+",l:"Tour Packages"},{v:"4.9★",l:"Avg. Rating"}].map(({v,l}) => (
              <div key={l} className="flex items-center gap-3">
                <span className="text-xl font-black text-secondary-DEFAULT">{v}</span>
                <span className="text-xs text-white/70">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {HERO_IMGS.map((_,i) => (
          <button key={i} onClick={() => setImgIdx(i)}
            className={cn("transition-all duration-300 rounded-full", i===imgIdx ? "w-6 h-2 bg-secondary-DEFAULT" : "w-2 h-2 bg-white/50 hover:bg-white/80")}/>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   POPULAR DESTINATIONS
══════════════════════════════════════════════════════════════════════════════ */
const DESTINATIONS = [
  { name:"Bali",        country:"Indonesia",   image:"https://images.unsplash.com/photo-1537996088602-50b28e3b6e0e?w=600&q=80", packages:12 },
  { name:"Maldives",    country:"Maldives",    image:"https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80", packages:8  },
  { name:"Switzerland", country:"Switzerland", image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", packages:9  },
  { name:"Japan",       country:"Japan",       image:"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80", packages:14 },
  { name:"Santorini",   country:"Greece",      image:"https://images.unsplash.com/photo-1469796466635-7ada0d5ee5cf?w=600&q=80", packages:7  },
  { name:"Iceland",     country:"Iceland",     image:"https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80", packages:6  },
];

export function PopularDestinations() {
  return (
    <section className="section-padding bg-white dark:bg-navy-800">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-secondary-DEFAULT text-sm font-semibold uppercase tracking-widest mb-2">Top Picks</p>
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle">From lush tropical islands to snow-capped peaks — the world's most sought-after destinations, curated for you.</p>
          </div>
          <Link href="/packages" className="flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-300 hover:text-secondary-DEFAULT transition-colors whitespace-nowrap group">
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {DESTINATIONS.map((d) => (
            <Link key={d.name} href={`/packages?search=${d.name}`}
              className="destination-card group block overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-44 overflow-hidden">
                <Image src={d.image} alt={d.name} fill className="destination-img object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"/>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 px-2 text-center">
                  <span className="text-2xl mb-1">{getCountryFlag(d.country)}</span>
                  <h3 className="text-white font-bold text-sm leading-tight">{d.name}</h3>
                  <p className="text-white/70 text-xs mt-0.5">{d.packages} tours</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   WHY CHOOSE US
══════════════════════════════════════════════════════════════════════════════ */
const FEATURES = [
  { icon:Shield,         title:"100% Secure Booking",    desc:"Bank-grade encryption protects every payment and personal detail.",              color:"bg-blue-50 dark:bg-blue-900/20 text-blue-600" },
  { icon:DollarSign,     title:"Best Price Promise",     desc:"Find a lower price elsewhere and we'll match it — no questions asked.",          color:"bg-green-50 dark:bg-green-900/20 text-green-600" },
  { icon:Award,          title:"Expert Local Guides",    desc:"Every tour led by certified, English-speaking guides with 5+ years experience.", color:"bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600" },
  { icon:HeadphonesIcon, title:"24/7 Travel Support",    desc:"Our team is available round the clock — wherever you are in the world.",         color:"bg-purple-50 dark:bg-purple-900/20 text-purple-600" },
  { icon:Globe,          title:"50+ Countries Covered",  desc:"Curated tours span six continents and more than 50 incredible countries.",       color:"bg-teal-50 dark:bg-teal-900/20 text-teal-600" },
  { icon:Clock,          title:"Flexible Cancellation",  desc:"Free cancellation up to 7 days before your departure — no penalty.",            color:"bg-orange-50 dark:bg-orange-900/20 text-orange-600" },
];

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-white dark:bg-navy-800">
      <div className="container-custom">
        <div className="text-center mb-14">
          <p className="text-secondary-DEFAULT text-sm font-semibold uppercase tracking-widest mb-2">Why TravelNest</p>
          <h2 className="section-title mx-auto">Your Journey, Our Priority</h2>
          <p className="section-subtitle mx-auto text-center mt-4">We're not just a booking platform — we're your travel partner.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 flex gap-4 group hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-xl ${f.color} group-hover:scale-110 transition-transform`}>
                <f.icon className="w-5 h-5"/>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-base mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   TRAVEL STATS
══════════════════════════════════════════════════════════════════════════════ */
const STATS = [
  { icon:Globe,   value:50,    suffix:"+", label:"Countries",      decimal:false },
  { icon:Award,   value:50000, suffix:"+", label:"Happy Travelers",decimal:false },
  { icon:Clock,   value:200,   suffix:"+", label:"Tour Packages",  decimal:false },
  { icon:Star,    value:4.9,   suffix:"★", label:"Avg. Rating",    decimal:true  },
];
const CHART_DATA = [
  {month:"Jan",bookings:320},{month:"Feb",bookings:410},{month:"Mar",bookings:580},
  {month:"Apr",bookings:720},{month:"May",bookings:940},{month:"Jun",bookings:1100},
  {month:"Jul",bookings:1350},{month:"Aug",bookings:1280},{month:"Sep",bookings:1060},
  {month:"Oct",bookings:890},{month:"Nov",bookings:640},{month:"Dec",bookings:780},
];

function useCountUp(target: number, duration=2000, go=false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!go) return;
    let t0: number;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setCount(parseFloat((p * target).toFixed(1)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, go]);
  return count;
}

function StatCard({ s, go }: { s: typeof STATS[0]; go: boolean }) {
  const c = useCountUp(s.value, 2200, go);
  return (
    <div className="card p-6 text-center group hover:-translate-y-1 transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
        <s.icon className="w-6 h-6 text-primary-700 dark:text-primary-300"/>
      </div>
      <div className="stat-number">{s.decimal ? c.toFixed(1) : Math.floor(c).toLocaleString()}{s.suffix}</div>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{s.label}</p>
    </div>
  );
}

export function TravelStats() {
  const [go, setGo]   = useState(false);
  const ref           = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setGo(true); obs.disconnect(); } }, { threshold:0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section ref={ref} className="section-padding bg-section-gradient dark:bg-navy-900">
      <div className="container-custom">
        <div className="text-center mb-14">
          <p className="text-secondary-DEFAULT text-sm font-semibold uppercase tracking-widest mb-2">By the Numbers</p>
          <h2 className="section-title mx-auto">TravelNest in Numbers</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {STATS.map((s) => <StatCard key={s.label} s={s} go={go}/>)}
        </div>
        <div className="card p-6 md:p-8">
          <h3 className="font-bold text-slate-800 dark:text-white mb-1">Monthly Bookings (2024)</h3>
          <p className="text-xs text-slate-400 mb-6">Peak season: June – August</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={CHART_DATA} barSize={32} margin={{left:-20}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,58,92,.08)" vertical={false}/>
              <XAxis dataKey="month" tick={{fontSize:12,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:12,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:"12px",fontSize:"13px",fontFamily:"Inter,sans-serif"}} formatter={(v:number)=>[v.toLocaleString(),"Bookings"]} cursor={{fill:"rgba(27,58,92,.04)"}}/>
              <Bar dataKey="bookings" fill="#1B3A5C" radius={[8,8,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  { name:"Sarah Mitchell",  location:"New York, USA",   avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80", rating:5, tour:"Bali Paradise Experience", text:"TravelNest made our dream Bali trip absolutely effortless. Every detail was perfectly organised. Our guide Made was incredibly knowledgeable. Worth every penny." },
  { name:"James Okafor",    location:"London, UK",      avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80", rating:5, tour:"Swiss Alps Adventure",     text:"Switzerland exceeded all expectations. The glacier hike, the cheese fondue evening in Grindelwald — moments I'll tell my grandchildren about. Seamless booking." },
  { name:"Mei Lin Zhang",   location:"Singapore",       avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80", rating:5, tour:"Tokyo City Explorer",      text:"As a solo traveller, safety and convenience are everything. TravelNest's Tokyo package gave me both. The small group size meant I made friends for life." },
  { name:"Carlos Mendez",   location:"Madrid, Spain",   avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80", rating:5, tour:"Maldives Luxury Retreat",  text:"Booked the Maldives honeymoon package. The overwater villa was breathtaking, the snorkelling world-class, and the sunset cruise a personal touch we didn't expect." },
  { name:"Anika Patel",     location:"Mumbai, India",   avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80", rating:5, tour:"Northern Lights Iceland",  text:"Seeing the Northern Lights was on my bucket list for a decade. TravelNest made it magical — the small group, the glacier hike, the hot springs. Pure perfection." },
  { name:"Tom Bergström",   location:"Stockholm, Sweden",avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80", rating:5, tour:"Machu Picchu Discovery",  text:"The Peru trip was a genuine adventure — challenging but deeply rewarding. Our guide's knowledge of Incan history transformed Machu Picchu from a site into a story." },
];

export function Testimonials() {
  const [idx, setIdx] = useState(0);
  const visible = [TESTIMONIALS[idx], TESTIMONIALS[(idx+1)%TESTIMONIALS.length], TESTIMONIALS[(idx+2)%TESTIMONIALS.length]];
  return (
    <section className="section-padding bg-white dark:bg-navy-800">
      <div className="container-custom">
        <div className="text-center mb-14">
          <p className="text-secondary-DEFAULT text-sm font-semibold uppercase tracking-widest mb-2">Traveler Stories</p>
          <h2 className="section-title mx-auto">What Our Travelers Say</h2>
          <p className="section-subtitle mx-auto text-center mt-4">Real experiences from real adventurers — unedited and unfiltered.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {visible.map((t,i) => (
            <div key={i} className="testimonial-card card p-6 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-xl object-cover shrink-0"/>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 dark:text-white text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.location}</p>
                  <div className="flex mt-1">{Array.from({length:t.rating}).map((_,s) => <Star key={s} className="w-3 h-3 fill-secondary-DEFAULT text-secondary-DEFAULT"/>)}</div>
                </div>
                <Quote className="w-6 h-6 text-primary-200 dark:text-primary-700 shrink-0"/>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic flex-1">"{t.text}"</p>
              <div className="pt-3 border-t border-slate-100 dark:border-primary-800">
                <span className="badge bg-secondary-50 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300 text-xs">✈ {t.tour}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2">
          {TESTIMONIALS.map((_,i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={cn("transition-all duration-300 rounded-full", i===idx ? "w-6 h-2 bg-primary-700" : "w-2 h-2 bg-slate-200 dark:bg-primary-800 hover:bg-primary-300")}/>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   LATEST BLOGS
══════════════════════════════════════════════════════════════════════════════ */
const FALLBACK: Partial<IBlog>[] = [
  { _id:"1", slug:"best-places-japan-2025", title:"Best Places to Visit in Japan in 2025", excerpt:"From ancient temples to neon-lit arcades — your definitive 2025 Japan travel guide.", coverImage:"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80", category:"Destination Guide", readTime:8, author:{name:"Hana Yoshida",avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80"}, publishedAt:new Date("2025-03-15").toISOString() },
  { _id:"2", slug:"southeast-asia-budget-guide", title:"Southeast Asia Under $50 a Day", excerpt:"Beaches, temples, street food and diving — without breaking the bank.", coverImage:"https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80", category:"Budget Travel", readTime:12, author:{name:"Ryan Torres",avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80"}, publishedAt:new Date("2025-02-28").toISOString() },
  { _id:"3", slug:"solo-female-travel-safety-2025", title:"Solo Female Travel: A Real Safety Guide for 2025", excerpt:"Field-tested advice from women who have explored the world alone.", coverImage:"https://images.unsplash.com/photo-1469796466635-7ada0d5ee5cf?w=600&q=80", category:"Solo Travel", readTime:10, author:{name:"Emma Clarke",avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80"}, publishedAt:new Date("2025-02-10").toISOString() },
];

export function LatestBlogs() {
  const [blogs,   setBlogs]   = useState<Partial<IBlog>[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    blogsApi.getAll(3)
      .then((r) => { const d = (r as {data:IBlog[]}).data; setBlogs(d?.length ? d : FALLBACK); })
      .catch(() => setBlogs(FALLBACK))
      .finally(() => setLoading(false));
  }, []);
  return (
    <section className="section-padding bg-section-gradient dark:bg-navy-900">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-secondary-DEFAULT text-sm font-semibold uppercase tracking-widest mb-2">Travel Journal</p>
            <h2 className="section-title">Latest Travel Guides</h2>
            <p className="section-subtitle">Insider tips, destination deep-dives, and budget hacks — written by seasoned travellers.</p>
          </div>
          <Link href="/blog" className="flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-300 hover:text-secondary-DEFAULT transition-colors whitespace-nowrap group">
            Read all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? Array.from({length:3}).map((_,i) => <BlogCardSkeleton key={i}/>)
            : blogs.map((b) => (
                <Link key={b._id} href={`/blog/${b.slug}`} className="card overflow-hidden group block hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <Image src={b.coverImage!} alt={b.title!} fill className="object-cover group-hover:scale-105 transition-transform duration-500"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
                    <span className="absolute top-3 left-3 badge bg-white/90 text-primary-700 text-xs"><Tag className="w-3 h-3"/> {b.category}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-800 dark:text-white text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary-700 dark:group-hover:text-secondary-DEFAULT transition-colors">{b.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{b.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {b.author?.avatar && <img src={b.author.avatar} alt={b.author.name} className="w-7 h-7 rounded-full object-cover"/>}
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{b.author?.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400"><Clock className="w-3.5 h-3.5"/> {b.readTime} min</div>
                    </div>
                  </div>
                </Link>
              ))
          }
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   FAQ
══════════════════════════════════════════════════════════════════════════════ */
const FAQS = [
  { q:"How do I book a tour package?", a:"Browse our packages, click 'View Details', then 'Book Now'. You'll need to be logged in and select your travel date and number of travellers. Booking is confirmed instantly." },
  { q:"Can I cancel or modify my booking?", a:"Yes — you can cancel any booking free of charge up to 7 days before departure. Manage all bookings from your dashboard under 'My Bookings'." },
  { q:"Are the tour guides certified?", a:"All TravelNest guides hold official certifications from their country's tourism board, speak fluent English, and have a minimum of 5 years of guiding experience." },
  { q:"What is included in the tour price?", a:"Each listing clearly shows 'What's Included' and 'What's Not Included'. Typically: accommodation, guided tours, transfers, select meals. International flights are generally not included." },
  { q:"Is it safe to travel with TravelNest?", a:"Safety is our top priority. All packages include comprehensive travel insurance, 24/7 emergency support, and pre-vetted accommodation and transport partners." },
  { q:"What payment methods do you accept?", a:"We accept all major credit/debit cards (Visa, Mastercard, Amex) and PayPal. All transactions are protected by 256-bit SSL encryption." },
];

export function FAQ() {
  const [open, setOpen] = useState<number|null>(0);
  return (
    <section className="section-padding bg-white dark:bg-navy-800">
      <div className="container-custom">
        <div className="text-center mb-14">
          <p className="text-secondary-DEFAULT text-sm font-semibold uppercase tracking-widest mb-2">FAQ</p>
          <h2 className="section-title mx-auto">Frequently Asked Questions</h2>
          <p className="section-subtitle mx-auto text-center mt-4">Everything you need to know before booking your next adventure.</p>
        </div>
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {FAQS.map((f,i) => (
            <div key={i} className="card overflow-hidden">
              <button onClick={() => setOpen(open===i ? null : i)} className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
                <span className="font-semibold text-slate-800 dark:text-white text-sm">{f.q}</span>
                <ChevronDown className={cn("w-4 h-4 shrink-0 text-slate-400 transition-transform duration-300", open===i && "rotate-180 text-secondary-DEFAULT")}/>
              </button>
              {open===i && (
                <div className="px-6 pb-5 border-t border-slate-100 dark:border-primary-800">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-4">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   NEWSLETTER SECTION
══════════════════════════════════════════════════════════════════════════════ */
export function NewsletterSection() {
  const [email,  setEmail]  = useState("");
  const [loading,setLoading]= useState(false);
  const [done,   setDone]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await newsletterApi.subscribe(email);
      setDone(true);
      toast.success("Subscribed! Welcome to the TravelNest community.");
      setEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-primary-gradient">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center text-white">
          <p className="text-secondary-DEFAULT text-sm font-semibold uppercase tracking-widest mb-3">Stay Inspired</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Get the Best Travel Deals</h2>
          <p className="text-white/75 text-base mb-8 leading-relaxed">Join 25,000+ travellers who receive exclusive discounts, destination guides, and early-access offers every week.</p>
          {done ? (
            <div className="bg-white/15 border border-white/25 rounded-2xl px-8 py-6 font-semibold">
              🎉 You're subscribed! Check your inbox for a welcome gift.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" required
                className="flex-1 min-w-0 px-5 py-3.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-secondary-DEFAULT focus:ring-1 focus:ring-secondary-DEFAULT"/>
              <button type="submit" disabled={loading} className="px-6 py-3.5 rounded-xl bg-secondary-DEFAULT hover:bg-secondary-600 text-white text-sm font-semibold transition-all shadow-md whitespace-nowrap disabled:opacity-60 flex items-center gap-2">
                <Send className="w-4 h-4"/> {loading ? "Joining…" : "Subscribe"}
              </button>
            </form>
          )}
          <p className="text-white/50 text-xs mt-4">No spam, ever. Unsubscribe with one click.</p>
        </div>
      </div>
    </section>
  );
}
