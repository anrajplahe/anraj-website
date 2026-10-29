
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import PublishedJournal from "@/components/journal/PublishedJournal";

export const metadata: Metadata = {
  title: "Guitar & Music Journal",
  description:
    "My guitar recordings, musical projects and experiences.",
  alternates: {
    canonical: "/music/journal",
  },
};

export default function MusicJournalPage() {
  return (
    <main className="min-h-screen flex-1 bg-[#0B0D14] text-white">
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
        <Link
          href="/music"
          className="text-sm text-pink-400 transition-colors hover:text-pink-300"
        >
          ← Back to Guitar & Music
        </Link>
      </div>

      <Suspense
        fallback={
          <p className="mx-auto max-w-6xl px-4 py-10 text-gray-400 sm:px-6">
            Loading journal...
          </p>
        }
      >
        <PublishedJournal
          category="music"
          variant="full"
        />
      </Suspense>
    </main>
  );
}
