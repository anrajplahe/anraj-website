"use server";

import { randomUUID } from "node:crypto";
import { head } from "@vercel/blob";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { posts, journalImageUploads } from "@/db/schema";
import { requireJournalAdmin } from "@/lib/journal/admin";
import { hasImageSignature, UUID_PATTERN, validateImageFile } from "@/lib/journal/images";

import { reportImageFailure } from "@/lib/journal/image-diagnostics";

type UploadContext = { operation: string };

class ImageUploadError extends Error {}

async function requireEntry(id: string) {
  if (typeof id !== "string" || !UUID_PATTERN.test(id)) throw new ImageUploadError("Invalid entry ID.");
  const [entry] = await db.select({ id: posts.id }).from(posts).where(eq(posts.id, id)).limit(1);
  if (!entry) throw new ImageUploadError("Journal entry no longer exists.");
}

async function prepareImage(postId: string, file: { name: string; type: string; size: number }, context: UploadContext) {
  await requireJournalAdmin();
  context.operation = "prepare.load-entry";
  await requireEntry(postId);
  try { validateImageFile(file); } catch { throw new ImageUploadError("Choose a JPG, PNG or WebP image no larger than 10 MB."); }
  const id = randomUUID();
  const extension = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[file.type];
  const pathname = `journal/${postId}/${id}.${extension}`;
  context.operation = "prepare.insert-upload-record";
  await db.insert(journalImageUploads).values({ id, postId, pathname, contentType: file.type, size: file.size });
  return { id, pathname };
}

async function finaliseImage(postId: string, uploadId: string, context: UploadContext) {
  await requireJournalAdmin();
  context.operation = "finalise.load-entry";
  await requireEntry(postId);
  if (typeof uploadId !== "string" || !UUID_PATTERN.test(uploadId)) throw new ImageUploadError("Invalid upload ID.");
  context.operation = "finalise.load-upload-record";
  const [upload] = await db.select().from(journalImageUploads).where(and(
    eq(journalImageUploads.id, uploadId), eq(journalImageUploads.postId, postId),
  )).limit(1);
  if (!upload) throw new ImageUploadError("Upload not found for this entry.");
  if (upload.verifiedAt && upload.url) return { id: upload.id, url: upload.url, caption: "", altText: "" };

  // Look up a server-issued pathname in our own store, never a browser-supplied URL.
  context.operation = "finalise.blob-head";
  const blob = await head(upload.pathname);
  context.operation = "finalise.validate-metadata";
  if (blob.pathname !== upload.pathname || blob.size !== upload.size || blob.contentType !== upload.contentType) {
    throw new ImageUploadError("The uploaded file does not match the authorised image.");
  }
  // Range-read only the signature; cancel even if the storage server ignores Range.
  context.operation = "finalise.read-signature";
  const response = await fetch(blob.url, {
    headers: { Range: "bytes=0-15" }, cache: "no-store", redirect: "error",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok || !response.body) throw new ImageUploadError("Could not verify image contents. Retry verification.");
  const reader = response.body.getReader();
  const bytes = new Uint8Array(16);
  let length = 0;
  try {
    while (length < bytes.length) {
      const chunk = await reader.read();
      if (chunk.done) break;
      const part = chunk.value.subarray(0, bytes.length - length);
      bytes.set(part, length);
      length += part.length;
    }
  } finally {
    await reader.cancel();
  }
  if (!hasImageSignature(bytes.subarray(0, length), upload.contentType)) {
    throw new ImageUploadError("File contents are not a valid JPG, PNG or WebP signature. Choose another image.");
  }
  context.operation = "finalise.persist-verification";
  const [verified] = await db.update(journalImageUploads).set({ url: blob.url, verifiedAt: new Date() })
    .where(and(eq(journalImageUploads.id, uploadId), eq(journalImageUploads.postId, postId)))
    .returning({ id: journalImageUploads.id });
  if (!verified) throw new ImageUploadError("The entry was removed while this image was being verified.");
  return { id: upload.id, url: blob.url, caption: "", altText: "" };
}

// Return expected failures explicitly: production Server Actions redact thrown errors.
async function uploadResult<T>(name: string, operation: (context: UploadContext) => Promise<T>) {
  const context = { operation: `${name}.authorise` };
  try {
    return { ok: true as const, value: await operation(context) };
  } catch (cause) {
    const diagnostic = reportImageFailure(context.operation, cause);
    return { ok: false as const, error: cause instanceof ImageUploadError
      ? `${cause.message} Reference: ${diagnostic.reference}.` : diagnostic.error };
  }
}

export async function prepareJournalImage(postId: string, file: { name: string; type: string; size: number }) {
  return uploadResult("prepare", (context) => prepareImage(postId, file, context));
}

export async function finaliseJournalImage(postId: string, uploadId: string) {
  return uploadResult("finalise", (context) => finaliseImage(postId, uploadId, context));
}
