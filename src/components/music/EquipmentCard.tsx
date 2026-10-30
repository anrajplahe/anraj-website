"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";

const cardBackground = "linear-gradient(145deg, #161b27, #10141e)";

type EquipmentCardProps = {
  name: string;
  specs: string[];
  icon: ReactNode;
  index: number;
};

export default function EquipmentCard({ name, specs, icon, index }: EquipmentCardProps) {
  const revealRef = useRef<HTMLLIElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    const reveal = revealRef.current;
    if (!card || !reveal) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mouse = window.matchMedia("(hover: hover) and (pointer: fine)");
    let observer: IntersectionObserver | undefined;

    // Reuse InterestCard's direct background drawing, including captured child events.
    function moveLight(event: MouseEvent) {
      if (!card || motion.matches || !mouse.matches) return;
      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      card.style.backgroundImage =
        `radial-gradient(380px circle at ${x}px ${y}px, rgba(244, 114, 182, 0.12), transparent 75%), ${cardBackground}`;
    }
    function removeLight() {
      card?.style.removeProperty("background-image");
    }
    if (!motion.matches && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        reveal.dataset.equipmentVisible = "true";
        observer?.disconnect();
      }, { threshold: 0.08 });
      reveal.dataset.equipmentVisible = "false";
      observer.observe(reveal);
    }
    function preferencesChanged() {
      removeLight();
      if (!motion.matches) return;
      observer?.disconnect();
      if (reveal) delete reveal.dataset.equipmentVisible;
    }
    card.addEventListener("mousemove", moveLight, { capture: true, passive: true });
    card.addEventListener("mouseenter", moveLight, { passive: true });
    card.addEventListener("mouseleave", removeLight);
    motion.addEventListener("change", preferencesChanged);
    mouse.addEventListener("change", preferencesChanged);
    return () => {
      observer?.disconnect();
      delete reveal.dataset.equipmentVisible;
      card.removeEventListener("mousemove", moveLight, true);
      card.removeEventListener("mouseenter", moveLight);
      card.removeEventListener("mouseleave", removeLight);
      motion.removeEventListener("change", preferencesChanged);
      mouse.removeEventListener("change", preferencesChanged);
      removeLight();
    };
  }, []);

  return (
    <li ref={revealRef} className="music-equipment-reveal min-w-0" style={{ "--equipment-delay": `${index * 110}ms` } as CSSProperties}>
      <article ref={cardRef} className="music-equipment h-full rounded-2xl border border-white/10 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-pink-400/15 bg-pink-400/[0.04] text-lg text-pink-400">{icon}</span>
          <div className="min-w-0 pt-1">
            <h4 className="text-base font-semibold leading-snug tracking-tight text-white sm:text-lg">{name}</h4>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-400">
              {specs.map(spec => <li key={spec}>{spec}</li>)}
            </ul>
          </div>
        </div>
      </article>
    </li>
  );
}
