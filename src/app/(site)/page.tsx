import { HiOutlineBriefcase, HiOutlineDocumentText } from "react-icons/hi2";
import HomeIntroduction from "@/components/HomeIntroduction";
import HomeInterestReveal from "@/components/HomeInterestReveal";
import InterestCard from "@/components/InterestCard";

// Interest card data

const interests = [
  {
  title: "Projects",
  description: "A little insight into my tech journey and what I'm building.",
  symbol: "</>",
  colour: "text-violet-400",
  href: "/projects",
  },
  {
    title: "Tech",
    description: "The tech I use and love.",
    symbol: "⌘",
    colour: "text-green-500",
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
    title: "Music",
    description: "Guitars, sounds and random musings.",
    symbol: "♫",
    colour: "text-pink-400",
    href: "/music",
  },
];

function getCVUrl() {
  const value = process.env.NEXT_PUBLIC_CV_GOOGLE_DOC_URL?.trim();
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "docs.google.com" && url.pathname.startsWith("/document/")
      ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export default function Home() {
  return (
    <main className="home-page flex-1 bg-[#0B0D14] text-white">

      {/* Hero Section */}
      <section
        id="about"
        className="home-hero relative isolate mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 md:py-36"
      >
        {/* Background glow */}
        <div aria-hidden="true" className="hero-atmosphere pointer-events-none absolute inset-0 -z-10" />

        <HomeIntroduction />
      </section>

      <section id="journey" aria-labelledby="journey-heading" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-28">
        <h2 id="journey-heading" className="home-section-title mb-6 text-2xl font-semibold tracking-tight sm:mb-8 sm:text-3xl">
          My Journey.
        </h2>
        <HomeInterestReveal>
          <div className="home-card-reveal h-full">
            <InterestCard title="CV" description="A snapshot of my skills, qualifications and professional experience."
              symbol={<HiOutlineDocumentText size={30} />} colour="text-[#60A5FA]" href={getCVUrl()} external />
          </div>
          <div className="home-card-reveal h-full">
            <InterestCard title="Experience" description="Explore the roles and experiences that have shaped my career."
              symbol={<HiOutlineBriefcase size={30} />} colour="text-[#60A5FA]" href="/experience" />
          </div>
        </HomeInterestReveal>
      </section>

      {/* Interests Section */}
      <section
        id="interests"
        className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-28"
      >
        <h2 className="home-section-title mb-6 text-2xl font-semibold tracking-tight sm:mb-8 sm:text-3xl">
          Things I&apos;m into.
        </h2>

        {/* Reusable Interest Cards */}
        <HomeInterestReveal>
          {interests.map((interest) => (
            <div key={interest.title} className="home-card-reveal h-full">
              <InterestCard
                title={interest.title}
                description={interest.description}
                symbol={interest.symbol}
                colour={interest.colour}
                href={interest.href}
              />
            </div>
          ))}
        </HomeInterestReveal>
      </section>
    </main>
  );
}
