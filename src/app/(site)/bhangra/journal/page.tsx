
import type { Metadata } from "next";
import ActionLink from "@/components/ActionLink";
import { Suspense } from "react";

import PublishedJournal from "@/components/journal/PublishedJournal";

export const metadata: Metadata = {
  title: "Bhangra Journal",
  description:
    "My Bhangra performances, competitions, teaching and experiences.",
  alternates: {
    canonical: "/bhangra/journal",
  },
};

export default function BhangraJournalPage() {
  return (
    <main className="min-h-screen flex-1 bg-[#0B0D14] text-white">
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
        <ActionLink href="/bhangra" accent="yellow" arrow="back">
          Back to Bhangra
        </ActionLink>
      </div>

      <Suspense
        fallback={
          <p className="mx-auto max-w-6xl px-4 py-10 text-gray-400 sm:px-6">
            Loading journal...
          </p>
        }
      >
        <PublishedJournal
          category="bhangra"
          variant="full"
        />
      </Suspense>
    </main>
  );
}
