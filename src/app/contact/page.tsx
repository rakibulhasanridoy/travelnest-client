"use client";
import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import toast  from "react-hot-toast";

const INFO = [
  { icon:Mail,  title:"Email Us",       lines:["hello@travelnest.com","support@travelnest.com"],          color:"bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"   },
  { icon:Phone, title:"Call Us",        lines:["+1 (555) 123-4567","Mon–Fri, 9 AM – 6 PM EST"],           color:"bg-secondary-50 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300" },
  { icon:MapPin,title:"Visit Us",       lines:["142 Travel Street, Suite 4B","New York, NY 10001, USA"],  color:"bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300"       },
  { icon:Clock, title:"Business Hours", lines:["Mon–Fri: 9:00 AM – 6:00 PM","Sat: 10:00 AM – 4:00 PM"], color:"bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"       },
];

const TOPICS = ["General Enquiry","Booking Support","Package Information",
  "Cancellation & Refund","Partnership Opportunity","Feedback / Complaint","Other"];

const FAQS = [
  { q:"How do I cancel my booking?",        a:"Go to My Bookings in your dashboard and click Cancel."           },
  { q:"When will I get confirmation?",       a:"Booking confirmation is sent instantly to your email."           },
  { q:"Can I modify my travel date?",        a:"Contact us at least 7 days before departure."                   },
  { q:"Do you offer group discounts?",       a:"Yes — groups of 8+ receive 10% off. Contact us for details."    },
];

export default function ContactPage() {
  const [form, setForm]     = useState({ name:"", email:"", phone:"", topic:"", message:"" });
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]     = useState<Record<string,string>>({});

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.name.trim())   e.name    = "Name is required";
    if (!form.email.trim())  e.email   = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.topic)         e.topic   = "Please select a topic";
    if (form.message.trim().length < 20) e.message = "Message must be at least 20 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
    toast.success("Message sent! We'll reply within 24 hours.");
  };

  const up = (k: string, v: string) => { setForm((p) => ({ ...p, [k]:v })); setErrors((p) => ({ ...p, [k]:"" })); };
  const fc  = (k: string) => `input-field ${errors[k] ? "border-red-400 focus:ring-red-400":""}`;

  return (
    <>
      <Navbar/>
      <main>
        {/* Hero */}
        <div className="bg-primary-gradient pt-28 pb-14 text-white">
          <div className="container-custom">
            <p className="text-secondary-DEFAULT text-sm font-semibold uppercase tracking-widest mb-2">Get in Touch</p>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3">We'd Love to Hear From You</h1>
            <p className="text-white/70 text-base max-w-xl">Have a question about a tour? Need help with a booking? Our team typically responds within 2 hours during business hours.</p>
          </div>
        </div>

        {/* Contact Info Cards */}
        <section className="bg-white dark:bg-navy-800 py-12">
          <div className="container-custom">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 -mt-14">
              {INFO.map((item) => (
                <div key={item.title} className="card p-5 flex gap-4 items-start">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <item.icon className="w-5 h-5"/>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{item.title}</h3>
                    {item.lines.map((l, i) => <p key={i} className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{l}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form + Map */}
        <section className="section-padding bg-section-gradient dark:bg-navy-900">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

              {/* Form */}
              <div className="card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center">
                    <Send className="w-5 h-5 text-white"/>
                  </div>
                  <div>
                    <h2 className="font-bold text-primary-700 dark:text-white">Send Us a Message</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">We reply within 24 hours</p>
                  </div>
                </div>

                {submitted ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500"/>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Message Sent!</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                      Thanks, {form.name.split(" ")[0]}. We'll get back to you at <strong>{form.email}</strong> within 24 hours.
                    </p>
                    <button onClick={() => { setSubmitted(false); setForm({ name:"",email:"",phone:"",topic:"",message:"" }); }}
                      className="px-5 py-2.5 rounded-xl bg-primary-700 text-white text-sm font-semibold hover:bg-primary-600 transition-colors">
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                        <input value={form.name} onChange={(e) => up("name",e.target.value)} placeholder="Your full name" className={fc("name")}/>
                        {errors.name && <p className="mt-1 text-xs text-red-500">⚠ {errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email <span className="text-red-500">*</span></label>
                        <input type="email" value={form.email} onChange={(e) => up("email",e.target.value)} placeholder="you@example.com" className={fc("email")}/>
                        {errors.email && <p className="mt-1 text-xs text-red-500">⚠ {errors.email}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone <span className="text-slate-400 font-normal">(optional)</span></label>
                      <input type="tel" value={form.phone} onChange={(e) => up("phone",e.target.value)} placeholder="+1 (555) 000-0000" className="input-field"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Topic <span className="text-red-500">*</span></label>
                      <select value={form.topic} onChange={(e) => up("topic",e.target.value)} className={fc("topic")}>
                        <option value="">Select a topic…</option>
                        {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      {errors.topic && <p className="mt-1 text-xs text-red-500">⚠ {errors.topic}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message <span className="text-red-500">*</span></label>
                      <textarea rows={5} value={form.message} onChange={(e) => up("message",e.target.value)}
                        placeholder="Tell us how we can help you…" className={`${fc("message")} resize-none`}/>
                      <div className="flex justify-between mt-1">
                        {errors.message ? <p className="text-xs text-red-500">⚠ {errors.message}</p> : <span/>}
                        <span className="text-xs text-slate-400">{form.message.length} chars</span>
                      </div>
                    </div>
                    <button type="submit" disabled={loading}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-primary-700 hover:bg-primary-600 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60">
                      {loading
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Sending…</>
                        : <><Send className="w-4 h-4"/> Send Message</>
                      }
                    </button>
                  </form>
                )}
              </div>

              {/* Map + FAQ */}
              <div className="flex flex-col gap-6">
                <div className="card overflow-hidden" style={{ minHeight:"300px" }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2412648718453!2d-73.98784368459498!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1706000000000!5m2!1sen!2sus"
                    width="100%" height="300" style={{ border:0 }} allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade" title="TravelNest Office"/>
                </div>
                <div className="card p-6">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm">Quick Answers</h3>
                  <div className="flex flex-col gap-3">
                    {FAQS.map((f) => (
                      <div key={f.q} className="p-3 rounded-xl bg-slate-50 dark:bg-primary-900/20">
                        <p className="text-xs font-semibold text-slate-700 dark:text-white mb-0.5">{f.q}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{f.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}
