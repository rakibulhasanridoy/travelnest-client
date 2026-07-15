import { clsx, type ClassValue } from "clsx";
import { twMerge }               from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

export const formatDate         = (d: string | Date) => format(new Date(d), "MMM d, yyyy");
export const formatRelativeDate = (d: string | Date) => formatDistanceToNow(new Date(d), { addSuffix: true });

export const slugify = (t: string) =>
  t.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");

export const truncate = (t: string, n: number) => (t.length <= n ? t : t.slice(0, n).trimEnd() + "…");

export const formatNumber = (n: number) =>
  n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M"
  : n >= 1_000   ? (n / 1_000).toFixed(1)     + "K"
  : String(n);

export const discountPercent = (orig: number, cur: number) =>
  orig > cur ? Math.round(((orig - cur) / orig) * 100) : 0;

const FLAGS: Record<string, string> = {
  Indonesia:"🇮🇩", Japan:"🇯🇵", Switzerland:"🇨🇭", Maldives:"🇲🇻", Greece:"🇬🇷",
  France:"🇫🇷", Morocco:"🇲🇦", Peru:"🇵🇪", Iceland:"🇮🇸", UAE:"🇦🇪",
  Thailand:"🇹🇭", Brazil:"🇧🇷", Kenya:"🇰🇪", "New Zealand":"🇳🇿", Jordan:"🇯🇴",
  Nepal:"🇳🇵", Vietnam:"🇻🇳", Ecuador:"🇪🇨", Canada:"🇨🇦", Italy:"🇮🇹",
  Spain:"🇪🇸", Turkey:"🇹🇷", India:"🇮🇳", Australia:"🇦🇺", USA:"🇺🇸",
};
export const getCountryFlag = (c: string) => FLAGS[c] || "🌍";

const CAT_COLORS: Record<string, string> = {
  "Adventure":         "bg-orange-100 text-orange-700",
  "Cultural":          "bg-purple-100 text-purple-700",
  "Beach & Island":    "bg-blue-100 text-blue-700",
  "Wildlife & Safari": "bg-green-100 text-green-700",
  "Luxury":            "bg-yellow-100 text-yellow-700",
  "Budget":            "bg-gray-100 text-gray-700",
  "Honeymoon":         "bg-pink-100 text-pink-700",
  "Family":            "bg-teal-100 text-teal-700",
  "Solo":              "bg-indigo-100 text-indigo-700",
  "Group Tour":        "bg-cyan-100 text-cyan-700",
};
export const getCategoryColor = (c: string) => CAT_COLORS[c] || "bg-gray-100 text-gray-700";

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  completed: "bg-blue-100 text-blue-700 border-blue-200",
};
export const getStatusColor = (s: string) => STATUS_COLORS[s] || "bg-gray-100 text-gray-700 border-gray-200";
