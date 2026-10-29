
import { parseYouTubeUrl } from "./youtube";

export const MAX_SOCIAL_EMBEDS = 20;

// Recognise share links without treating unresolved codes as saved video URLs.
export function parseTikTokShortUrl(input: unknown): string | null {
  if (typeof input !== "string" || input.length > 2048) return null;
  const value = input.trim();
  // Check the raw authority too: URL normalisation can hide an explicit :443.
  if (!/^https:\/\/(?:vm\.tiktok\.com|vt\.tiktok\.com|www\.tiktok\.com)\//i.test(value)) {
    return null;
  }
  try {
    const url = new URL(value);
    const shortHost = url.hostname === "vm.tiktok.com" || url.hostname === "vt.tiktok.com";
    const validPath = shortHost
      ? /^\/[A-Za-z0-9_-]{1,128}\/?$/.test(url.pathname)
      : /^\/t\/[A-Za-z0-9_-]{1,128}\/?$/.test(url.pathname);
    if (!validPath || url.username || url.password || url.port) return null;
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

export type SocialEmbed = {
  platform: "youtube" | "instagram" | "tiktok";
  id: string;
  url: string;
  embedUrl: string | null;
};

export function parseSocialUrl(
  input: string
): SocialEmbed | null {
  if (typeof input !== "string" || input.length > 2048) {
    return null;
  }

  // Keep the existing YouTube parser and URL formats.
  const youtube = parseYouTubeUrl(input);

  if (youtube) {
    return {
      platform: "youtube",
      id: youtube.id,
      url: youtube.url,
      embedUrl:
        `https://www.youtube-nocookie.com/embed/${youtube.id}`,
    };
  }

  try {
    const parsed = new URL(input.trim());

    if (
      !["http:", "https:"].includes(parsed.protocol) ||
      parsed.username ||
      parsed.password ||
      parsed.port
    ) {
      return null;
    }

    if (
      ["instagram.com", "www.instagram.com"].includes(
        parsed.hostname
      )
    ) {
      const match =
        /^\/(p|reel)\/([A-Za-z0-9_-]{5,32})\/?$/.exec(
          parsed.pathname
        );

      if (!match) return null;

      const [, type, id] = match;

      return {
        platform: "instagram",
        id,
        url: `https://www.instagram.com/${type}/${id}/`,
        // Instagram uses its own embedding script.
        embedUrl: null,
      };
    }

    if (
      ["tiktok.com", "www.tiktok.com", "m.tiktok.com"]
        .includes(parsed.hostname)
    ) {
      const match =
        /^\/@([A-Za-z0-9._]{2,24})\/video\/([0-9]{10,24})\/?$/.exec(
          parsed.pathname
        );

      if (!match) return null;

      const [, username, id] = match;

      return {
        platform: "tiktok",
        id,
        url: `https://www.tiktok.com/@${username}/video/${id}`,
        embedUrl:
          `https://www.tiktok.com/player/v1/${id}`,
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function validateSocialUrls(
  value: unknown
): string[] {
  if (
    !Array.isArray(value) ||
    value.length > MAX_SOCIAL_EMBEDS
  ) {
    throw new Error(
      `Use at most ${MAX_SOCIAL_EMBEDS} social embeds.`
    );
  }

  const urls = value.map((item: unknown) => {
    const parsed =
      typeof item === "string"
        ? parseSocialUrl(item)
        : null;

    if (!parsed) {
      throw new Error(
        "Enter a valid YouTube, Instagram or TikTok URL."
      );
    }

    return parsed.url;
  });

  if (new Set(urls).size !== urls.length) {
    throw new Error(
      "This social media post has already been added."
    );
  }

  return urls;
}
