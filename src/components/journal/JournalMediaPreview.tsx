"use client";

import { useState } from "react";
import Image from "next/image";
import type { JournalEntry } from "./JournalListing";
import SocialEmbed from "./SocialEmbed";
import { parseSocialUrl } from "@/lib/journal/social";

type Props = {
  entry: JournalEntry;
  category: "bhangra" | "music";
  label: string;
  featured?: boolean;
};

type MediaTab =
  | { id: string; label: string; kind: "cover" | "pictures" }
  | { id: string; label: string; kind: "social"; url: string };

export default function JournalMediaPreview({
  entry,
  category,
  label,
  featured = false,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const socials = (entry.previewSocialUrls ?? [])
    .map(parseSocialUrl)
    .filter((social): social is NonNullable<typeof social> => social !== null);
  const pictures = entry.previewImages ?? [];
  const tabs: MediaTab[] = [];

  if (entry.coverImage) {
    tabs.push({ id: "cover", label: "Cover", kind: "cover" });
  }

  const counts = new Map<string, number>();
  for (const social of socials) {
    counts.set(social.platform, (counts.get(social.platform) ?? 0) + 1);
  }
  const seen = new Map<string, number>();
  for (const social of socials) {
    const number = (seen.get(social.platform) ?? 0) + 1;
    seen.set(social.platform, number);
    const name = social.platform === "youtube"
      ? "YouTube"
      : social.platform === "instagram" ? "Instagram" : "TikTok";
    tabs.push({
      id: `social:${social.url}:${number}`,
      label: (counts.get(social.platform) ?? 0) > 1 ? `${name} ${number}` : name,
      kind: "social",
      url: social.url,
    });
  }

  if (pictures.length) {
    tabs.push({ id: "pictures", label: "Pictures", kind: "pictures" });
  }

  // Default to Cover, then the first saved embed, then Pictures.
  // Fall back safely if the selected media is removed from the entry.
  const selected = tabs.find((tab) => tab.id === selectedId) ?? tabs[0];
  const activeColour = category === "bhangra"
    ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
    : "border-pink-400 bg-pink-400/10 text-pink-400";
  const focusColour = category === "bhangra"
    ? "focus-visible:outline-yellow-400"
    : "focus-visible:outline-pink-400";

  const coverOrPlaceholder = (
    <div className={`relative overflow-hidden rounded-xl bg-[#161A22] ${featured ? "aspect-video" : "aspect-[4/3]"}`}>
      {entry.coverImage ? (
        <Image
          src={entry.coverImage.url}
          alt={entry.coverImage.alt}
          fill
          unoptimized
          sizes={featured ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 640px) 100vw, 50vw"}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="text-sm font-medium tracking-widest text-gray-500">{label}</span>
        </div>
      )}
    </div>
  );

  if (!selected) return coverOrPlaceholder;

  return (
    <div className="min-w-0 max-w-full space-y-3">
      <div role="group" aria-label={`${label} entry media`} className="flex max-w-full gap-2 overflow-x-auto p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={selected.id === tab.id}
            onClick={() => setSelectedId(tab.id)}
            className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${focusColour} ${selected.id === tab.id ? activeColour : "border-white/15 text-gray-300 hover:border-white/40"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {selected.kind === "cover" ? coverOrPlaceholder : selected.kind === "social" ? (
        <div className="min-w-0 rounded-xl bg-[#161A22] p-3">
          <SocialEmbed key={selected.id} url={selected.url} category={category} compact />
        </div>
      ) : (
        <div className={`grid min-w-0 grid-cols-2 items-start gap-3 ${featured ? "lg:grid-cols-3" : ""}`}>
          {pictures.map((image) => (
            <a
              key={image.id}
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={image.alt ? `Open full-size image: ${image.alt}` : "Open full-size image"}
              className={`min-w-0 overflow-hidden rounded-xl bg-[#161A22] focus-visible:outline-2 focus-visible:outline-offset-2 ${focusColour}`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                width={640}
                height={480}
                unoptimized
                className="h-auto w-full"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
