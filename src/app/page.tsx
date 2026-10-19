import InterestCard from "@/components/InterestCard";

import {
  FaLinkedinIn,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa6";

// Interest card data

const interests = [
  {
    title: "Projects",
    description: "A little insight into my tech journey and what I'm building.",
    symbol: "</>",
    colour: "text-violet-400",
  },
  {
    title: "Tech I Use",
    description: "Software and hardware I use and love.",
    symbol: "⌘",
    colour: "text-cyan-400",
  },
  {
    title: "Bhangra",
    description: "Teaching, performing and competing.",
    symbol: "✦",
    colour: "text-yellow-400",
  },
  {
    title: "Guitar & Music",
    description: "Guitars, sounds and random musings.",
    symbol: "♫",
    colour: "text-pink-400",
  },
];

export default function Home() {
  return (
    <main className="flex-1 bg-[#0B0D14] text-white">

      {/* Hero Section */}
      <section
        id="about"
        className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 md:py-36"
      >
        {/* Background glow */}
        <div className="pointer-events-none absolute right-0 top-12 -z-0 h-64 w-64 rounded-full bg-green-600/10 blur-3xl" />

        <div className="relative z-10">

          {/* Introduction */}
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl">
            Hi, I'm <span className="text-green-400">Anraj</span>.

            <span className="mt-3 block text-gray-400">
              Here's a little bit about me.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:mt-8 sm:text-lg">
            I'm passionate about software, technology, Bhangra and music.
            This is my space to share what I'm building, learning and
            enjoying along the way.
          </p>

          {/* Explore Button */}
          <a
            href="#interests"
            className="
              group mt-10 inline-flex items-center gap-4
              rounded-2xl border border-green-200/40
              bg-gradient-to-br from-green-300 via-green-400 to-green-600
              px-6 py-3
              text-base font-semibold tracking-normal text-green-950
              shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_30px_rgba(34,197,94,0.22)]
              transition-all duration-300
              motion-safe:hover:-translate-y-1
              hover:shadow-[0_16px_40px_rgba(34,197,94,0.35)]
              focus-visible:outline-2 focus-visible:outline-offset-4
              focus-visible:outline-green-300
            "
          >
            <span>Take a look</span>

            <span
              aria-hidden="true"
              className="
                flex h-9 w-9 items-center justify-center
                rounded-xl bg-green-950/15
                text-xl transition-transform duration-300
                motion-safe:group-hover:translate-x-1
                motion-safe:group-hover:-translate-y-1
              "
            >
              →
            </span>
          </a>

        </div>
      </section>

      {/* Interests Section */}
      <section
        id="interests"
        className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-28"
      >
        <h2 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">
          Things I'm into.
        </h2>

        {/* Reusable Interest Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {interests.map((interest) => (
            <InterestCard
              key={interest.title}
              title={interest.title}
              description={interest.description}
              symbol={interest.symbol}
              colour={interest.colour}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 py-7 sm:flex-row sm:px-6 sm:py-8">

          <p className="text-sm text-gray-400">
            Built by Anraj
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/anraj-plahe/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#191D2B] text-gray-300 transition-all duration-200 hover:-translate-y-1 hover:border-green-400/50 hover:text-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
            >
              <FaLinkedinIn size={18} />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/anraj.plahe/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#191D2B] text-gray-300 transition-all duration-200 hover:-translate-y-1 hover:border-green-400/50 hover:text-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
            >
              <FaInstagram size={19} />
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@anraj.plahe"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#191D2B] text-gray-300 transition-all duration-200 hover:-translate-y-1 hover:border-green-400/50 hover:text-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
            >
              <FaTiktok size={18} />
            </a>

          </div>
        </div>
      </footer>

    </main>
  );
}
