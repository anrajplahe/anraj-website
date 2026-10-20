CREATE TYPE "public"."journal_category" AS ENUM('bhangra', 'music');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('image', 'video_embed');--> statement-breakpoint
CREATE TYPE "public"."publication_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "post_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"type" "media_type" NOT NULL,
	"url" text NOT NULL,
	"caption" text,
	"alt_text" text,
	"position" integer DEFAULT 0 NOT NULL,
	"is_cover" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" "journal_category" NOT NULL,
	"title" text,
	"content" jsonb NOT NULL,
	"journal_date" date NOT NULL,
	"journal_time" time,
	"status" "publication_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "post_media" ADD CONSTRAINT "post_media_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "post_media_order_idx" ON "post_media" USING btree ("post_id","position");--> statement-breakpoint
CREATE INDEX "posts_journal_idx" ON "posts" USING btree ("category","status","journal_date","journal_time");