"use client";
import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Save } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardSidebar, { MobileDashboardNav } from "@/components/dashboard/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/utils/api";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [form,    setForm]    = useState({ name:"", phone:"", address:"", avatar:"" });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) setForm({ name:user.name||"", phone:user.phone||"", address:user.address||"", avatar:user.avatar||"" });
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setLoading(true);
    try {
      await authApi.updateProfile(form);
      await refreshUser();
      toast.success("Profile updated!");
      setEditing(false);
    } catch { toast.error("Failed to update profile"); }
    finally  { setLoading(false); }
  };

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0,2) ?? "TN";

  const Field = ({
    label, type="text", value, onChange, placeholder, disabled, icon: Icon,
  }: {
    label:string; type?:string; value:string; onChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void;
    placeholder?:string; disabled?:boolean; icon: React.FC<{className?:string}>;
  }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
          className="input-field pl-10 disabled:bg-slate-50 disabled:dark:bg-primary-900/20 disabled:cursor-not-allowed"/>
      </div>
    </div>
  );

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-slate-50 dark:bg-navy-900 pt-20 pb-24 lg:pb-10">
        <div className="container-custom py-8">
          <div className="flex gap-8 items-start">
            <DashboardSidebar/>
            <div className="flex-1 min-w-0 max-w-2xl">
              <div className="mb-6">
                <h1 className="text-xl font-extrabold text-primary-700 dark:text-white">My Profile</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account details and preferences</p>
              </div>

              {/* Avatar Card */}
              <div className="card p-6 mb-5 flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-primary-gradient flex items-center justify-center text-white text-2xl font-extrabold overflow-hidden shrink-0">
                  {user?.avatar
                    ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover"/>
                    : initials
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-slate-800 dark:text-white text-lg">{user?.name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
                  <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    user?.role === "admin"
                      ? "bg-secondary-50 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300"
                      : "bg-accent-50 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300"
                  }`}>
                    {user?.role === "admin" ? "Administrator" : "Member"}
                  </span>
                </div>
                {!editing
                  ? <button onClick={() => setEditing(true)} className="px-4 py-2 rounded-xl border-2 border-primary-700 text-primary-700 dark:text-primary-300 dark:border-primary-500 text-sm font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors shrink-0">
                      Edit Profile
                    </button>
                  : <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-xl border-2 border-slate-200 dark:border-primary-700 text-slate-500 dark:text-slate-400 text-sm font-semibold hover:border-red-300 hover:text-red-500 transition-colors shrink-0">
                      Cancel
                    </button>
                }
              </div>

              {/* Form */}
              <form onSubmit={handleSave}>
                <div className="card p-6 flex flex-col gap-5 mb-5">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">Personal Information</h3>

                  <Field label="Full Name" value={form.name}
                    onChange={(e) => setForm({ ...form, name:e.target.value })}
                    placeholder="Your full name" disabled={!editing} icon={User}/>

                  <Field label="Email Address (cannot be changed)" type="email"
                    value={user?.email ?? ""} disabled icon={Mail}/>

                  <Field label="Phone Number" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone:e.target.value })}
                    placeholder="+1 (555) 000-0000" disabled={!editing} icon={Phone}/>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400"/>
                      <textarea rows={2} value={form.address}
                        onChange={(e) => setForm({ ...form, address:e.target.value })}
                        placeholder="Your address" disabled={!editing}
                        className="input-field pl-10 resize-none disabled:bg-slate-50 disabled:dark:bg-primary-900/20 disabled:cursor-not-allowed"/>
                    </div>
                  </div>

                  {editing && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Avatar URL <span className="text-slate-400 font-normal">(optional)</span></label>
                      <input type="url" value={form.avatar} onChange={(e) => setForm({ ...form, avatar:e.target.value })}
                        placeholder="https://your-image-url.com/avatar.jpg" className="input-field"/>
                    </div>
                  )}

                  {editing && (
                    <button type="submit" disabled={loading}
                      className="flex items-center gap-2 justify-center w-full py-3.5 rounded-xl bg-primary-700 hover:bg-primary-600 text-white font-bold text-sm transition-all shadow-md disabled:opacity-60">
                      {loading
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Saving…</>
                        : <><Save className="w-4 h-4"/> Save Changes</>
                      }
                    </button>
                  )}
                </div>
              </form>

              {/* Account Stats */}
              <div className="card p-6">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4">Account Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label:"Account Type",   value: user?.role === "admin" ? "Administrator" : "Member" },
                    { label:"Profile Status", value: "Verified ✓" },
                    { label:"2FA Security",   value: "Not enabled" },
                    { label:"Data Region",    value: "United States" },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 rounded-xl bg-slate-50 dark:bg-primary-900/20">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-white mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MobileDashboardNav/>
      <Footer/>
    </>
  );
}
