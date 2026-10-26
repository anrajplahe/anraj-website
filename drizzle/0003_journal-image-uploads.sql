CREATE TABLE "journal_image_uploads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid,
	"pathname" text NOT NULL,
	"url" text,
	"content_type" text NOT NULL,
	"size" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"verified_at" timestamp with time zone,
	CONSTRAINT "journal_image_uploads_pathname_unique" UNIQUE("pathname")
);
--> statement-breakpoint
ALTER TABLE "journal_image_uploads" ADD CONSTRAINT "journal_image_uploads_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "journal_image_uploads_post_idx" ON "journal_image_uploads" USING btree ("post_id");