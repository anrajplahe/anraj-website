"use client";

import { useRef } from "react";
import HomeInterestReveal from "@/components/HomeInterestReveal";
import useCardSpotlight from "@/components/useCardSpotlight";
import type { Experience } from "@/data/experience";

function ExperienceCard({ experience }: { experience: Experience }) {
  const card = useRef<HTMLDetailsElement>(null);
  useCardSpotlight(card, "96, 165, 250");

  return (
    <details ref={card} className="interest-card experience-card card-disclosure rounded-2xl border border-white/10">
      <summary className="experience-summary list-none rounded-2xl p-6 sm:p-8">
        <span className="flex items-start justify-between gap-4">
          <span className="min-w-0">
            <span className="block text-sm font-medium text-[#60A5FA]">{experience.organisation}</span>
            <span className="mt-2 block text-lg font-semibold text-white sm:text-xl">{experience.title}</span>
            <span className="mt-2 block text-sm text-gray-400">{experience.dates}</span>
          </span>
          <span aria-hidden="true" className="experience-plus card-plus shrink-0 text-xl text-[#60A5FA]">+</span>
        </span>
        <span className="mt-4 block text-sm leading-relaxed text-gray-400">{experience.description}</span>
      </summary>
      <div className="space-y-6 px-6 pb-6 sm:px-8 sm:pb-8">
        {(["responsibilities", "achievements"] as const).map(section => experience[section].length > 0 && (
          <section key={section}>
            <h3 className="text-sm font-semibold capitalize text-white">{section}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-400 marker:text-[#60A5FA]">
              {experience[section].map(item => <li key={item}>{item}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </details>
  );
}

export default function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  if (!experiences.length) {
    return <p className="rounded-2xl border border-white/10 bg-[#10141e] p-6 text-sm leading-relaxed text-gray-400 sm:p-8">Experience details will be added here soon.</p>;
  }

  return (
    <HomeInterestReveal role="list" className="experience-timeline relative space-y-6 border-l border-[#60A5FA]/20 pl-6 sm:pl-10">
      {experiences.map(experience => (
        <div key={experience.id} role="listitem" className="home-card-reveal relative">
          <span aria-hidden="true" className="absolute -left-[29px] top-8 h-[9px] w-[9px] rounded-full bg-[#60A5FA] ring-4 ring-[#0B0D14] sm:-left-[45px]" />
          <ExperienceCard experience={experience} />
        </div>
      ))}
    </HomeInterestReveal>
  );
}
