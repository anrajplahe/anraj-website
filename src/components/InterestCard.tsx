"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import useCardSpotlight from "@/components/useCardSpotlight";
import { HiArrowUpRight } from "react-icons/hi2";

type InterestCardProps = {
  title: string;
  description: string;
  symbol: ReactNode;
  colour: string;
  href?: string;
  external?: boolean;
  layout?: "default" | "feature";
};

// Shared by the spotlight, border and keyboard focus treatment.
const spotlightRGB: Record<string, string> = {
  "text-violet-400": "192, 132, 252",
  "text-green-500": "34, 197, 94",
  "text-cyan-400": "34, 211, 238",
  "text-yellow-400": "250, 204, 21",
  "text-pink-400": "244, 114, 182",
};

const accents: Record<string, string> = {
  "text-violet-400": "interest-violet",
  "text-green-500": "interest-green",
  "text-cyan-400": "interest-cyan",
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
  layout = "default",
}: InterestCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isFeature = layout === "feature";

  useCardSpotlight(cardRef, spotlightRGB[colour] ?? "96, 165, 250");

  return (
    <div
      ref={cardRef}
      data-interactive={href ? "true" : undefined}
      className={`interest-card ${href ? "card-interactive" : "card-static"} relative isolate h-full ${isFeature ? "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 sm:gap-x-6 sm:p-8" : "min-h-[15rem]"} rounded-2xl border border-white/10 p-6 ${accents[colour] ?? ""}`}
    >
      {href && (
        <span aria-hidden="true" className={`interest-arrow pointer-events-none z-10 inline-flex h-7 items-center ${isFeature ? "col-start-3 row-start-1 row-span-2" : "absolute right-6 top-6"}`}>
          <HiArrowUpRight size={16} />
        </span>
      )}

      {/* Coloured symbol */}
      <span aria-hidden="true" className={`relative z-10 text-3xl font-medium ${isFeature ? "inline-block col-start-1 row-start-1 row-span-2" : "flex h-9 items-start leading-9"} ${colour}`}>
        {symbol}
      </span>

      {/* White title */}
      <h3 className={`relative z-10 text-lg font-semibold text-white sm:text-xl ${isFeature ? "col-start-2 row-start-1" : "mt-6"}`}>
        {title}
      </h3>

      {/* Description */}
      <p className={`relative z-10 mt-2 text-sm leading-relaxed text-gray-400 ${isFeature ? "col-start-2 row-start-2" : ""}`}>
        {description}
      </p>

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
