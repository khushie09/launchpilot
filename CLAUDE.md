# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server with Turbopack (http://localhost:3000)
npm run build    # Production build (also type-checks — no separate tsc step)
npm run lint     # ESLint (next core-web-vitals + typescript rules)
```

No test suite exists. Type errors surface only via `npm run build`.

After changing components, the dev server hot-reloads automatically. Use Playwright to take screenshots and verify visual output:

```js
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);
await page.screenshot({ path: '/tmp/preview.png' });
await browser.close();
```

## Stack

- **Next.js 16.2.9** with Turbopack — see AGENTS.md for breaking changes
- **React 19** / **TypeScript 5** strict mode
- **Tailwind CSS v4** — no `tailwind.config.js`; configured via `@theme inline` in `globals.css`. `--spacing: 0.25rem` is set, so all spacing utilities (`p-*`, `m-*`, `gap-*`) work in dashboard components.
- **shadcn/ui** `base-nova` style — components use `@base-ui/react` primitives (not Radix UI). Add components via `npx shadcn@latest add <name>`. Installed components are in `components/ui/`.
- **Clerk v7** — auth provider. `currentUser()` / `auth()` for server components; `useUser()` / `useAuth()` for client components. `Show` component for conditional rendering.
- **Supabase** (`@supabase/supabase-js` + `@supabase/ssr`) — Postgres database. Two client factories in `lib/supabase/`: `client.ts` (browser, `createBrowserClient`) and `server.ts` (Server Components / Route Handlers, `createServerClient` with cookie forwarding). Env vars: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- **Framer Motion 12** — animations on the marketing pages only
- **Lucide React 1.21** — icons throughout

## Path alias

`@/*` maps to the repo root. Always use `@/components/...`, `@/lib/...`, etc.

## Architecture

LaunchPilot is a **creator campaign management SaaS**. The codebase has two distinct areas:

### 1. Marketing site (`app/page.tsx`, `components/hero/`, `components/nav/`)
Landing page with animated hero section. Uses Framer Motion, inline styles, and Tailwind arbitrary values. **Spacing caveat**: spacing utilities worked inconsistently here before `--spacing` was added — use inline styles for anything layout-critical on these pages.

### 2. Dashboard (`app/dashboard/`, `components/dashboard/`)
Protected by Clerk in `app/dashboard/layout.tsx` — redirects to `/sign-in` if no user. Layout is a fixed sidebar (`Sidebar.tsx`) + sticky topnav (`TopNav.tsx`) + scrollable `<main>`.

Routes:
- `/dashboard` — overview with KPI cards, revenue chart, recent campaigns, activity feed
- `/dashboard/campaigns` — full campaigns table
- `/dashboard/creators` — creator cards grid
- `/dashboard/payments` — payments table
- `/dashboard/analytics` — charts and platform breakdown
- `/dashboard/settings` — profile/workspace/notification settings (uses `currentUser()` server-side)

**All dashboard pages use `style={{ padding: '32px 48px 48px 112px', maxWidth: 1200, margin: '0 auto' }}`** as their outer wrapper — keep this consistent.

### 3. Auth pages (`app/sign-in/`, `app/sign-up/`)
Clerk `<SignIn>` / `<SignUp>` components with a shared appearance config in `lib/clerkAppearance.ts`.

### Data layer
`lib/mock-data.ts` — **all data is currently mocked here**. Types (`Campaign`, `Creator`, `Payment`, `Activity`) are defined here alongside static arrays. When replacing with a real backend, replace the exported arrays with fetch calls and keep the types (or derive them from the DB schema).

## Theme

The app is **always dark** — `className="dark"` is hardcoded on `<html>`. There is no light-mode code path. The dark theme tokens live in the `.dark {}` block in `globals.css`. Key values:
- Background: `#07070a` / `--background`
- Cards: `#0f0f13` (used inline in dashboard cards, not via CSS var)
- Primary: `#3b82f6` (blue) — `--primary`
- Indigo accent (`#6366f1`) is used for sidebar active states and CTA buttons; it is **not** `--primary`

## Styling conventions

Dashboard pages use **inline styles for all card layout** (background, border, borderRadius, padding) because the card token (`--card: #0c0c10`) doesn't match the slightly different value used in practice (`#0f0f13`). Tailwind utilities handle spacing and typography inside components.

Hover states on interactive elements within dashboard cards use `onMouseEnter`/`onMouseLeave` with direct `.style` assignment rather than Tailwind `hover:` — this is intentional for values derived from design tokens not in the Tailwind config.

## Design references

Inspiration screenshots live in `inspiration/`. Read the relevant image before building or changing any visual section — it is the pixel-level source of truth.
