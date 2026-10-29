
"use client";

import { useState, type ReactNode } from "react";

import {
  MAX_SOCIAL_EMBEDS,
  parseSocialUrl,
} from "@/lib/journal/social";

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

  function addVideo() {
    const parsed = parseSocialUrl(url);

    if (!parsed) {
      setError(
        "Enter a valid YouTube, Instagram or TikTok post URL."
      );
      return;
    }

    if (videoUrls.includes(parsed.url)) {
      setError("This post has already been added.");
      return;
    }

    if (videoUrls.length >= MAX_SOCIAL_EMBEDS) {
      setError(
        `Use at most ${MAX_SOCIAL_EMBEDS} social embeds.`
      );
      return;
    }

    onChange([...videoUrls, parsed.url]);
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
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-[#0B0D14] transition-colors hover:bg-blue-400"
        >
          Add media
        </button>
      </div>

      <p
        id="journal-video-help"
        className="text-xs text-gray-400"
      >
        Supports YouTube videos and Shorts,
        Instagram posts and Reels, and TikTok videos.
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
