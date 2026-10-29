
import { Suspense } from "react";
import JournalArticle from "@/components/journal/JournalArticle";
import type { Metadata } from "next";
import { getPublishedJournalMetadata } from "@/lib/journal/public";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return getPublishedJournalMetadata("bhangra", id);
}

export default function BhangraArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="min-h-screen bg-[#0B0D14]">
      <Suspense
        fallback={
          <p className="p-8 text-gray-400">
            Loading journal entry...
          </p>
        }
      >
        <JournalArticle
          category="bhangra"
          params={params}
        />
      </Suspense>
    </main>
  );
}
