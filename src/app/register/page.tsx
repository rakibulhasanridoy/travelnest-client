"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Compass, ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const PERKS = ["Book 200+ tours worldwide","Save favourites & wishlists","Exclusive member discounts","24/7 booking support"];

export default function RegisterPage() {
  const { register } = useAuth();
  const [form,     setForm]     = useState({ name:"", email:"", password:"", confirm:"" });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState<Record<string,string>>({});

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.name.trim())                         e.name     = "Full name is required";
    if (!form.email)                               e.email    = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))  e.email    = "Enter a valid email";
    if (!form.password)                            e.password = "Password is required";
    else if (form.password.length < 6)             e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm)            e.confirm  = "Passwords don't match";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try   { await register(form.name.trim(), form.email.trim(), form.password); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Registration failed"); }
    finally     { setLoading(false); }
  };

  const up = (key: string, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]:"" }));
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strColor = ["","bg-red-500","bg-yellow-500","bg-green-500"][strength];
  const strLabel = ["","Weak","Fair","Strong"][strength];

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-slate-50 dark:bg-navy-900 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          {/* Left perks panel */}
          <div className="hidden md:block">
            <div className="bg-primary-gradient rounded-3xl p-8 text-white h-full">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Compass className="w-6 h-6 text-white"/>
              </div>
              <h2 className="text-2xl font-extrabold mb-3">Join 50,000+ Adventurers</h2>
              <p className="text-white/70 text-sm leading-relaxed mb-8">Create your free TravelNest account and unlock a world of curated tours, expert guides, and unforgettable journeys.</p>
              <div className="flex flex-col gap-4">
                {PERKS.map((p) => (
                  <div key={p} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-secondary-DEFAULT"/>
                    </div>
                    <span className="text-sm text-white/90">{p}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="flex -space-x-3 mb-3">
                  {["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40",
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40"].map((s,i) => (
                    <img key={i} src={s} alt="" className="w-9 h-9 rounded-full border-2 border-primary-700 object-cover"/>
                  ))}
                </div>
                <p className="text-white/70 text-xs">Joined by travelers from 80+ countries</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card p-8">
            <h1 className="text-2xl font-extrabold text-primary-700 dark:text-white mb-1">Create Account</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-7">Start your journey — it's completely free</p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                  <input type="text" autoComplete="name" value={form.name} onChange={(e) => up("name", e.target.value)}
                    placeholder="Your full name"
                    className={`input-field pl-10 ${errors.name?"border-red-400 focus:ring-red-400":""}`}/>
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-500">⚠ {errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                  <input type="email" autoComplete="email" value={form.email} onChange={(e) => up("email", e.target.value)}
                    placeholder="you@example.com"
                    className={`input-field pl-10 ${errors.email?"border-red-400 focus:ring-red-400":""}`}/>
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">⚠ {errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                  <input type={showPass?"text":"password"} autoComplete="new-password" value={form.password}
                    onChange={(e) => up("password", e.target.value)} placeholder="Minimum 6 characters"
                    className={`input-field pl-10 pr-10 ${errors.password?"border-red-400 focus:ring-red-400":""}`}/>
                  <button type="button" onClick={() => setShowPass((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                </div>
                {form.password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 flex gap-1">
                      {[1,2,3].map((s) => <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s<=strength ? strColor : "bg-slate-200 dark:bg-primary-800"}`}/>)}
                    </div>
                    <span className="text-xs text-slate-500">{strLabel}</span>
                  </div>
                )}
                {errors.password && <p className="mt-1 text-xs text-red-500">⚠ {errors.password}</p>}
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                  <input type={showPass?"text":"password"} autoComplete="new-password" value={form.confirm}
                    onChange={(e) => up("confirm", e.target.value)} placeholder="Repeat your password"
                    className={`input-field pl-10 ${errors.confirm?"border-red-400 focus:ring-red-400":""}`}/>
                  {form.confirm && form.password === form.confirm && (
                    <Check className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500"/>
                  )}
                </div>
                {errors.confirm && <p className="mt-1 text-xs text-red-500">⚠ {errors.confirm}</p>}
              </div>

              <p className="text-xs text-slate-400">
                By creating an account you agree to our{" "}
                <Link href="/terms-of-service" className="text-secondary-DEFAULT hover:underline">Terms of Service</Link>{" "}and{" "}
                <Link href="/privacy-policy"   className="text-secondary-DEFAULT hover:underline">Privacy Policy</Link>.
              </p>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl bg-primary-700 hover:bg-primary-600 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Creating…</>
                  : <><ArrowRight className="w-4 h-4"/> Create Free Account</>
                }
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-secondary-DEFAULT font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
