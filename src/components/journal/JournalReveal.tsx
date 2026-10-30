"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";

const cardBackground = "linear-gradient(145deg, #161b27, #10141e)";

type Props = {
  category: "bhangra" | "music";
  index: number;
  featured?: boolean;
  children: ReactNode;
};

export default function JournalReveal({ category, index, featured = false, children }: Props) {
  const revealRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const reveal = revealRef.current;
    const card = cardRef.current;
    if (!reveal || !card) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mouse = window.matchMedia("(hover: hover) and (pointer: fine)");
    const rgb = category === "bhangra" ? "250, 204, 21" : "244, 114, 182";
    let observer: IntersectionObserver | undefined;

    // The working InterestCard technique: paint directly into the background.
    function moveLight(event: MouseEvent) {
      if (!card || motion.matches || !mouse.matches) return;
      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      card.style.backgroundImage =
        `radial-gradient(380px circle at ${x}px ${y}px, rgba(${rgb}, 0.12), transparent 75%), ${cardBackground}`;
    }
    function removeLight() {
      card?.style.removeProperty("background-image");
    }
    if (!motion.matches && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        reveal.dataset.journalVisible = "true";
        observer?.disconnect();
      }, { threshold: 0.05 });
      reveal.dataset.journalVisible = "false";
      observer.observe(reveal);
    }
    function preferencesChanged() {
      removeLight();
      if (!motion.matches) return;
      observer?.disconnect();
      if (reveal) delete reveal.dataset.journalVisible;
    }
    card.addEventListener("mousemove", moveLight, { capture: true, passive: true });
    card.addEventListener("mouseenter", moveLight, { passive: true });
    card.addEventListener("mouseleave", removeLight);
    motion.addEventListener("change", preferencesChanged);
    mouse.addEventListener("change", preferencesChanged);
    return () => {
      observer?.disconnect();
      delete reveal.dataset.journalVisible;
      card.removeEventListener("mousemove", moveLight, true);
      card.removeEventListener("mouseenter", moveLight);
      card.removeEventListener("mouseleave", removeLight);
      motion.removeEventListener("change", preferencesChanged);
      mouse.removeEventListener("change", preferencesChanged);
      removeLight();
    };
  }, [category]);

  return (
    <div ref={revealRef} className="journal-preview-reveal min-w-0" style={{ "--journal-delay": `${index * 110}ms` } as CSSProperties}>
      <article ref={cardRef} className={`journal-preview-card h-full rounded-3xl border border-white/10 ${featured ? "p-5 sm:p-7 lg:p-8" : "p-5 sm:p-6"}`}>
        {children}
      </article>
    </div>
  );
}
