
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Navigation links for individual pages

const sections = [
  {
    title: "Projects",
    href: "/projects",
    activeStyle: "border-violet-400 bg-violet-400",
    hoverStyle: "hover:border-violet-400 hover:bg-violet-400",
  },
  {
    title: "Tech I Use",
    href: "/tech",
    activeStyle: "border-cyan-400 bg-cyan-400",
    hoverStyle: "hover:border-cyan-400 hover:bg-cyan-400",
  },
  {
    title: "Bhangra",
    href: "/bhangra",
    activeStyle: "border-yellow-400 bg-yellow-400",
    hoverStyle: "hover:border-yellow-400 hover:bg-yellow-400",
  },
  {
    title: "Guitar & Music",
    href: "/music",
    activeStyle: "border-pink-400 bg-pink-400",
    hoverStyle: "hover:border-pink-400 hover:bg-pink-400",
  },
];


export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header className="w-full border-b border-white/10 bg-[#0B0D14] text-white">
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
          className="shrink-0 text-lg font-bold tracking-tight transition-opacity hover:opacity-80 sm:text-2xl"
        >
          <span className="text-green-400">anraj</span>
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
                  shrink-0 rounded-lg border
                  px-4 py-2 text-sm font-semibold
                  text-[#0B0D14]
                  transition-colors duration-200
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-white
                  ${
                    isActive
                      ? section.activeStyle
                      : `border-gray-400 bg-gray-400 ${section.hoverStyle}`
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
