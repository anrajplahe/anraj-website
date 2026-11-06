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

**---**

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

## 20 October 2026 — PostgreSQL Database Integration

### What I built

I began transitioning my personal website from a static frontend into a full-stack application by setting up the database foundation for a future journal publishing system.

- Created a PostgreSQL development database using Neon.
- Integrated Drizzle ORM with Next.js and TypeScript.
- Defined two relational tables: `posts` for journal entries and `post_media` for photographs and video references.
- Used database enums, UUID primary keys, foreign keys and indexes.
- Designed the schema to support both Bhangra and Guitar & Music journals through a shared database.
- Separated user-selected journal dates and optional times from automatic creation and publication timestamps.
- Generated and applied my first SQL migration using Drizzle Kit.
- Configured a reusable, server-side database connection.
- Verified the database connection through a temporary Next.js Route Handler.
- Stored database credentials in `.env.local`, excluded from Git.

### Technical Decisions

**One shared database**

Rather than maintaining separate databases for each journal, I chose a shared relational structure with categories to distinguish posts. This avoids duplicated backend logic and makes the system easier to maintain and extend.

**Historical journal ordering**

Journal entries will be ordered by their manually selected date and optional time, rather than when they were created or published. This will allow me to add older experiences retrospectively while preserving chronological order.

**Development and production separation**

I created a dedicated development database so that future experiments and schema changes can be tested independently of production data.

### Challenges and Lessons Learned

**Database migrations**

I learned how Drizzle translates TypeScript schema definitions into SQL migrations and how migrations provide a version-controlled way to manage database structure.

**Next.js Route Handlers**

While testing the connection, I encountered a build error because an explicit runtime declaration was incompatible with the project's Next.js `cacheComponents` configuration.

Removing the unnecessary runtime declaration resolved the issue. I was then able to query both PostgreSQL tables successfully from server-side code.

### What I Learned

- Relational database design and table relationships.
- Integrating PostgreSQL with a Next.js application.
- Defining database schemas using Drizzle ORM and TypeScript.
- Generating and applying database migrations.
- Managing database credentials using environment variables.
- Using Next.js Route Handlers for server-side functionality.
- Separating development infrastructure from production.

**Milestone:** The development database is configured, its initial schema has been migrated, and connectivity from Next.js has been verified. At this stage, authentication, content publishing and public journal queries had not yet been implemented.

## 21 October 2026 — Administrator Authentication & Access Control

**What I built**

- Integrated Auth.js v5 with GitHub OAuth to introduce authentication into the Next.js application.
- Created a private administrator login page and dashboard using the App Router.
- Restricted sign-in to my approved GitHub account using its numeric account ID.
- Implemented JWT-based sessions, server-side authorisation checks and sign-out functionality.
- Configured authentication credentials through environment variables rather than storing secrets in source code.

**Challenges and lessons**

- Learned how OAuth redirects, authentication callbacks and sessions work together.
- Used TypeScript type guards to safely access custom session properties.
- Encountered a Next.js 16 prerendering error caused by cryptographic operations during static rendering. Resolved this using `connection()` and React `Suspense` to ensure authentication is evaluated at request time.
- Learned the distinction between authentication (verifying identity) and authorisation (determining who can access protected functionality).
- Established the importance of securing individual server-side operations, not just protecting the dashboard interface.

**Milestone:** GitHub authentication, session management and the protected admin dashboard have been implemented and tested locally. Production configuration and deployment remain to be completed.

## 21 October 2026 — Admin Dashboard & Database Integration

**What I built**
- Reorganised the Next.js application using Route Groups to separate public pages from the administrator interface without changing existing URLs.
- Introduced dedicated public and admin layouts while preserving the website's shared styling and branding.
- Connected the administrator dashboard to the Neon PostgreSQL database using Drizzle ORM.
- Implemented database queries for journal statistics, including total entries, published posts and drafts.
- Added server-side search, category filtering, publication status filtering and chronological sorting.
- Created an empty state for when no journal entries exist.

**Challenges and lessons**
- Learned how nested layouts and Route Groups work in the Next.js App Router.
- Resolved duplicate navigation and footer components caused by rendering them in multiple layouts.
- Used URL search parameters to implement bookmarkable filters without unnecessary client-side state.
- Learned how to construct conditional database queries and combine filtering, sorting and aggregation.
- Ensured database queries only execute after checking the administrator's session and permissions.

