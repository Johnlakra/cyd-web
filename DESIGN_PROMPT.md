# Design prompt — Anubhav 2026 public website

Use this as a one-shot design brief in a fresh Claude conversation, or paste it to the
anubhav-web-designer agent as its opening direction.

---

## Project
Design the public website for Anubhav 2026 — a Catholic youth retreat run by the Diocese
of Jalandhar's Youth Commission across three venues in Punjab, India:
- Phagwara (Hoshiarpur, Tanda, Jalandhar Cantt., Jalandhar City, Kapurthala, Sahnewal, Ludhiana) — 2–4 June 2026
- Abohar (Moga, Muktsar, Ferozpur) — 4–6 June 2026
- Amritsar (Tarn Taran, Amritsar, Ajnala, Fatehgarh Churian, Dhariwal, Gurdaspur) — 6–8 June 2026
Registration ₹50 per participant. Arrival 4:00 PM, departure 11:00 AM.

## Audience
Youth 16–25 attending (primary), parish priests and parents (secondary), Sisters and
Catechists who chaperone (tertiary). All Indian, mostly Punjabi, mostly English-comfortable
for digital surfaces. Some non-English speakers — keep copy simple.

## Tone
- Reverent and joyful. NOT edgy, dark, brutalist, or nightclub. This is faith and community.
- Modern, intentional, considered. The kind of craft that earns Site of the Day.
- Warm. Indian. Punjabi nuance without cliche (no over-using bhangra/turban motifs).
- Trustworthy to a 60-year-old parish priest AND exciting to a 19-year-old.

## Goal
Be the canonical place to learn what Anubhav 2026 is, see the schedule, read announcements,
meet the speakers, see how many youth are joining, and (when logged in) check personal
details — all without entering the operational app.

## Information hierarchy (strict — please respect)
1. THE LATEST ANNOUNCEMENT. Pinned, dominant, above the fold on the homepage. It is the
   most time-sensitive thing on the site.
2. Event identity: name, dates, the three venues.
3. CTA: log in / view my details.
4. Stats: participants joining per place + total.
5. Schedule + speakers preview.
6. Footer with credit and contact.

## Pages
- /                 Home — see hierarchy above.
- /timetable        Three places × three days. Editorial, scannable, beautiful.
- /announcements    Full feed; latest first; diocese-wide visually distinguished.
- /speakers         Portrait grid with bios.
- /stats            Big numerals + per-place breakdown.
- /login            Calm, focused login.
- /me               Authenticated personal view: profile, place, room + roommates
                    (names + parish only), my timetable, my announcements.

## Visual direction
- ONE confident primary color + ONE accent + a careful neutral scale. Lean warm/luminous.
  Avoid pure black; pick a near-black with character. Light + dark mode (system preference,
  toggleable).
- Typography: a display family with personality (consider a contemporary serif or a
  distinctive display sans) paired with one clean text family. Tight, expressive headlines.
  NOT Inter-on-everything.
- Spacing on an 8px scale, used consistently.
- Motion: subtle, slow easings, purposeful. No bouncy or cute animations.
- Photography: warm color treatment, one consistent crop and grade. If real photos are not
  yet available, use a beautiful typographic + gradient hero treatment as the placeholder —
  not stock imagery.
- Detail: focus states, hover affordances, link underlines, cursor variants where they help.

## Must-haves (block ship until all pass)
- Latest announcement is the visual anchor above the fold.
- Server-rendered HTML on the homepage so search engines see it.
- Lighthouse: Performance >= 95, Accessibility >= 95, SEO = 100 (mobile and desktop).
- Fully usable one-handed at 360px width.
- Zero layout shift, zero console errors.
- Reduced-motion preference respected.
- Photographs cropped/treated consistently (one duotone/filter system).
- AA contrast min, AAA on body text.

## Out of scope
- Donation/payment flow.
- Multilingual UI (English only for now).
- Replacing or duplicating any operational feature from the app (registration, room
  allotment, role management all stay in the app).

## Brand line, where appropriate (low-key, in footer)
"Powered by — Softech Smart Solutions" with www.softechsmartsolutions.in. Tasteful, small,
never overpowering the Diocese / Youth Commission identity.

## What I want from you (first turn)
1. Three distinct direction options (not three variations of the same idea). For each:
   - mood description (3-4 sentences),
   - color palette (5-6 hex values, named),
   - typography pairing (display + text, named with rationale),
   - one hero composition sketch (described in detail),
   - one motion idea unique to that direction.
2. After I pick one, deliver:
   - a tokens file (colors, type, spacing, radii, shadows, motion durations/easings),
   - homepage hero in code (Next.js + Tailwind + Framer Motion),
   - the latest-announcement component (the visual anchor),
   - the design rationale doc (DESIGN.md).
