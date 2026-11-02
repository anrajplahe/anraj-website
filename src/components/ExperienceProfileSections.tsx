"use client";

import { useRef, type ReactNode } from "react";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import HomeInterestReveal from "@/components/HomeInterestReveal";
import useCardSpotlight from "@/components/useCardSpotlight";
import { education, skillCategories } from "@/data/experienceProfile";

function ProfileCard({ children }: { children: ReactNode }) {
  const card = useRef<HTMLElement>(null);
  useCardSpotlight(card, "96, 165, 250");

  return (
    <div className="home-card-reveal min-w-0">
      <article ref={card} className="interest-card h-full rounded-2xl border border-[#60A5FA]/15 p-6 sm:p-8">
        {children}
      </article>
    </div>
  );
}

export default function ExperienceProfileSections() {
  return (
    <>
      <section aria-labelledby="education-heading" className="mt-16 sm:mt-20">
        <h2 id="education-heading" className="mb-6 text-2xl font-semibold tracking-tight sm:mb-8 sm:text-3xl">Education</h2>
        <HomeInterestReveal>
          {education.map(entry => (
            <ProfileCard key={entry.institution}>
              <HiOutlineAcademicCap aria-hidden="true" size={30} className="mb-6 text-[#60A5FA]" />
              <h3 className="text-lg font-semibold text-white sm:text-xl">{entry.institution}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-300">{entry.qualification}</p>
              {entry.awarded && <p className="mt-2 text-sm text-[#60A5FA]">Awarded: {entry.awarded}</p>}
              {entry.description && <p className="mt-4 text-sm leading-relaxed text-gray-400">{entry.description}</p>}
              {entry.results.length > 0 && (
                <ul className="mt-4 space-y-2 text-sm text-gray-400">
                  {entry.results.map(result => <li key={result}>{result}</li>)}
                </ul>
              )}
            </ProfileCard>
          ))}
        </HomeInterestReveal>
      </section>

      <section aria-labelledby="skills-heading" className="mt-16 sm:mt-20">
        <h2 id="skills-heading" className="mb-6 text-2xl font-semibold tracking-tight sm:mb-8 sm:text-3xl">Skills</h2>
        <HomeInterestReveal>
          {skillCategories.map(category => (
            <ProfileCard key={category.title}>
              <h3 className="text-lg font-semibold text-white sm:text-xl">{category.title}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {category.skills.map(skill => (
                  <li key={skill} className="rounded-full border border-[#60A5FA]/20 bg-[#60A5FA]/[0.04] px-3 py-1.5 text-xs leading-relaxed text-gray-300 transition-colors hover:border-[#60A5FA]/40 hover:bg-[#60A5FA]/[0.08] motion-reduce:transition-none">{skill}</li>
                ))}
              </ul>
            </ProfileCard>
          ))}
        </HomeInterestReveal>
      </section>
    </>
  );
}
