
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  MAX_SOCIAL_EMBEDS,
  parseSocialUrl,
  parseTikTokShortUrl,
} from "@/lib/journal/social";

import { resolveTikTokShareUrl } from "@/app/admin/posts/resolve-social";

import SocialEmbed from "@/components/journal/SocialEmbed";

type Props = {
  children?: ReactNode;
  hidePreviews?: boolean;
  videoUrls: string[];
  onChange: (videoUrls: string[]) => void;
};

export default function JournalVideoMedia({
  videoUrls,
  onChange,
  children,
  hidePreviews = false,
}: Props) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const [resolving, setResolving] = useState(false);
  const pending = useRef(false);
  const mounted = useRef(true);
  const latest = useRef({ videoUrls, onChange });

  useEffect(() => {
    latest.current = { videoUrls, onChange };
  }, [videoUrls, onChange]);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  async function addVideo() {
    if (pending.current) return;
    if (latest.current.videoUrls.length >= MAX_SOCIAL_EMBEDS) {
      setError(`Use at most ${MAX_SOCIAL_EMBEDS} social embeds.`);
      return;
    }

    let parsed = parseSocialUrl(url);
    if (!parsed && parseTikTokShortUrl(url)) {
      pending.current = true;
      setResolving(true);
      setError("");
      try {
        const result = await resolveTikTokShareUrl(url);
        if (!mounted.current) return;
        if (result.error) {
          setError(result.error);
          return;
        }
        parsed = parseSocialUrl(result.url ?? "");
        if (parsed?.platform !== "tiktok") {
          setError("Could not resolve this TikTok link. Copy the full video URL from TikTok and try again.");
          return;
        }
      } catch {
        if (mounted.current) {
          setError("Could not resolve this TikTok link. Check your admin session or copy the full video URL from TikTok and try again.");
        }
        return;
      } finally {
        pending.current = false;
        if (mounted.current) setResolving(false);
      }
    }

    if (!parsed) {
      setError("Enter a valid YouTube, Instagram or TikTok URL. For TikTok, use an HTTPS share link or the full video URL.");
      return;
    }

    // Recheck current props after resolution: other media may have changed.
    const current = latest.current;
    if (current.videoUrls.includes(parsed.url)) {
      setError("This post has already been added.");
      return;
    }
    if (current.videoUrls.length >= MAX_SOCIAL_EMBEDS) {
      setError(`Use at most ${MAX_SOCIAL_EMBEDS} social embeds.`);
      return;
    }

    // Keep the existing parent callback responsible for reconciling mediaOrder.
    current.onChange([...current.videoUrls, parsed.url]);
    setUrl("");
    setError("");
  }

  return (
    <section
      aria-labelledby="journal-media-heading"
      className="space-y-4 rounded-xl border border-white/10 bg-[#161A22] p-5"
    >
      <h2
        id="journal-media-heading"
        className="font-semibold text-white"
      >
        Media
      </h2>

      <label
        htmlFor="journal-video-url"
        className="block text-sm text-gray-400"
      >
        Social media URL
      </label>

      <div className="flex flex-wrap gap-3">
        <input
          id="journal-video-url"
          type="url"
          value={url}
          disabled={resolving}
          maxLength={2048}
          onChange={(event) => {
            setUrl(event.target.value);
            setError("");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addVideo();
            }
          }}
          placeholder="Instagram, TikTok or YouTube URL..."
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? "journal-video-error"
              : "journal-video-help"
          }
          className="min-w-0 flex-1 rounded-lg border border-white/15 bg-[#0B0D14] px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
        />

        <button
          type="button"
          onClick={addVideo}
          disabled={resolving}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-[#0B0D14] transition-colors hover:bg-blue-400 disabled:opacity-50"
        >
          Add media
        </button>
      </div>

      {resolving && (
        <p role="status" className="text-sm text-gray-400">
          Resolving TikTok link...
        </p>
      )}

      <p
        id="journal-video-help"
        className="text-xs text-gray-400"
      >
        Supports YouTube videos and Shorts,
        Instagram posts and Reels, and TikTok videos or mobile share links.
      </p>

      {error && (
        <p
          id="journal-video-error"
          role="alert"
          className="text-sm text-red-400"
        >
          {error}
        </p>
      )}

      {!hidePreviews && (
        <div className="grid gap-4 sm:grid-cols-2">
          {videoUrls.map((videoUrl, index) => (
            <JournalVideoPreview
              key={videoUrl}
              videoUrl={videoUrl}
              index={index}
              onRemove={() =>
                onChange(
                  videoUrls.filter((_, i) => i !== index)
                )
              }
            />
          ))}
        </div>
      )}

      {children}
    </section>
  );
}

export function JournalVideoPreview({
  videoUrl,
  index,
  onRemove,
}: {
  videoUrl: string;
  index: number;
  onRemove: () => void;
}) {
  const social = parseSocialUrl(videoUrl);

  return (
    <div className="min-w-0 space-y-3 overflow-hidden rounded-lg border border-white/15 p-3">
      <p className="text-sm font-medium capitalize text-white">
        {social?.platform ?? "Social media"}
      </p>

      <SocialEmbed url={videoUrl} />

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove social media post ${index + 1}`}
        className="text-sm text-red-300 hover:text-red-200"
      >
        Remove media
      </button>
    </div>
  );
}