**Milestone:** Implemented and tested a database-connected administrator dashboard with working statistics, search, filtering and sorting. Journal creation and editing functionality will be developed next.

## 21 October 2026 — Journal Editor, Autosaving & Publishing

### Overview

Implemented a database-backed journal editor for the Bhangra and Guitar & Music sections of the website. The system now supports creating, editing and automatically saving drafts, alongside explicit publishing and draft deletion.

### Implementation

- **Rich-text editor:** Integrated Tiptap with support for bold, italic, underline, strikethrough, ordered and unordered lists, hyperlinks, undo and redo. Added contextual toolbar highlighting and custom hyperlink controls.
- **Automatic draft saving:** Implemented debounced autosaving using React state and Next.js Server Actions. Changes are persisted to Neon PostgreSQL after a short period of inactivity.
- **Save coordination:** Introduced a queue for asynchronous save operations to prevent older requests from overwriting newer changes. Added save-status feedback and warnings for potentially unsaved changes.
- **Draft lifecycle:** Added manual Save draft, Publish and Discard draft actions. Drafts can be reopened from the admin dashboard, with their existing content and formatting restored.
- **Database migration:** Updated the Drizzle schema to permit nullable journal dates for drafts, while enforcing a valid date before publication. Adjusted dashboard ordering to place undated drafts after dated entries.
- **Security and validation:** Protected database mutations with server-side administrator authentication and added validation for journal fields, rich-text content and hyperlink URLs.

### Challenges & Learning

A key challenge was managing asynchronous persistence without introducing race conditions or losing recent edits. This involved coordinating pending save requests, ensuring navigation waits for outstanding changes, and accounting for browser limitations when closing a tab.

Implementing the rich-text editor also provided experience with structured JSON documents, React state synchronisation and extending third-party editor functionality.

The distinction between saving and publishing was maintained throughout: autosaving can update drafts but cannot publish them automatically.

### Outcome & Next Steps

The admin dashboard now supports a working draft-to-publication workflow backed by PostgreSQL.

Next steps include supporting revisions to published entries, adding image and video management, and displaying published journal content on the public-facing pages. Production deployment will follow separate database configuration and testing.

## 26 October 2026 — Published Journal Revisions & Editor State Management

### What I Built

Extended the journal publishing system to support editing previously published entries without immediately affecting their published content.

- Added the ability to reopen and edit published journal entries through the admin dashboard.
- Introduced a nullable `pending_revision` JSONB column in PostgreSQL to store unpublished changes separately from the published entry.
- Implemented autosaving for published-entry revisions, preserving changes to titles, categories, rich-text content, journal dates and times.
- Added **Save draft**, **Publish changes** and **Discard changes** functionality for published entries.
- Reused the existing Tiptap editor and journal form for both new drafts and published entries.
- Added dashboard indicators for published entries with outstanding unpublished changes.
- Implemented server-side actions to save, publish and discard revisions while enforcing administrator authorisation.

### Technical Decisions

**Separating published content from unpublished revisions**

Rather than allowing autosaving to update published records directly, I introduced a separate revision field. This ensures that unfinished changes cannot unintentionally replace published content.

The revision workflow follows three distinct operations:

- **Save draft:** Persist the latest changes while preserving the published version.
- **Publish changes:** Apply the revised content to the published entry and clear the pending revision.
- **Discard changes:** Remove the unpublished revision without deleting or modifying the published entry.

**Reusing existing components**

Instead of maintaining separate editors for draft and published content, I extended the existing editor to support both workflows. This reduced duplication and kept formatting, validation and autosaving behaviour consistent.

### Challenges & Lessons Learned

**Asynchronous state and persistence**

During testing, I encountered an issue where changes to published entries were not consistently persisted.

Investigating the problem highlighted the importance of synchronising React state with asynchronous save operations. I refined how the editor tracks its latest field values and coordinates database updates so that save actions operate on the intended content.

**React state preservation in Next.js 16**

A further issue occurred when reopening an entry after saving or publishing changes. The editor initially worked but subsequently became uneditable.

This was related to temporary editing state being retained across navigation, including flags used to prevent conflicting

## 26 October 2026 — Journal Media Management: Video Embeds & Image Uploads

### What I Built

Extended the journal publishing system to support multimedia content, allowing entries to contain photographs and embedded YouTube videos alongside rich-text content.

