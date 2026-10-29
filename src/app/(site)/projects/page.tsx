
import type { Metadata } from "next";
import { FaGithub } from "react-icons/fa6";

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
      "The website you're currently browsing! I built this as a personal space to share my interests, document my progress and develop my software engineering skills through hands-on experience.",

    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Git",
      "GitHub",
      "Vercel",
    ],

    features: [
      "Responsive design for desktop, tablet and mobile",
      "Multiple pages using Next.js App Router",
      "Reusable React components with TypeScript",
      "Shared navigation and footer components",
      "Custom branding, favicon and metadata",
      "Automatic deployments through GitHub and Vercel",
    ],

    githubUrl: "https://github.com/anrajplahe/anraj-website",
  },
];

export default function ProjectsPage() {
  return (
    <main className="flex-1 bg-[#0B0D14] text-white">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">

        {/* Page Introduction */}
        <h1 className="text-4xl font-bold tracking-tight text-violet-400 sm:text-5xl">
          Projects
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
          Things I've built, things I'm working on and
          what I've learned along the way.
        </p>

        {/* Projects */}
        <div className="mt-16 space-y-16">

          {projects.map((project) => (
            <article
              key={project.title}
              className="max-w-4xl border-t border-white/15 pt-8"
            >

              {/* Project Status */}
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-violet-400"
                />

                <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                  {project.status}
                </span>
              </div>

              {/* Project Title */}
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {project.title}
              </h2>

              {/* Project Description */}
              <p className="mt-5 max-w-3xl leading-relaxed text-gray-400">
                {project.description}
              </p>

              {/* Technology Stack */}
              <div className="mt-10">
                <h3 className="text-base font-semibold text-white">
                  Built with
                </h3>

                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-3">
                  {project.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="border-l-2 border-violet-400/60 pl-3 text-sm text-gray-400"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Implemented Features */}
              <div className="mt-10">
                <h3 className="text-base font-semibold text-white">
                  What I've implemented
                </h3>

                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-400 marker:text-violet-400">
                  {project.features.map((feature) => (
                    <li key={feature}>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
            
            {/* Project Links */}
            <div className="mt-10">
            <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                group inline-flex items-center gap-3
                rounded-xl border border-violet-400/30
                bg-violet-400/10
                px-5 py-3
                text-sm font-semibold text-violet-300
                transition-all duration-200
                hover:border-violet-400/60
                hover:bg-violet-400/20
                hover:text-violet-200
                focus-visible:outline-2
                focus-visible:outline-offset-4
                focus-visible:outline-violet-400
                "
            >
                <FaGithub size={20} aria-hidden="true" />

                <span>View source code</span>

                <span
                aria-hidden="true"
                className="transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                >
                ↗
                </span>
            </a>
            </div>

            </article>
          ))}

        </div>

        {/* Future Projects */}
        <div className="mt-20 max-w-4xl">
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
