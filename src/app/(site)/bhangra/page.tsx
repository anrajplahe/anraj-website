
import type { Metadata } from "next";
import CompetitionTimeline from "@/components/bhangra/CompetitionTimeline";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
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
    <main className="bhangra-page flex-1 bg-[#0B0D14] text-white">
      <section className="relative isolate mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div aria-hidden="true" className="bhangra-atmosphere pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem]" />
        {/* Page Introduction */}
        <h1 className="bhangra-heading text-5xl font-semibold tracking-[-0.05em] text-yellow-400 sm:text-6xl md:text-7xl">
          Bhangra
        </h1>

        <div className="bhangra-introduction mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-slate-400 sm:text-lg">
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
          className="mt-20 sm:mt-24"
        >
          <h2
            id="competition-heading"
            className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
          >
            Competition History
          </h2>

          <p className="mt-4 max-w-2xl leading-relaxed text-gray-400">
            The teams I've competed with, captained and
            coached over the years.
          </p>

          <CompetitionTimeline
            history={competitionHistory}
            placingColours={placingColours}
            vardiColours={vardiColours}
          />
        </section>

        {/* Anahat Social Links */}
        <section aria-labelledby="anahat-heading" className="mt-20 rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.02] p-6 sm:mt-24 sm:p-8">
          <h2 id="anahat-heading" className="text-xl font-semibold tracking-tight text-white">
            Follow Anahat Bhangra
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
            Anahat is my Bhangra academy, where I teach classes and workshops.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="https://www.instagram.com/anahatbhangra/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-yellow-400/30 hover:bg-yellow-400/5 hover:text-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400"
            >
              <FaInstagram size={18} aria-hidden="true" />
              Instagram
            </a>

            <a
              href="https://www.tiktok.com/@anahatbhangra"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-yellow-400/30 hover:bg-yellow-400/5 hover:text-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400"
            >
              <FaTiktok size={18} aria-hidden="true" />
              TikTok
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
