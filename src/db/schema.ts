import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/* ---------- Enums ---------- */

export const inquiryType = pgEnum("inquiry_type", ["race", "sponsorship"]);

export const inquiryStatus = pgEnum("inquiry_status", [
  "new",
  "reviewing",
  "call_scheduled",
  "quoted",
  "contract_sent",
  "confirmed",
  "completed",
  "declined",
]);

export const declineReason = pgEnum("decline_reason", [
  "short_notice",
  "budget",
  "schedule_conflict",
  "not_a_fit",
  "other",
]);

export const lodgingOption = pgEnum("lodging_option", [
  "yes",
  "no",
  "can_arrange",
]);

export const platform = pgEnum("platform", ["youtube", "tiktok", "instagram"]);

export const eventStatus = pgEnum("event_status", [
  "upcoming",
  "live",
  "completed",
]);

/* ---------- Shared column helpers ---------- */

const id = () => uuid("id").primaryKey().defaultRandom();
const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

/* ---------- Inquiries (race + sponsorship pipeline) ---------- */

export const inquiries = pgTable(
  "inquiries",
  {
    id: id(),
    type: inquiryType("type").notNull(),
    status: inquiryStatus("status").notNull().default("new"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),

    // Contact
    contactName: text("contact_name").notNull(),
    contactEmail: text("contact_email").notNull(),
    contactPhone: text("contact_phone"),
    contactRole: text("contact_role"),
    referralSource: text("referral_source"),
    message: text("message"),

    // Race fields (null for sponsorship)
    raceName: text("race_name"),
    raceUrl: text("race_url"),
    raceStartDate: date("race_start_date", { mode: "string" }),
    raceEndDate: date("race_end_date", { mode: "string" }),
    city: text("city"),
    state: text("state"),
    country: text("country").default("US"),
    formats: text("formats").array(),
    fieldSize: integer("field_size"),
    streamProducer: text("stream_producer"),
    services: text("services").array(),
    expensesAcknowledged: boolean("expenses_acknowledged"),
    nearestAirport: text("nearest_airport"),
    lodging: lodgingOption("lodging"),
    budgetRange: text("budget_range"),
    shortNotice: boolean("short_notice").notNull().default(false),
    leadDays: integer("lead_days"),

    // Sponsorship fields (null for race)
    brandName: text("brand_name"),
    brandUrl: text("brand_url"),
    partnershipTypes: text("partnership_types").array(),
    timeline: text("timeline"),

    // Private (admin only, never public)
    nextFollowUpDate: date("next_follow_up_date", { mode: "string" }),
    quotedAmountCents: integer("quoted_amount_cents"),
    agreedAmountCents: integer("agreed_amount_cents"),
    declineReason: declineReason("decline_reason"),
    gcalEventId: text("gcal_event_id"),
  },
  (t) => [
    index("inquiries_status_idx").on(t.status),
    index("inquiries_race_start_idx").on(t.raceStartDate),
    index("inquiries_follow_up_idx").on(t.nextFollowUpDate),
  ],
);

/** Status history log. One row per status change. */
export const inquiryEvents = pgTable(
  "inquiry_events",
  {
    id: id(),
    inquiryId: uuid("inquiry_id")
      .notNull()
      .references(() => inquiries.id, { onDelete: "cascade" }),
    fromStatus: inquiryStatus("from_status"),
    toStatus: inquiryStatus("to_status").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("inquiry_events_inquiry_idx").on(t.inquiryId)],
);

/** Private notes. Append-only. */
export const inquiryNotes = pgTable(
  "inquiry_notes",
  {
    id: id(),
    inquiryId: uuid("inquiry_id")
      .notNull()
      .references(() => inquiries.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("inquiry_notes_inquiry_idx").on(t.inquiryId)],
);

/* ---------- Public content ---------- */

/** Races for /coverage, /races, and the home hero. */
export const events = pgTable("events", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }),
  city: text("city"),
  state: text("state"),
  heroImageUrl: text("hero_image_url"),
  description: text("description"),
  streamUrl: text("stream_url"),
  status: eventStatus("status").notNull().default("upcoming"),
  published: boolean("published").notNull().default(false),
  inquiryId: uuid("inquiry_id").references(() => inquiries.id, {
    onDelete: "set null",
  }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const eventStats = pgTable("event_stats", {
  id: id(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  platform: platform("platform").notNull(),
  views: integer("views").notNull().default(0),
  likes: integer("likes"),
  asOf: date("as_of", { mode: "string" }).notNull(),
});

export const videos = pgTable("videos", {
  id: id(),
  platform: platform("platform").notNull(),
  url: text("url").notNull(),
  externalId: text("external_id"),
  title: text("title"),
  thumbnailUrl: text("thumbnail_url"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  eventId: uuid("event_id").references(() => events.id, {
    onDelete: "set null",
  }),
  pinned: boolean("pinned").notNull().default(false),
  hidden: boolean("hidden").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAt(),
});

/** Follower counts + 30-day views per platform. Latest row per platform wins. */
export const channelStats = pgTable("channel_stats", {
  id: id(),
  platform: platform("platform").notNull(),
  followers: integer("followers").notNull(),
  views30d: integer("views_30d"),
  asOf: date("as_of", { mode: "string" }).notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: id(),
  quote: text("quote").notNull(),
  authorName: text("author_name").notNull(),
  authorRole: text("author_role"),
  eventId: uuid("event_id").references(() => events.id, {
    onDelete: "set null",
  }),
  published: boolean("published").notNull().default(false),
  createdAt: createdAt(),
});

/** Email alert subscribers. scope = 'all' or an event id. */
export const subscribers = pgTable("subscribers", {
  id: id(),
  email: text("email").notNull(),
  scope: text("scope").notNull().default("all"),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
  createdAt: createdAt(),
});
