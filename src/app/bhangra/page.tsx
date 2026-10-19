
import type { Metadata } from "next";
import { FaInstagram, FaTiktok } from "react-icons/fa6";

export const metadata: Metadata = {
  title: "Bhangra",
  description:
    "A little insight into my world of Bhangra, from teaching to performing and competing.",
  alternates: {
    canonical: "/bhangra",
  },
};

export default function BhangraPage() {
  return (
    <main className="flex-1 bg-[#0B0D14] text-white">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">

        {/* Page Title */}
        <h1 className="text-4xl font-bold tracking-tight text-yellow-400 sm:text-5xl">
          Bhangra
        </h1>

        {/* Introduction */}
        <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-gray-400 sm:text-lg">
          <p>
            Bhangra is a huge part of my life. I dance and compete
            with Ranjhe, and I also run my own Bhangra academy,
            Anahat Bhangra, where I teach classes and workshops. I've even been learning dhol so I can teach a more traditional style of Bhangra.
          </p>

          <p>
            Between teaching, rehearsals, performances and
            competitions, there's always something going on!
          </p>

          <p>
            I'll be using this space to share some of the things
            I've been getting up to, whether that's something
            with Anahat, Ranjhe or just bhangra in general.
          </p>
        </div>

        {/* Social Links */}
        <div className="mt-12 max-w-2xl border-t border-white/15 pt-6">
          <p className="mb-5 text-sm text-gray-400">
            Follow Anahat Bhangra
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://www.instagram.com/anahatbhangra/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-300 transition-colors hover:text-yellow-400"
            >
              <FaInstagram size={20} />
              <span>Instagram</span>
            </a>

            <a
              href="https://www.tiktok.com/@anahatbhangra"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-300 transition-colors hover:text-yellow-400"
            >
              <FaTiktok size={20} />
              <span>TikTok</span>
            </a>
          </div>
        </div>

      </section>
    </main>
  );
}
