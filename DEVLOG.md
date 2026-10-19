# Development Log

This document tracks my progress, technical decisions, challenges and learning experiences throughout the development of my personal website.

## 12 October 2026 — Project Initialisation

### Objectives
- Set up my development environment.
- Initialise a Next.js application.
- Learn how to use Git and GitHub for version control.
- Establish a structured development workflow.

### Completed
- Created a Next.js project using TypeScript and Tailwind CSS.
- Set up the project in Visual Studio Code.
- Successfully launched the local development server.
- Created and connected my GitHub repository.
- Learned how to create Git commits and push changes.
- Created my first feature branch.
- Opened and merged my first pull request.
- Created the initial README and development log files.

### What I Learned
- The difference between Git and GitHub.
- How branches allow features to be developed independently.
- How commits record changes to a project's files.
- How to connect a local repository to GitHub using a remote.
- How pull requests are used to review and merge changes.
- The difference between running an application locally and deploying it.

### Challenges and Solutions

**Running the application**

Initially, I was unsure whether I needed to deploy the Next.js application to view it. I learned that the development server allows the website to run locally before it is published online.

**GitHub remote configuration**

When attempting to configure the remote repository, Git reported that `origin` already existed. I learned how to inspect an existing remote and verify that my local repository was synchronised with GitHub.

**Git branch conflicts**

I encountered an error when switching branches because an untracked development log would have been overwritten. I learned how Git protects untracked files and how to use `git stash` to preserve work temporarily.

**Pull requests**

I initially struggled to locate my pull request. I learned how to compare branches, create a pull request and merge changes into the main branch.

### Next Steps
- Finalise the development log.
- Begin developing the homepage.
- Create reusable React components.
- Implement the initial design system using Tailwind CSS.
- Continue practising Git branching, commits and pull requests.

---

## Future Development Entries

For each significant development session, I intend to record:

- What I planned to accomplish.
- What I completed.
- New technologies or concepts I learned.
- Problems encountered and how I resolved them.
- Decisions made and their reasoning.
- Next steps.

## 16 October 2026 — Initial Homepage Development

### Objectives
- Begin developing the frontend of my personal website.
- Create a reusable navigation component.
- Build the initial homepage layout.
- Experiment with Tailwind CSS styling and colour schemes.

### Completed
- Created a reusable `Navbar.tsx` React component.
- Replaced the default Next.js starter page with a custom homepage.
- Developed a hero section with a personal introduction and navigation button.
- Created four interest cards showcasing Software & Projects, Tech & Gear, Bhangra and Music.
- Used a JavaScript array and `.map()` to dynamically render the interest cards.
- Implemented responsive layouts using Tailwind CSS.
- Customised the original purple theme to use green as the primary accent colour and purple as the secondary accent.

### What I Learned
- **React components:** How components can be created in separate files, exported and imported into other parts of an application.
- **JSX:** How React uses JSX to define user interface elements.
- **Module imports:** How file paths and the `@/` alias work when importing components.
- **Dynamic rendering:** How `.map()` can generate multiple UI elements from structured data.
- **Tailwind CSS:** How utility classes control colours, spacing, typography, hover effects and responsive layouts.
- **Responsive design:** How breakpoint prefixes such as `sm:` and `md:` adjust styling for different screen sizes.

### Challenges and Solutions

**Component import error**

Initially, the application couldn't find the Navbar component because I had created it inside `src/app/components` rather than `src/components`.

I resolved this by correcting the folder structure and learned how module imports relate to the project's directory structure.

**Understanding the folder structure**

VS Code's Compact Folders setting displayed `src` and `app` together, which initially made it difficult to understand the directory hierarchy. I learned that this was a display preference rather than an issue with the actual folder structure.

**Changing the website's colour scheme**

After implementing the initial homepage, I decided to change the primary accent colour from purple to green, while using purple for the Tech & Gear category. This helped me understand how Tailwind CSS utility classes are applied and modified.

