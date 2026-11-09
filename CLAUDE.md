# DiggsUltra.com: Project Brief for Claude Code

> Read this whole file before writing any code. It is the single source of truth for this build.
> Compiled: November 8, 2026. Owner: Tyler Thompson (DiggsUltra).

---

## 0. How to use this file

1. Read every section. Sections 3 and 4 explain *why*. Sections 6 to 10 explain *what*.
2. Start with **Section 11, Phase 0**. Do not skip ahead.
3. Anything marked **[OPEN]** is an unresolved decision. Ask the owner before building that piece. Build everything else.
4. Anything marked **[OPINION]** is a strategic call from the planning session, not a measured fact. Treat it as the default unless the owner overrides it.
5. Verify every library API, version, and setup step against official docs at build time. Do not code from memory.

---

## 1. Who this is for

**DiggsUltra** is a personal media brand covering ultramarathon running.

- **YouTube:** channel "Diggs", handle @Diggsultra, tagline "Everything Ultra Marathon".
- **TikTok:** @diggsultra
- **Instagram:** @diggsultra

**What Diggs does:** live updates, commentary, and hype content for ultra races, especially multi-day backyard formats (last-person-standing races). Example coverage on TikTok:
- BPN G1M Ultra: result post for Mark Dowdle winning after 72 hours and 302 miles. 2,002 likes.
- G1M hour 55 update: 878 likes.
- Last Soul Ultra preview with live stream link: 3,347 on the counter.
- Cocodona 250 / Moab 240 cost breakdown video: 2,006 likes.

---

## 2. The business (owner's answers, verbatim intent)

### Services sold
1. **Live stream commentary:** Diggs shows up at the race and commentates on the race's live stream.
2. **Hype videos:** short-form videos that build interest in a race before it happens.
3. **Live race coverage:** on-the-ground updates posted across socials during the race.

### Pricing and money
- Diggs charges **nothing yet**.
- Future pricing is **case by case**. Diggs negotiates personally with each race director.
- **No public pricing.** Quote only. The site never shows a dollar amount.
- **No deposit yet.**
- **The race director covers all expenses** (travel, lodging, food). This is non-negotiable and must be stated clearly on the booking page and acknowledged in the intake form.

### Booking history
- **6 requests received. 2 accepted. Close rate: 33%.**
- **Why 4 were declined:** short notice. Race directors asked 1 to 2 weeks before the race.
- **Accepted races:** Last Soul Ultra, Longhorn Last Stand.
- **Booking horizon:** races book up to **1.5 years (about 548 days)** in advance.

### Workflow preferences
- **Every booking is approved manually** by Diggs. No auto-accept.
- **Race date is fixed.** The race director submits it. Diggs confirms availability. No date picker for the client to "choose" a slot.
- **Most important intake fields:** race date and location.
- **Calendar:** Google Calendar.
- **Contract / terms:** none exist yet.

### Audience (owner-reported, as of Nov 2026)
| Platform | Followers | Views, last 30 days |
|---|---|---|
| Instagram | 21,000 | 1,100,000 |
| TikTok | 40,000 | 764,000 |
| YouTube | 250 | not reported |
| **Total** | **61,250** | **1,864,000** |

- Audience is **mostly US**.
- **No registration-lift data exists.** Both races Diggs covered were already large before he joined.
- **No testimonials yet.** Diggs can request them from Last Soul Ultra and Longhorn Last Stand.

### Future revenue
- **Merch:** maybe. Placeholder only.
- **Sponsors:** the site must be the place brands go to partner with Diggs.
- **Runners:** the site can serve runners too (race calendar, alerts).

---

## 3. Competitive landscape

### Primary competitor: Mountain Outpost (mountainoutpost.com)
Diggs's stated goal: beat them.

**What they have (pulled Nov 8, 2026):**
- Live endurance broadcast production company. Multi-camera, drone footage, finish line interviews.
- Owned by **Steep Life Media**, which also owns **UltraRunning Magazine** and **Race Purse**.
- **20+ live broadcasts per year. 50.1K YouTube subscribers. 8+ years broadcasting.**
- Replay views: Cocodona 250 2026 at **1.6M**, Western States 100 at **942K**, Hardrock 100 at **370K**, Javelina Jundred at **178K**, Mammoth 200 at **153K**, Run Rabbit Run 100 at **74K**, Mammoth Trailfest at **36K**, Jackpot Ultras at **25K**, Chuckanut 50K at **15K**, Sonoma Fall Classic at **15K**, Lake Sonoma 100K at **10K**.
- Site is built on Next.js and uses Vercel Blob for images (visible in image URLs).

