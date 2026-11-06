"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { LuSprout } from "react-icons/lu";
import HomeInterestReveal from "@/components/HomeInterestReveal";
import useCardSpotlight from "@/components/useCardSpotlight";
import { books, branches, type Lesson } from "@/data/selfImprovement";

function GreenSurface({ children, className = "" }: { children: ReactNode; className?: string }) {
  const card = useRef<HTMLElement>(null);
  useCardSpotlight(card, "34, 197, 94", true);

  return (
    <article ref={card} className={`interest-card interest-green card-static rounded-2xl border border-green-500/20 p-6 text-white sm:p-8 ${className}`}>
      {children}
    </article>
  );
}

function LessonCard({ lesson }: { lesson: Lesson }) {
  const details = useRef<HTMLDetailsElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);
  const intendedOpen = useRef<boolean | null>(null);
  useCardSpotlight(details, "34, 197, 94", true);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finish = () => { if (motion.matches) animation.current?.finish(); };
    motion.addEventListener("change", finish);
    return () => {
      motion.removeEventListener("change", finish);
      animation.current?.cancel();
    };
  }, []);

  function toggle(event: MouseEvent<HTMLElement>) {
    const surface = details.current;
    const content = panel.current;
    if (!surface || !content || !content.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    const opening = !(intendedOpen.current ?? surface.open);
    const start = surface.open ? content.getBoundingClientRect().height : 0;
    const opacity = surface.open ? getComputedStyle(content).opacity : "0";
    animation.current?.cancel();
    intendedOpen.current = opening;
    surface.open = true;
    surface.dataset.expanded = String(opening);
    content.inert = !opening;
    const active = content.animate([
      { height: `${start}px`, opacity },
      { height: opening ? `${content.scrollHeight}px` : "0px", opacity: opening ? 1 : 0 },
    ], { duration: 400, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" });
    animation.current = active;
    active.onfinish = () => {
      surface.open = opening;
      delete surface.dataset.expanded;
      content.inert = false;
      intendedOpen.current = null;
      animation.current = null;
    };
  }

  return (
    <details ref={details} className="interest-card interest-green growth-lesson card-disclosure rounded-2xl border border-green-500/20 text-white">
      <summary onClick={toggle} className="growth-summary list-none rounded-2xl p-5 sm:p-6">
        <span className="flex items-center justify-between gap-4 text-green-500">
          <span className="text-xs font-semibold uppercase tracking-widest">Lesson {String(lesson.number).padStart(2, "0")}</span>
          <span aria-hidden="true" className="growth-plus card-plus text-xl font-light">+</span>
        </span>
        <h4 className="mt-4 text-lg font-semibold leading-snug text-white">{lesson.title}</h4>
        <p className="mt-3 text-xs leading-relaxed text-gray-400">{books[lesson.book].title}</p>
      </summary>
      <div ref={panel} className="growth-panel">
        <div className="space-y-4 px-5 pb-5 text-sm leading-7 text-gray-400 sm:px-6 sm:pb-6">
          {lesson.reflection.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
    </details>
  );
}

export default function LessonTree() {
  return (
    <>
      <section aria-labelledby="learning-heading">
        <div className="growth-tree">
          <GreenSurface className="growth-root relative mx-auto max-w-sm text-center">
            <LuSprout aria-hidden="true" size={36} strokeWidth={1.5} className="mx-auto text-green-500" />
            <h2 id="learning-heading" className="mt-4 text-xl font-semibold text-white">Always Learning</h2>
            <p className="mt-2 text-sm text-gray-400">Growing one lesson at a time</p>
          </GreenSurface>
          <HomeInterestReveal className="growth-branches relative mt-8 grid gap-6 lg:grid-cols-3">
            {branches.map(branch => (
              <section key={branch.id} aria-labelledby={`branch-${branch.id}`} className="home-card-reveal growth-branch relative min-w-0">
                <h3 id={`branch-${branch.id}`} className="text-lg font-semibold text-green-500 lg:text-center">{branch.title}</h3>
                <HomeInterestReveal className="mt-5 space-y-4">
                  {branch.lessons.map(lesson => (
                    <div key={lesson.number} className="home-card-reveal">
                      <LessonCard lesson={lesson} />
                    </div>
                  ))}
                </HomeInterestReveal>
              </section>
            ))}
          </HomeInterestReveal>
        </div>
      </section>

      <section aria-labelledby="books-heading" className="mt-20 sm:mt-24">
        <h2 id="books-heading" className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Books behind the lessons.</h2>
        <p className="mt-4 text-sm leading-relaxed text-gray-400 sm:text-base">Ideas worth keeping, questioning and coming back to.</p>
        <HomeInterestReveal className="mt-8 grid auto-rows-fr gap-4 sm:grid-cols-2 sm:gap-5">
          {Object.entries(books).map(([id, book]) => (
            <div key={id} className="home-card-reveal h-full min-w-0">
              <GreenSurface className="growth-book h-full">
                <HiOutlineBookOpen aria-hidden="true" size={30} className="text-green-500" />
                <h3 className="mt-5 text-lg font-semibold leading-snug text-white sm:text-xl">{book.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">{book.authors}</p>
              </GreenSurface>
            </div>
          ))}
        </HomeInterestReveal>
      </section>

      <section aria-labelledby="more-heading" className="mt-16 border-t border-green-500/15 pt-8 sm:mt-20">
        <h2 id="more-heading" className="text-xl font-semibold text-white">More to come.</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-400">A growing collection as I read, reflect and learn new things.</p>
      </section>
    </>
  );
}
