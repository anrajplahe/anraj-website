import type { Metadata } from "next";
import ActionLink from "@/components/ActionLink";
import LessonTree from "@/components/LessonTree";

export const metadata: Metadata = {
  title: "Self-Improvement",
  description: "Lessons, perspectives and ideas about life, personal growth and the people around us.",
  alternates: { canonical: "/self-improvement" },
};

export default function SelfImprovementPage() {
  return (
    <main className="self-improvement-page flex-1 bg-[#0B0D14] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
        <ActionLink href="/" accent="green" arrow="back">Back to Home</ActionLink>
        <header className="mb-12 mt-10 sm:mb-16">
          <h1 className="break-words text-4xl font-semibold tracking-tight text-green-500 sm:text-5xl md:text-6xl">Self-Improvement</h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">A collection of lessons, perspectives and ideas that have made me think differently about life, myself and the people around me.</p>
        </header>
        <LessonTree />
      </div>
    </main>
  );
}
