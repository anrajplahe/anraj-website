
export default function Navbar() {
  return (
    <header className="w-full border-b border-white/10 bg-[#0B0D14] text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-6">

        {/* Website Logo */}
        <a
          href="/"
          className="shrink-0 text-lg font-bold tracking-tight sm:text-2xl"
        >
          <span className="text-green-400">anraj</span>plahe
        </a>

        {/* Navigation Links */}
        <div className="flex items-center gap-3 text-xs text-gray-400 sm:gap-6 sm:text-sm">
          <a href="/#about" className="transition hover:text-white">
            About
          </a>

          <a href="/#interests" className="transition hover:text-white">
            Explore
          </a>
        </div>

      </nav>
    </header>
  );
}
