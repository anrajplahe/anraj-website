"use client";

import { useEffect, useRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";

const cardBackground = "linear-gradient(145deg, #161b27, #10141e)";

type DeviceCardProps = {
  category: string;
  name: string;
  specs: string[];
  icon: ReactNode;
  index: number;
};

export default function DeviceCard({ category, name, specs, icon, index }: DeviceCardProps) {
  const revealRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDetailsElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);
  const intendedOpen = useRef<boolean | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    const reveal = revealRef.current;
    if (!card || !reveal) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mouse = window.matchMedia("(hover: hover) and (pointer: fine)");
    let observer: IntersectionObserver | undefined;

    // Reuse InterestCard's direct background drawing and capture-phase listeners.
    function moveLight(event: globalThis.MouseEvent) {
      if (!card || motion.matches || !mouse.matches) return;
      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      card.style.backgroundImage =
        `radial-gradient(380px circle at ${x}px ${y}px, rgba(34, 197, 94, 0.12), transparent 75%), ${cardBackground}`;
    }
    function removeLight() {
      card?.style.removeProperty("background-image");
    }
    if (!motion.matches && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        reveal.dataset.deviceVisible = "true";
        observer?.disconnect();
      }, { threshold: 0.08 });
      reveal.dataset.deviceVisible = "false";
      observer.observe(reveal);
    }
    function preferencesChanged() {
      removeLight();
      if (!motion.matches) return;
      observer?.disconnect();
      delete reveal!.dataset.deviceVisible;
      animation.current?.finish();
    }
    card.addEventListener("mousemove", moveLight, { capture: true, passive: true });
    card.addEventListener("mouseenter", moveLight, { passive: true });
    card.addEventListener("mouseleave", removeLight);
    motion.addEventListener("change", preferencesChanged);
    mouse.addEventListener("change", preferencesChanged);
    return () => {
      observer?.disconnect();
      delete reveal.dataset.deviceVisible;
      animation.current?.cancel();
      card.removeEventListener("mousemove", moveLight, true);
      card.removeEventListener("mouseenter", moveLight);
      card.removeEventListener("mouseleave", removeLight);
      motion.removeEventListener("change", preferencesChanged);
      mouse.removeEventListener("change", preferencesChanged);
      removeLight();
    };
  }, []);

  function toggle(event: MouseEvent<HTMLElement>) {
    const card = cardRef.current;
    const panel = panelRef.current;
    if (!card || !panel || !panel.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    const opening = !(intendedOpen.current ?? card.open);
    const start = card.open ? panel.getBoundingClientRect().height : 0;
    const opacity = card.open ? getComputedStyle(panel).opacity : "0";
    animation.current?.cancel();
    intendedOpen.current = opening;
    card.open = true;
    card.dataset.expanded = String(opening);
    panel.inert = !opening;
    const active = panel.animate([
      { height: `${start}px`, opacity },
      { height: opening ? `${panel.scrollHeight}px` : "0px", opacity: opening ? 1 : 0 },
    ], { duration: 400, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" });
    animation.current = active;
    active.onfinish = () => {
      card.open = opening;
      delete card.dataset.expanded;
      panel.inert = false;
      intendedOpen.current = null;
      animation.current = null;
    };
  }

  // Preview existing specifications only; the complete, unchanged list is below.
  const preview = specs.length > 3 ? specs.slice(1, 3) : specs.slice(0, 2);

  return (
    <div ref={revealRef} className="tech-device-reveal min-w-0" style={{ "--device-delay": `${index * 120}ms` } as CSSProperties}>
      <details ref={cardRef} className="tech-device relative isolate rounded-3xl border border-white/10">
        <summary onClick={toggle} className="tech-device-summary cursor-pointer list-none rounded-3xl p-6 sm:p-7">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-green-500">{category}</span>
          <span aria-hidden="true" className="my-7 flex h-20 w-20 items-center justify-center rounded-2xl border border-green-500/15 bg-green-500/[0.04] text-green-500">{icon}</span>
          <h3 className="text-xl font-semibold tracking-tight text-white">{name}</h3>
          <span className="mt-4 block min-h-14 space-y-1 text-sm leading-relaxed text-slate-400">
            {preview.map(spec => <span key={spec} className="block">{spec}</span>)}
          </span>
          <span className="mt-7 flex items-center justify-between gap-3 border-t border-white/[0.08] pt-5 text-xs font-medium text-green-400">
            <span>View specifications</span>
            <span aria-hidden="true" className="tech-device-plus text-xl font-light">+</span>
          </span>
        </summary>
        <div ref={panelRef} className="tech-device-panel">
          <div className="px-6 pb-7 sm:px-7">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-300">Specifications</h4>
            <ul className="divide-y divide-white/[0.06]">
              {specs.map(spec => <li key={spec} className="py-3 text-sm leading-relaxed text-slate-400 first:pt-0 last:pb-0">{spec}</li>)}
            </ul>
          </div>
        </div>
      </details>
    </div>
  );
}