**Their site features worth matching:**
- "Next Live" hero: race name, date, time, location, Watch Live button.
- "Up next" list with countdowns ("41 days to go") and a Remind Me action.
- Free race-day SMS alerts (start, lead changes, finish).
- Replay grid with view counts on every card.
- Stat strip in the About section.

**Their weaknesses to exploit:**
- **Booking is a single `mailto:` link.** No intake, no qualification, no pipeline. DiggsUltra beats this on day one.
- **No personality.** It is a production crew. No face, no voice.
- **No short-form presence on the site.** Everything is long YouTube replays.

### Positioning [OPINION]
Do not position against Mountain Outpost on production value. They are a funded multi-camera crew. Diggs has 250 YouTube subs.

**Position on reach and personality instead:**
- Diggs's *monthly* short-form views (1.864M) exceed Mountain Outpost's *single best replay ever* (1.6M).
- Pitch: **"They stream your race. I make people care about it."**
- Goal: become the add-on every race books *alongside* Mountain Outpost, then take share.
- Signature offer to build toward: Diggs commentates the race stream AND clips it into short-form in real time.

---

## 4. Brand and design direction

### Vibe
- **Old Western.** Frontier, dust, grit, endurance as a test of character.
- References the owner likes:
  - **lastsoulultra.com:** liked for the *vibe*. **Do not copy their color scheme.**
  - **Bare Performance Nutrition (BPN):** liked for vibe and branding.
- No logo, colors, or fonts exist yet. **[OPEN]** Build a provisional system now; owner will supply final assets later.

### Before designing
1. Open lastsoulultra.com and bareperformancenutrition.com in a real browser and screenshot them. (Automated fetch of lastsoulultra.com was blocked by bot detection during planning.)
2. Write a 5-line design rationale in `docs/design.md`: palette, type pairing, texture, motion, imagery. Get owner sign-off before Phase 2 styling.

### Provisional direction [OPINION]
- **Palette:** desert and leather tones. Bone/parchment background, deep ink near-black, rust or oxblood accent, faded sage or denim secondary. Must be clearly distinct from Last Soul's palette.
- **Type:** a condensed slab or wood-type display face (wanted-poster energy) paired with a clean modern sans for body. Use `next/font`. Both must be free for commercial use.
- **Texture:** subtle paper grain, stamped/letterpress feel on headings. Keep it light. Performance beats decoration.
- **Copy voice:** short, punchy, active voice. Brutally direct. No corporate filler.
- **Dark mode:** required. Night-ops race coverage is a core brand moment.
- All colors defined as CSS custom properties / Tailwind theme tokens so the final brand drops in with one file change.

---

## 5. Current infrastructure state (verified Nov 8, 2026)

| Item | State |
|---|---|
| GitHub repo | `tylerrthompsonn68-arch/diggsultra`. Public. **Empty: zero commits** on `main`. |
| Vercel | Owner says a project exists. The Vercel account connected during planning showed **0 projects, 0 teams**. Owner authorized creating a new one. **[OPEN]** Confirm which Vercel account before linking. |
| Domain | Owner owns **DiggsUltra.com**. Registrar unknown. **[OPEN]** |
| Database | None. |
| Auth | None. |
| Stripe | None. Not needed until deposits start. |
| Notification email | `tylerrthompsonn68@gmail.com` for now. Owner may switch to a new address. **Store in env var `ADMIN_EMAIL`. Never hardcode.** |

---

## 6. Tech stack

Verify current versions and setup steps in official docs before installing.

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router), TypeScript strict | Owner's choice. |
| Hosting | Vercel | Owner's choice. |
| Styling | Tailwind CSS with theme tokens | Fast, brand swappable via tokens. |
| Database | Postgres via Vercel Marketplace (Neon or Supabase) | GitHub is not a backend. Need persistent pipeline data. [OPINION] |
| ORM | Drizzle | Typed schema, SQL migrations in repo. [OPINION] |
| Validation | Zod, shared between client and server | One schema per form. |
| Admin auth | Auth.js with Google provider, **allowlist of one email** (`ADMIN_EMAIL`) | Owner already lives in Google. No passwords to manage. |
| Email | Resend + React Email | Transactional confirmations and admin alerts. |
| Calendar | Google Calendar API | Write confirmed bookings to owner's calendar. |
| Images | Vercel Blob or `next/image` with remote patterns | Admin-uploaded race heroes. |
| Spam | Honeypot field + server-side rate limit + Cloudflare Turnstile | Public forms will get hit. |
| Analytics | Vercel Web Analytics + custom events on form steps | Measure funnel drop-off. |
| Payments | Stripe, **Phase 4 only** | Deposits not in use yet. |

