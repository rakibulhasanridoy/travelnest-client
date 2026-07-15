"use client";
import React from "react";
import { cn } from "@/utils/helpers";
import { Loader2, Star, X } from "lucide-react";

/* ═══════════════════════ BUTTON ═══════════════════════════════════════════ */
type Variant = "primary"|"secondary"|"outline"|"ghost"|"danger";
type Size    = "sm"|"md"|"lg";

const V: Record<Variant,string> = {
  primary:   "bg-primary-700 text-white hover:bg-primary-600 active:bg-primary-800 shadow-md hover:shadow-lg",
  secondary: "bg-secondary-DEFAULT text-white hover:bg-secondary-600 shadow-md hover:shadow-lg",
  outline:   "border-2 border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white dark:border-primary-400 dark:text-primary-300",
  ghost:     "text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30",
  danger:    "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg",
};
const S: Record<Size,string> = {
  sm: "px-4 py-2 text-sm rounded-lg gap-1.5",
  md: "px-6 py-3 text-sm rounded-xl gap-2",
  lg: "px-8 py-4 text-base rounded-xl gap-2",
};

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant; size?: Size; loading?: boolean;
  icon?: React.ReactNode; iconRight?: React.ReactNode; fullWidth?: boolean;
}
export function Button({ children, variant="primary", size="md", loading, icon, iconRight, fullWidth, className, disabled, ...p }: BtnProps) {
  return (
    <button
      className={cn("inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-DEFAULT focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        V[variant], S[size], fullWidth && "w-full", className)}
      disabled={disabled||loading} {...p}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin shrink-0"/> : icon && <span className="shrink-0">{icon}</span>}
      {children}
      {iconRight && !loading && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}

/* ═══════════════════════ BADGE ════════════════════════════════════════════ */
const BV: Record<string,string> = {
  primary:   "bg-primary-50 text-primary-700 border border-primary-100 dark:bg-primary-900/40 dark:text-primary-300",
  secondary: "bg-secondary-50 text-secondary-700 border border-secondary-100 dark:bg-secondary-900/30 dark:text-secondary-300",
  accent:    "bg-accent-50 text-accent-700 border border-accent-100 dark:bg-accent-900/30 dark:text-accent-300",
  success:   "bg-green-50 text-green-700 border border-green-100",
  warning:   "bg-amber-50 text-amber-700 border border-amber-100",
  danger:    "bg-red-50 text-red-700 border border-red-100",
  neutral:   "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300",
};
interface BadgeProps { children: React.ReactNode; variant?: keyof typeof BV; size?: "sm"|"md"; className?: string; }
export function Badge({ children, variant="primary", size="sm", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1 font-semibold rounded-full",
      size==="sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
      BV[variant], className)}>
      {children}
    </span>
  );
}

/* ═══════════════════════ STAR RATING ══════════════════════════════════════ */
interface StarRatingProps { rating: number; size?: "sm"|"md"|"lg"; showValue?: boolean; count?: number; className?: string; }
export function StarRating({ rating, size="sm", showValue=true, count, className }: StarRatingProps) {
  const sz = { sm:"w-3.5 h-3.5", md:"w-4 h-4", lg:"w-5 h-5" }[size];
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map((s) => (
          <Star key={s} className={cn(sz, s<=Math.round(rating)
            ? "fill-secondary-DEFAULT text-secondary-DEFAULT"
            : "fill-transparent text-slate-300 dark:text-slate-600")}/>
        ))}
      </div>
      {showValue && <span className={cn("font-semibold text-slate-700 dark:text-slate-300",
        size==="sm"?"text-xs":size==="md"?"text-sm":"text-base")}>{rating.toFixed(1)}</span>}
      {count!==undefined && <span className="text-xs text-slate-400">({count.toLocaleString()})</span>}
    </div>
  );
}

/* ═══════════════════════ SPINNER ══════════════════════════════════════════ */
export function Spinner({ size="md", className }: { size?: "sm"|"md"|"lg"; className?: string }) {
  const s = { sm:"w-5 h-5", md:"w-8 h-8", lg:"w-12 h-12" }[size];
  return <div className={cn("border-t-primary-700 rounded-full animate-spin", s, className)} style={{ border:"3px solid rgba(27,58,92,.15)", borderTopColor:"#1B3A5C" }}/>;
}

/* ═══════════════════════ SKELETONS ════════════════════════════════════════ */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)}/>;
}
export function PackageCardSkeleton() {
  return (
    <div className="card overflow-hidden package-card flex flex-col">
      <Skeleton className="h-52 w-full rounded-none rounded-t-2xl"/>
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex justify-between"><Skeleton className="h-5 w-24 rounded-full"/><Skeleton className="h-5 w-16 rounded-full"/></div>
        <Skeleton className="h-6 w-3/4"/><Skeleton className="h-4 w-1/2"/>
        <div className="flex gap-2"><Skeleton className="h-4 w-20"/><Skeleton className="h-4 w-20"/></div>
        <div className="mt-auto flex justify-between"><Skeleton className="h-7 w-24"/><Skeleton className="h-10 w-32 rounded-xl"/></div>
      </div>
    </div>
  );
}
export function BlogCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none rounded-t-2xl"/>
      <div className="p-5 flex flex-col gap-3">
        <Skeleton className="h-4 w-24 rounded-full"/><Skeleton className="h-6 w-full"/>
        <Skeleton className="h-4 w-5/6"/><Skeleton className="h-4 w-4/6"/>
        <div className="flex items-center gap-2 mt-2"><Skeleton className="h-8 w-8 rounded-full"/><Skeleton className="h-4 w-32"/></div>
      </div>
    </div>
  );
}
export function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-100 dark:border-primary-800">
      {[10,40,24,20,20].map((w,i) => <td key={i} className="p-4"><Skeleton className={`h-4 w-${w}`}/></td>)}
    </tr>
  );
}
export function StatCardSkeleton() {
  return (
    <div className="card p-6 flex flex-col gap-3">
      <div className="flex justify-between"><Skeleton className="h-4 w-24"/><Skeleton className="h-10 w-10 rounded-xl"/></div>
      <Skeleton className="h-9 w-32"/><Skeleton className="h-3 w-28"/>
    </div>
  );
}

/* ═══════════════════════ MODAL ════════════════════════════════════════════ */
interface ModalProps { isOpen: boolean; onClose: ()=>void; title?: string; children: React.ReactNode; size?: "sm"|"md"|"lg"|"xl"; }
export function Modal({ isOpen, onClose, title, children, size="md" }: ModalProps) {
  const sz = { sm:"max-w-sm", md:"max-w-md", lg:"max-w-lg", xl:"max-w-2xl" }[size];
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);
  React.useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key==="Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}/>
      <div className={cn("relative w-full bg-white dark:bg-navy-700 rounded-2xl shadow-2xl animate-slide-up", sz)}>
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-primary-800">
            <h3 className="text-lg font-bold text-primary-700 dark:text-white">{title}</h3>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-primary-800 transition-colors">
              <X className="w-5 h-5"/>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  isOpen: boolean; onClose: ()=>void; onConfirm: ()=>void;
  title: string; message: string; confirmLabel?: string;
  confirmVariant?: "danger"|"primary"; loading?: boolean;
}
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel="Confirm", confirmVariant="danger", loading }: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-primary-800 transition-colors">Cancel</button>
        <button onClick={onConfirm} disabled={loading}
          className={cn("px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60",
            confirmVariant==="danger" ? "bg-red-500 hover:bg-red-600" : "bg-primary-700 hover:bg-primary-600")}>
          {loading ? "Processing…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
