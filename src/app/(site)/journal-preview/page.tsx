
import { notFound } from "next/navigation";

import JournalListing, {
  type JournalEntry,
} from "@/components/journal/JournalListing";

const sampleBhangraEntries: JournalEntry[] = [
  {
    id: "1",
    title: "An Unforgettable Competition",
    date: "2026-09-24",
    excerpt:
      "A look back at the preparation, rehearsals and moments that made this competition memorable.",
  },
  {
    id: "2",
    title: "Behind the Rehearsals",
    date: "2026-08-12",
    excerpt:
      "Preparing choreography and refining our performance.",
  },
  {
    id: "3",
    title: "Sharing Bhangra",
    date: "2026-07-19",
    excerpt:
      "My experiences teaching Bhangra and sharing Punjabi culture.",
  },
];

const sampleMusicEntries: JournalEntry[] = [
  {
    id: "4",
    title: "Finding My Guitar Tone",
    date: "2026-10-10",
    excerpt:
      "Experimenting with different sounds and recording setups.",
  },
  {
    id: "5",
    title: "A New Recording",
    date: "2026-09-05",
    excerpt:
      "Working on a new guitar performance.",
  },
];

export default function JournalPreviewPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0B0D14]">
      <p className="mx-auto max-w-6xl px-4 pt-8 text-xs text-blue-400 sm:px-6">
        DEVELOPMENT PREVIEW — SAMPLE CONTENT
      </p>

      <JournalListing
        category="bhangra"
        entries={sampleBhangraEntries}
      />

      <div className="mx-auto max-w-6xl border-t border-white/10" />

      <JournalListing
        category="music"
        entries={sampleMusicEntries}
      />
    </main>
  );
}
