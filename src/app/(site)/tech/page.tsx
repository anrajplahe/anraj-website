
import type { Metadata } from "next";
import DeviceCard from "@/components/tech/DeviceCard";

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
    <main className="tech-page flex-1 bg-[#0B0D14] text-white">

      {/* Page Introduction */}
      <section className="relative isolate mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">

        <div aria-hidden="true" className="tech-atmosphere pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem]" />

        <h1 className="tech-heading text-5xl font-semibold tracking-[-0.05em] text-green-500 sm:text-6xl md:text-7xl">
          Tech
        </h1>

        <p className="tech-introduction mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
          A look at the tech I use every day.
        </p>

        {/* Devices Section */}
        <div className="mt-16">

          <h2 className="mb-8 text-2xl font-semibold tracking-tight">
            My everyday essentials.
          </h2>

          <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
            {devices.map((device, index) => {
              const Icon = device.icon;
              return (
                <DeviceCard
                  key={device.name}
                  category={device.category}
                  name={device.name}
                  specs={device.specs}
                  icon={<Icon size={38} />}
                  index={index}
                />
              );
            })}
          </div>

        </div>

      </section>

    </main>
  );
}
