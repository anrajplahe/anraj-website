"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

export default function ProjectShowcase({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || motion.matches || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.dataset.projectVisible = "true";
      observer.disconnect();
    }, { threshold: 0.08 });

    element.dataset.projectVisible = "false";
    observer.observe(element);
    const show = () => {
      delete element.dataset.projectVisible;
      observer.disconnect();
    };
    motion.addEventListener("change", show);
    return () => {
      show();
      motion.removeEventListener("change", show);
    };
  }, []);

  return <div ref={ref} className="project-reveal">{children}</div>;
}
