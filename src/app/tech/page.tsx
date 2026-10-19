
import type { Metadata } from "next";

import {
  FaMobileScreenButton,
  FaLaptop,
  FaHeadphones,
} from "react-icons/fa6";

export const metadata: Metadata = {
  title: "Tech",
  description:
    "A look at the tech I use every day.",
  alternates: {
    canonical: "/tech",
  },
};

// Devices I currently use

const devices = [
  {
    category: "Phone",
    name: "iPhone 16 Pro Max",
    icon: FaMobileScreenButton,
    specs: [
      "A18 Pro chip (6-core CPU, 6-core GPU, 16-core Neural Engine)",
      "8GB RAM",
      "256GB storage",
      "6.9-inch Super Retina XDR OLED display | 2868 × 1320 resolution | 460 PPI | ProMotion up to 120Hz | 2,000 nits peak outdoor brightness",
      "48MP Fusion camera, 48MP Ultra Wide, and 12MP 5x Telephoto"
    ],
  },
  {
    category: "Laptop",
    name: "MacBook Pro",
    icon: FaLaptop,
    specs: [
      "Apple M3 Pro chip - 11-core CPU (5 performance cores and 6 efficiency cores), 14-core GPU and 6-core Neural Engine",
      "18GB unified memory",
      "512GB SSD",
      "14.2-inch Liquid Retina XDR display | 3024 × 1964 resolution | 254 PPI | ProMotion up to 120Hz | 1,600 nits peak HDR brightness",
    ],
  },
  {
    category: "Headphones",
    name: "AirPods Pro 2",
    icon: FaHeadphones,
    specs: [
      "Apple H2 chip",
      "Active Noise Cancellation",
      "Transparency mode",
    ],
  },
];


export default function TechPage() {
  return (
    <main className="flex-1 bg-[#0B0D14] text-white">

      {/* Page Introduction */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">

        <h1 className="text-4xl font-bold tracking-tight text-cyan-400 sm:text-5xl">
          Tech
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
          A look at the tech I use every day.
        </p>

        {/* Devices Section */}
        <div className="mt-16">

          <h2 className="mb-8 text-2xl font-bold">
            My everyday essentials.
          </h2>

            <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => {
                const Icon = device.icon;

                return (
                <div
                    key={device.name}
                    className="border-t border-white/15 pt-6"
                >
                    {/* Device Heading */}
                    <div className="flex items-start gap-4">
                    <Icon
                        size={26}
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-cyan-400"
                    />

                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                        {device.category}
                        </p>

                        <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
                        {device.name}
                        </h3>
                    </div>
                    </div>

                    {/* Device Specifications */}
                    <ul className="mt-4 space-y-2">
                    {device.specs.map((spec) => (
                        <li
                        key={spec}
                        className="flex items-start gap-4 text-sm leading-relaxed text-gray-400"
                        >
                        {/* Cyan Bullet */}
                        <span
                            aria-hidden="true"
                            className="flex w-[26px] shrink-0 justify-center text-cyan-400"
                        >
                            •
                        </span>

                        {/* Specification */}
                        <span className="min-w-0">
                            {spec}
                        </span>
                        </li>
                    ))}
                    </ul>
                </div>
                );
            })}
            </div>

        </div>

      </section>

    </main>
  );
}
