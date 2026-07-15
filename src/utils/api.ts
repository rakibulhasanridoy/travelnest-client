import { PackageFilters } from "@/types";

// In development Next.js rewrites /api/* → Express server
// In production set NEXT_PUBLIC_API_URL to your deployed server URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "/api"; // uses Next.js rewrite in dev

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers:     { "Content-Type": "application/json", ...options.headers },
    credentials: "include",          // send/receive httpOnly cookies
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (name: string, email: string, password: string) =>
    request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),

  login: (email: string, password: string) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  logout: () =>
    request("/auth/logout", { method: "POST" }),

  getMe: () =>
    request("/auth/me"),

  updateProfile: (data: { name?: string; phone?: string; address?: string; avatar?: string }) =>
    request("/auth/me", { method: "PATCH", body: JSON.stringify(data) }),
};

// ─── Packages ─────────────────────────────────────────────────────────────────
export const packagesApi = {
  getAll: (filters: PackageFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && v !== 0) params.set(k, String(v));
    });
    return request(`/packages?${params.toString()}`);
  },
  getById:    (id: string) => request(`/packages/${id}`),
  getFeatured: ()          => request("/packages?isFeatured=true&limit=8"),
  create:     (data: unknown) =>
    request("/packages", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: unknown) =>
    request(`/packages/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) =>
    request(`/packages/${id}`, { method: "DELETE" }),
};

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookingsApi = {
  getMyBookings: () => request("/bookings?mine=true"),
  getAllBookings: () => request("/bookings"),
  create: (packageId: string, data: object) =>
    request("/bookings", { method: "POST", body: JSON.stringify({ packageId, ...data }) }),
  cancel: (id: string) =>
    request(`/bookings/${id}`, { method: "PATCH", body: JSON.stringify({ status: "cancelled" }) }),
  updateStatus: (id: string, status: string) =>
    request(`/bookings/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
};

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const reviewsApi = {
  getByPackage: (packageId: string) => request(`/reviews?packageId=${packageId}`),
  create: (packageId: string, rating: number, comment: string) =>
    request("/reviews", { method: "POST", body: JSON.stringify({ packageId, rating, comment }) }),
};

// ─── Blogs ────────────────────────────────────────────────────────────────────
export const blogsApi = {
  getAll:      (limit?: number) => request(`/blogs${limit ? `?limit=${limit}` : ""}`),
  getBySlug:   (slug: string)   => request(`/blogs/${slug}`),
};

// ─── Newsletter ───────────────────────────────────────────────────────────────
export const newsletterApi = {
  subscribe: (email: string) =>
    request("/newsletter", { method: "POST", body: JSON.stringify({ email }) }),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardApi = {
  getStats: () => request("/dashboard/stats"),
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export const wishlistApi = {
  toggle: (packageId: string) =>
    request("/wishlist", { method: "POST", body: JSON.stringify({ packageId }) }),
};
