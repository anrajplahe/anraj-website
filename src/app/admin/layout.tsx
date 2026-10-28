import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="w-full border-b border-white/10 bg-[#0B0D14]">
        <nav
          aria-label="Admin navigation"
          className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6"
        >
          <Link
            href="/admin"
            className="text-lg font-bold tracking-tight transition-opacity hover:opacity-80 sm:text-xl"
          >
            <span className="text-blue-500">anraj</span>
            <span className="text-white">plahe</span>
            <span className="ml-2 font-normal text-gray-500">
              / admin
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm text-gray-400 transition-colors hover:text-blue-500"
          >
            View website ↗
          </Link>
        </nav>
      </header>

      <div className="flex w-full flex-1 flex-col">
        {children}
      </div>
    </>
  );
}
