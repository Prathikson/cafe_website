import type { Metadata } from "next";
import { MenuPageClient } from "./MenuPageClient";

export const metadata: Metadata = {
  title: "Menu — Specialty Coffee, Pour Overs & Artisan Food",
  description:
    "Explore our full menu of specialty coffees, cold brews, matcha, and artisan food. Seasonal ingredients, freshly baked pastries, and thoughtfully crafted beverages.",
  alternates: {
    canonical: "https://luminarycafe.com/menu",
  },
  openGraph: {
    title: "Luminary Café Menu — Specialty Coffees & Artisan Food",
    description:
      "Single origin pour overs, espresso drinks, seasonal pastries, and weekend brunch.",
    url: "https://luminarycafe.com/menu",
  },
};

const menuData = {
  Coffee: [
    {
      name: "Espresso",
      description: "Double shot, 18g, 36ml yield, textbook extraction",
      price: "$4.00",
      badge: null,
    },
    {
      name: "Long Black",
      description: "Double ristretto pulled over hot water",
      price: "$4.50",
      badge: null,
    },
    {
      name: "Flat White",
      description: "Double ristretto, silky steamed whole milk, 5oz",
      price: "$5.50",
      badge: "Classic",
    },
    {
      name: "Oat Flat White",
      description: "Double ristretto, Oatly Barista, velvety microfoam",
      price: "$6.50",
      badge: "Bestseller",
    },
    {
      name: "Cappuccino",
      description: "Classic 6oz, balanced espresso and dense foam",
      price: "$5.50",
      badge: null,
    },
    {
      name: "Latte",
      description: "Double shot, steamed milk, poured with care, 8oz",
      price: "$6.00",
      badge: null,
    },
    {
      name: "Cortado",
      description: "Equal parts espresso and steamed milk, 4oz",
      price: "$5.00",
      badge: null,
    },
    {
      name: "Piccolo",
      description: "Single ristretto, a little steamed milk, 3oz",
      price: "$4.50",
      badge: null,
    },
  ],
  "Pour Over": [
    {
      name: "Ethiopian Yirgacheffe",
      description: "Jasmine, blueberry, citrus zest. Light roast. V60.",
      price: "$7.00",
      badge: "Single Origin",
    },
    {
      name: "Colombian Huila",
      description: "Brown sugar, caramel, stone fruit. Medium roast. Chemex.",
      price: "$7.00",
      badge: "Single Origin",
    },
    {
      name: "Guatemalan Antigua",
      description: "Cocoa, walnut, red apple. Medium-dark roast. Kalita.",
      price: "$7.50",
      badge: "Seasonal",
    },
  ],
  "Cold & Iced": [
    {
      name: "Cold Brew Reserve",
      description: "18hr steep, Brazil natural, served over ice",
      price: "$6.00",
      badge: null,
    },
    {
      name: "Iced Oat Latte",
      description: "Double espresso, oat milk, over ice",
      price: "$6.50",
      badge: null,
    },
    {
      name: "Iced Matcha Latte",
      description: "Ceremonial grade matcha, oat milk, light sweetness",
      price: "$6.50",
      badge: "Popular",
    },
    {
      name: "Sparkling Tonic Espresso",
      description: "Double ristretto, bitter lemon tonic, fresh mint",
      price: "$7.00",
      badge: "Signature",
    },
  ],
  "Non-Coffee": [
    {
      name: "Matcha Latte",
      description: "Ceremonial grade, oat milk, honey optional",
      price: "$6.00",
      badge: null,
    },
    {
      name: "Turmeric Latte",
      description: "Turmeric, ginger, black pepper, coconut milk",
      price: "$6.00",
      badge: null,
    },
    {
      name: "Masala Chai",
      description: "House blend spices, Darjeeling, whole milk",
      price: "$5.50",
      badge: null,
    },
    {
      name: "Hot Chocolate",
      description: "Single origin cocoa, steamed milk, sea salt",
      price: "$5.50",
      badge: null,
    },
  ],
  Food: [
    {
      name: "Almond Croissant",
      description:
        "Twice-baked, almond frangipane, toasted flaked almonds, powdered sugar",
      price: "$5.50",
      badge: "Fresh Daily",
    },
    {
      name: "Pain au Chocolat",
      description: "Laminated dough, Valrhona dark chocolate, flaky layers",
      price: "$5.00",
      badge: null,
    },
    {
      name: "Banana Bread",
      description: "Spelt flour, tahini, walnuts, brown butter glaze",
      price: "$4.50",
      badge: null,
    },
    {
      name: "Sourdough Toast",
      description:
        "House sourdough, whipped ricotta, seasonal jam, honey drizzle",
      price: "$9.00",
      badge: "Morning",
    },
    {
      name: "Avocado Board",
      description:
        "Smashed avo, two poached eggs, chilli flakes, toasted seeds, EVOO",
      price: "$14.00",
      badge: null,
    },
    {
      name: "Granola Bowl",
      description:
        "House granola, coconut yoghurt, seasonal fruit, edible flowers",
      price: "$12.00",
      badge: null,
    },
    {
      name: "Mushroom Toast",
      description:
        "Mixed mushrooms, herbed cream cheese, sourdough, truffle oil",
      price: "$13.00",
      badge: "New",
    },
  ],
};

export default function MenuPage() {
  return (
    <main className="pt-20">
      <MenuPageClient menuData={menuData} />
    </main>
  );
}
