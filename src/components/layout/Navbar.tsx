"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Compass, ChevronDown, User, LayoutDashboard, BookOpen, LogOut } from "lucide-react";
import { useAuth }  from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { cn }       from "@/utils/helpers";

const PUBLIC_NAV  = [
  { href:"/",         label:"Home"    },
  { href:"/packages", label:"Explore Packages" },
  { href:"/about",    label:"About"   },
  { href:"/blog",     label:"Blog"    },
  { href:"/contact",  label:"Contact" },
];
const AUTH_NAV = [
  { href:"/",                       label:"Home"        },
  { href:"/packages",               label:"Explore"     },
  { href:"/dashboard/my-bookings",  label:"My Bookings" },
  { href:"/dashboard",              label:"Dashboard"   },
  { href:"/about",                  label:"About"       },
  { href:"/contact",                label:"Contact"     },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => { setMobileOpen(false); setProfileOpen(false); }, [pathname]);

  const links  = user ? AUTH_NAV : PUBLIC_NAV;
  const isHome = pathname === "/";
  const solid  = scrolled || !isHome;

  const linkCls = (href: string) => {
    const active = pathname === href || (href !== "/" && pathname.startsWith(href));
    return cn("px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
      solid
        ? active ? "text-primary-700 dark:text-secondary-DEFAULT bg-primary-50 dark:bg-primary-900/30"
                 : "text-slate-600 dark:text-slate-300 hover:text-primary-700 dark:hover:text-white hover:bg-primary-50 dark:hover:bg-primary-900/20"
        : active ? "text-secondary-DEFAULT" : "text-white/90 hover:text-white");
  };

  return (
    <>
      <header className={cn("fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        solid ? "bg-white/95 dark:bg-navy-900/95 backdrop-blur-md shadow-nav border-b border-slate-100 dark:border-primary-800" : "bg-transparent")}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-primary-gradient rounded-xl flex items-center justify-center shadow-md">
                <Compass className="w-5 h-5 text-white"/>
              </div>
              <span className={cn("text-xl font-bold tracking-tight transition-colors", solid ? "text-primary-700 dark:text-white" : "text-white")}>
                Travel<span className="text-secondary-DEFAULT">Nest</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {links.map((l) => <Link key={l.href} href={l.href} className={linkCls(l.href)}>{l.label}</Link>)}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button onClick={toggleTheme}
                className={cn("w-9 h-9 flex items-center justify-center rounded-lg transition-all",
                  solid ? "text-slate-500 hover:text-primary-700 hover:bg-primary-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-primary-900/30" : "text-white/80 hover:text-white")}>
                {theme === "dark" ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
              </button>

              {user ? (
                <div className="relative hidden md:block">
                  <button onClick={() => setProfileOpen((p) => !p)}
                    className={cn("flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all",
                      solid ? "border-slate-200 dark:border-primary-700 bg-white dark:bg-primary-900/30 hover:border-primary-300" : "border-white/30 bg-white/10 hover:bg-white/20")}>
                    <div className="w-7 h-7 rounded-lg bg-primary-gradient flex items-center justify-center text-white text-xs font-bold">
                      {user.avatar ? <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-lg object-cover"/> : user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className={cn("text-sm font-medium", solid ? "text-slate-700 dark:text-white" : "text-white")}>{user.name.split(" ")[0]}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", solid ? "text-slate-500 dark:text-slate-400" : "text-white/70", profileOpen && "rotate-180")}/>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-navy-700 rounded-2xl shadow-lg border border-slate-100 dark:border-primary-800 py-2 animate-slide-down">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-primary-800 mb-1">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      {[
                        { href:"/dashboard",         icon:LayoutDashboard, label:"Dashboard"  },
                        { href:"/dashboard/profile",  icon:User,            label:"Profile"    },
                        { href:"/dashboard/my-bookings", icon:BookOpen,     label:"My Bookings"},
                      ].map(({href,icon:Icon,label}) => (
                        <Link key={href} href={href} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-white transition-colors">
                          <Icon className="w-4 h-4"/> {label}
                        </Link>
                      ))}
                      <div className="border-t border-slate-100 dark:border-primary-800 mt-1 pt-1">
                        <button onClick={logout} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left">
                          <LogOut className="w-4 h-4"/> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login" className={cn("px-4 py-2 text-sm font-semibold rounded-xl transition-all",
                    solid ? "text-primary-700 dark:text-white hover:bg-primary-50 dark:hover:bg-primary-900/30" : "text-white hover:bg-white/10")}>
                    Log In
                  </Link>
                  <Link href="/register" className="px-4 py-2 text-sm font-semibold rounded-xl bg-secondary-DEFAULT text-white hover:bg-secondary-600 transition-all shadow-md">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button onClick={() => setMobileOpen((p) => !p)}
                className={cn("md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors",
                  solid ? "text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/30" : "text-white")}>
                {mobileOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)}/>
          <div className="absolute top-16 left-0 right-0 bg-white dark:bg-navy-800 border-b border-slate-100 dark:border-primary-800 shadow-xl animate-slide-down">
            <div className="container-custom py-4 flex flex-col gap-1">
              {links.map((l) => (
                <Link key={l.href} href={l.href}
                  className={cn("flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    (pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href)))
                      ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-secondary-DEFAULT"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-primary-900/20")}>
                  {l.label}
                </Link>
              ))}
              <div className="border-t border-slate-100 dark:border-primary-800 pt-3 mt-2 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"><LayoutDashboard className="w-4 h-4"/> Dashboard</Link>
                    <Link href="/dashboard/profile" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"><User className="w-4 h-4"/> Profile</Link>
                    <button onClick={logout} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full text-left transition-colors"><LogOut className="w-4 h-4"/> Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="w-full text-center py-3 rounded-xl text-sm font-semibold text-primary-700 border-2 border-primary-700 hover:bg-primary-50 transition-colors">Log In</Link>
                    <Link href="/register" className="w-full text-center py-3 rounded-xl text-sm font-semibold text-white bg-secondary-DEFAULT hover:bg-secondary-600 transition-colors">Sign Up Free</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {profileOpen && <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)}/>}
    </>
  );
}
