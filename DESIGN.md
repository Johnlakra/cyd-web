# Anubhav 2026 — Design System (Lumen)

The public site implements **Lumen**, the direction chosen from the Claude Design
handoff: *luminous editorial* — Spectral serif on warm ivory, royal-violet ink,
antique gold. Reverent and joyful, Apple-grade restraint, information-first.

## Tokens (`tailwind.config.ts`)

| Token | Hex | Use |
|-------|-----|-----|
| `bg` | `#F8F2E7` | page background (warm ivory) |
| `bgAlt` | `#F2EADB` | recessed surfaces, chips |
| `paper` | `#FFFFFF` | cards, raised surfaces |
| `ink` | `#241B2E` | primary text (near-black with violet character) |
| `sub` | `#6E6456` | secondary text (AAA on bg for body) |
| `faint` | `#9A8E7C` | tertiary / metadata |
| `violet` | `#5A3E8C` | primary — CTAs, active states |
| `violetDeep` | `#3F2A66` | footer, hero stat panel |
| `gold` | `#B0822B` | accent — underlines, kickers, dots |
| `goldSoft` | `#C99A3F` | accent on dark surfaces |
| `line` / `lineSoft` | `rgba(36,27,46,.12 / .07)` | hairline borders |

## Type

- **Display:** Spectral (400/500/600 + italic) — `font-serif`.
- **Text:** Hanken Grotesk (400–700) — `font-sans`.
- Loaded via `next/font/google` (self-hosted, no CLS). Headlines use fluid
  `clamp()` sizes that shrink to fit 360px.

## Motion (`ease-lumen` = `cubic-bezier(0.22,1,0.36,1)`)

Built on Framer Motion, all gated by `useReducedMotion()`:

- `Reveal` — fade + rise on scroll-into-view (once).
- `DrawUnderline` — the signature gold underline drawing in.
- `CountUp` — eased numeral count-up.
- `GrowBar` — stat bars growing from 0 to their share.

## Components (`src/components/`)

`SiteHeader` (sticky, frosts on scroll, mobile menu) · `SiteFooter` · `PageHead`
· `Kicker` · `Mark` (brand SVG) · `PhotoSlot` (consistent warm-tinted crop;
renders real photos or a placeholder) · plus the motion primitives above.

## Principles

- **Mobile-first.** Single-column by default; `sm:`/`md:`/`lg:` upgrades. Tap
  targets ≥ 44px. No horizontal overflow at 360px.
- **Hierarchy.** The latest announcement is the visual anchor above the fold on `/`.
- **Accessibility.** AA minimum / AAA body text, on-brand `:focus-visible` ring,
  `prefers-reduced-motion` respected globally and per-component.
- **Privacy.** Public pages render counts and non-personal data only; PII
  (roommate names + parish, never phones) appears solely on the authenticated `/me`.
