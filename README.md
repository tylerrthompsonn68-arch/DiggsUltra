# DiggsUltra.com

Booking, sponsorship, and coverage site for **DiggsUltra**: live commentary, hype videos, and on-the-ground coverage for ultramarathons.

The full project brief is in [`CLAUDE.md`](./CLAUDE.md). Decisions and assumptions are logged in [`docs/decisions.md`](./docs/decisions.md).

## Stack

Next.js 16 (App Router, TypeScript strict) · Tailwind CSS 4 · Postgres (Neon) + Drizzle ORM · Zod · Vercel

## Local setup

**Requirements:** Node.js 24+ (install from [nodejs.org](https://nodejs.org)) and git.

```bash
git clone https://github.com/tylerrthompsonn68-arch/DiggsUltra.git
cd diggsultra
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

To get real values, link the project and pull env vars from Vercel (the Neon integration sets the database URLs):

```bash
npx vercel link --project diggsultra --scope diggs2
npx vercel env pull .env.local
```

## Database

The schema lives in `src/db/schema.ts`. Migrations are SQL files in `drizzle/` and are committed to the repo.

```bash
npm run db:generate   # create a new migration after editing schema.ts
npm run db:migrate    # apply migrations (reads .env.local)
npm run db:studio     # browse data locally
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types + `tsc` |

## Theming

All brand colors are CSS custom properties at the top of `src/app/globals.css`, with light and dark ("night ops") sets. Fonts are set in `src/app/layout.tsx`. Swapping in the final brand means editing those two places only.

## Business rules

Lead-time limits, response-time copy, nav, and social links live in `src/config/site.ts`.