---

## 7. Sitemap and page specs

### `/` Home
- **Hero:** next race Diggs is covering. Race name, date, location, countdown, CTA. If no upcoming race, fall back to a brand hero.
- **Reach strip:** combined monthly views (1.864M), total followers (61,250), platforms. Each stat shows an "as of" date. Values editable in admin.
- **Latest clips:** most recent videos (see Section 9).
- **Two primary CTAs:** "Book Diggs for Your Race" → `/book`. "Partner With Diggs" → `/partners`.
- **Proof:** races covered (logos or names), testimonials when they exist.

### `/book` Race director intake (the money page)
Multi-step form. Show progress. Save draft to `localStorage` wrapped in try/catch.

**Step 1: The race**
- Race name (required)
- Race website URL
- Race start date (required), end date (multi-day races)
- City, state (required), country (default US)
- Distance(s) / format (dropdown: 50K, 50M, 100K, 100M, 200M+, Backyard / last person standing, Multi-stage, Other)
- Expected field size (number)
- Is the race live streamed? Who produces the stream? (free text; surfaces Mountain Outpost overlap)

**Step 2: What you want** (multi-select)
- Live stream commentary
- Hype videos (pre-race)
- Live race coverage (on socials)
- Not sure, let's talk

**Step 3: Logistics**
- Checkbox (required): "I understand the race covers all travel, lodging, and food for Diggs."
- Nearest airport
- Lodging provided on site? (yes / no / can arrange)
- Budget range (optional select: Under $500, $500 to $1,500, $1,500 to $5,000, $5,000+, Prefer to discuss) [OPINION: captures signal without publishing prices]

**Step 4: You**
- Contact name, role, email (required), phone
- How did you hear about Diggs?
- Anything else

**Lead time rule (critical: 4 of 6 past requests were declined for this):**
- Compute days between submission and race start date.
- If below `MIN_LEAD_DAYS`, show a clear inline warning *before* submit: short notice requests are rarely accepted.
- Still allow submission but tag the inquiry `short_notice = true` and sort it to the bottom of the admin pipeline.
- `MIN_LEAD_DAYS` lives in config. Default **60**. **[OPEN]** Owner to confirm the number.
- Reject race dates more than **548 days** out with a friendly message ("we book up to 18 months ahead").
- Reject past dates.

**On submit:**
- Save to DB with status `new`.
- Email race director: confirmation, what happens next, expected response time **[OPEN: owner to set, default "within 3 business days"]**.
- Email `ADMIN_EMAIL`: full inquiry summary with a deep link to `/admin/inquiries/[id]`.

**Page copy must state:** quote only, no public pricing, expenses covered by the race, book early (show the lead time).

### `/partners` Sponsor intake + media kit
- **Media kit section:** audience numbers (from admin-managed stats), audience geography (mostly US), content formats, past race coverage, sample clips.
- **Separate form** from `/book`. Fields: brand name, website, contact name, email, role, partnership type (multi-select: race coverage sponsorship, product integration, dedicated video, event activation, other), budget range (optional), timeline, message.
- Same submit flow: DB, confirmation email, admin alert. Inquiry `type = sponsorship`.
- Optional Phase 3: downloadable media kit PDF generated from the same stats.

### `/coverage` Races covered
- Grid of races Diggs has covered, newest first. Mirrors Mountain Outpost's replay grid but leads with short-form reach.
- Each card: hero image, race name, date, location, total views across platforms, link to detail page.
- `/coverage/[slug]`: race detail with embedded clips and per-platform numbers.
- **Seed entries:** Last Soul Ultra, Longhorn Last Stand. **[OPEN]** Owner to supply dates, images, view counts.

### `/races` Runner calendar (Phase 2)
- Upcoming races Diggs will cover. Countdown per race.
- **Email alerts signup** per race or global. Double opt-in. One-click unsubscribe.
- **No SMS in v1.** SMS requires consent capture, STOP/HELP handling, and carrier compliance work. Email delivers most of the value without that overhead. [OPINION]

### `/merch` (Phase 4)
- Placeholder "coming soon" page with email capture. No store.

