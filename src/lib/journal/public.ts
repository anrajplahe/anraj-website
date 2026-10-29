
import {
  and,
  asc,
  desc,
  eq,
  inArray,
  isNotNull,
  sql,
} from "drizzle-orm";

import type { Metadata } from "next";

import { db } from "@/db";
import { posts, postMedia } from "@/db/schema";
import { UUID_PATTERN } from "@/lib/journal/images";
import type { JournalEntry } from "@/components/journal/JournalListing";

type JournalCategory = "bhangra" | "music";

// ---------------------------------------------------------
// Extract readable text from Tiptap JSON
// ---------------------------------------------------------

function extractText(value: unknown): string {
  if (!value || typeof value !== "object") {
    return "";
  }

  const node = value as {
    type?: string;
    text?: string;
    content?: unknown;
  };

  if (node.type === "text") {
    return typeof node.text === "string"
      ? node.text
      : "";
  }

  if (node.type === "hardBreak") {
    return " ";
  }

  const text = Array.isArray(node.content)
    ? node.content.map(extractText).join("")
    : "";

  if (
    node.type === "paragraph" ||
    node.type === "listItem"
  ) {
    return `${text} `;
  }

  return text;
}

// ---------------------------------------------------------
// Generate a short excerpt from journal content
// ---------------------------------------------------------

function createExcerpt(content: unknown): string {
  const text = extractText(content)
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= 180) {
    return text;
  }

  return `${text.slice(0, 180).trimEnd()}…`;
}

// ---------------------------------------------------------
// Retrieve published journal entries for public listings
// ---------------------------------------------------------

export async function getPublishedJournalEntries(
  category: JournalCategory,
  limit?: number
): Promise<JournalEntry[]> {
  // Only published entries are visible publicly.
  // Pending revisions are never included.

  const query = db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      date: posts.journalDate,
    })
    .from(posts)
    .where(
      and(
        eq(posts.category, category),
        eq(posts.status, "published"),
        isNotNull(posts.journalDate)
      )
    )
    .orderBy(
      desc(posts.journalDate),
      sql`${posts.journalTime} DESC NULLS LAST`,
      desc(posts.publishedAt),
      desc(posts.id)
    );

  // Limit results for main-page previews.
  // Retrieve all entries for the full journal.
  const entries =
    limit !== undefined
      ? await query.limit(limit)
      : await query;

  if (entries.length === 0) {
    return [];
  }

  // -------------------------------------------------------
  // Retrieve published media for these entries
  // -------------------------------------------------------

  const media = await db
    .select({
      postId: postMedia.postId,
      id: postMedia.id,
      type: postMedia.type,
      url: postMedia.url,
      altText: postMedia.altText,
      isCover: postMedia.isCover,
    })
    .from(postMedia)
    .where(
      inArray(
        postMedia.postId,
        entries.map((entry) => entry.id)
      )
    )
    .orderBy(
      asc(postMedia.position),
      asc(postMedia.id)
    );

  // Store the selected cover image for each entry.
  const coverByPost = new Map<
    string,
    { url: string; alt: string }
  >();

  const coverIdByPost = new Map<string, string>();
  const imagesByPost = new Map<
    string,
    { id: string; url: string; alt: string }[]
  >();

  // Store every social media URL for each entry.
  const socialByPost = new Map<string, string[]>();

  for (const item of media) {
    // Selected cover image
    if (
      item.type === "image" &&
      item.isCover &&
      !coverByPost.has(item.postId)
    ) {
      coverIdByPost.set(item.postId, item.id);
      coverByPost.set(item.postId, {
        url: item.url,
        alt: item.altText ?? "",
      });
    }

    if (item.type === "image") {
      const images = imagesByPost.get(item.postId) ?? [];
      images.push({ id: item.id, url: item.url, alt: item.altText ?? "" });
      imagesByPost.set(item.postId, images);
    }

    // YouTube, Instagram and TikTok embeds
    if (item.type === "video_embed") {
      const existing =
        socialByPost.get(item.postId) ?? [];

      existing.push(item.url);

      socialByPost.set(item.postId, existing);
    }
  }

  // -------------------------------------------------------
  // Format entries for the journal listing component
  // -------------------------------------------------------

  return entries
    .filter((entry) => entry.date !== null)
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      date: entry.date!,
      excerpt: createExcerpt(entry.content),
      coverImage:
        coverByPost.get(entry.id) ?? null,
      previewSocialUrls:
        socialByPost.get(entry.id) ?? [],
      previewImages: (imagesByPost.get(entry.id) ?? []).filter(
        (image) => image.id !== coverIdByPost.get(entry.id)
      ),
    }));
}

