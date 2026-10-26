
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  date,
  time,
  jsonb,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

import type { JournalDraftFields } from "@/types/journal";

// Journal categories
export const journalCategory = pgEnum(
  "journal_category",
  ["bhangra", "music"]
);

// Publication status
export const publicationStatus = pgEnum(
  "publication_status",
  ["draft", "published"]
);

// Media types
export const mediaType = pgEnum(
  "media_type",
  ["image", "video_embed"]
);

// Journal entries
export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    category: journalCategory("category").notNull(),

    title: text("title"),

    // Rich-text content from Tiptap
    content: jsonb("content")
      .$type<Record<string, unknown>>()
      .notNull(),

    pendingRevision: jsonb("pending_revision")
      .$type<JournalDraftFields>(),

    // User-selected date and optional time
    journalDate: date("journal_date", { mode: "string" }),

    journalTime: time("journal_time"),

    status: publicationStatus("status")
      .default("draft")
      .notNull(),

    // Automatically managed timestamps
    createdAt: timestamp("created_at", {
      withTimezone: true,
    }).defaultNow().notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),

    publishedAt: timestamp("published_at", {
      withTimezone: true,
    }),
  },
  (table) => [
    index("posts_journal_idx").on(
      table.category,
      table.status,
      table.journalDate,
      table.journalTime
    ),
  ]
);

// Media attached to journal entries
export const postMedia = pgTable(
  "post_media",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, {
        onDelete: "cascade",
      }),

    type: mediaType("type").notNull(),

    url: text("url").notNull(),

    caption: text("caption"),

    altText: text("alt_text"),

    // Position within the photo carousel
    position: integer("position")
      .default(0)
      .notNull(),

    isCover: boolean("is_cover")
      .default(false)
      .notNull(),
  },
  (table) => [
    index("post_media_order_idx").on(
      table.postId,
      table.position
    ),
  ]
);
