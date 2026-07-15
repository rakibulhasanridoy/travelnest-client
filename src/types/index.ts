// ─── User ─────────────────────────────────────────────────────────────────────
export interface IUser {
  _id:      string;
  name:     string;
  email:    string;
  role:     "user" | "admin";
  avatar?:  string;
  phone?:   string;
  address?: string;
  wishlist?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id:      string;
  name:    string;
  email:   string;
  role:    "user" | "admin";
  avatar?: string;
  phone?:   string;
  address?: string;
  wishlist?: string[];
}

// ─── Package ──────────────────────────────────────────────────────────────────
export interface ItineraryDay {
  day:         number;
  title:       string;
  description: string;
}

export interface TravelGuide {
  name:       string;
  experience: string;
  languages:  string[];
  avatar?:    string;
}

export type PackageCategory =
  | "Adventure" | "Cultural" | "Beach & Island" | "Wildlife & Safari"
  | "Luxury"    | "Budget"   | "Honeymoon"      | "Family"
  | "Solo"      | "Group Tour";

export interface IPackage {
  _id:              string;
  title:            string;
  slug:             string;
  shortDescription: string;
  fullDescription:  string;
  country:          string;
  city:             string;
  category:         PackageCategory;
  price:            number;
  originalPrice?:   number;
  duration:         number;
  availableSeats:   number;
  bookedSeats:      number;
  images:           string[];
  rating:           number;
  reviewCount:      number;
  included:         string[];
  excluded:         string[];
  itinerary:        ItineraryDay[];
  guide?:           TravelGuide;
  isFeatured:       boolean;
  isTrending:       boolean;
  createdAt:        string;
  updatedAt:        string;
}

// ─── Booking ──────────────────────────────────────────────────────────────────
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface IBooking {
  _id:              string;
  user:             IUser | string;
  package:          IPackage | string;
  travelDate:       string;
  travelers:        number;
  totalPrice:       number;
  status:           BookingStatus;
  specialRequests?: string;
  createdAt:        string;
  updatedAt:        string;
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface IReview {
  _id:       string;
  user:      IUser | { name: string; avatar?: string };
  package:   string;
  rating:    number;
  comment:   string;
  createdAt: string;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
export type BlogCategory =
  | "Destination Guide" | "Travel Tips"  | "Budget Travel"
  | "Safety"            | "Food & Culture" | "Visa Guide" | "Solo Travel";

export interface IBlog {
  _id:         string;
  title:       string;
  slug:        string;
  excerpt:     string;
  content:     string;
  coverImage:  string;
  category:    BlogCategory;
  tags:        string[];
  author:      { name: string; avatar?: string };
  readTime:    number;
  publishedAt: string;
  createdAt:   string;
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?:   T;
  message?: string;
  error?:   string;
  total?:   number;
  page?:    number;
  pages?:   number;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalPackages:      number;
  totalBookings:      number;
  totalUsers:         number;
  totalRevenue:       number;
  recentBookings:     IBooking[];
  packagesByCountry:  { country: string; count: number }[];
  bookingsByCategory: { category: string; count: number }[];
  monthlyBookings:    { month: string; bookings: number; revenue: number }[];
}

// ─── Filters ──────────────────────────────────────────────────────────────────
export interface PackageFilters {
  search?:    string;
  country?:   string;
  category?:  PackageCategory | "";
  minPrice?:  number;
  maxPrice?:  number;
  minRating?: number;
  duration?:  string;
  sortBy?:    "price_asc" | "price_desc" | "rating_desc" | "newest";
  page?:      number;
  limit?:     number;
}

// ─── Forms ────────────────────────────────────────────────────────────────────
export interface BookingFormData {
  travelDate:       string;
  travelers:        number;
  specialRequests?: string;
}

export interface PackageFormData {
  title:            string;
  country:          string;
  city:             string;
  category:         PackageCategory;
  price:            number;
  originalPrice?:   number;
  duration:         number;
  availableSeats:   number;
  images:           string[];
  shortDescription: string;
  fullDescription:  string;
  included:         string[];
  excluded:         string[];
  itinerary:        ItineraryDay[];
  isFeatured:       boolean;
  isTrending:       boolean;
}