**YouTube Video Embeds**
- Implemented support for adding YouTube videos through validated URLs.
- Added video previews and removal controls within the journal editor.
- Integrated video references with PostgreSQL persistence and the existing autosave system.
- Ensured video changes to published entries remain unpublished until explicitly applied.
- Tested video persistence across draft saving, publication, editing and discarding changes.

**Image Uploads**
- Integrated Vercel Blob for cloud-based image storage.
- Added support for uploading images directly from the journal editor.
- Implemented image previews and support for captions and alternative text.
- Connected uploaded files to database records in Neon PostgreSQL.
- Added server-side upload handling and administrator authorisation.
- Integrated the image-upload functionality with the existing journal media management interface.

### Technical Decisions

**Separating file storage from database storage**

Rather than storing images directly in PostgreSQL, I chose to use Vercel Blob for file storage and Neon PostgreSQL for structured media records.

This separates two responsibilities:

- **Vercel Blob:** Stores the actual image files.
- **PostgreSQL:** Stores the references and metadata required to associate media with journal entries.

This approach makes the system more maintainable and avoids storing large binary files within the relational database.

**Maintaining the existing publishing workflow**

Media management was designed around the existing draft and published-revision system. Changes to media on published entries must remain separate from their published state until explicitly applied.

This maintains consistency between written content and associated media.

### Challenges & Lessons Learned

**Debugging failed image uploads**

During implementation, image uploads initially failed with a generic error message, making it difficult to determine the underlying cause.

I investigated the Vercel Blob configuration, local development credentials and upload handling before obtaining a more specific error indicating that the required database table was missing.

The application was attempting to create an image-upload record in a table that had not yet been created.

**Database migration management**

Codex had prepared the required database migration, but it had not been applied automatically.

After reviewing the migration, I applied it to the Neon development database using Drizzle Kit. This resolved the missing-table error and allowed image uploads to work.

This reinforced the distinction between:

- Defining a database schema in application code.
- Generating the SQL migration.
- Applying the migration to the actual database.

I also gained experience debugging functionality spanning multiple services, where a frontend upload error can originate from the database rather than the file-storage provider itself.

**Using Codex for development**

I began using OpenAI Codex to assist with implementing features spanning multiple files.

I maintained control over architectural decisions, environment configuration, migrations and Git operations while using Codex to inspect existing code and assist with implementation.

This introduced a more structured workflow involving implementation plans, code review, local testing and controlled changes.

### Outcome

The journal editor now supports rich-text entries, YouTube embeds and cloud-hosted image uploads.

YouTube functionality has been tested across the publishing lifecycle, and image uploading is operational following the database migration fix.

### Next Steps

- Implement drag-and-drop ordering for images and YouTube videos.
- Add cover-image selection for journal entries.
- Complete regression testing of image persistence across published revisions.
- Develop the public-facing Bhangra and Guitar & Music journal displays.
- Configure separate production infrastructure before deploying the publishing system.

### Documentation & Resources