### `/admin` (auth-gated)
See Section 8.

### Global
- Header nav: Home, Coverage, Races, Partners, Book (Book styled as primary button).
- Footer: social links (YouTube, TikTok, Instagram), contact, privacy, terms.
- `/privacy` and `/terms` pages (required because forms collect personal data). Plain-language placeholders; owner to review.
- Open Graph images for every page.

---

## 8. Admin dashboard

Single user (`ADMIN_EMAIL`). Server-side session check on every admin route and every admin server action.

### Inquiry pipeline
**Statuses:** `new` → `reviewing` → `call_scheduled` → `quoted` → `contract_sent` → `confirmed` → `completed`. Side exit: `declined` (with reason).

**Views:**
- Kanban board by status (drag to change status).
- Table view with filters: type (race / sponsorship), status, race date range, short notice flag.
- Default sort: race date ascending, short notice last.

**Inquiry detail page:**
- All submitted fields.
- Status changer with timestamped history log.
- Private notes (append-only, timestamped).
- **Next follow-up date** field. Bookings run up to 18 months out; follow-ups get lost without this.
- Quoted amount and agreed amount fields (private, never public).
- Decline reason (select: short notice, budget, schedule conflict, not a fit, other).

### Status side effects
- **→ `confirmed`:** create a Google Calendar event on the owner's calendar spanning race start to end date, with location and a link back to the admin record. Store the returned event ID. Update the event if dates change. Delete it if status leaves `confirmed`.
- **→ `confirmed`:** optionally auto-create a draft Event in the content model so the race can appear on `/races` and the home hero (admin toggles "publish").
- **→ `declined`:** optional templated decline email (admin previews and clicks send; never auto-send).

### Content management
- **Events:** create, edit, publish/unpublish races for `/coverage`, `/races`, and the home hero.
- **Stats:** edit follower counts and monthly views per platform with an "as of" date.
- **Videos:** add or hide clips (see Section 9).
- **Testimonials:** quote, name, role, race, published toggle.
- **Subscribers:** list and CSV export.

### Daily digest (Phase 3)
- Vercel Cron job each morning: email `ADMIN_EMAIL` the list of inquiries with follow-up date today or overdue, plus new inquiries in the last 24 hours.

---

## 9. Video feed ("start with auto")

Owner wants latest videos pulled automatically.

