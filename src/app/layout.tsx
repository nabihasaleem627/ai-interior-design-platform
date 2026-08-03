import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeWrapper } from "@/components/layout/ThemeWrapper";
import { ToastContainer } from "@/components/ui/Toast";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { AppInitializer } from "@/components/layout/AppInitializer";

export const metadata: Metadata = {
  title: "Interior AI — Design Inspiration Platform",
  description:
    "Discover, organize, and visualize beautiful interior design ideas with AI-powered recommendations.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeWrapper>
          <AppInitializer />
          <Navbar />
          <GlobalSearch />
          {children}
          <ToastContainer />
        </ThemeWrapper>
      </body>
    </html>
  );
}
