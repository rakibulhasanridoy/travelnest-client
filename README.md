# ✈️ TravelNest — Full-Stack Tour & Travel Booking Platform

> **Discover, Compare, and Book Your Perfect Journey.**

A production-ready full-stack application built with **Next.js 14 (Client)** and **Express.js (Server)** — two completely separate applications communicating over a REST API.

---

## 🏗️ Architecture

```
travelnest/
├── client/          # Next.js 14 — Frontend (port 3000)
│   └── src/
│       ├── app/              # Pages (no API routes)
│       ├── components/       # UI, Layout, Home, Packages, Dashboard
│       ├── context/          # AuthContext, ThemeContext
│       ├── hooks/            # useAuth, usePackages
│       ├── types/            # Shared TypeScript types
│       └── utils/            # api.ts (calls Express), helpers.ts
│
└── server/          # Express.js — REST API (port 5000)
    └── src/
        ├── app.ts            # Express app with CORS, routes
        ├── server.ts         # HTTP server entry point
        ├── config/           # MongoDB connection
        ├── controllers/      # Route handlers (auth, packages, bookings…)
        ├── middleware/        # authMiddleware, errorMiddleware
        ├── models/           # Mongoose models
        ├── routes/           # Express routers
        ├── utils/            # jwt.ts, helpers.ts
        └── scripts/          # seed.ts (13 packages, 3 users, 5 blogs)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works perfectly)

---

### 1 — Clone & Install

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

---

### 2 — Configure Environment Variables

**Server** (`server/.env`):
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/travelnest
JWT_SECRET=your_super_secret_key_at_least_32_chars
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:3000
```

