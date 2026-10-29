
import type { Metadata } from "next";
import {
  FaGuitar,
  FaSliders,
  FaVolumeHigh,
} from "react-icons/fa6";
import { Suspense } from "react";
import PublishedJournal from "@/components/journal/PublishedJournal";

export const metadata: Metadata = {
  title: "Guitar & Music",
  description:
    "A little insight into my interests in guitar, music production and the gear I use.",
  alternates: {
    canonical: "/music",
  },
};

// Gear organised into categories
const gearCategories = [
  {
    title: "Guitars",
    icon: FaGuitar,
    items: [
      {
        name: "PRS SE Custom 24",
        specs: [
          "HH pickup configuration",
        ],
      },
      {
        name: "Fender Player II Stratocaster",
        specs: [
          "SSS pickup configuration",
        ],
      },
    ],
  },
  {
    title: "Amps & Sims",
    icon: FaSliders,
    items: [
      {
        name: "Neural DSP Archetype: Plini X",
        specs: [
          "Amp simulation and effects",
        ],
      },
      {
        name: "Neural DSP Tone King Imperial Mk II",
        specs: [
          "Amp simulation and effects",
        ],
      },
    ],
  },
  {
    title: "Recording & Studio Equipment",
    icon: FaVolumeHigh,
    items: [
      {
        name: "Universal Audio Volt 2",
        specs: [
          "USB audio interface",
        ],
      },
      {
        name: "Yamaha HS5",
        specs: [
          "Active studio monitors",
        ],
      },
      {
        name: "Beyerdynamic DT 990 Pro",
        specs: [
          "Open-back studio headphones",
        ],
      },
      {
        name: "Logic Pro X",
        specs: [
          "Digital audio workstation",
        ],
      },
    ],
  },
];

export default function MusicPage() {
  return (
    <main className="flex-1 bg-[#0B0D14] text-white">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">

        {/* Page Introduction */}
        <h1 className="text-4xl font-bold tracking-tight text-pink-400 sm:text-5xl">
          Guitar & Music
        </h1>

        <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-gray-400 sm:text-lg">
          <p>
            Music has always been something I've loved,
            and guitar is my favourite way of getting
            involved with it.
          </p>

          <p>
            I enjoy learning songs, playing around with
            different guitar tones and experimenting
            with recording and music production.
          </p>

          <p>
            I'll eventually be using this space to share
            guitar covers, recordings and anything else
            musical that I've been working on.
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
            category="music"
            variant="preview"
          />
        </Suspense>

        {/* My Gear Section */}
        <section
          aria-labelledby="gear-heading"
          className="mt-16"
        >
          <h2
            id="gear-heading"
            className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            My Gear
          </h2>

          <p className="mt-4 max-w-2xl leading-relaxed text-gray-400">
            The guitars, plugins and recording equipment
            I use for playing and making music.
          </p>

          {/* Gear Categories */}
          <div className="mt-12 space-y-14">
            {gearCategories.map((category) => {
              const Icon = category.icon;

              return (
                <section
                  key={category.title}
                  aria-label={category.title}
                >
                  {/* Category Heading */}
                  <div className="flex items-center gap-3">
                    <Icon
                      aria-hidden="true"
                      className="text-xl text-pink-400"
                    />

                    <h3 className="text-xl font-semibold tracking-tight text-pink-400 sm:text-2xl">
                      {category.title}
                    </h3>
                  </div>

                  {/* Equipment Grid */}
                  <div className="mt-6 grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2">
                    {category.items.map((item) => (
                      <article
                        key={item.name}
                        className="border-t border-white/15 pt-5"
                      >
                        {/* Equipment Name */}
                        <h4 className="text-lg font-semibold text-white">
                          {item.name}
                        </h4>

                        {/* Equipment Details */}
                        <div className="mt-4 space-y-2 text-sm leading-relaxed text-gray-400">
                          {item.specs.map((spec) => (
                            <p key={spec}>
                              {spec}
                            </p>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
