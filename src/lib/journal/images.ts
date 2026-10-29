export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_JOURNAL_IMAGES = 50;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type JournalImage = {
  id: string;
  url: string;
  caption: string;
  altText: string;
};

export function validateImageFile(file: { name: string; type: string; size: number }) {
  const extensions: Record<string, RegExp> = {
    "image/jpeg": /\.jpe?g$/i,
    "image/png": /\.png$/i,
    "image/webp": /\.webp$/i,
  };
  if (!extensions[file.type]?.test(file.name)) {
    throw new Error("Choose a JPG, PNG or WebP image with a matching file extension.");
  }
  if (!Number.isInteger(file.size) || file.size <= 0 || file.size > MAX_IMAGE_BYTES) {
    throw new Error("Each image must be non-empty and no larger than 10 MB.");
  }
}

export function hasImageSignature(bytes: Uint8Array, type: string) {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return [137, 80, 78, 71, 13, 10, 26, 10].every((b, i) => bytes[i] === b);
  if (type === "image/webp") return [82, 73, 70, 70].every((b, i) => bytes[i] === b) &&
    [87, 69, 66, 80].every((b, i) => bytes[i + 8] === b);
  return false;
}

// URLs are deliberately excluded: the server resolves IDs against trusted records.
export function validateImageInput(value: unknown): Omit<JournalImage, "url">[] {
  if (!Array.isArray(value) || value.length > MAX_JOURNAL_IMAGES) {
    throw new Error(`Use at most ${MAX_JOURNAL_IMAGES} images per entry.`);
  }
  const result = value.map((item: unknown) => {
    if (!item || typeof item !== "object") throw new Error("Invalid image reference.");
    const image = item as Record<string, unknown>;
    if (typeof image.id !== "string" || !UUID_PATTERN.test(image.id)) throw new Error("Invalid image reference.");
    if (typeof image.caption !== "string" || image.caption.length > 2000 ||
      typeof image.altText !== "string" || image.altText.length > 1000) {
      throw new Error("Image captions must be at most 2,000 characters and alternative text at most 1,000 characters.");
    }
    return { id: image.id, caption: image.caption, altText: image.altText };
  });
  if (new Set(result.map((item) => item.id)).size !== result.length) throw new Error("Duplicate image reference.");
  return result;
}
