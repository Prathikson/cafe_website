import type { Metadata } from "next";
import { AboutPageClient } from "./AboutPageClient";

export const metadata: Metadata = {
  title: "Our Story — How Luminary Café Began",
  description:
    "Learn about Luminary Café — our passion for specialty coffee, our commitment to ethical sourcing, and the people who make every cup extraordinary.",
  alternates: {
    canonical: "https://luminarycafe.com/about",
  },
};

export default function AboutPage() {
  return (
    <main className="pt-20">
      <AboutPageClient />
    </main>
  );
}
