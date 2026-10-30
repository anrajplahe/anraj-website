
import Link from "next/link";
import JournalReveal from "@/components/journal/JournalReveal";
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

  // The full-journal branch below deliberately retains its original markup.
  if (isPreview) {
    return (
      <section className={`journal-preview ${isBhangra ? "journal-preview-bhangra" : "journal-preview-music"} ${embedded ? "mt-20 border-t border-white/[0.08] pt-12 sm:mt-24" : "mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20"}`}>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5 sm:mb-10">
          <div>
            <p className={`mb-3 text-xs font-semibold tracking-[0.18em] ${accentText}`}>{label} / JOURNAL</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">The Journal.</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              {isBhangra ? "Performances, competitions, teaching and experiences." : "Guitar, recordings, gear and everything musical."}
            </p>
          </div>
          <Link href={journalUrl} className="journal-preview-link inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium">
            View all entries <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {!featured ? (
          <p className="text-sm text-slate-400">No journal entries yet.</p>
        ) : (
          <>
            <JournalReveal category={category} index={0} featured>
              <div className="grid min-w-0 items-start gap-7 lg:grid-cols-[1.15fr_1fr] lg:gap-9">
                <div className="min-w-0">
                  <JournalMediaPreview key={featured.id} entry={featured} category={category} label={label} featured />
                </div>
                <div className="min-w-0 py-1 lg:py-3">
                  <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${accentText}`}>Featured entry</p>
                  <time dateTime={featured.date} className="mt-4 block text-xs text-slate-400">{formatDate(featured.date)}</time>
                  <h3 className="mt-4 break-words text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
                    <Link href={`/${category}/${featured.id}`} className="journal-preview-title rounded-md">{featured.title || "Journal entry"}</Link>
                  </h3>
                  <p className="mt-5 break-words text-sm leading-7 text-slate-400 sm:text-base">{featured.excerpt}</p>
                  <Link href={`/${category}/${featured.id}`} className="journal-preview-link mt-6 inline-flex min-h-11 items-center gap-3 rounded-lg text-sm font-medium">
                    Read entry <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </JournalReveal>

            {remaining.length > 0 && (
              <div className="mt-10 sm:mt-12">
                <h3 className="mb-5 text-lg font-semibold tracking-tight text-white">Recent entries</h3>
                <div className="grid min-w-0 items-start gap-5 md:grid-cols-2">
                  {remaining.map((entry, index) => (
                    <JournalReveal key={entry.id} category={category} index={index + 1}>
                      <JournalMediaPreview entry={entry} category={category} label={label} />
                      <div className="mt-5 min-w-0">
                        <time dateTime={entry.date} className="text-xs text-slate-400">{formatDate(entry.date)}</time>
                        <h4 className="mt-3 break-words text-lg font-semibold leading-snug tracking-tight text-white sm:text-xl">
                          <Link href={`/${category}/${entry.id}`} className="journal-preview-title rounded-md">{entry.title || "Journal entry"}</Link>
                        </h4>
                        <p className="mt-3 line-clamp-3 break-words text-sm leading-6 text-slate-400">{entry.excerpt}</p>
                        <Link href={`/${category}/${entry.id}`} className="journal-preview-link mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg text-xs font-medium">
                          Read entry <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </JournalReveal>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <div className="mt-8">
          <Link href={journalUrl} className="journal-preview-link inline-flex min-h-11 items-center gap-3 rounded-full border border-white/15 px-5 py-3 text-sm font-medium transition-colors">
            Explore the full journal <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    );
  }

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
