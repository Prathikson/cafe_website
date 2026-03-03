import type { Metadata } from "next";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Visit Us — Location, Hours & Contact",
  description:
    "Find Luminary Café at 42 Bloom Street, San Francisco. Open Monday–Friday 7am–6pm, weekends 8am–5pm. Get in touch or just come say hello.",
  alternates: {
    canonical: "https://luminarycafe.com/contact",
  },
  openGraph: {
    title: "Visit Luminary Café — 42 Bloom Street, San Francisco",
    description: "Open 7 days. Specialty coffee, artisan food, and a warm welcome.",
    url: "https://luminarycafe.com/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="pt-20">
      <ContactPageClient />
    </main>
  );
}
