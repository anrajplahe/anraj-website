import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { journalImageUploads, postMedia } from "@/db/schema";
import { validateImageInput, type JournalImage } from "./images";

export async function resolveJournalImages(postId: string, value: unknown): Promise<JournalImage[]> {
  const images = validateImageInput(value);
  if (!images.length) return [];
  const ids = images.map((image) => image.id);
  const uploads = await db.select().from(journalImageUploads).where(and(
    eq(journalImageUploads.postId, postId), inArray(journalImageUploads.id, ids),
  ));
  // Existing image rows remain valid, including attachments predating this stage.
  const existing = await db.select().from(postMedia).where(and(
    eq(postMedia.postId, postId), eq(postMedia.type, "image"), inArray(postMedia.id, ids),
  ));
  return images.map((image) => {
    const upload = uploads.find((row) => row.id === image.id && row.verifiedAt && row.url);
    const attached = existing.find((row) => row.id === image.id);
    const url = upload?.url ?? attached?.url;
    if (!url) throw new Error("An image has not been verified for this entry. Retry the upload before saving.");
    return { ...image, url };
  });
}