### Technical Decisions
- Used separate React components to make the application easier to maintain and extend.
- Used an array of objects to store interest card information, reducing repetitive JSX.
- Chose a dark visual theme with green as the primary accent colour.
- Kept the initial homepage relatively simple before introducing animations, additional pages and backend functionality.

### Next Steps
- Refactor the interest cards into reusable React components.
- Improve the homepage's visual design and layout.
- Add personal photographs and imagery.
- Introduce animations and interactive elements.
- Test the homepage on different screen sizes.
- Continue developing the remaining website sections.
- Add social media links to the appropriate parts of the website.

## 16 October 2026 — Homepage Styling and Social Integration

### Objectives
- Refine the visual design of the homepage.
- Improve the main call-to-action button.
- Introduce social media links.
- Establish a consistent colour scheme for the interest cards.

### Completed
- Updated the homepage's colour scheme with individual accent colours for each interest:
  - Software & Projects — Purple
  - Tech & Gear — Cyan
  - Bhangra — Yellow
  - Music — Pink
- Improved the "Take a look" button using Space Grotesk, gradient styling, shadows and hover animations.
- Added LinkedIn, Instagram and TikTok icons to the website footer using React Icons.
- Added Anahat Bhangra's Instagram, TikTok and email contact links to the Bhangra card.
- Used conditional rendering to display Anahat's links only within the Bhangra card.
- Investigated npm dependency security warnings using `npm audit` and `npm audit --omit=dev`.

### What I Learned
- How to integrate external React component libraries such as React Icons.
- How to customise typography using Next.js font utilities.
- How Tailwind CSS supports hover animations, transitions and custom shadows.
- How conditional rendering works in React.
- How `mailto:` links can open a user's email application without backend functionality.
- How to investigate dependency vulnerabilities and distinguish development dependencies from production dependencies.

### Challenges and Solutions

**Dependency security warnings**

Installing React Icons revealed five high-severity vulnerabilities. I investigated the affected dependency chain and confirmed that the production dependency audit reported zero vulnerabilities. I also learned why forcing major dependency changes can introduce compatibility issues.

**Button styling**

The original call-to-action button looked too basic. I experimented with a more expressive design using a gradient, improved typography and an animated arrow, then adjusted the arrow to face right.

### Design Decisions
- Chose to keep the interest cards minimal, without background photography or excessive visual effects.
- Assigned each interest a distinct accent colour while maintaining a consistent dark theme.
- Placed personal social accounts in the footer and Anahat's contact links within the Bhangra card.
- Decided to reserve more expressive imagery and animations for dedicated pages.

### Next Steps
- Fix minor text formatting and spacing inconsistencies.
- Refactor the interest cards into reusable React components.
- Introduce TypeScript interfaces for component props.
- Improve the overall component structure.
- Continue testing responsiveness and accessibility.

## 16 October 2026 — Website Deployment, Custom Domain and Email Configuration

### Objectives
- Deploy my Next.js website to a publicly accessible production environment.
- Purchase and configure a custom domain.
- Set up a professional email address using my domain.
- Connect my GitHub repository to a hosting platform.
- Gain practical experience with DNS configuration and deployment workflows.

### Completed

**Domain Registration and Email Hosting**
- Registered `anrajplahe.com` through IONOS.
- Purchased the IONOS Mail Basic 5 package, which includes custom-domain email hosting.
- Added Domain Guard for additional domain security.
- Configured and successfully tested `mail@anrajplahe.com`.
- Retained IONOS as the domain registrar and DNS provider.

**Website Deployment**
- Created a Vercel account and connected my existing GitHub repository.
- Imported my Next.js project into Vercel.
- Successfully deployed the website to a publicly accessible production environment.
- Added `anrajplahe.com` and `www.anrajplahe.com` as custom domains.
- Verified that the website is accessible through both addresses.

**DNS Configuration**
- Configured an A record to direct the root domain to Vercel.
- Configured a CNAME record for the `www` subdomain.
- Preserved the existing IONOS email-related DNS records, including MX, SPF, DKIM and DMARC.
- Successfully connected my domain to Vercel while maintaining email functionality.

