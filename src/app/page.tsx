import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { MarqueeSection } from "@/components/sections/MarqueeSection";
import { StackingCardsSection } from "@/components/sections/StackingCardsSection";
import { MenuPreviewSection } from "@/components/sections/MenuPreviewSection";
import { AtmosphereSection } from "@/components/sections/AtmosphereSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CtaSection } from "@/components/sections/CtaSection";

export const metadata: Metadata = {
  title: "Luminary Café — Specialty Coffee & Artisan Pastries in San Francisco",
  description: "Discover San Francisco's premier specialty café. Single origin pour overs, artisan pastries, and a space designed for slow mornings.",
  alternates: { canonical: "https://luminarycafe.com" },
};

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <MarqueeSection />
      <StackingCardsSection />
      <MenuPreviewSection />
      <AtmosphereSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
