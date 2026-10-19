
import {
  FaLinkedinIn,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#0B0D14] text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 py-7 sm:flex-row sm:px-6 sm:py-8">

        {/* Footer Text */}
        <p className="text-sm text-gray-400">
          Built by Anraj
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-3">

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/anraj-plahe/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#191D2B] text-gray-300 transition-all duration-200 hover:-translate-y-1 hover:border-green-400/50 hover:text-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
          >
            <FaLinkedinIn size={18} />
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/anraj.plahe/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#191D2B] text-gray-300 transition-all duration-200 hover:-translate-y-1 hover:border-green-400/50 hover:text-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
          >
            <FaInstagram size={19} />
          </a>

          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@anraj.plahe"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#191D2B] text-gray-300 transition-all duration-200 hover:-translate-y-1 hover:border-green-400/50 hover:text-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
          >
            <FaTiktok size={18} />
          </a>

        </div>
      </div>
    </footer>
  );
}