**Git and Version Control**
- Continued working with feature branches and GitHub.
- Encountered an issue where my homepage code appeared to disappear after switching to the `main` branch in GitHub Desktop.
- Identified that my latest homepage development was stored on `feature/homepage`.
- Successfully restored the expected working files by switching back to the correct branch.

### What I Learned

**Domain Registration and DNS**
- The difference between a domain registrar, DNS provider and web hosting platform.
- How DNS translates domain names into the information needed to reach a hosting service.
- How A records point a domain towards an IP address.
- How CNAME records allow subdomains to reference another hostname.
- How website hosting and email hosting can operate independently under the same domain.

**Deployment and Hosting**
- How to deploy a Next.js application using Vercel.
- How to connect a GitHub repository to a deployment platform.
- How production environments differ from local development.
- How GitHub-integrated deployments can support a continuous deployment workflow.

**Email Infrastructure**
- How custom-domain email hosting works.
- The role of MX records in directing incoming email.
- How SPF, DKIM and DMARC help protect email authentication and delivery.
- Why DNS changes must be carefully managed to avoid disrupting existing services.

**Git and Branch Management**
- How switching Git branches changes the files displayed in my local working directory.
- Why commits on a feature branch do not automatically appear on `main`.
- How to locate and recover the expected version of a project by checking its branches.

### Challenges and Solutions

**Choosing Hosting Services**

I initially considered using IONOS for both domain registration and website hosting. After comparing the available options, I decided to use IONOS for domain and email management and Vercel for hosting my Next.js application.

This decision allows me to maintain a managed Next.js deployment while keeping the domain and email services separate.

**Connecting the Domain**

After adding my custom domain to Vercel, the dashboard initially displayed an invalid DNS configuration.

I resolved this by updating the appropriate A and CNAME records within IONOS using the values provided by Vercel.

Both the root domain and www subdomain subsequently became accessible.

**Preserving Email Functionality**

Because I was using IONOS for email hosting, I needed to ensure that connecting the website to Vercel would not interfere with incoming or outgoing mail.

I kept the email-related DNS records intact and subsequently verified that the mailbox was working.

**GitHub Desktop Branch Confusion**

After switching to `main` in GitHub Desktop, my homepage appeared to have reverted to an earlier version.

I discovered that the latest changes were present on `feature/homepage`, rather than the local `main` branch.

Switching back restored the expected files and reinforced my understanding of how Git manages independent branches.

### Technical Decisions
- Selected Vercel for managed Next.js hosting and future server-side functionality.
- Used IONOS for domain registration, DNS management and email hosting.
- Kept website hosting and email hosting separate to allow independent configuration.
- Continued using Git feature branches to isolate development changes from the main branch.
- Chose to deploy the initial homepage before completing the entire full-stack application, allowing the website to evolve through future releases.

### Next Steps
- Merge the completed homepage changes into `main`, after reviewing and committing any remaining work.
- Configure `www.anrajplahe.com` to redirect permanently to `anrajplahe.com`.
- Configure email forwarding to my personal inbox.
- Confirm Domain Guard activation.
- Test an automatic production deployment following a GitHub merge.
- Continue improving the homepage's component structure.
- Begin developing dedicated pages and backend functionality.

### Project Milestone

**First public deployment completed.**

My personal website is now accessible at:

https://anrajplahe.com

This marks the transition from a locally developed application to a publicly accessible website with a custom domain, production hosting and a professional email address.

## 16 October 2026 — Website Identity, Metadata & Deployment

### What I worked on

Following the initial deployment of my personal website, I focused on improving its identity and ensuring that changes could be tested and deployed reliably.

**Website branding and metadata**
- Updated the website's browser title and description through Next.js metadata configuration in `src/app/layout.tsx`.
- Added metadata for search engines and social media sharing, including Open Graph properties.
- Designed a custom `ap` favicon using a green `a` and white `p`, reflecting my website's existing branding.
- Used the Geist Bold font to maintain consistency with the navigation logo.
- Generated the favicon programmatically using Next.js `ImageResponse` in `src/app/icon.tsx`.
- Removed the default Next.js favicon.

