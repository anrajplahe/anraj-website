import InterestCard from "@/components/InterestCard";

// Interest card data

const interests = [
  {
    title: "Projects",
    description: "A little insight into my tech journey and what I'm building.",
    symbol: "</>",
    colour: "text-violet-400",
  },
  {
    title: "Tech",
    description: "The tech I use and love.",
    symbol: "⌘",
    colour: "text-cyan-400",
    href: "/tech",
  },
  
  {
    title: "Bhangra",
    description: "Teaching, performing and competing.",
    symbol: "✦",
    colour: "text-yellow-400",
    href: "/bhangra",
  },
  {
    title: "Guitar & Music",
    description: "Guitars, sounds and random musings.",
    symbol: "♫",
    colour: "text-pink-400",
    href: "/music",
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
              href={interest.href}
            />
          ))}
        </div>
      </section>
      
    </main>
  );
}
