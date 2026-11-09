# Decisions log

Assumptions made during the build, with dates. See CLAUDE.md section 14.

## 2026-11-08
- **Local Node.js:** Homebrew can't build Node on macOS 13 (Tier 3; the source build failed). Node gets installed with the official nodejs.org macOS installer instead.
- **Brief location:** CLAUDE.md is copied into the repo root so it's versioned with the code and loaded automatically by Claude Code.
- **Next.js 16.4.5** scaffolded with create-next-app defaults: `src/` dir, Tailwind 4, ESLint, Cache Components + Partial Prefetching on (the new defaults).
- **Database driver:** Neon (`@neondatabase/serverless` + `drizzle-orm/neon-http`), chosen over Supabase because the site only needs Postgres, not Supabase's auth/storage. Not provisioned yet: waiting on the Vercel account confirmation (open item #1). The Neon free tier needs owner approval per §14.
- **DB client is lazy** (`getDb()`), so builds and previews work before `DATABASE_URL` exists.
- **Provisional fonts:** Rye (display) + Inter (body). See docs/design.md.
- **Dark mode:** follows the OS by default; `data-theme="light|dark"` on `<html>` overrides it, ready for a toggle later.
- **`booking.minLeadDays = 60`, `responseTime = "within 3 business days"`:** brief defaults, still [OPEN].
- **AGENTS.md:** kept the Next.js-generated agent rules (`next dev` rewrites them anyway) and referenced them from CLAUDE.md.
- **Vercel:** project `diggsultra` on team **DIGGS** (`diggs2`, Hobby), account `tylerrthompsonn68-2265`. The owner logged in to choose it, which closes open item #1. Public URL: https://diggsultra.vercel.app
- **First deploy came from the CLI** because the Vercel GitHub app isn't installed on `tylerrthompsonn68-arch` yet. Once it's installed, run `vercel git connect` so pushes auto-deploy.
- **Neon (free plan):** the owner approved it on 2026-11-08. Planned settings: region `iad1` (US East, matches the Vercel default function region), Neon Auth off (Auth.js handles admin login). The owner installs it from the Vercel dashboard.
- **Neon connected** (resource `neon-green-cloud`) to production, preview, and development. Migration `0000_init` applied: all 9 tables exist. GitHub ↔ Vercel connected, so pushes now auto-deploy.
- **drizzle.config.ts** loads `.env.local` and prefers `DATABASE_URL_UNPOOLED` for migrations.
- **Lead time (owner-confirmed):** minimum 30 days (below that = `short_notice`), preferred 90 days (30–89 shows a soft "earlier is better" note). Closes open item #3.
- **Response time (owner-confirmed):** no fixed promise. The confirmation email says "as soon as I can". Closes open item #4.
- **Brand direction (owner feedback):** the full Western theme was too much. Going subtler: "DIGGS" in bold caps plus "Ultra" in a Western script. Four wordmark options are on a design canvas; the Rye/parchment provisional look will be replaced once one is picked.
- **Brand picked:** option A+D 3 (Archivo Black + Yellowtail, A's rust palette). Replaced the Rye/parchment/grain look. Closes open item #10 for direction; a finished SVG logo is still optional.
- **Owner photos:** 7 web copies are in `public/images/diggs/` (max 2000px, JPEG q80). All EXIF/GPS metadata is stripped, because the originals had location data. Originals stay on the owner's Desktop and are not in the repo. Left out for now: `Strong.heic` (shirtless, which fits social media better than a race-director booking page) and `IMG_7737.MOV` (24s vertical video, 25MB; it needs compressing before it could be a hero loop).

## 2026-11-08 (Phase 1)
- **Tagline:** "Making ultras worth watching." The owner asked for no comparison to other coverage. It's in `site.headline` (`src/config/site.ts`), with alternates in the PR description.
- **Admin auth:** Auth.js v5 (beta, supports Next 16), Google only, JWT sessions (no auth tables). `signIn` callback requires `email_verified` and an exact `ADMIN_EMAIL` match. `src/proxy.ts` gives an optimistic redirect; `requireAdmin()`/`assertAdmin()` enforce on every admin page and action.
- **Graceful without keys:** no `RESEND_API_KEY` → emails are logged, not sent. No `TURNSTILE_SECRET_KEY` → the Turnstile check is skipped (honeypot + rate limit still apply). The site works end to end before those accounts exist.
- **Rate limit:** Postgres fixed window, 5 submissions/hour per form per hashed IP (`rate_limits` table, migration 0001).
- **Stats:** `getChannelStats()` uses `"use cache"` + `cacheTag("channel-stats")`, and the admin save calls `updateTag`. It falls back to the brief's Nov 2026 numbers until a snapshot is saved.
- **Lead time "today"** is US Central on the server and the visitor's local zone in the browser. A 1-day disagreement at midnight is acceptable.
- **Dropping a card on "Declined"** in the kanban sets no reason. The reason is picked on the detail page (keeps drag simple; decline emails are never auto-sent).
- **/coverage and /races** are placeholder pages, so nav links don't 404 before Phase 2.
- **Viper 100 result** is not claimed anywhere until the owner confirms the year/placing.
- **@types/node bumped to ^24** (vitest 5 peer requirement; runtime is Node 26).
