import React from "react";
import Image from "next/image";
import Link  from "next/link";
import { Target, Eye, Heart, Globe, Award, Users, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const TEAM = [
  { name:"Alexandra Chen",  role:"Co-Founder & CEO",          avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80", bio:"Former Lonely Planet editor. 15 years of travel journalism across 90 countries." },
  { name:"Marcus Rivera",   role:"Co-Founder & CTO",          avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80", bio:"Ex-Google engineer passionate about using technology to make travel accessible." },
  { name:"Priya Nair",      role:"Head of Partnerships",      avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80", bio:"Built our global network of 500+ vetted local guides and tour operators." },
  { name:"James Okonkwo",   role:"Head of Customer Success",  avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80", bio:"Dedicated to ensuring every TravelNest journey exceeds expectations." },
];

const VALUES = [
  { icon:Heart,  title:"Traveler-First",       desc:"Every decision starts with one question: does this make the traveler's experience better?" },
  { icon:Globe,  title:"Sustainable Travel",    desc:"We partner only with operators who share our commitment to preserving destinations we love." },
  { icon:Award,  title:"Uncompromising Quality",desc:"Every package is personally vetted. If we wouldn't book it ourselves, we won't list it." },
  { icon:Users,  title:"Community-Driven",      desc:"Our best insights come from 50,000+ travellers. We listen, learn, and constantly improve." },
];

export default function AboutPage() {
  return (
    <>
      <Navbar/>
      <main>
        {/* Hero */}
        <section className="relative h-72 md:h-96 flex items-end overflow-hidden">
          <Image src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1800&q=85" alt="About TravelNest" fill className="object-cover" priority/>
          <div className="absolute inset-0 hero-overlay"/>
          <div className="container-custom relative z-10 pb-12 text-white">
            <p className="text-secondary-DEFAULT text-sm font-semibold uppercase tracking-widest mb-2">About Us</p>
            <h1 className="text-3xl md:text-5xl font-extrabold">We're TravelNest</h1>
            <p className="text-white/70 mt-3 text-base max-w-xl">A team of passionate travelers on a mission to make extraordinary journeys accessible to everyone.</p>
          </div>
        </section>

        {/* Story */}
        <section className="section-padding bg-white dark:bg-navy-800">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-secondary-DEFAULT text-sm font-semibold uppercase tracking-widest mb-3">Our Story</p>
                <h2 className="section-title mb-5">Born from a Missed Flight and a Serendipitous Journey</h2>
                <div className="flex flex-col gap-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  <p>TravelNest began in 2015 when Alexandra and Marcus, strangers at the time, both missed a connecting flight in Istanbul. With eight hours to kill, they explored the city together — guided by a retired history teacher named Mehmet, who transformed a transit delay into an unforgettable adventure.</p>
                  <p>They returned home with a shared frustration: why was it so hard to connect with knowledgeable local guides? Why did booking a tour require navigating a dozen websites with no quality guarantees?</p>
                  <p>Two years later, they launched TravelNest — a platform where every package is personally curated, every guide is certified, and every traveller is supported from booking to return. Today, TravelNest has helped over 50,000 travellers create memories that last a lifetime.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { src:"https://images.unsplash.com/photo-1537996088602-50b28e3b6e0e?w=400&q=80", mt:"" },
                  { src:"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80", mt:"mt-8" },
                  { src:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", mt:"-mt-4" },
                  { src:"https://images.unsplash.com/photo-1469796466635-7ada0d5ee5cf?w=400&q=80", mt:"mt-4" },
                ].map(({ src, mt }, i) => (
                  <Image key={i} src={src} alt="" width={300} height={300} className={`rounded-2xl object-cover w-full h-48 ${mt}`}/>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-padding bg-section-gradient dark:bg-navy-900">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon:Target, title:"Our Mission", color:"bg-primary-50 dark:bg-primary-900/30 text-primary-700", text:"To connect curious travelers with authentic, transformative experiences by providing access to handpicked tours, certified local guides, and unparalleled booking support — all in one place." },
                { icon:Eye,    title:"Our Vision",  color:"bg-secondary-50 dark:bg-secondary-900/20 text-secondary-700", text:"A world where every person, regardless of budget or experience level, can safely explore the planet — and where travel creates meaningful connections between cultures and communities." },
              ].map(({ icon:Icon, title, color, text }) => (
                <div key={title} className="card p-8">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${color}`}>
                    <Icon className="w-6 h-6"/>
                  </div>
                  <h3 className="text-xl font-bold text-primary-700 dark:text-white mb-3">{title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-white dark:bg-navy-800">
          <div className="container-custom">
            <div className="text-center mb-12">
              <p className="text-secondary-DEFAULT text-sm font-semibold uppercase tracking-widest mb-2">What We Stand For</p>
              <h2 className="section-title mx-auto">Our Core Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((v) => (
                <div key={v.title} className="card p-6 text-center group hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <v.icon className="w-6 h-6 text-primary-700 dark:text-primary-300"/>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-2 text-sm">{v.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="section-padding bg-section-gradient dark:bg-navy-900">
          <div className="container-custom">
            <div className="text-center mb-12">
              <p className="text-secondary-DEFAULT text-sm font-semibold uppercase tracking-widest mb-2">The People Behind TravelNest</p>
              <h2 className="section-title mx-auto">Meet Our Team</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM.map((m) => (
                <div key={m.name} className="card p-6 text-center group hover:-translate-y-1 transition-all duration-300">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 shadow-card">
                    <Image src={m.avatar} alt={m.name} width={80} height={80} className="object-cover w-full h-full"/>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">{m.name}</h3>
                  <p className="text-secondary-DEFAULT text-xs font-semibold mt-0.5 mb-3">{m.role}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{m.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary-gradient text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-white/70 text-base mb-8 max-w-xl mx-auto">Join 50,000+ travelers who trust TravelNest to create unforgettable experiences.</p>
            <Link href="/packages" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-secondary-DEFAULT hover:bg-secondary-600 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg">
              Explore All Tours <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}
