
import { Suspense } from "react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense
        fallback={
          <header className="w-full border-b border-white/10 bg-[#0B0D14] text-white">
            <nav className="mx-auto flex max-w-6xl items-center px-4 py-4 sm:px-6">
              <Link
                href="/"
                aria-label="Anraj Plahe homepage"
                className="text-lg font-bold tracking-tight sm:text-2xl"
              >
                <span className="text-blue-500">anraj</span>
                <span className="text-white">plahe</span>
              </Link>
            </nav>
          </header>
        }
      >
        <Navbar />
      </Suspense>

      <div className="flex w-full flex-1 flex-col">
        {children}
      </div>

      <Footer />
    </>
  );
}
