"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import useCardSpotlight from "@/components/useCardSpotlight";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import { HiArrowUpRight, HiOutlineEnvelope } from "react-icons/hi2";

type InterestCardProps = {
  title: string;
  description: string;
  symbol: ReactNode;
  colour: string;
  href?: string;
  external?: boolean;
};

// Shared by the spotlight, border and keyboard focus treatment.
const spotlightRGB: Record<string, string> = {
  "text-violet-400": "192, 132, 252",
  "text-green-500": "34, 197, 94",
  "text-yellow-400": "250, 204, 21",
  "text-pink-400": "244, 114, 182",
};

const accents: Record<string, string> = {
  "text-violet-400": "interest-violet",
  "text-green-500": "interest-green",
  "text-yellow-400": "interest-yellow",
  "text-pink-400": "interest-pink",
};

export default function InterestCard({
  title,
  description,
  symbol,
  colour,
  href,
  external = false,
}: InterestCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useCardSpotlight(cardRef, spotlightRGB[colour] ?? "96, 165, 250");

  return (
    <div
      ref={cardRef}
      data-interactive={href ? "true" : undefined}
      className={`interest-card relative isolate h-full min-h-72 rounded-2xl border border-white/10 p-6 sm:p-8 ${accents[colour] ?? ""}`}
    >
      {href && (
        <span aria-hidden="true" className="interest-arrow pointer-events-none absolute right-6 top-7 z-10 inline-flex h-7 items-center sm:right-8 sm:top-9">
          <HiArrowUpRight size={16} />
        </span>
      )}

      {/* Coloured symbol */}
      <span aria-hidden="true" className={`relative z-10 inline-block text-3xl font-medium ${colour}`}>
        {symbol}
      </span>

      {/* White title */}
      <h3 className="relative z-10 mt-8 text-lg font-semibold text-white sm:mt-10 sm:text-xl">
        {title}
      </h3>

      {/* Description */}
      <p className="relative z-10 mt-2 text-sm leading-relaxed text-gray-400">
        {description}
      </p>

      {/* Bhangra social links */}
      {title === "Bhangra" && (
        <div className="interest-socials relative z-30 mt-5 flex flex-wrap items-center gap-3 sm:gap-4">
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
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          aria-label={`Explore ${title}${external ? " (opens in a new tab)" : ""}`}
          className="interest-card-link absolute inset-0 z-20 rounded-2xl"
        />
      )}
    </div>
  );
}
