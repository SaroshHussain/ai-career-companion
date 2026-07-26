# Project Name

AI Career Companion

# Project Description

AI Career Companion is an AI-powered career assistant that helps users improve their career journey through resume building, interview preparation, cover letter generation, and job application management.

## Tech Stack

### Frontend

* React
* Vite
* JavaScript (ES6+)
* Tailwind CSS

### Development Tools

* Node.js
* Git
* GitHub
* Cursor AI

---

# Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── landing/
│   │   ├── FAQ.jsx
│   │   ├── FeatureBento.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── HowItWorks.jsx
│   │   └── Navbar.jsx
│   └── ui/
│       ├── Button.jsx
│       └── Reveal.jsx
│
├── data/
│   ├── faq.js
│   ├── features.js
│   ├── footerLinks.js
│   └── steps.js
│
└── hooks/
    ├── useScrollReveal.js
    └── .gitkeep
```

## Folder Responsibilities

### `components/`

Contains all reusable React components.

* `landing/` contains components used exclusively by the landing page.
* `ui/` contains generic reusable UI primitives that can be shared throughout the application.

### `data/`

Contains static configuration and content.

Examples:

* FAQ items
* Feature cards
* Footer navigation
* Landing page steps

Do not hardcode repeated content inside components when it belongs in the `data` folder.

### `hooks/`

Contains reusable custom React hooks.

Current hook:

* `useScrollReveal.js`

Future reusable hooks should also live here.

---

# Coding Guidelines

* Use React functional components only.
* Use hooks where appropriate.
* Write clean, readable, and maintainable code.
* Prefer composition over duplication.
* Avoid unnecessary abstraction.
* Use meaningful variable, function, and component names.
* Follow modern React best practices.
* Keep code simple and scalable.

---

# Component Rules

* Use PascalCase for every component.
* One component per file.
* Keep components focused on a single responsibility.
* Create reusable components instead of duplicating UI.
* Move repeated UI into reusable components.
* Extract repeated data into the `data` folder.
* Generic UI belongs in `components/ui`.
* Landing-specific sections belong in `components/landing`.

Examples:

* Hero.jsx
* FeatureBento.jsx
* FAQ.jsx
* Button.jsx

---

# Data Rules

* Store static content inside the `data` directory.
* Components should consume data rather than defining large arrays inline.
* Keep data files simple and export plain JavaScript objects or arrays.

Examples:

* `features.js`
* `steps.js`
* `faq.js`
* `footerLinks.js`

---

# Custom Hook Rules

* Place reusable hooks inside `src/hooks`.
* Prefix every hook with `use`.
* Hooks should contain reusable logic, not UI.

Example:

```
useScrollReveal.js
```

---

# UI/UX Guidelines

* Build responsive layouts for desktop, tablet, and mobile.
* Keep spacing consistent throughout the application.
* Maintain consistent typography.
* Build reusable UI patterns.
* Prioritize accessibility.
* Create clean and modern interfaces.
* Avoid unnecessary visual clutter.
* Keep animations subtle and purposeful.

---

# AI Assistant Guidelines

Before making changes:

* Understand the existing project structure.
* Reuse existing components whenever possible.
* Search for similar implementations before creating new ones.
* Avoid generating duplicate components.
* Keep the architecture consistent.
* Explain major architectural changes before implementing them.
* Suggest improvements when appropriate.
* Prefer simple and maintainable solutions.
* Follow the project's coding conventions.




---

# Git Commit Convention

Use Conventional Commits.

Examples:

* feat: add landing page FAQ section
* fix: resolve navbar responsive issue
* docs: update CLAUDE.md
* style: improve button spacing
* refactor: simplify FeatureBento layout
* chore: update dependencies

---

# Framework Rules

* This project uses React + Vite.
* Do not migrate to Next.js, CRA, or another framework.
* Use JavaScript only unless explicitly requested otherwise.

---

# Development Commands

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Build production:

```
npm run build
```

Preview production build:

```
npm run preview
```

---


# Project Goal

Build a production-quality AI Career Companion that helps users with:

* Resume creation
* Resume improvement
* Cover letter generation
* Interview preparation
* Job application tracking
* AI-powered career guidance

The application should remain clean, scalable, maintainable, and easy to extend as new features are added.



## Additional Project Rules

1. Always reuse existing landing page components before creating new ones.
2. Keep every landing page section responsive across mobile, tablet, and desktop devices.
3. Follow the project's design system for spacing, typography, colors, and border radius.
4. Verify every UI change by running `npm run build` and checking for console errors.
5. Avoid duplicated layouts by extracting reusable UI into shared components.
