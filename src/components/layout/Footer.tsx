"use client";
import React, { useState } from "react";
import Link   from "next/link";
import { Compass, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin, ArrowRight, Send } from "lucide-react";
import { newsletterApi } from "@/utils/api";
import toast from "react-hot-toast";

const LINKS = [
  { href:"/",         label:"Home"             },
  { href:"/packages", label:"Explore Packages" },
  { href:"/about",    label:"About Us"         },
  { href:"/blog",     label:"Travel Blog"      },
  { href:"/contact",  label:"Contact Us"       },
];
const DESTINATIONS = [
  { href:"/packages?search=Bali",        label:"Bali, Indonesia"    },
  { href:"/packages?search=Japan",       label:"Tokyo, Japan"       },
  { href:"/packages?search=Maldives",    label:"Maldives"           },
  { href:"/packages?search=Switzerland", label:"Swiss Alps"         },
  { href:"/packages?search=Greece",      label:"Santorini, Greece"  },
  { href:"/packages?search=Iceland",     label:"Iceland"            },
];
const SOCIALS = [
  { Icon:Facebook,  href:"#", label:"Facebook"  },
  { Icon:Twitter,   href:"#", label:"Twitter"   },
  { Icon:Instagram, href:"#", label:"Instagram" },
  { Icon:Youtube,   href:"#", label:"YouTube"   },
  { Icon:Linkedin,  href:"#", label:"LinkedIn"  },
];

export default function Footer() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try { await newsletterApi.subscribe(email); toast.success("Subscribed!"); setEmail(""); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <footer className="bg-primary-dark dark:bg-navy-900 text-white" style={{ backgroundColor:"#0a1828" }}>
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-secondary-gradient rounded-xl flex items-center justify-center">
                <Compass className="w-5 h-5 text-white"/>
              </div>
              <span className="text-xl font-bold">Travel<span className="text-secondary-DEFAULT">Nest</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">Your trusted partner for unforgettable journeys. Handpicked tours, expert guides, and memories that last a lifetime.</p>
            <div className="flex flex-col gap-3">
              <a href="mailto:hello@travelnest.com" className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-secondary-DEFAULT transition-colors"><Mail className="w-4 h-4 shrink-0"/> hello@travelnest.com</a>
              <a href="tel:+15551234567"            className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-secondary-DEFAULT transition-colors"><Phone className="w-4 h-4 shrink-0"/> +1 (555) 123-4567</a>
              <div className="flex items-start gap-2.5 text-sm text-slate-400"><MapPin className="w-4 h-4 shrink-0 mt-0.5"/> <span>142 Travel Street, Suite 4B<br/>New York, NY 10001, USA</span></div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold mb-5">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex items-center gap-2 text-sm text-slate-400 hover:text-secondary-DEFAULT transition-colors group">
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"/>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-base font-bold mb-5">Popular Destinations</h4>
            <ul className="flex flex-col gap-3">
              {DESTINATIONS.map((d) => (
                <li key={d.href}>
                  <Link href={d.href} className="flex items-center gap-2 text-sm text-slate-400 hover:text-secondary-DEFAULT transition-colors group">
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"/>
                    {d.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-base font-bold mb-2">Stay in the Loop</h4>
            <p className="text-sm text-slate-400 mb-5">Get exclusive travel deals and destination guides straight to your inbox.</p>
            <form onSubmit={handleSub} className="flex gap-2">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required
                className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-secondary-DEFAULT transition-colors"/>
              <button type="submit" disabled={loading} className="px-3 py-2.5 rounded-xl bg-secondary-DEFAULT hover:bg-secondary-600 text-white transition-colors disabled:opacity-60 shrink-0">
                <Send className="w-4 h-4"/>
              </button>
            </form>
            <div className="mt-7">
              <h5 className="text-sm font-semibold mb-3">Follow Us</h5>
              <div className="flex gap-2">
                {SOCIALS.map(({Icon, href, label}) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-secondary-DEFAULT text-slate-400 hover:text-white transition-all">
                    <Icon className="w-4 h-4"/>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} TravelNest. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {["Privacy Policy","Terms of Service","Cookie Policy"].map((t) => (
              <Link key={t} href={`/${t.toLowerCase().replace(/\s+/g,"-")}`} className="text-xs text-slate-500 hover:text-secondary-DEFAULT transition-colors">{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
