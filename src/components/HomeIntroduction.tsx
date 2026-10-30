"use client";

import { useLayoutEffect, useState } from "react";

const greeting = "Hi, I'm Anraj.";

export default function HomeIntroduction() {
  // Server and first client render both contain the complete, static heading.
  const [letters, setLetters] = useState(greeting.length);
  const [animated, setAnimated] = useState(false);

  useLayoutEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;
    const finish = () => {
      cancelled = true;
      clearTimeout(timer);
      setLetters(greeting.length);
      setAnimated(false);
    };
    if (!motion.matches) {
      setAnimated(true);
      setLetters(0);
      let count = 0;
      const type = () => {
        if (cancelled) return;
        count += 1;
        setLetters(count);
        if (count < greeting.length) {
          timer = setTimeout(type, [50, 55, 48, 60][count % 4]);
        }
      };
      timer = setTimeout(type, 55);
    }
    motion.addEventListener("change", finish);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      motion.removeEventListener("change", finish);
    };
  }, []);

  const typing = animated && letters < greeting.length;

  return (
    <div className="relative z-10" data-hero-animated={animated} data-typing={typing}>
      <h1 className="home-intro max-w-5xl text-[clamp(2.5rem,6.5vw,5rem)] font-semibold leading-[1.08] tracking-[-0.055em]">
        <span className="sr-only">{greeting}</span>
        <span aria-hidden="true" className="hero-greeting relative inline-block whitespace-nowrap">
          <span className="invisible">Hi, I'm <span className="text-blue-500">Anraj</span>.</span>
          <span className="hero-typed absolute inset-0">
            {greeting.slice(0, Math.min(letters, 8))}
            <span className="text-blue-500">{greeting.slice(8, Math.min(letters, 13))}</span>
            {letters > 13 ? "." : ""}
            {typing && <span className="hero-cursor" />}
          </span>
        </span>
        <span className="hero-subtitle mt-4 block text-slate-400">
          Here's a little bit about me.
        </span>
      </h1>
      <p className="home-description mt-7 max-w-xl text-base leading-relaxed text-slate-400 sm:mt-9 sm:text-lg">
        I'm passionate about software, technology, Bhangra and music.
        This is my space to share what I'm building, learning and
        enjoying along the way.
      </p>
    </div>
  );
}
