
import Link from "next/link";
import JournalMediaPreview from "@/components/journal/JournalMediaPreview";

export type JournalEntry = {
  id: string;
  title: string | null;
  date: string;
  excerpt: string;
  coverImage?: {
    url: string;
    alt: string;
  } | null;
  previewSocialUrls?: string[];
  previewImages?: {
    id: string;
    url: string;
    alt: string;
  }[];
};

type Props = {
  category: "bhangra" | "music";
  entries: JournalEntry[];
  variant?: "preview" | "full";
  embedded?: boolean;
};

function formatDate(date: string) {
  const parsed = new Date(`${date}T12:00:00Z`);

  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export default function JournalListing({
  category,
  entries,
  variant = "full",
  embedded = false,
}: Props) {
  const isBhangra = category === "bhangra";
  const isPreview = variant === "preview";

  const label = isBhangra ? "BHANGRA" : "MUSIC";

  const accentText = isBhangra
    ? "text-yellow-400"
    : "text-pink-400";

  const hoverText = isBhangra
    ? "group-hover:text-yellow-400"
    : "group-hover:text-pink-400";

  const journalUrl = `/${category}/journal`;

  const visibleEntries = isPreview
    ? entries.slice(0, 3)
    : entries;

  const featured = visibleEntries[0];

  const remaining = featured
    ? visibleEntries.filter(
        (entry) => entry.id !== featured.id
      )
    : [];

  return (
    <section
      className={
        embedded
          ? "mt-16 border-t border-white/10 pt-12"
          : "mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20"
      }
    >
      {/* Journal heading */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p
            className={`mb-3 text-xs font-semibold tracking-widest ${accentText}`}
          >
            {label} / JOURNAL
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            The Journal.
          </h2>

          <p className="mt-4 max-w-2xl text-gray-400">
            {isBhangra
              ? "Performances, competitions, teaching and experiences."
              : "Guitar, recordings, gear and everything musical."}
          </p>
        </div>

        {isPreview && (
          <Link
            href={journalUrl}
            className={`text-sm font-medium ${accentText} hover:underline`}
          >
            View all entries →
          </Link>
        )}
      </div>

      {!featured ? (
        <p className="text-sm text-gray-400">
          No journal entries yet.
        </p>
      ) : (
        <>
          {/* Featured entry */}
          <article className="grid min-w-0 items-center gap-8 md:grid-cols-2">
            <JournalMediaPreview
              key={featured.id}
              entry={featured}
              category={category}
              label={label}
              featured
            />

            <div className="min-w-0 space-y-4 break-words">
              <p
                className={`text-xs font-semibold uppercase tracking-wider ${accentText}`}
              >
                Featured entry
              </p>

              <p className="text-sm text-gray-400">
                {formatDate(featured.date)}
              </p>

              <Link
                href={`/${category}/${featured.id}`}
                className="group block space-y-4"
              >
                <h3
                  className={`text-2xl font-semibold text-white transition-colors ${hoverText} sm:text-3xl`}
                >
                  {featured.title || "Journal entry"}
                </h3>

                <p className="leading-7 text-gray-400">
                  {featured.excerpt}
                </p>

                <span
                  className={`inline-block text-sm font-medium ${accentText}`}
                >
                  Read entry →
                </span>
              </Link>
            </div>
          </article>

          {/* Remaining entries */}
          {remaining.length > 0 && (
            <div className="mt-16 border-t border-white/10 pt-10">
              <h3 className="mb-8 text-xl font-semibold text-white">
                {isPreview
                  ? "Recent entries"
                  : "More from the journal"}
              </h3>

              <div className="grid min-w-0 gap-10 sm:grid-cols-2">
                {remaining.map((entry) => (
                  <article
                    key={entry.id}
                    className="min-w-0 space-y-3"
                  >
                    <JournalMediaPreview
                      entry={entry}
                      category={category}
                      label={label}
                    />

                    <Link
                      href={`/${category}/${entry.id}`}
                      className="group block space-y-3 break-words"
                    >
                      <p className="text-xs text-gray-400">
                        {formatDate(entry.date)}
                      </p>

                      <h4
                        className={`text-lg font-semibold text-white transition-colors ${hoverText}`}
                      >
                        {entry.title || "Journal entry"}
                      </h4>

                      <p className="line-clamp-3 text-sm leading-6 text-gray-400">
                        {entry.excerpt}
                      </p>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Full journal link */}
      {isPreview && (
        <div className="mt-10">
          <Link
            href={journalUrl}
            className={`inline-flex rounded-lg border border-white/20 px-5 py-3 text-sm font-medium transition-colors hover:border-white/50 ${accentText}`}
          >
            Explore the full journal →
          </Link>
        </div>
      )}
    </section>
  );
}
