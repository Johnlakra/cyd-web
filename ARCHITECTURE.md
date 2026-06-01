# Anubhav 2026 Public Website — Architecture & Build Plan

## Current repo state (verified 2026-05-29 against feature/anubhav-2026-event-module)
- Backend live URL: https://cyd-id-be.onrender.com
- Login endpoint: POST /auth/login (NOT /api/auth/login — comments in code are misleading)
- Mounts: /auth, /profiles, /profile-holder, /anubhav (server.js)
- CORS: app.use(cors()) — wide open today; tighten with allow-list when adding the website
- /anubhav/my/event already built, tested, and returns:
    { registered, place, venue, dates, room, timetable, live, announcements }
  -> the website's /me page calls THIS, no new auth/data code needed
- Accommodation deletes (admin/dexco only) shipped 2026-05-28; rooming occupants include photo_url
- No anubhav_speakers table yet — the website backend agent must add it
- Response envelope app-wide: { success, message, data }
- Existing Anubhav pages in CYD_ID (DO NOT TOUCH): RegisterYouth, RegisteredYouthList,
  AnubhavRegistration, BuildingSetup, RoomBoard, RoomingPdfGenerator, TimetableManager,
  AnnouncementManager, AnubhavLiveBanner, MyEvent, RoleManagement.

## Decision: separate Next.js site (new repo)
A third repo, e.g. `anubhav-web`, deployed independently. Talks to the EXISTING backend
(`cyd_Id_BE`) for data. Reuses the EXISTING JWT for login. The current CYD_ID app stays
100% untouched.

Why separate (vs. adding public routes to CYD_ID):
- Awwwards-grade design needs Next.js (SSR/SEO, image optimization, motion libs).
- The existing app's MUI default theme must not change — a public marketing site needs
  a distinct, modern aesthetic without bleeding back into the app.
- SEO matters for an event website; CRA SPAs index poorly.
- Failure isolation: a viral share storm on the public site can't impact DEXCO operations.

## What lives where

### New: anubhav-web (Next.js 14, App Router, TypeScript, Tailwind, Framer Motion)
- `/`               Hero, dates/venues, latest announcement at the TOP of the hierarchy.
- `/timetable`      Three places × three days, beautifully laid out.
- `/announcements`  Full feed (latest at top).
- `/speakers`       Speakers grid with bios and photos.
- `/stats`          Live participant counts per place + totals.
- `/login`          Reuses backend JWT.
- `/me`             Authenticated participant: their profile + Anubhav details (room,
                    roommates name+parish only, their place timetable, their announcements).
                    NO bouncing into the app.

### Backend additions (cyd_Id_BE) — strictly additive
New PUBLIC endpoints (no auth) under `/anubhav/public/*`:
  GET /anubhav/public/event-summary    -> venues, dates, deanery groups (static-ish facts)
  GET /anubhav/public/announcements    -> place + diocese-wide, status=1, sanitized
  GET /anubhav/public/announcements/latest -> the single most-recent (for the homepage hero)
  GET /anubhav/public/timetable?place= -> ordered items (no creator info)
  GET /anubhav/public/stats            -> { byPlace:[{place,registered,allotted}], totals }
                                          counts only — NO names, phones, or photos
  GET /anubhav/public/speakers         -> [{name, role, bio, photo_url, place|null}]

New tables:
  anubhav_speakers (id, place|null, name, role, bio, photo_url, sort_order, status, created_by, created_at)

CORS must allow the website origin. The website never touches admin/DEXCO endpoints.

### Existing endpoints reused (with the SAME JWT) for /me on the website
  POST /api/auth/login           -> token
  GET  /anubhav/my/event         -> participant's room/timetable/announcements (already built)
  GET  /api/profile/me (or equivalent)  -> the user's profile data

## Hard rules
1. NO PII in public endpoints. Stats are counts only. Roommates expose name+parish only,
   and only on the authenticated /me page (matches the app's existing privacy model).
2. The website is a SEPARATE repo; it must NEVER push changes into CYD_ID or alter its build.
3. The CYD_ID app's design, routes, and behavior stay exactly the same.
4. Latest announcement is the visual anchor of the homepage — top of the information hierarchy,
   above the fold, above other content blocks.
5. Mobile-first; awwwards-grade motion but always respect prefers-reduced-motion.
6. Phone numbers, photo_url for youth (other than authenticated /me), and any contact info
   never leave the backend on a public endpoint.
