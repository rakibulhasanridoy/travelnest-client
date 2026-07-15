"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link  from "next/link";
import { Clock, Users, MapPin, Heart, TrendingUp, Zap } from "lucide-react";
import { IPackage }   from "@/types";
import { formatCurrency, getCategoryColor, cn } from "@/utils/helpers";
import { StarRating }  from "@/components/ui/index";
import { useAuth }     from "@/context/AuthContext";
import { wishlistApi } from "@/utils/api";
import toast from "react-hot-toast";

interface Props {
  pkg: IPackage;
  wishlist?: string[];
  onWishlistChange?: (id: string, action: "added"|"removed") => void;
}

export default function PackageCard({ pkg, wishlist=[], onWishlistChange }: Props) {
  const { user }     = useAuth();
  const [liked, setLiked] = useState(wishlist.includes(pkg._id));
  const [wlLoading, setWlLoading] = useState(false);

  const remaining = pkg.availableSeats - pkg.bookedSeats;
  const isLow     = remaining <= 5 && remaining > 0;
  const isSoldOut = remaining <= 0;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please log in to save packages"); return; }
    if (wlLoading) return;
    setWlLoading(true);
    try {
      const res = await wishlistApi.toggle(pkg._id) as { action:"added"|"removed" };
      setLiked(res.action === "added");
      toast.success(res.action === "added" ? "Saved to wishlist ❤️" : "Removed from wishlist");
      onWishlistChange?.(pkg._id, res.action);
    } catch { toast.error("Failed to update wishlist"); }
    finally   { setWlLoading(false); }
  };

  return (
    <div className={cn("card overflow-hidden flex flex-col group package-card", isSoldOut && "opacity-80")}>
      {/* Image */}
      <div className="relative h-52 overflow-hidden shrink-0">
        <Image
          src={pkg.images[0] || "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80"}
          alt={pkg.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500"/>
        <div className="absolute inset-0 card-img-overlay"/>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {pkg.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-DEFAULT text-white text-xs font-bold shadow-md">
              <Zap className="w-3 h-3 fill-current"/> Featured
            </span>
          )}
          {pkg.isTrending && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-DEFAULT text-white text-xs font-bold shadow-md">
              <TrendingUp className="w-3 h-3"/> Trending
            </span>
          )}
          {isSoldOut && (
            <span className="px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow-md">Sold Out</span>
          )}
        </div>

        {/* Wishlist */}
        <button onClick={handleWishlist}
          className={cn("absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg backdrop-blur-sm border border-white/20 transition-all duration-200",
            liked ? "bg-red-500/90 text-white border-red-400" : "bg-white/20 text-white hover:bg-white/30")}>
          <Heart className={cn("w-4 h-4", liked && "fill-current")}/>
        </button>

        {/* Location */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/90">
          <MapPin className="w-3.5 h-3.5 shrink-0"/>
          <span className="text-xs font-medium">{pkg.city}, {pkg.country}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-center justify-between">
          <span className={cn("badge text-xs", getCategoryColor(pkg.category))}>{pkg.category}</span>
          <StarRating rating={pkg.rating} count={pkg.reviewCount} size="sm"/>
        </div>

        <h3 className="font-bold text-slate-800 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-primary-700 dark:group-hover:text-secondary-DEFAULT transition-colors">
          {pkg.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 shrink-0"/> {pkg.duration} days</span>
          <span className={cn("flex items-center gap-1", isLow && "text-orange-500 font-medium")}>
            <Users className="w-3.5 h-3.5 shrink-0"/>
            {isSoldOut ? "Sold out" : `${remaining} seats`}
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-primary-800">
          <div>
            {pkg.originalPrice && pkg.originalPrice > pkg.price && (
              <p className="text-xs text-slate-400 line-through">{formatCurrency(pkg.originalPrice)}</p>
            )}
            <p className="text-lg font-extrabold text-primary-700 dark:text-secondary-DEFAULT">
              {formatCurrency(pkg.price)}
              <span className="text-xs font-normal text-slate-400 ml-1">/person</span>
            </p>
          </div>
          <Link href={`/packages/${pkg._id}`}
            className={cn("px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200",
              isSoldOut
                ? "bg-slate-100 dark:bg-primary-800 text-slate-400 cursor-not-allowed pointer-events-none"
                : "bg-primary-700 text-white hover:bg-primary-600 shadow-md hover:shadow-lg")}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
