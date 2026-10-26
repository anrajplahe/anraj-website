
"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { posts, postMedia } from "@/db/schema";
import type { JournalDraftInput } from "@/types/journal";
import type { JSONContent } from "@tiptap/core";
import { and, asc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { JournalDraftFields } from "@/types/journal";

import { validateVideoUrls } from "@/lib/journal/youtube";

const EMPTY_CONTENT = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

async function requireAdmin() {
  const session = await auth();
  const adminId = process.env.ADMIN_GITHUB_ID;

  if (!adminId || session?.githubId !== adminId) {
    throw new Error("Unauthorised.");
  }
}

// Read afresh when an Activity-preserved editor becomes visible again.
// Do not cache this: its revision may have changed since the route was visited.
export async function loadJournalEditor(id: string) {
  await requireAdmin();

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error("Invalid entry ID.");
  }

  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!post) throw new Error("Journal entry no longer exists.");

  const media = await db.select({ url: postMedia.url }).from(postMedia)
    .where(and(eq(postMedia.postId, id), eq(postMedia.type, "video_embed")))
    .orderBy(asc(postMedia.position), asc(postMedia.id));
  const videoUrls = media.map((item) => item.url);

  return {
    mode: post.status,
    initial: post.pendingRevision ? {
      ...post.pendingRevision,
      // Revisions created before media support inherit the published videos.
      videoUrls: post.pendingRevision.videoUrls ?? videoUrls,
    } : {
      videoUrls,
      category: post.category,
      title: post.title ?? "",
      content: post.content as JSONContent,
      journalDate: post.journalDate ?? "",
      journalTime: post.journalTime?.slice(0, 5) ?? "",
    },
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

// Keep only document nodes and formatting supported by our editor.
function validateContent(value: unknown): JSONContent {
  const serialized = JSON.stringify(value);

  if (!serialized || serialized.length > 100000) {
    throw new Error("Invalid or oversized journal content.");
  }

  let nodeCount = 0;

  function clean(node: unknown, depth: number): JSONContent {
    nodeCount++;

    if (
      !isObject(node) ||
      depth > 20 ||
      nodeCount > 2000
    ) {
      throw new Error("Invalid journal document.");
    }

    const type = node.type;

    if (type === "text") {
      if (
        typeof node.text !== "string" ||
        node.text.length > 20000
      ) {
        throw new Error("Invalid journal text.");
      }

      const marks = node.marks === undefined
        ? []
        : node.marks;

      if (!Array.isArray(marks) || marks.length > 10) {
        throw new Error("Invalid formatting.");
      }

      const safeMarks = marks.map((mark: unknown) => {
        if (!isObject(mark)) {
          throw new Error("Invalid formatting.");
        }

        if (
          mark.type === "bold" ||
          mark.type === "italic" ||
          mark.type === "underline" ||
          mark.type === "strike"
        ) {
          return { type: mark.type };
        }

        if (
          mark.type === "link" &&
          isObject(mark.attrs) &&
          typeof mark.attrs.href === "string"
        ) {
          try {
            const url = new URL(mark.attrs.href);

            if (
              !["http:", "https:"].includes(url.protocol) ||
              !url.hostname ||
              url.toString().length > 2048
            ) {
              throw new Error("Invalid link.");
            }

            return {
              type: "link",
              attrs: { href: url.toString() },
            };
          } catch {
            throw new Error("Invalid link URL.");
          }
        }

        throw new Error("Unsupported formatting.");
      });

      return {
        type: "text",
        text: node.text,
        ...(safeMarks.length ? { marks: safeMarks } : {}),
      };
    }

    if (type === "hardBreak") {
      return { type: "hardBreak" };
    }

    const allowedNodes = [
      "doc",
      "paragraph",
      "bulletList",
      "orderedList",
      "listItem",
    ];

    if (
      typeof type !== "string" ||
      !allowedNodes.includes(type)
    ) {
      throw new Error("Unsupported document element.");
    }

    if (
      node.content !== undefined &&
      !Array.isArray(node.content)
    ) {
      throw new Error("Invalid document content.");
    }

    return {
      type,
      content: (node.content ?? []).map(
        (child: unknown) => clean(child, depth + 1)
      ),
    };
  }

  const content = clean(value, 0);

  if (content.type !== "doc") {
    throw new Error("Invalid document root.");
  }

  return content;
}

function hasText(content: JSONContent): boolean {
  return (
    Boolean(content.text?.trim()) ||
    Boolean(content.content?.some(hasText))
  );
}

function validateInput(input: JournalDraftInput) {
  if (
    typeof input.id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      input.id
    )
  ) {
    throw new Error("Invalid entry ID.");
  }

  if (
    input.category !== "bhangra" &&
    input.category !== "music"
  ) {
    throw new Error("Invalid journal.");
  }

  if (
    typeof input.title !== "string" ||
    input.title.length > 150
  ) {
    throw new Error("Invalid title.");
  }

  if (
    typeof input.journalDate !== "string" ||
    typeof input.journalTime !== "string"
  ) {
    throw new Error("Invalid date or time.");
  }

  const date = input.journalDate;

  if (date) {
    const parsed = new Date(`${date}T00:00:00Z`);

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== date
    ) {
      throw new Error("Invalid journal date.");
    }
  }

  if (
    input.journalTime &&
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.journalTime)
  ) {
    throw new Error("Invalid journal time.");
  }

  const content = validateContent(input.content);

  return {
    id: input.id,
    category: input.category,
    title: input.title.trim() || null,
    journalDate: date || null,
    journalTime: input.journalTime || null,
    content: content as Record<string, unknown>,
    hasContent: hasText(content),
    videoUrls: validateVideoUrls(input.videoUrls),
  };
}