**Client** (`client/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=TravelNest
```

---

### 3 — Seed the Database

```bash
cd server
npm run seed
```

Seeded data:
- ✅ **3 users** — 1 admin + 2 demo users
- ✅ **13 tour packages** — Bali, Tokyo, Swiss Alps, Maldives, Santorini, Iceland, Peru, Thailand, Dubai, Kenya, Morocco, Vietnam, Nepal
- ✅ **5 blog posts** — Destination guides, travel tips, visa guide, solo travel, budget travel

---

### 4 — Run Both Apps

Open **two terminals**:

```bash
# Terminal 1 — Start Express API server (port 5000)
cd server && npm run dev

# Terminal 2 — Start Next.js client (port 3000)
cd client && npm run dev
```

Open **http://localhost:3000**

---

## 🔐 Demo Credentials

| Role  | Email                   | Password     |
|-------|-------------------------|--------------|
| 👤 User  | `traveler@demo.com`     | `Demo@2025`  |
| 🛡️ Admin | `admin@travelnest.com`  | `Admin@2025` |

Demo buttons on the **Login page** auto-fill these credentials.

---

## 📄 Pages

| Route                            | Access    | Description                            |
|----------------------------------|-----------|----------------------------------------|
| `/`                              | Public    | Home — 9 rich sections                 |
| `/packages`                      | Public    | Explore with 6 filters + pagination    |
| `/packages/:id`                  | Public    | Detail — gallery, itinerary, booking   |
| `/about`                         | Public    | Company story, team, values            |
| `/contact`                       | Public    | Contact form + embedded map            |
| `/blog`                          | Public    | Blog listing with search & categories  |
| `/login`                         | Guest     | JWT login with demo auto-fill          |
| `/register`                      | Guest     | Registration with strength meter       |
| `/dashboard`                     | Auth      | Analytics (admin) / Bookings (user)    |
| `/dashboard/add-package`         | **Admin** | Full package creation form             |
| `/dashboard/manage-packages`     | **Admin** | Table with view / delete actions       |
| `/dashboard/my-bookings`         | Auth      | Booking tabs with cancel action        |
| `/dashboard/profile`             | Auth      | Edit name, phone, address, avatar      |

---

## 🔌 REST API Endpoints (Express — port 5000)

### Auth
| Method | Path                    | Auth      | Description            |
|--------|-------------------------|-----------|------------------------|
| POST   | `/api/auth/register`    | —         | Create account         |
| POST   | `/api/auth/login`       | —         | Login → set cookie     |
| POST   | `/api/auth/logout`      | —         | Clear auth cookie      |
| GET    | `/api/auth/me`          | ✅ Any    | Get current user       |
| PATCH  | `/api/auth/me`          | ✅ Any    | Update profile         |
| GET    | `/api/auth/users`       | 🛡️ Admin  | List all users         |

### Packages
| Method  | Path                    | Auth      | Description            |
|---------|-------------------------|-----------|------------------------|
| GET     | `/api/packages`         | —         | List + filter + paginate |
| GET     | `/api/packages/:id`     | —         | Get single package     |
| POST    | `/api/packages`         | 🛡️ Admin  | Create package         |
| PATCH   | `/api/packages/:id`     | 🛡️ Admin  | Update package         |
| DELETE  | `/api/packages/:id`     | 🛡️ Admin  | Delete package         |

### Bookings
| Method | Path                    | Auth      | Description            |
|--------|-------------------------|-----------|------------------------|
| GET    | `/api/bookings`         | ✅ Any    | List bookings          |
| POST   | `/api/bookings`         | ✅ Any    | Create booking         |
| PATCH  | `/api/bookings/:id`     | ✅ Any    | Cancel / update status |
| DELETE | `/api/bookings/:id`     | 🛡️ Admin  | Delete booking         |

### Other
| Method | Path                    | Auth      | Description            |
|--------|-------------------------|-----------|------------------------|
| GET    | `/api/reviews`          | —         | Reviews by package     |
| POST   | `/api/reviews`          | ✅ Any    | Submit review          |
| GET    | `/api/blogs`            | —         | List blog posts        |
| GET    | `/api/blogs/:slug`      | —         | Single blog post       |
| POST   | `/api/newsletter`       | —         | Subscribe              |
| POST   | `/api/wishlist`         | ✅ Any    | Toggle wishlist        |
| GET    | `/api/dashboard/stats`  | 🛡️ Admin  | Analytics data         |
| GET    | `/api/health`           | —         | Health check           |

---

## 🎨 Design System

| Token     | Color     | Hex       | Usage                        |
|-----------|-----------|-----------|------------------------------|
| Primary   | Navy      | `#1B3A5C` | CTAs, headings, nav, sidebar |
| Secondary | Amber     | `#F0A500` | Highlights, stars, badges    |
| Accent    | Teal      | `#0C9070` | Success states, nature themes|

- All cards: identical height, 16px border radius, consistent shadow
- 4-column grid on desktop → responsive to 1 column
- Skeleton loaders on every async data fetch
- Dark mode via `ThemeContext` → `localStorage` persisted
- Mobile bottom tab bar in dashboard

---

## 🗃️ MongoDB Collections

| Collection      | Documents          |
|-----------------|--------------------|
| `users`         | Auth + profile + wishlist |
| `packages`      | Tour packages with itinerary |
| `bookings`      | Bookings with status |
| `reviews`       | Star ratings + comments |
| `blogs`         | Travel articles |
| `newsletters`   | Email subscribers |

---

## ✨ Features Implemented

- ✅ **JWT auth** — httpOnly cookies + Next.js middleware route guard
- ✅ **3 user roles** — Guest / User / Admin with access control
- ✅ **13 real tour packages** — full itinerary, guide, included/excluded
- ✅ **Advanced filtering** — search, country, category, price, rating, duration, sort
- ✅ **Pagination** — server-side with page controls
- ✅ **Admin dashboard** — 4 Recharts charts (Bar, Pie, Line, Area)
- ✅ **Booking system** — seat deduction, status management, cancellation
- ✅ **Review & rating** — per-user, auto-updates package rating
- ✅ **Wishlist** — toggle favourite packages
- ✅ **Dark / Light mode** — persisted to localStorage
- ✅ **Newsletter** — email subscription with duplicate check
- ✅ **Fully responsive** — mobile, tablet, desktop
- ✅ **Skeleton loaders** — on all async content
- ✅ **Demo credentials** — auto-fill buttons on login page
- ✅ **Featured / Trending badges** — on package cards
- ✅ **Image gallery** — multi-image with navigation arrows
- ✅ **CORS** — configured for cross-origin client/server communication

---

## 🚢 Deployment

### Server → Railway / Render
1. Connect your GitHub repo
2. Set root directory to `server`
3. Add environment variables
4. Deploy

### Client → Vercel
1. Connect GitHub repo
2. Set root directory to `client`
3. Add `NEXT_PUBLIC_API_URL=https://your-server.railway.app`
4. Deploy

---

## 📦 Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Client      | Next.js 14, TypeScript, Tailwind CSS |
| Charts      | Recharts                          |
| Icons       | Lucide React                      |
| Server      | Express.js, TypeScript            |
| Database    | MongoDB, Mongoose                 |
| Auth        | JWT (httpOnly cookies)            |
| Toasts      | react-hot-toast                   |