- [Vercel Blob Documentation](https://vercel.com/docs/vercel-blob)
- [Vercel Blob Client Uploads](https://vercel.com/docs/vercel-blob/client-upload)
- [Drizzle ORM — Migrations](https://orm.drizzle.team/docs/migrations)
- [Next.js — Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
- [YouTube Embedded Players](https://developers.google.com/youtube/iframe_api_reference)
- [OpenAI Codex](https://developers.openai.com/codex/)

## 28 October 2026 — Media Ordering, Cover Selection & Visual Consistency

**What I built**

- Extended the journal media editor with drag-and-drop ordering of uploaded images and social media embeds using dnd-kit.
- Added cover-image selection, storing it separately from the overall media order.
- Preserved image captions and alternative text as part of the media editing experience.
- Improved feedback and responsive layout within the editor, with drag handles and keyboard-accessible reordering controls.
- Standardised the website's colour treatment: blue for general and administrative interfaces, with dedicated accent colours for interest-specific sections.

**Technical decisions and challenges**

Media order is represented explicitly rather than relying on the order in which files were uploaded. This allows users to rearrange different media types and keep that order across saving, publication and revisions.

The selected cover is stored as a separate reference to an uploaded image. That keeps cover selection independent of drag-and-drop position.

**Lesson:** Building a flexible editing interface also requires a reliable data model. The UI, validation and persisted media references must remain consistent after files are added, removed or reordered.

## 29 October 2026 — Public Journals, Article Pages & SEO

**What I built**

- Connected the Bhangra and Guitar & Music pages to published journal data stored in Neon PostgreSQL.
- Added journal previews on section pages, full journal listing routes and individual article routes.
- Created reusable public-facing components rather than building separate publishing systems for the two categories.
- Retrieved entries in historical journal-date order and generated short text excerpts from Tiptap content.
- Limited public queries to published entries, keeping drafts and pending revisions private.
- Added dynamic article metadata, canonical URLs, a sitemap containing published articles and `robots.txt` rules for administrative paths.
- Added revalidation of relevant public pages and the sitemap after publishing or deleting entries.
- Created a separate production database migration configuration to reduce the risk of accidentally targeting the wrong database.

**Technical decisions and challenges**

The public website reads published content independently of the editor's pending revisions. A published article should remain stable while I work on its next revision.

I also separated public content queries from the admin dashboard's database access, allowing both journals to reuse the same underlying structure without duplicating their backend logic.

**Lesson:** Publishing is more than storing a record in a database. It also involves public routing, caching, metadata, content visibility and keeping the live website in sync with changes.

## 29 October 2026 — Journal Deletion & Rich Media Previews

**What I built**

- Added a permanent **Delete** action to the admin dashboard and journal editor, with an explicit confirmation step.
- Protected deletion with administrator authorisation and entry-version checking to guard against deleting stale or concurrently edited content.
- Updated the public journal cards to prioritise an explicitly selected cover image.
- Replaced the previous single-media preview with a tabbed preview component.
- Added a **Cover** tab, separate tabs for individual YouTube, Instagram and TikTok embeds, and a **Pictures** tab containing a responsive grid of the other uploaded images.
- Preserved the existing social-media embed components and handled entries with different combinations of cover images, videos and photographs.

**Technical decisions and challenges**

I initially prioritised cover images over embeds, but that hid additional media on journal cards. A tabbed interface resolved the trade-off: the selected cover appears first without making the other media inaccessible.

Deletion is deliberately permanent at this stage. A 30-day recovery or soft-delete system is a possible later enhancement, **not an implemented feature**.

While merging the new preview component into `main`, I encountered a Git rebase conflict because another change had modified the old media component. I resolved the obsolete component's conflict, preserved the new preview implementation and completed the rebase despite a Vim commit-message editor problem.

**Lesson:** Integrating concurrent changes is as important as implementing features. Understanding which code is superseded helps resolve conflicts without losing functionality.

## 29 October 2026 — TikTok Mobile Share Links

**What I built**

- Added support for common TikTok mobile share links, including `vm.tiktok.com`, `vt.tiktok.com` and supported TikTok `/t/` links.
- Introduced an authenticated server-side operation that follows approved TikTok redirects and obtains the canonical video URL.
- Added allowlisted destination checks, a redirect limit and timeout handling instead of accepting arbitrary URL redirects.
- Updated the journal editor to display resolution progress, avoid repeated submissions and report failures.
- Kept the existing full TikTok, YouTube and Instagram flows intact.

**Technical decisions and challenges**

A shortened TikTok URL contains a redirect code, not the video ID needed for an embedded player. Treating it as a normal full video URL would not work.

The solution resolves the short URL before adding media and stores only a validated, canonical TikTok video URL. This keeps the existing media-order validation, deduplication and publishing workflow consistent.

**Outcome:** Mobile TikTok links were tested successfully through the journal editor.

**Lesson:** Input validation needs to account for real user behaviour, such as links copied from mobile apps, while still constraining server-side network requests.

## 29 October 2026 — Core Functionality Milestone

The main functional features of the website are now implemented and working: the public portfolio sections, secure administrator access, database-backed journals, rich-text editing, draft autosaving, published revisions, image uploads, social embeds, media ordering, cover selection, public journal pages and entry deletion.

The project has grown from a static Next.js site into a full-stack publishing application using PostgreSQL, Drizzle ORM, Auth.js, Tiptap and Vercel Blob.

**Next phase — Design and interaction**

The immediate priority is now visual refinement: stronger layouts and typography, tasteful animations, page transitions, responsive polish and improved interaction feedback. Motion should remain accessible, including appropriate reduced-motion behaviour.

Automated tests, stronger CI checks and optional recovery for deleted entries remain possible future improvements. They are not being presented as completed features.

### Further Technical References

- [dnd-kit](https://dndkit.com/) — Drag-and-drop interactions.
- [Next.js Metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) — Page and article metadata.
- [Next.js `sitemap.ts`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — Generated sitemap.
- [Git — Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing) — Replaying commits and resolving conflicts.

## 30 October 2026 — Portfolio Redesign: Homepage & Projects

**What I built**

- Refined the homepage into a more cohesive dark, minimalist portfolio, with an animated introduction and staggered interest-card entrances.
- Added section-specific interactive highlights to the homepage cards, retaining violet for Projects, green for Tech, yellow for Bhangra and pink for Music.
- Redesigned the Projects page as a set of expandable cards. Each card exposes its technologies, features and optional source link without navigating away.
- Added **Fortitude** as a second project, documenting only its currently confirmed stack: Python with Pyglet for the game and Tkinter for the UI. More detail can be added later.
- Added scroll-triggered reveal effects, subtle hover elevation and accessible disclosure interactions, with reduced-motion considerations.

**Technical decisions and lessons**

I chose inline expansion for project details because these are compact portfolios of work, whereas long-form journal entries benefit from their own article URLs. The project data remains separate from presentation so additional projects can be added without rewriting the card layout.

The mouse-following spotlight initially appeared static in the homepage cards. Comparing the working components helped distinguish pointer-coordinate updates from CSS stacking and background rendering. The final homepage implementation draws a `radial-gradient()` directly onto the card background based on mouse coordinates. An outdated local Next.js development process also caused newer code to appear ineffective; restarting the correct server resolved that confusion.

**Lesson:** A visual problem can be caused by event handling, CSS rendering or an outdated development process. Inspect the actual loaded component and browser state before repeatedly changing implementation code.

## 30 October 2026 — Tech, Bhangra & Music Page Redesigns

**What I built**

- Redesigned Tech around expandable device cards for the iPhone 16 Pro Max, MacBook Pro and AirPods Pro 2, keeping their existing specifications and simplifying the action label to **View specifications**.
- Updated the Bhangra competition showcase into a responsive two-column arrangement grouped by year, keeping team names, captain/coach roles, results, vardi colours and YouTube performance links.
- Replaced the initial full-width vertical timeline and removed the decorative year dots. Switched from paired CSS Grid rows to independent CSS columns so years containing fewer competitions do not leave large empty gaps.
- Added individual scroll reveals and cursor-following yellow lighting to the competition cards.
- Redesigned the Music equipment sections as compact animated cards with pink cursor-following highlights, preserving the existing guitars, amp software and studio equipment.
- Simplified the visible section name from **Guitar & Music** to **Music** in the navbar, homepage, headings, relevant metadata and journal navigation, while preserving the `/music` URLs.

**Technical decisions and lessons**

Each section uses a related visual language but a different information layout: expandable projects and device specifications, non-expandable competition cards grouped by year, and a structured music-equipment collection. Scroll-reveal wrappers and hoverable card surfaces use separate animation layers to avoid competing transforms.

The Bhangra grid initially created large vertical gaps because each row inherited the height of its tallest year group. Newspaper-style CSS columns provided a closer fit for the intended year-group presentation while keeping each group together with `break-inside-avoid`.

**Lesson:** A responsive layout should follow the shape of the content. A grid is not always the best solution when grouped items have unequal heights.

## 30 October 2026 — Versioned Favicon & Browser Cache Debugging

**What I built**

- Investigated Safari displaying an older green favicon on some sections even when the current icon URL returned the blue design.
- Moved the generated icon into a dedicated `/brand-icon` route and configured it to avoid HTTP caching.
- Added a deployment-specific version query to the favicon metadata, using available Vercel commit or deployment identifiers with a local development fallback.

**Technical decisions and lessons**

Clearing Safari's cache corrected the immediate inconsistency, but that would not help every returning visitor. Versioning the URL gives a browser a different favicon resource address when the deployment version changes.

**Lesson:** Browser-managed resources such as favicons can outlive a deployment. Both asset caching and the URL used to identify an asset matter when shipping visual changes.

## 30–31 October 2026 — Journal Interface & Navigation Refinement

**What I built**

- Redesigned both Bhangra and Music journal previews with a featured entry, recent-entry cards, responsive layouts and scroll-triggered entrances.
- Carried the design into full journal listings with a prominent featured story and a grid of remaining entries.
- Updated individual journal articles with more deliberate typography, readable text widths, improved media spacing and clearer back navigation.
- Added category-aware cursor-following lighting to journal listing cards: yellow for Bhangra and pink for Music. The reading area itself remains free of moving spotlights.
- Introduced a shared `ActionLink` component to make prominent navigation and performance links look like consistent buttons, while keeping their semantic links and destinations intact.
- Preserved interactive Cover, YouTube, Instagram, TikTok and Pictures media tabs and the existing published-content workflow.

**Technical decisions and lessons**

The public journals share their underlying publishing components, so the redesign applies consistently to both categories without changing data fetching, authentication, the admin editor or media parsing. Listing cards include separate interactive links and media controls; a full-card navigation overlay would obstruct those controls and was intentionally avoided.

**Lesson:** Presentation changes to a shared component need to respect the interaction boundaries of nested controls, especially when preview media includes tabs, links and embedded players.

## 2 November 2026 — Mobile Arrow Icons & Final UI Consistency

**What I built**

- Identified that the Unicode diagonal arrow in prominent links could render as an emoji on mobile devices.
- Updated the shared `ActionLink` component to use React Icons SVG arrows for back, forward and diagonal navigation instead of font-dependent arrow characters.
- Preserved existing link behaviour, category accents, hover movement and external-link handling.

**Outcome and next steps**

The main public-facing redesign is in the repository: Homepage, Projects, Tech, Bhangra, Music, journal previews, complete journals and article reading pages. The next phase is a cross-device regression pass, accessibility and performance review, and improved automated coverage. These checks are ongoing priorities rather than completed milestones.

**Lesson:** Small interface details can behave differently across operating systems and fonts; using a consistent icon component removes one source of rendering variability.

---

## 2 November 2026 — My Journey and Experience

- Added **My Journey.** below the existing homepage interests, reusing `InterestCard` and `HomeInterestReveal` for matching responsive cards, blue accents, SVG document/briefcase icons and staggered reveals.
- Extended the card to accept React icons and external links; existing interest destinations, colours and behaviour remain unchanged. The CV uses `NEXT_PUBLIC_CV_GOOGLE_DOC_URL`, opens in a new tab and stays non-interactive when the URL is absent or invalid.
- Added `/experience` with page metadata, a shared `ActionLink` back to Home and a responsive, blue career timeline ready for verified entries. Native `details`/`summary` controls support keyboard expansion and visible focus.
- Kept career data in `src/data/experience.ts`. Populated five roles using the Google Docs CV supplied during implementation, preserving its employment dates and work-experience designation. An empty state remains available when the list is cleared.
- Extracted the existing home-card spotlight unchanged into `useCardSpotlight` so the new timeline can reuse its geometry and event handling. Reused homepage reveal timing with an optional container layout.

Configured the supplied Google Docs URL in the ignored local environment file; deployments must set the same variable. No database, authentication, navbar or existing section changes were needed.

**Validation**

- TypeScript, targeted ESLint for every changed/new TypeScript file, and whitespace checks passed. Local HTTP checks verified both `/` and `/experience`, including page metadata, the configured CV destination/new-tab attributes, existing homepage destinations and all five experience disclosures.
- Server-rendered assertions covered missing/invalid/configured CV URLs, the career empty state and populated responsibility/achievement panels. Test fixtures were kept outside the repository.
- Full ESLint completed with existing errors across public copy and older client/admin components. The homepage apostrophe was escaped without changing its displayed text; unrelated lint findings were left for separate work.
- Desktop/mobile visual, touch, keyboard and animated browser checks could not run because no browser was connected. Google Docs text export succeeded after the document's sharing permissions were updated; a browser new-tab click was not tested.

## 2 November 2026 — Education and Skills

- Added Education and Skills below the existing career timeline on `/experience`, keeping the title, career data and disclosure controls intact.
- Added the supplied Computer Science DipHE (2026), A Levels (ABB) and GCSE results without claiming a completed BSc or honours degree.
- Added six categories of compact skill badges, using only the supplied skills without proficiency ratings or additional certifications.
- Kept content editable in `src/data/experienceProfile.ts`. Static cards reuse the blue spotlight hook, dark card surface and responsive, reduced-motion-aware `HomeInterestReveal` component; only badges have subtle colour hover effects.
- Validation: TypeScript, targeted ESLint and whitespace checks passed. Server-rendered checks confirmed section order, all supplied qualifications/skills, nine non-interactive cards and the five existing native career disclosures. Responsive grid and badge-wrapping classes were checked; desktop/mobile visual and keyboard interaction checks remain unverified because no browser was connected.

## 2 November 2026 — Experience Navigation and View CV

- Added Experience as the first navbar tab, using `#60A5FA` for active and hover styles and the existing exact/nested route detection.
- Preserved the four other tabs, homepage tab hiding, focus styling and horizontal overflow for narrow screens.
- Added a blue `ActionLink` with the diagonal SVG arrow below the Experience introduction, opening `/cv` internally in the same tab. Existing hover, focus and reduced-motion behaviour comes from the shared component.
- Left homepage Journey cards, the CV viewer and timeline unchanged.
- Validation: TypeScript, targeted ESLint and whitespace checks passed. Rendered-markup assertions covered all five exact/nested active routes, tab ordering, homepage tab hiding, overflow classes, the same-tab CV action and five preserved career disclosures. Visual desktop/mobile checks remain unverified because no browser was connected.

## 6 November 2026 — Tech Cyan and Self-Improvement Green

- Changed Tech to `#22D3EE` across its homepage icon/arrow, spotlight, hover border, page heading, device disclosures, open/focus states, atmospheric glow and navbar active/hover treatment.
- Changed the Self-Improvement homepage card to `#22C55E` using the existing green accent mapping. The icon, decorative SVG arrow and spotlight now use green; the shared focus/border mapping is ready for a future destination. The card remains non-clickable without a route.
- Added the exact cyan Tailwind token and shared card mapping. Preserved all other section colours, layouts, backgrounds, SVGs, motion timing and interaction logic.
- Validation: TypeScript, targeted ESLint and whitespace checks passed. Source review found no remaining green Tech accents. Calculated contrast for cyan/green against the brightest card spotlight was 7.50:1 / 6.19:1; Tech retains visible 2px focus outlines. Desktop/mobile visual checks remain unverified because no browser was connected.

## 6 November 2026 — Complete Tech Theme Audit

- Re-audited `/tech`, `DeviceCard`, all `.tech-*` rules, homepage accent mappings and the navbar. All Tech accents already use cyan (`#22D3EE`, `34, 211, 238`); no further implementation changes were needed.
- Confirmed that green remains available for Self-Improvement. Reviewed native summary controls, animation and spotlight handlers, fine-pointer hover rules, cyan 2px focus outlines and reduced-motion fallbacks without changing them.
- TypeScript, targeted ESLint and whitespace checks passed. Desktop/mobile layout and interactive hover, spotlight, expansion and keyboard tests remain unverified because no browser was connected.

## 6 November 2026 — Self-Improvement Lesson Tree

- Added `/self-improvement` with the green theme, a Back to Home action, page metadata and explicit white/grey text against dark gradient surfaces.
- Built a centred Always Learning root, three connected branches and six expandable lesson cards. Desktop connectors become a vertical branching timeline below 1024px. Book cards credit Mark Manson, Ichiro Kishimi and Fumitake Koga, followed by More to come.
- Kept books, branches, lesson titles and reflections editable in `src/data/selfImprovement.ts`. The approved preview reflections were not available in the session; newly written example reflections are clearly labelled, with no claim of personal experience or direct quotation.
- Reused `HomeInterestReveal`, `useCardSpotlight`, `ActionLink` and the existing SVG libraries. Native disclosures use the same interruptible height/opacity animation pattern as the device cards, with visible green focus and reduced-motion fallbacks.
- Added an optional motion/pointer preference guard to the shared spotlight hook for the new page; existing callers keep their previous behaviour.
- Added Self-Improvement second in the navbar, preserving homepage tab hiding and mobile scrolling, and activated the existing green homepage card link without changing card order.
- Validation: TypeScript, targeted ESLint and whitespace checks passed. A local HTTP request verified the route and metadata. Rendered/handler checks covered six disclosures, book credits, homepage linking, navbar order and exact/nested active routes, expansion/collapse, rapid reversal and reduced-motion fallback. Contrast calculations passed 4.5:1 for white, muted grey and green text against the brightest green spotlight. Desktop/mobile visual, connector, touch and live keyboard/spotlight checks remain unverified because no browser was connected.

## 6 November 2026 — Consistent Card Interactions

- Audited homepage, Experience, Projects, Self-Improvement, Tech, Bhangra, Music and journal surfaces against their actual functionality.
- Added shared `.card-interactive`, `.card-disclosure`, `.card-static` and `.card-plus` rules. Full-card links and disclosure summaries now share the 280ms transition, 3px fine-pointer hover lift, 45% accent hover border, 50% active/focus border and visible keyboard outlines. Expanded descriptions retain a default cursor and do not independently trigger card hover.
- Kept native disclosure controls, height/opacity animation implementations, existing spotlight handlers and scroll-reveal keyframes unchanged. Preserved the inset Project focus ring so overflow clipping cannot hide it.
- Replaced the Projects disclosure chevron with `+` and its source-link character arrow with `HiArrowUpRight`. Removed the arrow-only override from `InterestCard` so navigation indicators follow real destinations.
- Removed hover brightening from static books, skill chips and technology labels. Existing informational Bhangra/Music/journal containers remain static, with their child links and controls intact.
- Applied shared navigation styling and SVG arrows to full-image journal thumbnail links, while cover previews, embed wrappers and article cards remain static. Media buttons retain their own actions and explicit pointer cursors.
- Pinned named section colour tokens to the specified palette and aligned the Project card spotlight/focus/border accent with `#C084FC`; Tech remains cyan and Self-Improvement green.
- Validation: TypeScript, targeted ESLint, CSS parsing and whitespace checks passed. Temporary rendered/handler regression checks covered all card families, six homepage destinations/social links, static tab stops, journal cover/picture boundaries, open/close behaviour, rapid reversal, inert panels and reduced-motion fallback. Source comparison confirmed unchanged disclosure logic and reveal keyframes. Browser visual, live focus and desktop/tablet/mobile checks remain unverified because no browser was connected.

## Documentation and Reference Resources

Official documentation relevant to the frameworks, tools and techniques used in this project. These are technical references, not a claim that I followed each resource as a tutorial.

### Project setup, frontend and interface

- [Next.js — Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) — App Router, file-based routing and shared layouts.
- [React — Learn React](https://react.dev/learn) — JSX, reusable components, props, lists and conditional rendering.
- [TypeScript — Documentation](https://www.typescriptlang.org/docs/) — Typed JavaScript, interfaces and type checking.
- [Tailwind CSS — Install with Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs) — Utility-first styling and framework integration.
- [React Icons — Documentation and Icon Library](https://react-icons.github.io/react-icons/) — Integrating icon components.
- [Next.js — Metadata and OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) — Page metadata, favicons and social previews.

### Version control, deployment and domains

- [Pro Git — Git Book](https://git-scm.com/book/en/v2) — Branching, commits, remotes and merges.
- [GitHub Docs — Pull Requests](https://docs.github.com/en/pull-requests/reference/pull-requests) — Reviewing and merging feature-branch work.
- [Vercel — Deployment Environments](https://vercel.com/docs/deployments/environments) — Development, preview and production deployments.
- [IONOS — DNS Settings](https://www.ionos.co.uk/help/domains/general-information-about-dns-settings/default-dns-settings-for-11-ionos-domains/) — Domain records and DNS configuration.

### Database and server-side development

- [PostgreSQL — Official Tutorial](https://www.postgresql.org/docs/current/tutorial.html) — Relational databases, SQL and querying.
- [Neon — Documentation](https://neon.com/docs/introduction) — Managed PostgreSQL databases and connections.
- [Drizzle ORM — PostgreSQL with Neon](https://orm.drizzle.team/docs/get-started/neon-new) — Drizzle integration and typed database access.
- [Drizzle ORM — Migrations](https://orm.drizzle.team/docs/migrations) — Database schema changes and SQL migrations.
- [Next.js — Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers) — Server-side endpoints in the App Router.

### Authentication and request-time rendering

- [Auth.js — Installation](https://authjs.dev/getting-started/installation) — Next.js authentication configuration.
- [Auth.js — GitHub Provider](https://authjs.dev/getting-started/providers/github) — GitHub OAuth configuration and callback URLs.
- [Auth.js — Protecting Resources](https://authjs.dev/getting-started/session-management/protecting) — Server-side session checks and access control.
- [Next.js — `connection()`](https://nextjs.org/docs/app/api-reference/functions/connection) — Rendering request-specific content without prerendering.
- [Next.js — Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups) — Separating public and admin layouts without changing URLs.

### Journal Editor, Autosaving and Publishing
- [Tiptap — React Integration](https://tiptap.dev/docs/editor/getting-started/install/react)
- [Tiptap — Link Extension](https://tiptap.dev/docs/editor/extensions/marks/link)
- [Next.js — Server Functions and Mutations](https://nextjs.org/docs/app/getting-started/updating-data)
- [Drizzle ORM — Migrations](https://orm.drizzle.team/docs/migrations)
- [React — Synchronising with Effects](https://react.dev/learn/synchronizing-with-effects)