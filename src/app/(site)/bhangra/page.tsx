
import type { Metadata } from "next";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa6";
import { Suspense } from "react";
import PublishedJournal from "@/components/journal/PublishedJournal";

export const metadata: Metadata = {
  title: "Bhangra",
  description:
    "My experiences in Bhangra, from competing and performing to coaching and teaching.",
  alternates: {
    canonical: "/bhangra",
  },
};

type VardiColour = "Black" | "Yellow" | "Blue" | "Red";

type CompetitionEntry = {
  team: string;
  competition: string;
  role?: "Captain" | "Coach";
  placing?: "1st Place" | "2nd Place" | "3rd Place";
  vardiColour?: VardiColour;
  youtubeUrl?: string;
};

type CompetitionYear = {
  year: number;
  entries: CompetitionEntry[];
};

const competitionHistory: CompetitionYear[] = [
  {
    year: 2022,
    entries: [
      {
        team: "Ankhi Jawan",
        competition: "World Class Bhangra",
        placing: "2nd Place",
        vardiColour: "Black",
        youtubeUrl: "https://youtu.be/sH7a7IRud8w",
      },
    ],
  },
  {
    year: 2023,
    entries: [
      {
        team: "Loughborough × Nottingham Trent University",
        competition: "The Bhangra Showdown",
        role: "Captain",
        vardiColour: "Black",
        youtubeUrl: "https://youtu.be/dLcNn2ojKL0",
      },
      {
        team: "Ranjhe",
        competition: "World Class Bhangra",
        placing: "2nd Place",
        vardiColour: "Yellow",
        youtubeUrl: "https://youtu.be/ZZdAm3OHFhc",
      },
    ],
  },
  {
    year: 2024,
    entries: [
      {
        team: "Loughborough × Nottingham Trent University",
        competition: "The Bhangra Showdown",
        role: "Captain",
        vardiColour: "Blue",
        youtubeUrl: "https://youtu.be/xQXB3AB2pgo",
      },
      {
        team: "Ranjhe",
        competition: "Bhangra Beatdown",
        placing: "1st Place",
        vardiColour: "Red",
        youtubeUrl: "https://youtu.be/TUY4c5vOIC8",
      },
    ],
  },
  {
    year: 2025,
    entries: [
      {
        team: "Westminster × University College London",
        competition: "The Bhangra Showdown",
        role: "Coach",
        youtubeUrl: "https://youtu.be/Z1PdY69lxA4",
      },
      {
        team: "Ranjhe",
        competition: "Bhangra Beatdown",
        vardiColour: "Yellow",
        youtubeUrl: "https://youtu.be/nLexvzOqCU0",
      },
    ],
  },
  {
    year: 2026,
    entries: [
      {
        team: "Raunak Bhangra",
        competition: "The Bhangra Virsa Festival",
        placing: "3rd Place",
        vardiColour: "Blue",
        youtubeUrl: "https://youtu.be/xBL7NvuMLYk",
      },
      {
        team: "Ranjhe",
        competition: "Bhangra Beatdown",
        placing: "1st Place",
        vardiColour: "Black",
      },
    ],
  },
];

const placingColours: Record<
  NonNullable<CompetitionEntry["placing"]>,
  string
> = {
  "1st Place": "text-[#E8B84B]",
  "2nd Place": "text-[#CDD5DF]",
  "3rd Place": "text-[#CD9467]",
};

const vardiColours: Record<VardiColour, string> = {
  Black: "#111111",
  Yellow: "#FACC15",
  Blue: "#2563EB",
  Red: "#DC2626",
};

