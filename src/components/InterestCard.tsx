
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";

type InterestCardProps = {
  title: string;
  description: string;
  symbol: string;
  colour: string;
};

export default function InterestCard({
  title,
  description,
  symbol,
  colour,
}: InterestCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#191D2B] p-5 transition duration-300 hover:border-green-400/40 sm:p-8 motion-safe:hover:-translate-y-1">

      <span className={`text-3xl font-bold ${colour}`}>
        {symbol}
      </span>

      <h3 className="mt-8 text-lg font-semibold sm:mt-10 sm:text-xl">
        {title}
      </h3>

      <p className="mt-2 text-sm text-gray-400">
        {description}
      </p>

      {title === "Bhangra" && (
        <div className="mt-5 flex flex-wrap items-center gap-3 sm:gap-4">
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
            className="inline-flex max-w-full min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-gray-300 transition-all hover:border-yellow-400/40 hover:bg-yellow-400/10 hover:text-yellow-400"
          >
            <HiOutlineEnvelope size={18} />
            <span>Email Anahat Bhangra</span>
          </a>
        </div>
      )}
    </div>
  );
}
