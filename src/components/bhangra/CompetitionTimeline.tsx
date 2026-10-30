"use client";

import { useEffect, useRef, type CSSProperties, type MouseEvent } from "react";
import ActionLink from "@/components/ActionLink";
import { FaYoutube } from "react-icons/fa6";

type Entry = {
  team: string;
  competition: string;
  role?: "Captain" | "Coach";
  placing?: "1st Place" | "2nd Place" | "3rd Place";
  vardiColour?: "Black" | "Yellow" | "Blue" | "Red";
  youtubeUrl?: string;
};
type TimelineProps = {
  history: { year: number; entries: Entry[] }[];
  placingColours: Record<NonNullable<Entry["placing"]>, string>;
  vardiColours: Record<NonNullable<Entry["vardiColour"]>, string>;
};
const cardBackground = "linear-gradient(145deg, #161b27, #10141e)";

export default function CompetitionTimeline({ history, placingColours, vardiColours }: TimelineProps) {
  const timelineRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const root = timelineRef.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!root || motion.matches || !("IntersectionObserver" in window)) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-timeline-item]"));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.timelineVisible = "true";
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    items.forEach(item => {
      item.dataset.timelineVisible = "false";
      observer.observe(item);
    });
    const showAll = () => {
      observer.disconnect();
      items.forEach(item => { delete item.dataset.timelineVisible; });
    };
    motion.addEventListener("change", showAll);
    return () => {
      showAll();
      motion.removeEventListener("change", showAll);
    };
  }, []);

  // InterestCard's working direct-background technique, including capture from links.
  function moveLight(event: MouseEvent<HTMLElement>) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    card.style.backgroundImage =
      `radial-gradient(380px circle at ${x}px ${y}px, rgba(250, 204, 21, 0.12), transparent 75%), ${cardBackground}`;
  }

  return (
    <ol ref={timelineRef} className="mt-10 list-none columns-1 md:columns-2 md:gap-7">
      {history.map(year => (
        <li key={year.year} className="mb-10 inline-block w-full min-w-0 break-inside-avoid align-top md:mb-12">
          <div data-timeline-item className="bhangra-timeline-reveal">
            <h3 id={`bhangra-year-${year.year}`} className="font-mono text-lg font-medium tracking-tight text-yellow-400">{year.year}</h3>
          </div>
          <ul aria-labelledby={`bhangra-year-${year.year}`} className="mt-4 min-w-0 list-none space-y-4">
            {year.entries.map((entry, index) => (
              <li key={`${entry.team}-${entry.competition}`} data-timeline-item className="bhangra-timeline-reveal" style={{ "--timeline-delay": `${(index + 1) * 120}ms` } as CSSProperties}>
                <article
                  className="bhangra-competition rounded-2xl border border-white/10 p-5 sm:p-6"
                  onMouseMoveCapture={moveLight}
                  onMouseEnter={moveLight}
                  onMouseLeave={event => event.currentTarget.style.removeProperty("background-image")}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-medium tracking-wide text-slate-400">{entry.competition}</p>
                    {entry.placing && <span className={`rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold ${placingColours[entry.placing]}`}>{entry.placing}</span>}
                  </div>
                  <h4 className="mt-3 text-base font-semibold leading-relaxed tracking-tight text-white sm:text-lg">{entry.team}</h4>
                  {entry.role && <p className="mt-1 text-xs font-medium text-yellow-400/80">{entry.role}</p>}
                  {(entry.vardiColour || entry.youtubeUrl) && (
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-white/[0.06] pt-4">
                      {entry.vardiColour && <span className="inline-flex items-center gap-2 text-xs text-slate-400">
                        <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full border border-white/40" style={{ backgroundColor: vardiColours[entry.vardiColour] }} />
                        {entry.vardiColour}
                      </span>}
                      {entry.youtubeUrl && <ActionLink href={entry.youtubeUrl} external accent="yellow" arrow="diagonal" tone="neutral"
                        aria-label={`Watch ${entry.team}'s performance at ${entry.competition} (${year.year})`}
                        className="bhangra-performance">
                        <FaYoutube size={18} className="text-red-500" aria-hidden="true" />
                        {entry.role === "Coach" ? "Watch team performance" : "Watch performance"}
                      </ActionLink>}
                    </div>
                  )}
                </article>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
