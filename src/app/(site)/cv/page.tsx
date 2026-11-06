import type { Metadata } from "next";
import ActionLink from "@/components/ActionLink";

export const metadata: Metadata = {
  title: "CV",
  description: "My skills, qualifications and professional experience.",
  alternates: { canonical: "/cv" },
};

const publishedCVUrl = "https://docs.google.com/document/d/e/2PACX-1vRzowokfyF9iezMJqCvsFZIoeENH9Zew4j8ab1HsZ7rHknXg37nF2xz7lH3meVVOQViCcPF4OUDESpf/pub?embedded=true";

export default function CVPage() {
  return (
    <main className="flex-1 bg-[#0B0D14] text-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
        <ActionLink href="/" accent="blue" arrow="back">Back to Home</ActionLink>
        <h1 className="mb-8 mt-10 text-4xl font-semibold tracking-tight sm:text-5xl">CV.</h1>
        <iframe
          src={publishedCVUrl}
          title="Anraj Plahe — CV"
          className="block h-[85svh] min-h-[32rem] w-full rounded-2xl border border-blue-400/20 bg-white"
        />
      </div>
    </main>
  );
}
