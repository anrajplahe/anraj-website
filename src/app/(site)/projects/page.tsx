
import ProjectCard from "@/components/ProjectCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A collection of things I've built, experimented with and learned along the way.",
  alternates: {
    canonical: "/projects",
  },
};

// Projects to showcase
const projects = [
  {
    title: "Personal Website",
    status: "Ongoing project",

    description:
      "The website you're currently browsing! A full-stack personal space for my interests and journals, with authenticated administration, rich-text publishing and media management, deployed on Vercel.",

    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
      "Neon",
      "Drizzle ORM",
      "Auth.js",
      "Tiptap",
      "Vercel Blob",
      "Git",
      "GitHub",
      "Vercel",
    ],

    features: [
      "Administrator authentication with Auth.js",
      "Journal publishing backed by PostgreSQL, Neon and Drizzle ORM",
      "Rich-text editing with Tiptap",
      "Media uploads and management with Vercel Blob",
      "Social embeds within journal content",
      "Automatic deployments through GitHub and Vercel",
    ],

    githubUrl: "https://github.com/anrajplahe/anraj-website",
  },
  {
    title: "Fortitude",
    category: "Game Development",
    description:
      "A game project developed in Python, using Pyglet for the game and Tkinter for the user interface.",
    technologies: ["Python", "Pyglet — Game", "Tkinter — User Interface"],
    features: [],
    // Add further features and a githubUrl when details are available.
  },
];

export default function ProjectsPage() {
  return (
    <main className="projects-page flex-1 bg-[#0B0D14] text-white">
      <section className="relative isolate mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">

        <div aria-hidden="true" className="projects-atmosphere pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem]" />

        {/* Page Introduction */}
        <h1 className="projects-heading text-5xl font-semibold tracking-[-0.05em] text-violet-400 sm:text-6xl md:text-7xl">
          Projects
        </h1>

        <p className="projects-description mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
          Things I've built, things I'm working on and
          what I've learned along the way.
        </p>

        {/* Projects */}
        <div className="mt-16 space-y-16">

          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}

        </div>

        {/* Future Projects */}
        <div className="mt-16 max-w-2xl border-l border-violet-400/25 pl-6 sm:mt-20">
          <h2 className="text-xl font-semibold text-white">
            More to come.
          </h2>

          <p className="mt-4 max-w-2xl leading-relaxed text-gray-400">
            I'm currently revisiting some of my previous work
            and exploring new ideas. I'll be adding more projects
            here as they're ready to share.
          </p>
        </div>

      </section>
    </main>
  );
}
