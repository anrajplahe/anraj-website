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