- **YouTube:** auto-pull via YouTube Data API (channel uploads playlist) on a revalidation interval. API key in env var.
- **TikTok and Instagram:** automatic pulling requires platform API access (Instagram needs a professional account connected through Meta's Graph API; TikTok has its own developer approval). **[OPEN]** Confirm account types and whether the owner will complete developer app setup.
- **Fallback that ships in Phase 1:** admin pastes a TikTok or Instagram URL, the site renders it via the platform's official embed/oEmbed. Admin can pin, reorder, and hide clips.
- Verify each platform's current API and embed rules in official docs before building.

---

## 10. Data model (starting point)

Adjust as needed. Keep migrations in the repo.

```
inquiries
  id, type ('race' | 'sponsorship'), status, created_at, updated_at
  contact_name, contact_email, contact_phone, contact_role, referral_source, message
  -- race fields (nullable for sponsorship)
  race_name, race_url, race_start_date, race_end_date, city, state, country,
  formats[], field_size, stream_producer, services[],
  expenses_acknowledged, nearest_airport, lodging, budget_range,
  short_notice (bool), lead_days (int)
  -- sponsorship fields (nullable for race)
  brand_name, brand_url, partnership_types[], timeline
  -- private
  next_follow_up_date, quoted_amount_cents, agreed_amount_cents,
  decline_reason, gcal_event_id

inquiry_events        (status history)
  id, inquiry_id, from_status, to_status, created_at

inquiry_notes
  id, inquiry_id, body, created_at

events                (races for /coverage, /races, home hero)
  id, slug, name, start_date, end_date, city, state, hero_image_url,
  description, stream_url, status ('upcoming' | 'live' | 'completed'),
  published (bool), inquiry_id (nullable)

event_stats
  id, event_id, platform, views, likes, as_of

videos
  id, platform ('youtube' | 'tiktok' | 'instagram'), url, external_id,
  title, thumbnail_url, published_at, event_id (nullable), pinned, hidden, sort_order

channel_stats
  id, platform, followers, views_30d, as_of

testimonials
  id, quote, author_name, author_role, event_id, published

subscribers
  id, email, scope ('all' | event_id), confirmed_at, unsubscribed_at, created_at
```

---

## 11. Build phases

Each phase ends with a deployed preview on Vercel and a short summary to the owner.

### Phase 0: Foundation
- [ ] Confirm the Vercel account with the owner **[OPEN]**. Create or link the Vercel project to `tylerrthompsonn68-arch/diggsultra`.
- [ ] Scaffold Next.js (App Router, TypeScript strict, Tailwind, ESLint).
- [ ] Provision Postgres via Vercel Marketplace. Add Drizzle and first migration.
- [ ] `.env.example` listing every variable (no values). Never commit real secrets.
- [ ] Provisional theme tokens (Section 4) and base layout with header/footer.
- [ ] README with local setup steps.

### Phase 1: The money path
- [ ] `/book` multi-step form with lead-time logic.
- [ ] `/partners` form and media kit section.
- [ ] Home page with hero, reach strip, CTAs.
- [ ] Resend emails: client confirmation + admin alert, for both forms.
- [ ] Admin auth (Google, single-email allowlist).
- [ ] Admin pipeline: kanban, table, detail page, notes, status history, follow-up date.
- [ ] Admin stats editor.
- [ ] Spam protection on both forms.
- [ ] Privacy and terms placeholder pages.

### Phase 2: Proof and audience
- [ ] Design rationale signed off by owner (Section 4).
- [ ] `/coverage` grid + detail pages. Seed Last Soul Ultra and Longhorn Last Stand.
- [ ] Video feed: YouTube auto-pull + admin-pasted TikTok/Instagram embeds.
- [ ] `/races` runner calendar with countdowns.
- [ ] Email alerts with double opt-in and unsubscribe.
- [ ] Testimonials in admin and on home.

### Phase 3: Automation
- [ ] Google Calendar sync on `confirmed`.
- [ ] Daily follow-up digest via Vercel Cron.
- [ ] Media kit PDF download.
- [ ] Connect DiggsUltra.com domain **[OPEN: registrar]**.

### Phase 4: Money and merch
- [ ] Stripe deposits / invoices (only after owner sets pricing and deposit policy).
- [ ] Contract template and e-sign step. Owner must have a lawyer review terms.
- [ ] `/merch` placeholder → store decision later.
- [ ] TikTok/Instagram auto-pull if API access is approved.

---

## 12. Definition of done (objective checks)

| Check | Target |
|---|---|
| Lighthouse mobile (Performance, Accessibility, Best Practices, SEO) | **90+ each** on `/`, `/book`, `/partners` |
| Form → DB → both emails | Verified end to end on a Vercel preview with a real test submission |
| Lead time logic | Unit tests: past date rejected, >548 days rejected, under `MIN_LEAD_DAYS` flagged `short_notice` |
| Admin protection | Unauthenticated request to any `/admin` route or admin action returns redirect/401 (tested) |
| Calendar sync | Status → `confirmed` creates exactly one event; leaving `confirmed` deletes it |
| Accessibility | Every form field labeled; full keyboard navigation through `/book` |
| Responsive | No horizontal scroll at 360px width |
| Funnel | Vercel Analytics events fire for each `/book` step and submit |

**Business metric the site exists to move:** inquiry → confirmed booking rate. Baseline today: **2 of 6 (33%)**. Track it in admin from day one (count by status).

---

## 13. Open items for the owner

1. **Vercel account:** which account owns (or should own) the project?
2. **Domain registrar** for DiggsUltra.com.
3. **`MIN_LEAD_DAYS`:** minimum notice before a race. Default 60.
4. **Response time promise** in the confirmation email. Default "within 3 business days".
5. **Last Soul Ultra and Longhorn Last Stand:** dates, locations, photos, view counts for `/coverage`.
6. **Testimonials** from those two race directors.
7. **Instagram and TikTok account types** (personal, creator, business) for API access.
8. **Brand assets:** logo, colors, fonts (provisional system is fine until then).
9. **Final notification email** if switching off Gmail.
10. **Sign-off on design rationale** before Phase 2 styling.

---

## 14. Guardrails for Claude Code

- Ask before: buying anything, adding paid Marketplace integrations, changing DNS, or deleting data.
- Never commit secrets. Use Vercel environment variables and `.env.local` (gitignored).
- Never show prices publicly.
- Never auto-send decline emails.
- Small, focused commits with clear messages. One phase per PR or branch.
- When an assumption is made, write it in `docs/decisions.md` with the date.

---

@AGENTS.md
