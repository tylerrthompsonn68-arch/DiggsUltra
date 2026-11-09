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
