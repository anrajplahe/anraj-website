
import Navbar from "@/components/Navbar";
import { Space_Grotesk } from "next/font/google";
import {
  FaLinkedinIn,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

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
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
            Hi, I'm <span className="text-green-400">Anraj</span>.
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
  className={`
    ${spaceGrotesk.className}
    group mt-10 inline-flex items-center gap-4
    rounded-2xl border border-green-200/40
    bg-gradient-to-br from-green-300 via-green-400 to-green-600
    px-6 py-3
    text-base font-semibold tracking-wide text-green-950
    shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_30px_rgba(34,197,94,0.22)]
    transition-all duration-300
    motion-safe:hover:-translate-y-1
    hover:shadow-[0_16px_40px_rgba(34,197,94,0.35)]
    focus-visible:outline-2 focus-visible:outline-offset-4
    focus-visible:outline-green-300
  `}
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
    ">
    →
  </span>
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

{interest.title === "Bhangra" && (
  <div className="mt-5 flex items-center gap-4">
    <a
      href="https://www.instagram.com/anahatbhangra/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Anahat Bhangra Instagram"
      className="text-gray-400 transition-colors hover:text-yellow-400"
    >
      <FaInstagram size={20} />
    </a>

    <a
      href="https://www.tiktok.com/@anahatbhangra"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Anahat Bhangra TikTok"
      className="text-gray-400 transition-colors hover:text-yellow-400"
    >
      <FaTiktok size={20} />
    </a>

    
<a
  href="mailto:anahatbhangra@gmail.com"
  aria-label="Email Anahat Bhangra"
  className="
    inline-flex items-center gap-2
    rounded-lg border border-white/10
    bg-white/5 px-3 py-2
    text-sm font-medium text-gray-300
    transition-all duration-200
    hover:border-yellow-400/40
    hover:bg-yellow-400/10
    hover:text-yellow-400
  "
>
  <HiOutlineEnvelope size={18} />
  <span>Email Anahat Bhangra</span>
</a>

  </div>
)}

            </div>
          ))}
        </div>
      </section>

      
{/* Footer */}
<footer className="border-t border-white/10">
  <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 py-8 sm:flex-row">

    <p className="text-sm text-gray-400">
      Built by Anraj
    </p>

    <div className="flex items-center gap-3">
      <a
        href="https://www.linkedin.com/in/anraj-plahe/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#191D2B] text-gray-300 transition-all duration-200 hover:-translate-y-1 hover:border-green-400/50 hover:text-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
      >
        <FaLinkedinIn size={18} />
      </a>

      <a
        href="https://www.instagram.com/anraj.plahe/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#191D2B] text-gray-300 transition-all duration-200 hover:-translate-y-1 hover:border-green-400/50 hover:text-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
      >
        <FaInstagram size={19} />
      </a>

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