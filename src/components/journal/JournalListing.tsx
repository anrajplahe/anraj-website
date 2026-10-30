
import Link from "next/link";
import ActionLink from "@/components/ActionLink";
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

  // Landing-page preview markup stays independent of the full journal.
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
          <ActionLink href={journalUrl} accent={isBhangra ? "yellow" : "pink"} arrow="diagonal" tone="quiet">
                    View all entries
                  </ActionLink>
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
                  <ActionLink href={`/${category}/${featured.id}`} accent={isBhangra ? "yellow" : "pink"} arrow="forward" className="mt-6">
                    Read entry
                  </ActionLink>
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
                        <ActionLink href={`/${category}/${entry.id}`} accent={isBhangra ? "yellow" : "pink"} arrow="forward" className="mt-4">
                    Read entry
                  </ActionLink>
                      </div>
                    </JournalReveal>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <div className="mt-8">
          <ActionLink href={journalUrl} accent={isBhangra ? "yellow" : "pink"} arrow="forward">
                    Explore the full journal
                  </ActionLink>
        </div>
      </section>
    );
  }

  return (
    <section className={`journal-full ${isBhangra ? "journal-preview-bhangra" : "journal-preview-music"} ${embedded ? "mt-16 border-t border-white/10 pt-12" : "mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20"}`}>
      <header className="journal-full-intro mb-10 sm:mb-12">
        <p className={`text-xs font-semibold tracking-[0.18em] ${accentText}`}>{label} / JOURNAL</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">The Journal.</h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400">
          {isBhangra ? "Performances, competitions, teaching and experiences." : "Guitar, recordings, gear and everything musical."}
        </p>
      </header>
      {!featured ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-slate-400">No journal entries yet.</p>
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
                <h2 className="mt-4 break-words text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
                  <Link href={`/${category}/${featured.id}`} className="journal-preview-title rounded-md">{featured.title || "Journal entry"}</Link>
                </h2>
                <p className="mt-5 break-words text-sm leading-7 text-slate-400 sm:text-base">{featured.excerpt}</p>
                <ActionLink href={`/${category}/${featured.id}`} accent={isBhangra ? "yellow" : "pink"} arrow="forward" className="mt-6">
                    Read entry
                  </ActionLink>
              </div>
            </div>
          </JournalReveal>
          {remaining.length > 0 && (
            <section aria-label="More from the journal" className="mt-10 sm:mt-12">
              <h2 className="mb-6 text-xl font-semibold tracking-tight text-white">More from the journal</h2>
              <div className="grid min-w-0 items-start gap-5 md:grid-cols-2">
                {remaining.map((entry, index) => (
                  <JournalReveal key={entry.id} category={category} index={(index + 1) % 6}>
                    <JournalMediaPreview entry={entry} category={category} label={label} />
                    <div className="mt-5 min-w-0">
                      <time dateTime={entry.date} className="text-xs text-slate-400">{formatDate(entry.date)}</time>
                      <h3 className="mt-3 break-words text-lg font-semibold leading-snug tracking-tight text-white sm:text-xl">
                        <Link href={`/${category}/${entry.id}`} className="journal-preview-title rounded-md">{entry.title || "Journal entry"}</Link>
                      </h3>
                      <p className="mt-3 line-clamp-3 break-words text-sm leading-6 text-slate-400">{entry.excerpt}</p>
                      <ActionLink href={`/${category}/${entry.id}`} accent={isBhangra ? "yellow" : "pink"} arrow="forward" className="mt-4">
                    Read entry
                  </ActionLink>
                    </div>
                  </JournalReveal>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </section>
  );
}
