import { UUID_PATTERN, type JournalImage } from "./images";
import { validateSocialUrls } from "./social";

export type MediaReference = { id: string; type: "image" } | { id: string; type: "video_embed"; url: string };
export type MediaFields = {
  images: JournalImage[];
  videoUrls: string[];
  mediaOrder: MediaReference[];
  coverImageId: string | null;
};

// Preserve existing references, prune removed items, append newly added media.
// Used for legacy snapshots as well as image upload completions during editing.
export function reconcileMedia<T extends MediaFields>(fields: T, makeId: () => string): T {
  const imageIds = new Set(fields.images.map((image) => image.id));
  const videoUrls = new Set(fields.videoUrls);
  const seenImages = new Set<string>();
  const seenVideos = new Set<string>();
  const mediaOrder = fields.mediaOrder.filter((item) => {
    if (item.type === "image") {
      if (!imageIds.has(item.id) || seenImages.has(item.id)) return false;
      seenImages.add(item.id);
    } else {
      if (!videoUrls.has(item.url) || seenVideos.has(item.url)) return false;
      seenVideos.add(item.url);
    }
    return true;
  });
  for (const image of fields.images) {
    if (!seenImages.has(image.id)) mediaOrder.push({ type: "image", id: image.id });
  }
  for (const url of fields.videoUrls) {
    if (!seenVideos.has(url)) mediaOrder.push({ type: "video_embed", id: makeId(), url });
  }
  return { ...fields, mediaOrder, coverImageId: fields.coverImageId && imageIds.has(fields.coverImageId) ? fields.coverImageId : null };
}

export function validateMediaArrangement(value: unknown, cover: unknown, images: { id: string }[], videoUrls: string[]) {
  if (!Array.isArray(value) || value.length !== images.length + videoUrls.length) throw new Error("Invalid media order.");
  const imageIds = new Set(images.map((image) => image.id));
  const videos = new Set(videoUrls);
  const ids = new Set<string>();
  const order: MediaReference[] = value.map((item: unknown) => {
    if (!item || typeof item !== "object") throw new Error("Invalid media reference.");
    const ref = item as Record<string, unknown>;
    if (typeof ref.id !== "string" || !UUID_PATTERN.test(ref.id) || ids.has(ref.id)) throw new Error("Invalid or duplicate media ID.");
    ids.add(ref.id);
    if (ref.type === "image" && imageIds.delete(ref.id)) return { id: ref.id, type: "image" };
    if (ref.type === "video_embed" && typeof ref.url === "string") {
      const [url] = validateSocialUrls([ref.url]);
      if (videos.delete(url)) return { id: ref.id, type: "video_embed", url };
    }
    throw new Error("Media order must reference each attached image and video exactly once.");
  });
  if (imageIds.size || videos.size) throw new Error("Incomplete media order.");
  if (cover !== null && (typeof cover !== "string" || !images.some((image) => image.id === cover))) {
    throw new Error("The cover must be an attached image.");
  }
  return { mediaOrder: order, coverImageId: cover as string | null };
}

export function moveMedia(order: MediaReference[], id: string, targetIndex: number) {
  const index = order.findIndex((item) => item.id === id);
  if (index < 0 || targetIndex < 0 || targetIndex >= order.length || index === targetIndex) return order;
  const next = [...order];
  const [item] = next.splice(index, 1);
  next.splice(targetIndex, 0, item);
  return next;
}
