import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech I Use",
  description:
    "A look at the technology, hardware and software I use and enjoy.",
  alternates: {
    canonical: "/tech",
  },
  openGraph: {
    url: "/tech",
  },
};

export default function TechPage() {
  return (
    <main className="flex-1 bg-[#0B0D14] text-white">

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">

        <h1 className="text-4xl font-bold tracking-tight text-cyan-400 sm:text-5xl">
          Tech I Use
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-400">
          A look at the technology, hardware and software
          I use and enjoy.
        </p>

      </section>

    </main>
  );
}
