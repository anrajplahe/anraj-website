"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

export default function HomeInterestReveal({ children }: { children: ReactNode }) {
  const grid = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = grid.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || motion.matches || !("IntersectionObserver" in window)) return;

    const cards = Array.from(element.children) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.revealed = "true";
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });

    cards.forEach((card, index) => {
      card.style.setProperty("--reveal-delay", `${index * 120}ms`);
      card.dataset.revealed = "false";
      observer.observe(card);
    });
    const showAll = () => {
      observer.disconnect();
      cards.forEach((card) => { delete card.dataset.revealed; });
    };
    motion.addEventListener("change", showAll);
    return () => {
      showAll();
      motion.removeEventListener("change", showAll);
    };
  }, []);

  return <div ref={grid} className="home-interests grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">{children}</div>;
}