**Git, GitHub and deployment**
- Worked on the `feature/site-identity` branch to keep development separate from production.
- Staged, committed and pushed changes to GitHub.
- Created and merged a pull request into `main`.
- Used Vercel preview deployments to inspect changes before publishing them.
- Verified the deployment of the updated website to my custom domain, `anrajplahe.com`.

### Challenges and lessons learned

**Understanding Git stages**

I encountered an issue where GitHub reported that there was nothing to compare between my feature branch and `main`.

By inspecting `git status` and `git log`, I discovered that although I had staged my changes, I had not yet committed them.

This helped reinforce the distinction between staging, committing and pushing, and why each stage is necessary.

**Production deployments versus previews**

I also learned that Vercel preview deployments are separate from the version served on my production domain. Pushing a feature branch does not automatically update the live website; the changes must first be merged into the production branch.

**Favicon caching**

After deployment, Safari continued showing the original Next.js favicon even though the new icon was accessible on the live domain. I investigated the icon URLs and browser caching before resolving the issue.

This highlighted the difference between a deployment problem and a browser-side caching issue.

### What I learned

- How Git branches and pull requests support controlled development.
- The differences between `git add`, `git commit`, `git push` and merging.
- How Vercel preview and production deployments work.
- How Next.js generates metadata and application icons.
- How to integrate a custom font into a generated favicon.
- How to troubleshoot discrepancies between local development and production.

### Next steps

- Review and improve mobile responsiveness.
- Test the website across multiple viewport sizes.
- Refactor repeated homepage UI into reusable React components.
- Begin developing the individual interest pages.

## 19 October 2026 — Mobile Responsiveness & Component Refactoring

### What I worked on

Following the launch of my personal website, I focused on improving the homepage's responsiveness, maintaining consistent styling and restructuring the code to make it easier to maintain and extend.

**Mobile responsiveness**
- Improved the homepage layout for smaller screens using Tailwind CSS's mobile-first responsive utilities.
- Adjusted the hero section's typography, spacing and padding across different screen sizes.
- Refined the interest cards to use more appropriate spacing and text sizes on mobile devices.
- Updated the Bhangra contact section to allow its social links and email button to wrap on narrower screens.
- Improved navigation and footer spacing while preserving the existing desktop design.

**Typography and visual consistency**
- Standardised the website's typography around the Geist font.
- Removed the separate Space Grotesk font previously used for the "Take a look" button.
- Adjusted the button's letter spacing to match the rest of the website more closely.
- Retained the existing colour scheme, gradients and animations.

**React component refactoring**
- Created a reusable `InterestCard.tsx` component in `src/components/`.
- Moved the interest card JSX out of `page.tsx`, reducing repetition and improving the organisation of the homepage.
- Defined a TypeScript type for the component's props, including its title, description, symbol and colour.
- Used React props to pass data from the `interests` array in `page.tsx` to each card.
- Preserved the Bhangra-specific social links using conditional rendering within the component.

### Challenges and lessons learned

**Understanding responsive design**

I developed a better understanding of Tailwind CSS's mobile-first approach, particularly how breakpoint prefixes such as `sm:` and `md:` change the layout at different viewport widths.

I also learned that responsive design involves more than resizing elements. Spacing, typography, content wrapping and usability all need to be considered.

**Understanding React props and components**

Previously, the JSX responsible for rendering my interest cards was written directly in `page.tsx`.

By extracting this into a reusable component, I learned how to separate a component's data from its presentation.

I also gained experience defining TypeScript prop types to help ensure components receive the correct information.

**Maintaining consistency**

The website previously used different fonts in certain areas, which affected its visual consistency. Standardising the typography reinforced the importance of having a coherent design system.

### What I learned

