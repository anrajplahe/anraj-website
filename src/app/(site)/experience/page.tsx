import type { Metadata } from "next";
import ActionLink from "@/components/ActionLink";
import ExperienceProfileSections from "@/components/ExperienceProfileSections";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import { experiences } from "@/data/experience";

export const metadata: Metadata = {
  title: "Experience",
  description: "The roles and experiences that have shaped my career.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return (
    <main className="flex-1 bg-[#0B0D14] text-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
        <ActionLink href="/" accent="blue" arrow="back">Back to Home</ActionLink>
        <header className="mb-10 mt-10 sm:mb-12">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Experience.</h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">The roles and experiences that have shaped my career.</p>
        </header>
        <section aria-label="Experience">
          <ExperienceTimeline experiences={experiences} />
        </section>
        <ExperienceProfileSections />
      </div>
    </main>
  );
}
