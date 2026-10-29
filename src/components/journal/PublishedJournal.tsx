
import JournalListing from "./JournalListing";

import { getPublishedJournalEntries } from "@/lib/journal/public";

type Props = {
  category: "bhangra" | "music";
  variant?: "preview" | "full";
};

export default async function PublishedJournal({
  category,
  variant = "preview",
}: Props) {
  const entries = await getPublishedJournalEntries(
    category,
    variant === "preview" ? 3 : undefined
  );

  return (
    <JournalListing
      category={category}
      entries={entries}
      variant={variant}
      embedded={variant === "preview"}
    />
  );
}
