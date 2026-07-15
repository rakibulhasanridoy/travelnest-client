import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider }  from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster }       from "react-hot-toast";

export const metadata: Metadata = {
  title:       { default: "TravelNest – Discover, Compare & Book Your Journey", template: "%s | TravelNest" },
  description: "Explore handpicked tour packages across 50+ countries. Compare prices, read reviews, and book your perfect trip.",
  keywords:    ["travel", "tour packages", "book trips", "holidays", "adventure"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  fontFamily:   "Inter, sans-serif",
                  borderRadius: "12px",
                  padding:      "14px 18px",
                  fontSize:     "14px",
                  fontWeight:   "500",
                  boxShadow:    "0 8px 32px rgba(27,58,92,0.18)",
                  background:   "#fff",
                  color:        "#1a202c",
                  border:       "1px solid #e2e8f0",
                },
                success: { iconTheme: { primary: "#0C9070", secondary: "#fff" } },
                error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
