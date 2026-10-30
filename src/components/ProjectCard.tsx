"use client";

import { useEffect, useRef, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import { FaGithub } from "react-icons/fa6";
import ProjectShowcase from "@/components/ProjectShowcase";

type Project = {
  title: string;
  status?: string;
  category?: string;
  description: string;
  technologies: string[];
  features: string[];
  githubUrl?: string;
};

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const details = useRef<HTMLDetailsElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);
  const intendedOpen = useRef<boolean | null>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finishImmediately = () => {
      animation.current?.finish();
    };
    motion.addEventListener("change", finishImmediately);
    return () => {
      motion.removeEventListener("change", finishImmediately);
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
    animation.current?.cancel();
    intendedOpen.current = opening;
    surface.open = true;
    surface.dataset.expanded = String(opening);
    // Prevent focus entering content as it collapses; native details handles the closed state.
    content.inert = !opening;
    const end = opening ? content.scrollHeight : 0;
    const active = content.animate(
      [{ height: `${start}px`, opacity: opening ? 0.25 : 1 }, { height: `${end}px`, opacity: opening ? 1 : 0 }],
      { duration: 420, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" },
    );
    animation.current = active;
    active.onfinish = () => {
      surface.open = opening;
      delete surface.dataset.expanded;
      content.inert = false;
      intendedOpen.current = null;
      animation.current = null;
    };
  }

  function spotlight(event: PointerEvent<HTMLDetailsElement>) {
    if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div className="project-card-slot" style={{ "--project-delay": `${index * 120}ms` } as CSSProperties}>
      <ProjectShowcase>
        <details ref={details} className="project-showcase project-disclosure relative isolate overflow-hidden rounded-3xl border border-white/10" onPointerMove={spotlight}>
          <summary onClick={toggle} className="project-summary cursor-pointer list-none p-6 sm:p-10 lg:p-12">
            <span aria-hidden="true" className="project-spotlight pointer-events-none absolute inset-0 -z-10" />
            <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="min-w-0">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-violet-400">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-violet-400" />{project.status ?? project.category}
                </span>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{project.title}</h2>
                <p className="mt-4 line-clamp-2 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">{project.description}</p>
                <span className="mt-6 flex flex-wrap gap-2">
                  {project.technologies.slice(0, 4).map(tech => <span key={tech} className="project-tech rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300">{tech}</span>)}
                </span>
              </div>
              <span aria-hidden="true" className="project-motif hidden h-24 w-28 items-center justify-center rounded-2xl border border-violet-300/15 font-mono text-4xl text-violet-300/70 sm:flex">&lt;/&gt;</span>
            </div>
            <span className="mt-8 flex items-center justify-between border-t border-white/[0.08] pt-5 text-sm font-medium text-violet-300">
              <span className="project-explore">Explore project</span>
              <span aria-hidden="true" className="project-chevron inline-flex h-8 w-8 items-center justify-center rounded-full border border-violet-400/20">⌄</span>
            </span>
          </summary>
          <div ref={panel} className="project-disclosure-panel">
            <div className="project-disclosure-content px-6 pb-8 sm:px-10 sm:pb-10 lg:px-12 lg:pb-12">
              <p className="max-w-3xl leading-relaxed text-slate-400">{project.description}</p>
              <div className={`mt-8 grid gap-8 ${project.features.length ? "lg:grid-cols-2 lg:gap-12" : ""}`}>
                <div>
                  <h3 className="font-semibold">Built with</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map(tech => <li key={tech} className="project-tech rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300">{tech}</li>)}
                  </ul>
                </div>
                {project.features.length > 0 && (
                <div>
                  <h3 className="font-semibold">What I've implemented</h3>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-400 marker:text-violet-400">
                    {project.features.map(feature => <li key={feature}>{feature}</li>)}
                  </ul>
                </div>
                )}
              </div>
              {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-3 rounded-xl border border-violet-400/30 bg-violet-400/10 px-5 py-3 text-sm font-semibold text-violet-300 transition-colors hover:border-violet-400/60 hover:bg-violet-400/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-400">
                <FaGithub size={20} aria-hidden="true" />View source code<span aria-hidden="true">↗</span>
              </a>
              )}
            </div>
          </div>
        </details>
      </ProjectShowcase>
    </div>
  );
}
