# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server with Turbopack (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint (next core-web-vitals + typescript rules)
```

There are no tests. TypeScript type-checking runs through the build: `npm run build` will surface type errors.

After changing components, the dev server hot-reloads automatically. Use Playwright (already installed) to take screenshots and verify visual output:

```js
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(4000); // let framer-motion animations settle
await page.screenshot({ path: '/tmp/preview.png' });
await browser.close();
```

## Stack

- **Next.js 16.2.9** with Turbopack (see AGENTS.md — breaking changes from prior versions)
- **React 19** / **TypeScript 5** — strict mode enabled
- **Tailwind CSS v4** — imported via `@import "tailwindcss"` in `globals.css`, configured through `@theme inline` blocks and arbitrary values. No `tailwind.config.js` exists.
- **Framer Motion 12** — used for all animations (entrance fades, orbit rotation, hover states)
- **Lucide React 1.21** — icon library used in orbit node pills and CTAs
- **Geist** fonts loaded via `next/font/google` in `app/layout.tsx`, exposed as CSS vars `--font-geist-sans` / `--font-geist-mono`

## Path alias

`@/*` maps to the repo root. Use `@/components/...`, `@/app/...` etc.

## Architecture

This is a single-page marketing site. Currently only the Hero section is built.

```
app/
  layout.tsx      — root layout, Geist fonts, metadata, antialiasing
  page.tsx        — renders <Navbar> + <Hero> inside <main>
  globals.css     — CSS custom properties (#06060F background), Tailwind import,
                    overflow-x:hidden on body

components/
  nav/
    Navbar.tsx    — fixed floating glass-pill navbar (pointer-events-none wrapper,
                    pointer-events-auto on the header itself so viewport sides
                    remain clickable)
  hero/
    Hero.tsx      — section shell; stacks layers: AmbientGlow → Orbit → HeroContent
                    → ScrollIndicator
    AmbientGlow.tsx  — three concentric radial-gradient divs that pulse
    Orbit.tsx     — 800×800 logical canvas (CSS-scaled per breakpoint) containing
                    one SVG <circle> ring + one rotating <motion.div> that holds
                    all 8 OrbitNode children
    OrbitNode.tsx — individual pill: positioned from the ring's centre using
                    cos/sin, counter-rotated to stay upright, gently floats
    HeroContent.tsx  — announcement pill, h1, subtext, CTA row; all fade-up on mount
    ScrollIndicator.tsx — bouncing ChevronDown at viewport bottom
```

## Orbit coordinate system

`Orbit.tsx` uses an **800×800 logical canvas** centred in the hero section. All positions are in this space — the outer `<div>` applies `scale-[n]` at each Tailwind breakpoint (lg = scale-100) so the SVG ring and JS node positions stay in sync without any JS resize listeners.

- Ring centre: (400, 400) in canvas space
- Node positions: `x = cos(angleDeg°) × radius`, `y = sin(angleDeg°) × radius`
  — `0°` = right, `90°` = down (standard screen convention)
- Rotating parent div at `left:400 top:400 width:0 height:0` carries all nodes;
  each OrbitNode counter-rotates by the same duration to stay label-upright

## Styling conventions

- All colours and spacing are inline styles or Tailwind arbitrary values — no separate theme file
- `'use client'` is required on every component that uses Framer Motion or browser events
- Hover colours on plain `<a>` tags use `onMouseEnter`/`onMouseLeave` inline handlers (not Tailwind `hover:`) because the values come from design tokens that aren't in the Tailwind config
- Gradient text uses `WebkitBackgroundClip: 'text'` + `WebkitTextFillColor: 'transparent'` inline

## Design references

Inspiration screenshots live in `inspiration/`. Before building or changing any visual section, read the relevant image to understand the target design. The pixel-level source of truth for this project is the inspiration files, not the current implementation.
