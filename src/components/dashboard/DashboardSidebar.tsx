"use client";
import React from "react";
import Link  from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, PlusCircle, BookOpen, User, BarChart2, LogOut, Compass } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn }      from "@/utils/helpers";

const USER_LINKS  = [
  { href:"/dashboard",               icon:LayoutDashboard, label:"Overview"   },
  { href:"/dashboard/my-bookings",   icon:BookOpen,        label:"My Bookings"},
  { href:"/dashboard/profile",       icon:User,            label:"Profile"    },
];
const ADMIN_LINKS = [
  { href:"/dashboard",                  icon:BarChart2,    label:"Analytics"  },
  { href:"/dashboard/manage-packages",  icon:Package,      label:"Packages"   },
  { href:"/dashboard/add-package",      icon:PlusCircle,   label:"Add Package"},
  { href:"/dashboard/my-bookings",      icon:BookOpen,     label:"All Bookings"},
  { href:"/dashboard/profile",          icon:User,         label:"Profile"    },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const links = user?.role === "admin" ? ADMIN_LINKS : USER_LINKS;

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col">
      <div className="card p-5 flex flex-col h-full sticky top-24">
        {/* User Info */}
        <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-primary-800">
          <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover"/>
              : user?.name?.charAt(0)?.toUpperCase() ?? "T"
            }
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            <span className={cn("inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold",
              user?.role === "admin"
                ? "bg-secondary-50 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300"
                : "bg-accent-50 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300")}>
              {user?.role === "admin" ? "Admin" : "Member"}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {links.map(({ href, icon:Icon, label }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary-700 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-white")}>
                <Icon className="w-4 h-4 shrink-0"/> {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-primary-800 flex flex-col gap-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-primary-900/20 transition-colors">
            <Compass className="w-4 h-4"/> Back to Site
          </Link>
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left">
            <LogOut className="w-4 h-4"/> Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}

export function MobileDashboardNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const links = user?.role === "admin"
    ? [
        { href:"/dashboard",                 icon:BarChart2,    label:"Analytics"},
        { href:"/dashboard/manage-packages", icon:Package,      label:"Packages" },
        { href:"/dashboard/add-package",     icon:PlusCircle,   label:"Add"      },
        { href:"/dashboard/my-bookings",     icon:BookOpen,     label:"Bookings" },
        { href:"/dashboard/profile",         icon:User,         label:"Profile"  },
      ]
    : [
        { href:"/dashboard",               icon:LayoutDashboard, label:"Home"    },
        { href:"/dashboard/my-bookings",   icon:BookOpen,        label:"Bookings"},
        { href:"/dashboard/profile",       icon:User,            label:"Profile" },
      ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-navy-800 border-t border-slate-100 dark:border-primary-800 px-4 py-2 flex justify-around">
      {links.map(({ href, icon:Icon, label }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href}
            className={cn("flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all",
              active ? "text-primary-700 dark:text-secondary-DEFAULT" : "text-slate-400 dark:text-slate-500 hover:text-primary-700 dark:hover:text-white")}>
            <Icon className="w-5 h-5"/>
            <span className="text-xs font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