- Mobile-first responsive design with Tailwind CSS.
- Responsive spacing, typography and layout techniques.
- Creating and importing reusable React components.
- Passing information between components using props.
- Defining component properties with TypeScript.
- Conditional rendering in React.
- Improving code organisation and maintainability.

### Next steps

- Build dedicated pages for Software & Projects, Tech & Gear, Bhangra and Music.
- Implement navigation between the homepage and individual pages using Next.js routing.
- Create reusable layouts and components for the new pages.
- Develop the Software & Projects page to showcase completed projects, technical skills and ongoing learning.
- Explore adding backend functionality and dynamic content in future development stages.

## 19 October 2026 — Tech Page & Shared Layout

### What I worked on

Following the completion of my homepage and its responsive design, I began expanding the website with its first dedicated section: **Tech**.

This development stage focused on Next.js routing, shared layouts, data-driven content and creating a consistent visual experience across different pages.

**Next.js routing and shared layouts**
- Created the `src/app/tech/page.tsx` route, making the Tech page accessible at `/tech`.
- Moved the navigation component into `src/app/layout.tsx`, allowing the same Navbar to appear automatically across the website.
- Updated navigation links so they correctly return to homepage sections from other pages.
- Added page-specific metadata, including the browser title, description and canonical URL.

**Tech I Use page**
- Created a dedicated page showcasing the technology and equipment I use.
- Added my iPhone 16 Pro Max, MacBook Pro with M3 Pro and AirPods Pro 2.
- Organised device information in a JavaScript array containing names, categories, icons and specifications.
- Used React's `.map()` method to generate the device listings dynamically.
- Added detailed specifications covering processors, memory, storage, displays and device features.
- Implemented a responsive grid using Tailwind CSS.
- Refined the design from traditional cards into minimalist informational listings, using subtle dividers and cyan icons.
- Added custom bullet-point alignment to ensure device specifications line up consistently with their headings.

**Homepage improvements**
- Made the Tech I Use interest card clickable using Next.js `Link`.
- Extended the reusable `InterestCard` component with an optional `href` prop.
- Updated the interest cards to use their individual accent colours for hover effects instead of a universal green.
- Returned the homepage card titles to white while preserving coloured symbols.
- Kept dedicated page titles in their respective accent colours.

### Challenges and lessons learned

**Understanding shared layouts**

Initially, the Navbar was imported separately into individual pages. Moving it into the root layout demonstrated how Next.js can share interface elements between routes without duplicating code.

This also introduced a styling issue where the Navbar displayed a white background instead of the website's dark theme.

I investigated the global CSS and layout styling before applying an explicit background colour to the Navbar component.

**Distinguishing navigation from information**

My initial equipment cards looked too similar to the clickable interest cards on the homepage.

I redesigned them as static informational listings without hover animations or raised card backgrounds. This helped me understand the importance of visual cues in user interface design.

**Data-driven rendering**

Rather than creating separate JSX for every device, I stored the device information in an array and rendered it using `.map()`.

I also added nested arrays for device specifications, allowing the page to display variable amounts of information without duplicating its structure.

**Development and deployment workflow**

I continued using Git feature branches to separate development from production, testing changes locally before committing and pushing them.

I also gained more experience troubleshooting situations where local changes were not immediately reflected in the development server.

### What I learned

- Next.js App Router and file-based routing.
- Shared layouts and reusable navigation components.
- Page-specific metadata.
- Data-driven rendering with React.
- Nested arrays and `.map()`.
- Optional props and conditional navigation.
- Responsive grid layouts with Tailwind CSS.
- CSS flexbox alignment and text wrapping.
- Consistent UI styling and distinguishing interactive from non-interactive elements.
- Using Git branches, commits, pull requests and Vercel preview deployments.

### Next steps

- Create introductory Bhangra and Guitar & Music pages.
- Connect the remaining homepage interest cards to their respective pages.
- Explore building a private content management system to publish personal updates, photographs and videos.
- Investigate authentication, database integration and media storage for future dynamic content.
- Return to the Projects section once I have organised and prepared my existing work for presentation.