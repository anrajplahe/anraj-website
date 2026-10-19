
import Link from "next/link";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";

type InterestCardProps = {
  title: string;
  description: string;
  symbol: string;
  colour: string;
  href?: string;
};

// Match each card's hover colour to its accent.
const hoverColours: Record<string, string> = {
  "text-violet-400": "hover:border-violet-400/40",
  "text-cyan-400": "hover:border-cyan-400/40",
  "text-yellow-400": "hover:border-yellow-400/40",
  "text-pink-400": "hover:border-pink-400/40",
};

export default function InterestCard({
  title,
  description,
  symbol,
  colour,
  href,
}: InterestCardProps) {
  return (
    <div
      className={`
        relative h-full rounded-2xl border border-white/10
        bg-[#191D2B] p-5 transition-all duration-300 sm:p-8
        ${hoverColours[colour] ?? "hover:border-white/20"}
        ${href ? "motion-safe:hover:-translate-y-1" : ""}
      `}
    >
      {/* Coloured symbol */}
      <span className={`text-3xl font-bold ${colour}`}>
        {symbol}
      </span>

      {/* White title */}
      <h3 className="mt-8 text-lg font-semibold text-white sm:mt-10 sm:text-xl">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm text-gray-400">
        {description}
      </p>

      {/* Bhangra social links */}
      {title === "Bhangra" && (
        <div className="relative z-10 mt-5 flex flex-wrap items-center gap-3 sm:gap-4">
          <a
            href="https://www.instagram.com/anahatbhangra/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Anahat Bhangra Instagram"
            className="inline-flex h-10 w-10 items-center justify-center text-gray-400 transition-colors hover:text-yellow-400"
          >
            <FaInstagram size={20} />
          </a>

          <a
            href="https://www.tiktok.com/@anahatbhangra"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Anahat Bhangra TikTok"
            className="inline-flex h-10 w-10 items-center justify-center text-gray-400 transition-colors hover:text-yellow-400"
          >
            <FaTiktok size={20} />
          </a>

          <a
            href="mailto:anahatbhangra@gmail.com"
            aria-label="Email Anahat Bhangra"
            className="
              inline-flex max-w-full min-w-0 items-center gap-2
              rounded-lg border border-white/10 bg-white/5
              px-3 py-2 text-sm font-medium text-gray-300
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

      {/* Full-card navigation when a destination exists */}
      {href && (
        <Link
          href={href}
          aria-label={`Explore ${title}`}
          className="
            absolute inset-0 rounded-2xl
            focus-visible:outline-2
            focus-visible:outline-offset-4
            focus-visible:outline-cyan-400
          "
        />
      )}
    </div>
  );
}