// ---------------------------------------------------------
// Retrieve one complete published journal article
// ---------------------------------------------------------

export async function getPublishedJournalArticle(
  category: JournalCategory,
  id: string
) {
  // Reject invalid IDs before querying PostgreSQL.
  if (!UUID_PATTERN.test(id)) {
    return null;
  }

  // Read only published content.
  // Never expose pendingRevision.
  const [entry] = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      date: posts.journalDate,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(
      and(
        eq(posts.id, id),
        eq(posts.category, category),
        eq(posts.status, "published"),
        isNotNull(posts.journalDate)
      )
    )
    .limit(1);

  if (!entry || !entry.date) {
    return null;
  }

  // Retrieve all published media in its saved order.
  const media = await db
    .select({
      id: postMedia.id,
      type: postMedia.type,
      url: postMedia.url,
      caption: postMedia.caption,
      altText: postMedia.altText,
      isCover: postMedia.isCover,
    })
    .from(postMedia)
    .where(
      eq(postMedia.postId, entry.id)
    )
    .orderBy(
      asc(postMedia.position),
      asc(postMedia.id)
    );

  return {
    ...entry,
    date: entry.date,
    media,
  };
}

// ---------------------------------------------------------
// Generate SEO metadata for individual journal articles
// ---------------------------------------------------------

export async function getPublishedJournalMetadata(
  category: JournalCategory,
  id: string
): Promise<Metadata> {
  const entry = await getPublishedJournalArticle(
    category,
    id
  );

  // Prevent unpublished or missing entries
  // from receiving indexable metadata.
  if (!entry) {
    return {
      title: "Journal entry not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // -------------------------------------------------------
  // Article title
  // -------------------------------------------------------

  const title =
    entry.title?.trim() ||
    (category === "bhangra"
      ? "Bhangra Journal Entry"
      : "Music Journal Entry");

  // -------------------------------------------------------
  // Article description
  // -------------------------------------------------------

  const description =
    createExcerpt(entry.content) ||
    (category === "bhangra"
      ? "A Bhangra journal entry by Anraj Plahe."
      : "A music journal entry by Anraj Plahe.");

  // -------------------------------------------------------
  // Canonical URL
  // -------------------------------------------------------

  const canonical = `/${category}/${entry.id}`;

  // -------------------------------------------------------
  // Social sharing image
  // -------------------------------------------------------

  // Prefer the explicitly selected cover image.
  // Otherwise, use the first uploaded photograph.
  const cover =
    entry.media.find(
      (item) =>
        item.type === "image" && item.isCover
    ) ??
    entry.media.find(
      (item) => item.type === "image"
    );

  const image = cover
    ? {
        url: cover.url,
        alt: cover.altText?.trim() || title,
      }
    : null;

  // -------------------------------------------------------
  // Next.js metadata
  // -------------------------------------------------------

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,
    },

    // Open Graph (LinkedIn, Facebook, WhatsApp, etc.)
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Anraj Plahe",
      locale: "en_GB",
      type: "article",

      ...(entry.publishedAt
        ? {
            publishedTime:
              entry.publishedAt.toISOString(),
          }
        : {}),

      ...(image
        ? { images: [image] }
        : {}),
    },

    // X / Twitter sharing cards
    twitter: {
      card: image
        ? "summary_large_image"
        : "summary",

      title,
      description,

      ...(image
        ? { images: [image] }
        : {}),
    },
  };
}
