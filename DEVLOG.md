# Development Log

This log documents the significant technical milestones, decisions, challenges and lessons from building my personal website, [anrajplahe.com](https://anrajplahe.com). It focuses on development rather than routine updates to page content.

## 12 October 2026 — Project Setup & Version Control

**What I built**
- Initialised a Next.js application with TypeScript and Tailwind CSS, and set up my development environment in Visual Studio Code.
- Connected the project to GitHub and established a workflow using feature branches, commits and pull requests.
- Created the initial project documentation, including a README and this development log.

**Challenges and lessons**
- Learned to run and test the application locally using the Next.js development server before deploying it.
- Investigated a Git error when the `origin` remote already existed and learned to inspect the repository's remote configuration.
- Encountered an untracked file blocking a branch switch. This helped me understand how Git protects local work and when to preserve changes before switching branches.
- Completed my first pull request and became more familiar with the distinction between local changes, commits, branches and merges.

## 16 October 2026 — Homepage & Frontend Foundations

**What I built**
- Replaced the Next.js starter page with a custom homepage and established a dark theme with individual accent colours for each interest.
- Built the initial hero section and interest listings using React, JSX and Tailwind CSS.
- Stored interest data in an array and rendered it with `.map()`, avoiding repeated markup.
- Integrated React Icons and links to my personal social accounts and Anahat Bhangra's contact channels.

**Decisions and lessons**
- Chose to keep the homepage focused on a few clear sections instead of introducing complex functionality immediately.
- Learned how React components, imports, conditional rendering, responsive utilities and external link types work together.
- Resolved an import issue caused by placing a component in the wrong directory, reinforcing the importance of understanding the project structure.
- Used `npm audit` to investigate dependency warnings and distinguish development-tooling issues from the production dependency audit, rather than applying potentially disruptive upgrades without checking them.

## 16 October 2026 — Production Deployment, Domain & Email

**What I built**
- Connected the GitHub repository to Vercel and published the website.
- Registered `anrajplahe.com` with IONOS and configured the domain to point to Vercel using the required DNS records.
- Set up custom-domain email with IONOS while keeping website hosting and email hosting separate.

**Challenges and decisions**
- Vercel initially reported an invalid domain configuration. I corrected the A and CNAME records in IONOS and verified that the website became accessible.
- Preserved email-related DNS records, including MX, SPF, DKIM and DMARC, so changing the website's hosting would not disrupt email.
- Chose Vercel for managed Next.js deployments while retaining IONOS for the domain, DNS and mailbox.
- When switching branches appeared to restore an older homepage, I traced the newer code to the feature branch. This clarified why work on one branch does not automatically appear on `main`.

**Milestone:** First public deployment of the website on its custom domain.

## 16 October 2026 — Website Identity & Release Workflow

**What I built**
- Configured page metadata and social-sharing information through Next.js.
- Replaced the default favicon with a custom `ap` icon generated using Next.js `ImageResponse` and the site's branding.
- Used GitHub pull requests and Vercel preview deployments to review changes before merging them into the production branch.

**Challenges and lessons**
- Investigated a pull request with no changes to compare and found that I had staged files without committing them. This reinforced the distinction between `git add`, `git commit`, `git push` and merging.
- Learned that a Vercel preview deployment is not the same as the production site: feature-branch changes only reach the live website after merging into `main`.
- Troubleshot Safari continuing to display the previous favicon after deployment and identified browser caching as a factor.

## 19 October 2026 — Responsive Design & Multi-Page Architecture

**What I built**
- Extracted the homepage interest listings into a reusable, typed `InterestCard` component with an optional navigation destination.
- Improved responsive layouts, typography and content wrapping across different screen sizes.
- Added dedicated routes for `/tech`, `/bhangra` and `/music`, using the Next.js App Router and page-specific metadata.
- Moved shared navigation and footer components into the root layout so they appear consistently across pages.
- Developed a route-aware Navbar using `usePathname()` and Next.js `Link`: the homepage keeps a centred logo, while section pages offer navigation with an active-page indicator.

**Decisions and lessons**
- Learned how typed props, reusable components, shared layouts and file-based routing reduce duplication as a site grows.
- Differentiated navigation cards from static informational layouts. In particular, I replaced clickable-looking equipment cards with simpler listings so that the appearance of an element better reflects its behaviour.
- Learned to treat responsive design as a usability problem involving layout, spacing, text wrapping and navigation, rather than just scaling down desktop elements.

## 19 October 2026 — Projects Page & Interface Refinement

**What I built**
- Created `/projects` to showcase development work, starting with the website itself.
- Used structured project data to render descriptions, technologies, implemented features and a GitHub source-code link.
- Connected the Projects section to the homepage and added GitHub to the shared footer.

**Decisions and lessons**
- Chose an editorial, non-clickable layout for project information, reserving button styling for actual actions such as opening the source repository.
- Removed the redundant link back to the website from its own project entry and removed the homepage's unnecessary “Take a look” button.
- Reinforced the importance of reducing interface clutter and keeping project data separate from its presentation so future work can be added consistently.

---

## Current State

The website has a responsive homepage, dedicated Projects, Tech, Bhangra and Guitar & Music sections, shared site navigation and footer, and a live deployment connected to GitHub. These pages are currently maintained primarily through the source code; **a backend publishing system has not yet been implemented**.

## Planned Development

The next significant feature will be a private publishing system for Bhangra and Guitar & Music content. I plan to approach it in stages:

1. **Design the public-facing post experience** — decide how written updates, photographs, guitar recordings and social media embeds should appear before coding.
2. **Introduce server-side functionality and a database** — model and store posts, then retrieve them on the public pages.
3. **Add secure administrator authentication** — restrict content management to a private dashboard.
4. **Implement content management** — create, edit, draft, publish and delete posts, with appropriate support for media.
5. **Improve reliability and delivery** — add automated testing, strengthen CI/CD and explore deployment and monitoring practices as the project grows.

These are plans, not completed features. Future log entries will focus on significant implementations, technical decisions and challenges rather than routine page-content changes or minor styling adjustments.