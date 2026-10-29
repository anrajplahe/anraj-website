
"use client";

import { useEffect } from "react";
import { parseSocialUrl } from "@/lib/journal/social";

type Props = {
  url: string;
  category?: "bhangra" | "music";
  compact?: boolean;
};

type InstagramWindow = Window & {
  instgrm?: {
    Embeds?: {
      process: () => void;
    };
  };
};

export default function SocialEmbed({
  url,
  category,
  compact = false,
}: Props) {
  const social = parseSocialUrl(url);

  const accentText =
    category === "bhangra"
      ? "text-yellow-400"
      : category === "music"
        ? "text-pink-400"
        : "text-blue-400";

  const accentButton =
    category === "bhangra"
      ? "hover:border-yellow-400 focus-visible:outline-yellow-400"
      : category === "music"
        ? "hover:border-pink-400 focus-visible:outline-pink-400"
        : "hover:border-blue-400 focus-visible:outline-blue-400";

  useEffect(() => {
    if (social?.platform !== "instagram") {
      return;
    }

    const processEmbeds = () => {
      (window as InstagramWindow).instgrm
        ?.Embeds?.process();
    };

    // Reuse the Instagram script if it has already loaded.
    if (
      (window as InstagramWindow).instgrm
        ?.Embeds?.process
    ) {
      processEmbeds();
      return;
    }

    const existing =
      document.querySelector<HTMLScriptElement>(
        "script[data-journal-instagram]"
      );

    if (existing) {
      existing.addEventListener("load", processEmbeds);

      return () => {
        existing.removeEventListener(
          "load",
          processEmbeds
        );
      };
    }

    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.dataset.journalInstagram = "true";
    script.addEventListener("load", processEmbeds);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener(
        "load",
        processEmbeds
      );
    };
  }, [social?.platform, social?.url]);

  if (!social) {
    return (
      <p className="text-sm text-red-400">
        Invalid social media URL.
      </p>
    );
  }

  const name =
    social.platform === "youtube"
      ? "YouTube"
      : social.platform === "tiktok"
        ? "TikTok"
        : "Instagram";

  return (
    <div className="min-w-0 space-y-3">
      {social.platform === "instagram" ? (
        <div
          className={`mx-auto w-full min-w-0 overflow-x-auto rounded-xl bg-[#161A22] p-2 ${
            compact ? "max-w-[360px]" : "max-w-[540px]"
          }`}
        >
          <blockquote
            key={social.url}
            className="instagram-media"
            style={{ margin: 0, width: "100%", minWidth: 0 }}
            data-instgrm-permalink={social.url}
            data-instgrm-version="14"
          >
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm ${accentText}`}
            >
              View this post on Instagram
            </a>
          </blockquote>
        </div>
      ) : (
        <div
          className={
            social.platform === "youtube"
              ? "aspect-video w-full overflow-hidden rounded-xl bg-black"
              : `mx-auto aspect-[9/16] w-full overflow-hidden rounded-xl bg-black ${compact ? "max-w-[280px]" : "max-w-[360px]"}`
          }
        >
          <iframe
            key={social.url}
            src={social.embedUrl ? `${social.embedUrl}?autoplay=0` : undefined}
            title={`${name} embedded post`}
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      )}

      <a
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block break-all text-xs hover:underline focus-visible:outline-2 ${accentText} ${accentButton}`}
      >
        Open on {name}
      </a>
    </div>
  );
}
