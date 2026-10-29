
import { and, asc, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { posts, postMedia } from "@/db/schema";
import type { JournalEntry } from "@/components/journal/JournalListing";
import { UUID_PATTERN } from "@/lib/journal/images";

type JournalCategory = "bhangra" | "music";

// Extract readable text from Tiptap JSON.
function extractText(value: unknown): string {
  if (!value || typeof value !== "object") return "";

  const node = value as {
    type?: string;
    text?: string;
    content?: unknown;
  };

  if (node.type === "text") {
    return typeof node.text === "string" ? node.text : "";
  }

  if (node.type === "hardBreak") return " ";

  const text = Array.isArray(node.content)
    ? node.content.map(extractText).join("")
    : "";

  if (node.type === "paragraph" || node.type === "listItem") {
    return `${text} `;
  }

  return text;
}

function createExcerpt(content: unknown): string {
  const text = extractText(content).replace(/\s+/g, " ").trim();

  if (text.length <= 180) return text;

  return `${text.slice(0, 180).trimEnd()}…`;
}

export async function getPublishedJournalEntries(
  category: JournalCategory,
  limit?: number
): Promise<JournalEntry[]> {
  // Only query the published version of each entry.
  // Build the published-entry query.
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

    const entries =
    limit !== undefined
        ? await query.limit(limit)
        : await query;

  if (entries.length === 0) return [];

  // Retrieve selected cover images for these entries.
  const covers = await db
    .select({
      postId: postMedia.postId,
      url: postMedia.url,
      altText: postMedia.altText,
    })
    .from(postMedia)
    .where(
      and(
        inArray(
          postMedia.postId,
          entries.map((entry) => entry.id)
        ),
        eq(postMedia.type, "image"),
        eq(postMedia.isCover, true)
      )
    )
    .orderBy(asc(postMedia.position));

  const coverByPost = new Map<
    string,
    { url: string; alt: string }
  >();

  for (const cover of covers) {
    if (!coverByPost.has(cover.postId)) {
      coverByPost.set(cover.postId, {
        url: cover.url,
        alt: cover.altText ?? "",
      });
    }
  }

  return entries
    .filter((entry) => entry.date !== null)
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      date: entry.date!,
      excerpt: createExcerpt(entry.content),
      coverImage: coverByPost.get(entry.id) ?? null,
    }));
}

export async function getPublishedJournalArticle(
  category: JournalCategory,
  id: string
) {
  // Reject invalid IDs before passing them to PostgreSQL.
  if (!UUID_PATTERN.test(id)) return null;

  // Read published content only, never pendingRevision.
  const [entry] = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      date: posts.journalDate,
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

  if (!entry || !entry.date) return null;

  // Read published media in its saved order.
  const media = await db
    .select({
      id: postMedia.id,
      type: postMedia.type,
      url: postMedia.url,
      caption: postMedia.caption,
      altText: postMedia.altText,
    })
    .from(postMedia)
    .where(eq(postMedia.postId, entry.id))
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
