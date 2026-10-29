
"use client";

import { useState } from "react";

import SocialEmbed from "./SocialEmbed";
import { parseSocialUrl } from "@/lib/journal/social";

type Props = {
  urls: string[];
  category: "bhangra" | "music";
};

export default function JournalSocialPreview({
  urls,
  category,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const videos = urls
    .map((url) => parseSocialUrl(url))
    .filter(
      (video): video is NonNullable<typeof video> =>
        video !== null
    );

  if (videos.length === 0) return null;

  const selected = videos[selectedIndex] ?? videos[0];

  const activeColour =
    category === "bhangra"
      ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
      : "border-pink-400 bg-pink-400/10 text-pink-400";

  return (
    <div className="min-w-0 space-y-4">
      {videos.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {videos.map((video, index) => {
            const name =
              video.platform === "youtube"
                ? "YouTube"
                : video.platform === "instagram"
                  ? "Instagram"
                  : "TikTok";

            return (
              <button
                key={video.url}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-pressed={selectedIndex === index}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  selectedIndex === index
                    ? activeColour
                    : "border-white/15 text-gray-300 hover:border-white/40"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}

      <SocialEmbed
        compact
        key={selected.url}
        url={selected.url}
        category={category}
      />
    </div>
  );
}
