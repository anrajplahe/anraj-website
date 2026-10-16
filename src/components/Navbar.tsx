
export default function Navbar() {
  return (
    <header className="border-b border-white/10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">

        {/* Website Logo */}
        <a href="/" className="text-2xl font-bold tracking-tight">
          anraj<span className="text-green-400">.</span>
        </a>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <a href="#about" className="transition hover:text-white">
            About
          </a>

          <a href="#interests" className="transition hover:text-white">
            Explore
          </a>
        </div>

      </nav>
    </header>
  );
}