export default function BhangraPage() {
  return (
    <main className="flex-1 bg-[#0B0D14] text-white">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Page Introduction */}
        <h1 className="text-4xl font-bold tracking-tight text-yellow-400 sm:text-5xl">
          Bhangra
        </h1>

        <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-gray-400 sm:text-lg">
          <p>
            Bhangra is a huge part of my life. I dance and
            compete with Ranjhe, and I also run my own
            Bhangra academy, Anahat, where I teach
            classes and workshops.
          </p>

          <p>
            Between teaching, rehearsals, performances
            and competitions, there's usually something
            going on!
          </p>

          <p>
            I'll be using this space to share some of
            the things I've been getting up to, whether
            that's something with Anahat, Ranjhe or just
            Bhangra in general.
          </p>
        </div>

        {/* Published Journal */}
        <Suspense
          fallback={
            <p className="mt-16 text-sm text-gray-400">
              Loading journal...
            </p>
          }
        >
          <PublishedJournal
            category="bhangra"
            variant="preview"
          />
        </Suspense>

        {/* Competition History */}
        <section
          aria-labelledby="competition-heading"
          className="mt-16"
        >
          <h2
            id="competition-heading"
            className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            Competition History
          </h2>

          <p className="mt-4 max-w-2xl leading-relaxed text-gray-400">
            The teams I've competed with, captained and
            coached over the years.
          </p>

          <div className="mt-10 max-w-4xl space-y-8">
            {competitionHistory.map((year) => (
              <section
                key={year.year}
                aria-label={`${year.year} competitions`}
                className="flex items-start gap-4 sm:gap-8"
              >
                {/* Year */}
                <div className="w-12 shrink-0 pt-3">
                  <h3 className="font-semibold text-yellow-400">
                    {year.year}
                  </h3>
                </div>

                {/* Competition Entries */}
                <div className="min-w-0 flex-1 space-y-6 border-t border-white/15 pt-3">
                  {year.entries.map((entry) => (
                    <div
                      key={`${entry.team}-${entry.competition}`}
                    >
                      {/* Team and Role */}
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <h4 className="text-sm font-semibold text-white sm:text-base">
                          {entry.team}
                        </h4>

                        {entry.role && (
                          <span className="text-xs italic text-slate-400">
                            ({entry.role})
                          </span>
                        )}
                      </div>

                      {/* Competition and Placing */}
                      <p className="mt-1 text-sm leading-relaxed text-gray-400">
                        {entry.competition}

                        {entry.placing && (
                          <span
                            className={`ml-2 font-medium italic ${placingColours[entry.placing]}`}
                          >
                            ({entry.placing})
                          </span>
                        )}
                      </p>

                      {/* Vardi Colour and Performance Video */}
                      {(entry.vardiColour || entry.youtubeUrl) && (
                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
                          {entry.vardiColour && (
                            <div className="inline-flex items-center gap-2">
                              <span
                                aria-hidden="true"
                                className="h-4 w-4 shrink-0 rounded-full border border-white/40"
                                style={{
                                  backgroundColor:
                                    vardiColours[entry.vardiColour],
                                }}
                              />
                              <span className="text-xs text-gray-400">
                                {entry.vardiColour}
                              </span>
                            </div>
                          )}

                          {entry.youtubeUrl && (
                            <a
                              href={entry.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={
                                entry.role === "Coach"
                                  ? `Watch ${entry.team}'s performance at ${entry.competition}`
                                  : `Watch ${entry.team}'s performance at ${entry.competition}`
                              }
                              className="inline-flex items-center gap-2 text-xs font-medium text-gray-300 transition-colors hover:text-yellow-400 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                            >
                              <FaYoutube
                                size={17}
                                className="text-red-500"
                                aria-hidden="true"
                              />
                              {entry.role === "Coach"
                                ? "Watch team performance"
                                : "Watch performance"}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        {/* Anahat Social Links */}
        <div className="mt-16 max-w-2xl border-t border-white/15 pt-6">
          <p className="mb-4 text-sm font-medium text-white">
            Follow Anahat Bhangra
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://www.instagram.com/anahatbhangra/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-yellow-400"
            >
              <FaInstagram size={18} aria-hidden="true" />
              Instagram
            </a>

            <a
              href="https://www.tiktok.com/@anahatbhangra"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-yellow-400"
            >
              <FaTiktok size={18} aria-hidden="true" />
              TikTok
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
