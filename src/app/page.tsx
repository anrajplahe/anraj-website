
import Navbar from "@/components/Navbar";

const interests = [
  {
    title: "Software & Projects",
    description: "A little insight into my tech journey and what I'm building.",
    symbol: "</>",
    colour: "text-violet-400",
  },
  {
    title: "Tech & Gear",
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
    title: "Music",
    description: "Guitars, sounds and random musings.",
    symbol: "♫",
    colour: "text-pink-400",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0D14] text-white">

      <Navbar />

      {/* Hero Section */}
      <section
        id="about"
        className="relative mx-auto max-w-6xl px-6 py-24 md:py-36"
      >
        <div className="pointer-events-none absolute right-0 top-12 -z-0 h-64 w-64 rounded-full bg-green-600/10 blur-3xl" />

        <div className="relative z-10">
          <p className="mb-6 text-sm font-medium uppercase tracking-widest text-green-400">
            Welcome!
          </p>

          <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
            I'm Anraj.
            <span className="mt-3 block text-gray-400">
              Here's little bit about me.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-400">
            I'm passionate about software, technology, Bhangra and music.
            This is my space to share what I'm building, learning and
            enjoying along the way.
          </p>

          <a
            href="#interests"
            className="mt-10 inline-flex rounded-xl bg-green-600 px-6 py-3 font-medium transition hover:bg-green-500"
          >
            Take a look →
          </a>
        </div>
      </section>

      {/* Interests Section */}
      <section
        id="interests"
        className="mx-auto max-w-6xl px-6 pb-28"
      >
        <h2 className="mb-8 text-3xl font-bold">
          Things I'm into.
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {interests.map((interest) => (
            <div
              key={interest.title}
              className="rounded-2xl border border-white/10 bg-[#191D2B] p-8 transition duration-300 motion-safe:hover:-translate-y-1 hover:border-green-400/40"
            >
              <span className={`text-3xl font-bold ${interest.colour}`}>
                {interest.symbol}
              </span>

              <h3 className="mt-10 text-xl font-semibold">
                {interest.title}
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                {interest.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-gray-500">
        Built by Anraj
      </footer>

    </main>
  );
}