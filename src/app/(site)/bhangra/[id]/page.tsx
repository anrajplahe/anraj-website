
import { Suspense } from "react";

import JournalArticle from "@/components/journal/JournalArticle";

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
