
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Navigation links for individual pages

const sections = [
  {
    title: "Experience",
    href: "/experience",
    activeStyle: "border-[#60A5FA]/40 bg-[#60A5FA]/10 text-[#60A5FA]",
    hoverStyle: "hover:border-[#60A5FA]/30 hover:bg-[#60A5FA]/10 hover:text-[#60A5FA]",
  },
  {
    title: "Projects",
    href: "/projects",
    activeStyle: "border-violet-400/40 bg-violet-400/10 text-violet-400",
    hoverStyle: "hover:border-violet-400/30 hover:bg-violet-400/10 hover:text-violet-400",
  },
  {
    title: "Self-Improvement",
    href: "/self-improvement",
    focusStyle: "focus-visible:outline-green-500",
    activeStyle: "border-green-500/40 bg-green-500/10 text-green-500",
    hoverStyle: "hover:border-green-500/30 hover:bg-green-500/10 hover:text-green-500",
  },
  {
    title: "Tech",
    href: "/tech",
    focusStyle: "focus-visible:outline-cyan-400",
    activeStyle: "border-cyan-400/40 bg-cyan-400/10 text-cyan-400",
    hoverStyle: "hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-400",
  },
  {
    title: "Bhangra",
    href: "/bhangra",
    activeStyle: "border-yellow-400/40 bg-yellow-400/10 text-yellow-400",
    hoverStyle: "hover:border-yellow-400/30 hover:bg-yellow-400/10 hover:text-yellow-400",
  },
  {
    title: "Music",
    href: "/music",
    activeStyle: "border-pink-400/40 bg-pink-400/10 text-pink-400",
    hoverStyle: "hover:border-pink-400/30 hover:bg-pink-400/10 hover:text-pink-400",
  },
];


export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header className="site-navbar sticky top-0 z-50 w-full border-b border-white/[0.08] text-white">
      <nav
        aria-label="Main navigation"
        className={`mx-auto flex w-full max-w-6xl px-4 sm:px-6 ${
          isHomePage
            ? "items-center justify-center py-4 sm:py-6"
            : "flex-col items-start gap-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6"
        }`}
      >
        {/* Website Logo */}
        <Link
          href="/"
          aria-label="Anraj Plahe homepage"
          className="site-logo shrink-0 rounded-md text-lg font-semibold tracking-tight transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 sm:text-2xl"
        >
          <span className="text-blue-500">anraj</span>
          <span className="text-white">plahe</span>
        </Link>

        {/* Navigation buttons - hidden on homepage */}
        {!isHomePage && (
          <div className="w-full overflow-x-auto lg:ml-auto lg:w-auto">
            <div className="flex w-max min-w-full items-center justify-end gap-2 lg:min-w-0">
              {sections.map((section) => {
                const isActive =
                  pathname === section.href ||
                  pathname.startsWith(`${section.href}/`);

                return (
              <Link
                key={section.href}
                href={section.href}
                aria-current={isActive ? "page" : undefined}
                className={`
                  shrink-0 rounded-full border
                  px-4 py-2 text-sm font-semibold

                  transition-colors duration-200
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  ${section.focusStyle ?? "focus-visible:outline-white"}
                  ${
                    isActive
                      ? section.activeStyle
                      : `border-transparent bg-transparent text-slate-400 ${section.hoverStyle}`
                  }
                `}
              >
                {section.title}
              </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
