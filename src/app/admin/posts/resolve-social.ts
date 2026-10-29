"use server";

import { requireJournalAdmin } from "@/lib/journal/admin";
import { parseSocialUrl, parseTikTokShortUrl } from "@/lib/journal/social";

const FAILURE = "Could not resolve this TikTok link. Copy the full video URL from TikTok and try again.";
const MAX_REDIRECTS = 4;

// This resolver accepts only TikTok share/video paths on these exact hosts.
function approvedDestination(value: string): URL | null {
  if (value.length > 2048 || !/^https:\/\/(?:vm\.tiktok\.com|vt\.tiktok\.com|www\.tiktok\.com|m\.tiktok\.com|tiktok\.com)\//i.test(value)) {
    return null;
  }
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
    const social = parseSocialUrl(url.toString());
    if (!parseTikTokShortUrl(value) && social?.platform !== "tiktok") return null;
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

export async function resolveTikTokShareUrl(
  input: unknown
): Promise<{ url: string; error?: never } | { error: string; url?: never }> {
  await requireJournalAdmin();

  const shortUrl = parseTikTokShortUrl(input);
  let destination = shortUrl ? approvedDestination(shortUrl) : null;
  if (!destination) return { error: FAILURE };

  const controller = new AbortController();
  // One deadline covers the whole redirect chain, not each hop separately.
  const timeout = setTimeout(() => controller.abort(), 5000);
  const visited = new Set<string>();
  try {
    for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
      if (visited.has(destination.href)) return { error: FAILURE };
      visited.add(destination.href);

      const social = parseSocialUrl(destination.href);
      if (social?.platform === "tiktok") return { url: social.url };

      const response = await fetch(destination, {
        method: "HEAD",
        redirect: "manual",
        credentials: "omit",
        referrerPolicy: "no-referrer",
        cache: "no-store",
        signal: controller.signal,
      });
      // Never read or parse a response body, including error responses.
      await response.body?.cancel();
      if (![301, 302, 303, 307, 308].includes(response.status) || redirects === MAX_REDIRECTS) {
        return { error: FAILURE };
      }
      const location = response.headers.get("location");
      if (!location || location.length > 2048 || /[\\\u0000-\u0020\u007f]/.test(location)) return { error: FAILURE };
      // Reject explicit ports/credentials before resolving relative redirects.
      const absolute = /^[a-z][a-z0-9+.-]*:/i.test(location) || location.startsWith("//");
      const candidate = absolute
        ? (location.startsWith("//") ? `https:${location}` : location)
        : new URL(location, destination).href;
      const next = approvedDestination(candidate);
      if (!next) return { error: FAILURE };
      destination = next;
    }
  } catch {
    // Do not expose remote responses, redirect destinations or internal errors.
    return { error: FAILURE };
  } finally {
    clearTimeout(timeout);
  }
  return { error: FAILURE };
}
