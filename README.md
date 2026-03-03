# ☕ Luminary Café — Next.js Website

A modern, high-performance café website built with Next.js 14, GSAP, Framer Motion, and Tailwind CSS v3.

## Features

- **Next.js 14** App Router with Server Components
- **GSAP + ScrollTrigger** for scroll-based animations (parallax, horizontal scroll, draw-on-scroll SVGs)
- **Framer Motion** for page transitions, floating elements, and micro-interactions
- **Lenis** smooth scrolling
- **Custom cursor** with spring physics
- **Full SEO**: metadata, Open Graph, Twitter cards, JSON-LD structured data
- **Sitemap** and **robots.txt** auto-generated
- **Tailwind CSS v3** with custom design tokens
- **Custom SVG illustrations** and animations
- **Horizontal scroll** atmosphere gallery section
- **Marquee ticker** with smooth animation
- **Interactive menu** with category filtering

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, features, menu preview, atmosphere, testimonials, newsletter |
| `/menu` | Full menu with category filtering |
| `/about` | Story, values, timeline with SVG drawing animation, team |
| `/contact` | Info, stylized SVG map, contact form |

## Setup

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout + SEO metadata + JSON-LD
│   ├── page.tsx          # Homepage
│   ├── robots.ts         # SEO robots
│   ├── sitemap.ts        # Dynamic sitemap
│   ├── not-found.tsx     # 404 page
│   ├── menu/
│   │   ├── page.tsx      # Menu page (server)
│   │   └── MenuPageClient.tsx
│   ├── about/
│   │   ├── page.tsx      # About page (server)
│   │   └── AboutPageClient.tsx
│   └── contact/
│       ├── page.tsx      # Contact page (server)
│       └── ContactPageClient.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx    # Scroll-aware navbar with mobile menu
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx       # Hero with SVG coffee illustration
│   │   ├── MarqueeSection.tsx    # Animated text ticker
│   │   ├── FeaturesSection.tsx   # 3-column features
│   │   ├── MenuPreviewSection.tsx # Tabbed menu preview
│   │   ├── AtmosphereSection.tsx # Horizontal scroll gallery
│   │   ├── TestimonialsSection.tsx
│   │   └── CtaSection.tsx        # Newsletter signup
│   └── ui/
│       ├── CustomCursor.tsx      # Spring-animated cursor
│       ├── SmoothScroll.tsx      # Lenis wrapper
│       └── PageTransition.tsx    # Framer Motion page transitions
├── hooks/
│   └── useScrollAnimation.ts    # GSAP scroll animation hook
└── lib/
    └── utils.ts                 # cn(), ease, stagger helpers
```

## Design System

| Token | Value |
|-------|-------|
| `cream-100` | `#F9F5EE` — Primary background |
| `espresso-900` | `#2C1810` — Primary text |
| `espresso-950` | `#1A0F08` — Dark sections |
| `sage-800` | `#2D4A28` — Accent sections |
| Display font | Cormorant Garamond |
| Body font | DM Sans |
| Mono font | DM Mono |

## SEO Implementation

- Metadata API with title templates
- Open Graph & Twitter card images
- JSON-LD structured data (CafeOrCoffeeShop schema)
- Canonical URLs on all pages
- Auto-generated XML sitemap
- Robots.txt with proper directives
- Semantic HTML (main, section, h1-h3, address, aria-labels)
