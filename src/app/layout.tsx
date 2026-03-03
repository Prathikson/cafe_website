import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { PageTransition } from "@/components/ui/PageTransition";
import { Preloader } from "@/components/ui/Preloader";
import { CartProvider } from "@/lib/CartContext";
import { CartSidebar } from "@/components/ui/CartSidebar";

const siteUrl = "https://luminarycafe.com";
const siteName = "Luminary Café";
const siteDescription = "Luminary Café — A sanctuary for specialty coffee, artisan pastries, and slow mornings in San Francisco.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${siteName} — Specialty Coffee & Artisan Pastries`, template: `%s | ${siteName}` },
  description: siteDescription,
  keywords: ["specialty coffee","artisan café","single origin coffee","artisan pastries","third wave coffee"],
  authors: [{ name: "Luminary Café" }],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: { type: "website", locale: "en_US", url: siteUrl, siteName, title: `${siteName} — Specialty Coffee`, description: siteDescription, images: [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630, alt: siteName }] },
  twitter: { card: "summary_large_image", title: `${siteName}`, description: siteDescription, images: [`${siteUrl}/og-image.jpg`] },
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = { themeColor: "#F5F0E8", width: "device-width", initialScale: 1 };

const jsonLd = {
  "@context": "https://schema.org", "@type": "CafeOrCoffeeShop",
  name: siteName, description: siteDescription, url: siteUrl,
  telephone: "+1-555-LUMINARY", email: "hello@luminarycafe.com",
  address: { "@type": "PostalAddress", streetAddress: "42 Bloom Street", addressLocality: "San Francisco", addressRegion: "CA", postalCode: "94102", addressCountry: "US" },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "07:00", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday","Sunday"], opens: "08:00", closes: "17:00" },
  ],
  servesCuisine: ["Coffee","Pastries","Brunch"], priceRange: "$$", menu: `${siteUrl}/menu`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400&display=swap" rel="stylesheet" />
      </head>
      <body className="grain bg-sand-100 text-ink-900 antialiased">
        <CartProvider>
          <Preloader />
          <SmoothScroll>
            <CustomCursor />
            <Navbar />
            <CartSidebar />
            <PageTransition>{children}</PageTransition>
            <Footer />
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}
