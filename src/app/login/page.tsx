"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Compass, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const DEMO_USER  = { email:"traveler@demo.com",    password:"Demo@2025" };
const DEMO_ADMIN = { email:"admin@travelnest.com",  password:"Admin@2025" };

export default function LoginPage() {
  const { login } = useAuth();
  const [form,     setForm]     = useState({ email:"", password:"" });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState<Record<string,string>>({});

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.email)    e.email    = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try   { await login(form.email.trim(), form.password); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Login failed"); }
    finally     { setLoading(false); }
  };

  const fillDemo = (type: "user"|"admin") => {
    const c = type === "admin" ? DEMO_ADMIN : DEMO_USER;
    setForm(c); setErrors({});
    toast.success(`Demo ${type} credentials filled in!`);
  };

  const field = (key: "email"|"password") => ({
    value:    form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => { setForm({ ...form, [key]: e.target.value }); setErrors((p) => ({ ...p, [key]:"" })); },
  });

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-slate-50 dark:bg-navy-900 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md">
          <div className="card p-8">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 bg-primary-gradient rounded-2xl flex items-center justify-center shadow-lg mb-4">
                <Compass className="w-6 h-6 text-white"/>
              </div>
              <h1 className="text-2xl font-extrabold text-primary-700 dark:text-white">Welcome Back</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to your TravelNest account</p>
            </div>

            {/* Demo buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[{ type:"user" as const, icon:"👤", label:"Demo User" },{ type:"admin" as const, icon:"🛡️", label:"Demo Admin" }].map(({ type, icon, label }) => (
                <button key={type} onClick={() => fillDemo(type)}
                  className="py-2.5 px-4 rounded-xl border-2 border-dashed border-accent-DEFAULT/50 text-accent-DEFAULT hover:bg-accent-50 dark:hover:bg-accent-900/20 text-xs font-semibold transition-all flex items-center justify-center gap-1.5">
                  <span>{icon}</span> {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-slate-200 dark:bg-primary-800"/>
              <span className="text-xs text-slate-400">or sign in with email</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-primary-800"/>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                  <input type="email" autoComplete="email" placeholder="you@example.com"
                    className={`input-field pl-10 ${errors.email ? "border-red-400 focus:ring-red-400":""}`} {...field("email")}/>
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">⚠ {errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password <span className="text-red-500">*</span></label>
                  <Link href="#" className="text-xs text-secondary-DEFAULT hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                  <input type={showPass?"text":"password"} autoComplete="current-password" placeholder="Your password"
                    className={`input-field pl-10 pr-10 ${errors.password ? "border-red-400 focus:ring-red-400":""}`} {...field("password")}/>
                  <button type="button" onClick={() => setShowPass((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">⚠ {errors.password}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl bg-primary-700 hover:bg-primary-600 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Signing In…</>
                  : <><ArrowRight className="w-4 h-4"/> Sign In</>
                }
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Don't have an account?{" "}
              <Link href="/register" className="text-secondary-DEFAULT font-semibold hover:underline">Create one free</Link>
            </p>
          </div>
          <p className="text-center text-xs text-slate-400 mt-4">🔒 Your data is encrypted and never shared.</p>
        </div>
      </main>
      <Footer/>
    </>
  );
}