// One PostgreSQL statement keeps fields and videos atomic with Neon HTTP.
// Only video rows are replaced; future image attachments are left intact.
async function writePostAndVideos(
  data: ReturnType<typeof validateInput>,
  expectedStatus: "draft" | "published",
  publish: boolean,
) {
  const result = await db.execute(sql`
    WITH updated AS (
      UPDATE ${posts} SET
        category = ${data.category}::journal_category,
        title = ${data.title}, content = ${JSON.stringify(data.content)}::jsonb,
        journal_date = ${data.journalDate}::date,
        journal_time = ${data.journalTime}::time,
        status = ${publish ? "published" : "draft"}::publication_status,
        published_at = CASE WHEN ${publish && expectedStatus === "draft"}
          THEN now() ELSE published_at END,
        pending_revision = NULL, updated_at = now()
      WHERE id = ${data.id}::uuid AND status = ${expectedStatus}::publication_status
      RETURNING id
    ), removed AS (
      DELETE FROM ${postMedia} WHERE post_id IN (SELECT id FROM updated)
        AND type = 'video_embed' RETURNING id
    ), inserted AS (
      INSERT INTO ${postMedia} (post_id, type, url, position)
      SELECT updated.id, 'video_embed'::media_type, video.url, (video.position - 1)::integer
      FROM updated CROSS JOIN jsonb_array_elements_text(${JSON.stringify(data.videoUrls)}::jsonb)
        WITH ORDINALITY AS video(url, position)
      CROSS JOIN (SELECT count(*) FROM removed) AS deletion_done
      RETURNING id
    )
    SELECT id FROM updated
  `);
  return result.rows[0];
}

// Create a permanent draft as soon as New entry is clicked.
export async function createJournalDraft() {
  await requireAdmin();

  const [created] = await db
    .insert(posts)
    .values({
      category: "bhangra",
      content: EMPTY_CONTENT,
      journalDate: null,
      status: "draft",
    })
    .returning({ id: posts.id });

  if (!created) {
    throw new Error("Could not create draft.");
  }

  revalidatePath("/admin");
  redirect(`/admin/posts/${created.id}/edit`);
}

// Autosave or manually save changes to an existing draft.
export async function saveJournalDraft(
  input: JournalDraftInput
) {
  await requireAdmin();

  const data = validateInput(input);

  const updated = await writePostAndVideos(data, "draft", false);

  if (!updated) {
    throw new Error("Draft not found or no longer editable.");
  }

  return { saved: true };
}

// Publication is always a separate, explicit action.
export async function publishJournalDraft(
  input: JournalDraftInput
) {
  await requireAdmin();

  const data = validateInput(input);

  if (!data.journalDate) {
    throw new Error("Choose a journal date before publishing.");
  }

  if (!data.hasContent) {
    throw new Error("Write some content before publishing.");
  }

  const updated = await writePostAndVideos(data, "draft", true);

  if (!updated) {
    throw new Error("Draft not found or already published.");
  }

  revalidatePath("/admin");
  return { published: true };
}

// Delete a draft only after the administrator confirms.
export async function discardJournalDraft(id: string) {
  await requireAdmin();

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  ) {
    throw new Error("Invalid entry ID.");
  }

  const [deleted] = await db
    .delete(posts)
    .where(
      and(
        eq(posts.id, id),
        eq(posts.status, "draft")
      )
    )
    .returning({ id: posts.id });

  if (!deleted) {
    throw new Error("Draft not found or cannot be discarded.");
  }

  revalidatePath("/admin");
  return { discarded: true };
}


/**
 * Autosave changes to a published entry without
 * modifying the published content.
 */
export async function savePublishedRevision(
  input: JournalDraftInput
) {
  await requireAdmin();

  const data = validateInput(input);

  const revision: JournalDraftFields = {
    videoUrls: data.videoUrls,
    category: data.category,
    title: data.title ?? "",
    content: data.content as JSONContent,
    journalDate: data.journalDate ?? "",
    journalTime: data.journalTime ?? "",
  };

  const [updated] = await db
    .update(posts)
    .set({
      pendingRevision: revision,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(posts.id, data.id),
        eq(posts.status, "published")
      )
    )
    .returning({ id: posts.id });

  if (!updated) {
    throw new Error("Published entry not found.");
  }

  return { saved: true };
}

/**
 * Explicitly apply changes to the published entry.
 * The original publication timestamp is preserved.
 */
export async function publishPublishedRevision(
  input: JournalDraftInput
) {
  await requireAdmin();

  const data = validateInput(input);

  if (!data.journalDate) {
    throw new Error(
      "Choose a journal date before publishing changes."
    );
  }

  if (!data.hasContent) {
    throw new Error(
      "Journal content cannot be empty."
    );
  }

  const updated = await writePostAndVideos(data, "published", true);

  if (!updated) {
    throw new Error("Published entry not found.");
  }

  revalidatePath("/admin");
  revalidatePath("/bhangra");
  revalidatePath("/music");

  return { published: true };
}

/**
 * Discard only the unpublished changes.
 * Never delete the published entry itself.
 */
export async function discardPublishedRevision(
  id: string
) {
  await requireAdmin();

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      id
    )
  ) {
    throw new Error("Invalid entry ID.");
  }

  const [updated] = await db
    .update(posts)
    .set({
      pendingRevision: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(posts.id, id),
        eq(posts.status, "published")
      )
    )
    .returning({ id: posts.id });

  if (!updated) {
    throw new Error("Published entry not found.");
  }

  revalidatePath("/admin");

  return { discarded: true };
}
