"use client";

import { useState, type ReactNode } from "react";
import { MAX_JOURNAL_VIDEOS, parseYouTubeUrl } from "@/lib/journal/youtube";

type Props = {
  children?: ReactNode;
  hidePreviews?: boolean;
  videoUrls: string[];
  onChange: (videoUrls: string[]) => void;
};

export default function JournalVideoMedia({ videoUrls, onChange, children, hidePreviews = false }: Props) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  function addVideo() {
    const video = parseYouTubeUrl(url);
    if (!video) {
      setError("Enter a valid YouTube watch, youtu.be or Shorts URL beginning with https:// or http://.");
      return;
    }
    if (videoUrls.includes(video.url)) {
      setError("This video has already been added.");
      return;
    }
    if (videoUrls.length >= MAX_JOURNAL_VIDEOS) {
      setError(`Use at most ${MAX_JOURNAL_VIDEOS} videos per entry.`);
      return;
    }
    onChange([...videoUrls, video.url]);
    setUrl("");
    setError("");
  }

  return (
    <section aria-labelledby="journal-media-heading" className="space-y-4 rounded-xl border border-white/10 bg-[#161A22] p-5">
      <h2 id="journal-media-heading" className="font-semibold text-white">Media</h2>
      <label htmlFor="journal-video-url" className="block text-sm text-gray-400">YouTube video URL</label>
      <div className="flex flex-wrap gap-3">
        <input
          id="journal-video-url"
          type="url"
          value={url}
          maxLength={2048}
          onChange={(event) => { setUrl(event.target.value); setError(""); }}
          onKeyDown={(event) => {
            if (event.key === "Enter") { event.preventDefault(); addVideo(); }
          }}
          placeholder="https://www.youtube.com/watch?v=..."
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "journal-video-error" : "journal-video-help"}
          className="min-w-0 flex-1 rounded-lg border border-white/15 bg-[#0B0D14] px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
        />
        <button type="button" onClick={addVideo} className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-[#0B0D14] hover:bg-blue-400">Add video</button>
      </div>
      <p id="journal-video-help" className="text-xs text-gray-400">YouTube links, short links and Shorts are supported. Added and removed videos save automatically.</p>
      {error && <p id="journal-video-error" role="alert" className="text-sm text-red-400">{error}</p>}
      {!hidePreviews && <div className="grid gap-4 sm:grid-cols-2">
        {videoUrls.map((videoUrl, index) => <JournalVideoPreview key={videoUrl} videoUrl={videoUrl} index={index}
          onRemove={() => onChange(videoUrls.filter((_, i) => i !== index))} />)}
      </div>}
      {children}
    </section>
  );
}

export function JournalVideoPreview({ videoUrl, index, onRemove }: { videoUrl: string; index: number; onRemove: () => void }) {
  const video = parseYouTubeUrl(videoUrl);
  return (
    <div className="space-y-3 overflow-hidden rounded-lg border border-white/15 p-3">
      {video && <iframe
        src={`https://www.youtube-nocookie.com/embed/${video.id}`}
        title={`YouTube video ${index + 1}`}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="aspect-video w-full rounded border-0"
      />}
      <p className="break-all text-xs text-gray-400">{videoUrl}</p>
      <button type="button" onClick={onRemove} aria-label={`Remove video ${index + 1}`} className="text-sm text-red-300 hover:text-red-200">Remove video</button>
    </div>
  );
}
