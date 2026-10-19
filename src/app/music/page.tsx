
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guitar & Music",
  description:
    "My love for guitar, music, recording and experimenting with different sounds.",
  alternates: {
    canonical: "/music",
  },
};

export default function MusicPage() {
  return (
    <main className="flex-1 bg-[#0B0D14] text-white">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">

        {/* Page Title */}
        <h1 className="text-4xl font-bold tracking-tight text-pink-400 sm:text-5xl">
          Guitar & Music
        </h1>

        {/* Introduction */}
        <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-gray-400 sm:text-lg">
          <p>
            Music has always been something I've loved, and
            guitar is one of my favourite ways of expressing it.
          </p>

          <p>
            I enjoy learning songs, playing around with
            different guitar tones and experimenting with
            recording and music production. I also play dhol, and Indian drum that is very prevalent in Bhangra.
          </p>

          <p>
            I'll eventually be using this space to share
            guitar covers, recordings and anything else
            musical that I've been working on.
          </p>
        </div>

      </section>
    </main>
  );
}
