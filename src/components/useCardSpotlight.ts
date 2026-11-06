"use client";

import { useEffect, type RefObject } from "react";

const cardBackground = "linear-gradient(145deg, #161b27, #10141e)";

export default function useCardSpotlight<T extends HTMLElement>(ref: RefObject<T | null>, rgb: string, respectMotionPreferences = false) {
  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    const preferences = respectMotionPreferences
      ? window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)")
      : undefined;

    // Draw the same 380px spotlight directly into the card background.
    // This avoids custom-property repaint issues and stacking/overlay layers.
    function moveLight(event: MouseEvent) {
      if (!card || (preferences && !preferences.matches)) return;
      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      card.style.backgroundImage =
        `radial-gradient(380px circle at ${x}px ${y}px, rgba(${rgb}, 0.12), transparent 75%), ${cardBackground}`;
    }

    function removeLight() {
      card?.style.removeProperty("background-image");
    }

    // Capture events from the full-card link as well as other child elements.
    card.addEventListener("mousemove", moveLight, { capture: true, passive: true });
    card.addEventListener("mouseenter", moveLight, { passive: true });
    card.addEventListener("mouseleave", removeLight);
    preferences?.addEventListener("change", removeLight);

    return () => {
      card.removeEventListener("mousemove", moveLight, true);
      card.removeEventListener("mouseenter", moveLight);
      card.removeEventListener("mouseleave", removeLight);
      preferences?.removeEventListener("change", removeLight);
      removeLight();
    };
  }, [ref, rgb, respectMotionPreferences]);
}
