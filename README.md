# Anraj — Personal Website

A full-stack personal portfolio and publishing platform for my work in technology, Bhangra and music.

**Live website:** [anrajplahe.com](https://anrajplahe.com)  
**Source code:** [GitHub](https://github.com/anrajplahe/anraj-website)  
**Development history:** [DEVLOG.md](./DEVLOG.md)

## Overview

I built this project to create a more personal alternative to a conventional portfolio: somewhere to share technical projects alongside my experiences in Bhangra and guitar.

What began as a responsive Next.js frontend has developed into a full-stack application with a private content management system, database-backed journals, cloud image uploads and embedded social media.

**Project status (29 October 2026):** The main functional features are implemented and working. The next phase focuses on visual design, animation, accessibility and interface polish.

## Features

### Public website

- Responsive homepage and shared navigation.
- Dedicated **Tech**, **Projects**, **Bhangra** and **Guitar & Music** sections.
- Bhangra and Music journals, with previews on their respective section pages.
- Full journal listings and individual article pages.
- Journal entries ordered by their chosen historical date, so older experiences can be added retrospectively.
- Media previews with a **Cover** tab, individual YouTube/Instagram/TikTok tabs, and a **Pictures** grid.
- Page metadata, article metadata, canonical URLs, `robots.txt` rules and a sitemap that includes published articles.
- A consistent dark interface with blue general branding and section-specific accents.

### Private journal management

- GitHub OAuth authentication through Auth.js, restricted to an authorised administrator.
- Dashboard with post statistics, search, filtering and sorting.
- Rich-text editing using Tiptap, including formatting, lists and links.
- Automatic saving of drafts, with separate and explicit publishing controls.
- Editing of published entries through **unpublished revisions**, so in-progress changes do not immediately alter public articles.
- Save, publish and discard controls for drafts and pending revisions.
- Confirmed, permanent deletion of journal entries with server-side authorisation and version checks.
- Image uploads to Vercel Blob, with captions, alternative text and cover-image selection.
- Drag-and-drop ordering of images and video embeds.
- YouTube videos and Shorts, Instagram posts and Reels, and TikTok video embeds.
- Support for TikTok mobile sharing links (`vm.tiktok.com`, `vt.tiktok.com` and supported TikTok `/t/` links), resolved to full video URLs before saving.
- Input validation and checks to avoid duplicate embeds and conflicting edits.

**Note:** Deleted journal entries are not currently recoverable from a recycle bin. The deletion action is permanent.

## Technology Stack

| Area | Technologies |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS |
| Editor and UI | Tiptap, React Icons, dnd-kit |
| Backend | Next.js Server Actions and Route Handlers |
| Database | Neon PostgreSQL, Drizzle ORM and Drizzle Kit |
| Authentication | Auth.js v5 with GitHub OAuth |
| Media storage | Vercel Blob |
| Hosting and deployment | Vercel |
| Domain and email | IONOS |
| Version control | Git and GitHub |

## Project Structure

```text
src/
  app/
    (site)/          Public pages and journal routes
    admin/           Private dashboard, editor and server actions
    api/             API route handlers
  components/        Shared UI and journal components
  db/                Database schema, connection and queries
  lib/journal/       Journal validation, media and publishing logic
  types/             Shared TypeScript types
  auth.ts            Authentication setup

drizzle/             Database migrations
```

The public site and administrative interface use separate App Router layouts, while the journal categories share their underlying publishing system.

## Running Locally

### Prerequisites

- Node.js and npm
- Git
- Access to development instances/configuration for Neon PostgreSQL, GitHub OAuth and Vercel Blob when testing the full publishing workflow

### Setup

```bash
git clone https://github.com/anrajplahe/anraj-website.git
cd anraj-website
npm ci
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

The public pages and private journal features may require environment-specific configuration. Keep credentials in local environment files or deployment environment settings; **never commit secrets to the repository**. Database migrations must be applied to the intended database before using features that depend on them.

## Development Approach

The project is documented as a series of practical learning milestones. I have used feature branches, pull requests, manual testing and GitHub-based version control, with OpenAI Codex assisting on some implementation tasks. Architectural choices, review, configuration and release decisions remain part of my development process.

For technical decisions, debugging notes and implementation milestones, see [DEVLOG.md](./DEVLOG.md).

## Next Phase

With core functionality in place, I am focusing on the experience of using the site:

- Refine typography, layouts, spacing and visual hierarchy.
- Add purposeful animations, page transitions and micro-interactions.
- Improve responsive behaviour, keyboard access and reduced-motion support.
- Review performance, loading states and accessibility.
- Expand automated testing and deployment checks over time.

Additional features may be considered later, but the immediate priority is **design and polish**, rather than expanding the content management system.

## Author

Built by **Anraj Plahe** as an ongoing personal project and a way to develop practical software engineering skills.
