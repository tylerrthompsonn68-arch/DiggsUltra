CREATE TYPE "public"."decline_reason" AS ENUM('short_notice', 'budget', 'schedule_conflict', 'not_a_fit', 'other');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('upcoming', 'live', 'completed');--> statement-breakpoint
CREATE TYPE "public"."inquiry_status" AS ENUM('new', 'reviewing', 'call_scheduled', 'quoted', 'contract_sent', 'confirmed', 'completed', 'declined');--> statement-breakpoint
CREATE TYPE "public"."inquiry_type" AS ENUM('race', 'sponsorship');--> statement-breakpoint
CREATE TYPE "public"."lodging_option" AS ENUM('yes', 'no', 'can_arrange');--> statement-breakpoint
CREATE TYPE "public"."platform" AS ENUM('youtube', 'tiktok', 'instagram');--> statement-breakpoint
CREATE TABLE "channel_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" "platform" NOT NULL,
	"followers" integer NOT NULL,
	"views_30d" integer,
	"as_of" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"platform" "platform" NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"likes" integer,
	"as_of" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"city" text,
	"state" text,
	"hero_image_url" text,
	"description" text,
	"stream_url" text,
	"status" "event_status" DEFAULT 'upcoming' NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"inquiry_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "inquiry_type" NOT NULL,
	"status" "inquiry_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"contact_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" text,
	"contact_role" text,
	"referral_source" text,
	"message" text,
	"race_name" text,
	"race_url" text,
	"race_start_date" date,
	"race_end_date" date,
	"city" text,
	"state" text,
	"country" text DEFAULT 'US',
	"formats" text[],
	"field_size" integer,
	"stream_producer" text,
	"services" text[],
	"expenses_acknowledged" boolean,
	"nearest_airport" text,
	"lodging" "lodging_option",
	"budget_range" text,
	"short_notice" boolean DEFAULT false NOT NULL,
	"lead_days" integer,
	"brand_name" text,
	"brand_url" text,
	"partnership_types" text[],
	"timeline" text,
	"next_follow_up_date" date,
	"quoted_amount_cents" integer,
	"agreed_amount_cents" integer,
	"decline_reason" "decline_reason",
	"gcal_event_id" text
);
--> statement-breakpoint
CREATE TABLE "inquiry_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inquiry_id" uuid NOT NULL,
	"from_status" "inquiry_status",
	"to_status" "inquiry_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inquiry_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inquiry_id" uuid NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"scope" text DEFAULT 'all' NOT NULL,
	"confirmed_at" timestamp with time zone,
	"unsubscribed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quote" text NOT NULL,
	"author_name" text NOT NULL,
	"author_role" text,
	"event_id" uuid,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" "platform" NOT NULL,
	"url" text NOT NULL,
	"external_id" text,
	"title" text,
	"thumbnail_url" text,
	"published_at" timestamp with time zone,
	"event_id" uuid,
	"pinned" boolean DEFAULT false NOT NULL,
	"hidden" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event_stats" ADD CONSTRAINT "event_stats_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_inquiry_id_inquiries_id_fk" FOREIGN KEY ("inquiry_id") REFERENCES "public"."inquiries"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiry_events" ADD CONSTRAINT "inquiry_events_inquiry_id_inquiries_id_fk" FOREIGN KEY ("inquiry_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiry_notes" ADD CONSTRAINT "inquiry_notes_inquiry_id_inquiries_id_fk" FOREIGN KEY ("inquiry_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "inquiries_status_idx" ON "inquiries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "inquiries_race_start_idx" ON "inquiries" USING btree ("race_start_date");--> statement-breakpoint
CREATE INDEX "inquiries_follow_up_idx" ON "inquiries" USING btree ("next_follow_up_date");--> statement-breakpoint
CREATE INDEX "inquiry_events_inquiry_idx" ON "inquiry_events" USING btree ("inquiry_id");--> statement-breakpoint
CREATE INDEX "inquiry_notes_inquiry_idx" ON "inquiry_notes" USING btree ("inquiry_id");