# Project Name

AI Career Companion

# Project Description

AI Career Companion is an AI-powered career assistant that helps users improve their career journey through resume building, interview preparation, cover letter generation, and job application management.

## Tech Stack

### Frontend

* React 19
* Vite 6
* JavaScript (ES6+)
* Tailwind CSS 3 (with CSS custom properties for theming)
* React Router DOM 7

### Key Libraries

* react-icons (hi2, md, fa6)
* lucide-react
* react-to-print
* pdfjs-dist
* mammoth
* react-hook-form (available)

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
│   ├── landing/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── FeatureBento.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── FAQ.jsx
│   │   └── Footer.jsx
│   │
│   ├── dashboard/
│   │   ├── DashboardLayout.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TopNavbar.jsx
│   │   ├── StatCard.jsx
│   │   ├── JobCard.jsx
│   │   ├── ActivityCard.jsx
│   │   └── AIInsightsCard.jsx
│   │
│   ├── resume/
│   │   ├── ResumeOptionCard.jsx
│   │   ├── ResumeStepper.jsx
│   │   ├── PersonalForm.jsx
│   │   ├── EducationForm.jsx
│   │   ├── ExperienceForm.jsx
│   │   ├── SkillsForm.jsx
│   │   ├── ProjectsForm.jsx
│   │   ├── ResumePreview.jsx
│   │   ├── PreviewPage.jsx
│   │   ├── ZoomControls.jsx
│   │   ├── UploadedResumePreview.jsx
│   │   ├── ResumeUploader.jsx
│   │   └── AIConfigModal.jsx
│   │
│   ├── settings/
│   │   ├── SettingsTabs.jsx
│   │   ├── ProfileSection.jsx
│   │   ├── PersonalInfo.jsx
│   │   ├── ProfessionalLinks.jsx
│   │   └── AppearanceSelector.jsx
│   │
│   └── ui/
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Reveal.jsx
│       ├── ConfirmDialog.jsx
│       └── Toast.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── ResumeContext.jsx
│
├── hooks/
│   ├── useScrollReveal.js
│   ├── useAuth.js
│   └── useProtectedNavigation.js
│
├── services/
│   ├── fileExtractor.js
│   ├── aiResumeParser.js
│   ├── heuristicParser.js
│   └── resumeParser.js
│
├── data/
│   ├── faq.js
│   ├── features.js
│   ├── footerLinks.js
│   ├── steps.js
│   └── defaultResume.js
│
├── pages/
│   ├── LandingPage.jsx
│   ├── Login.jsx
│   ├── SignUp.jsx
│   ├── Dashboard.jsx
│   ├── ResumeBuilder.jsx
│   ├── ResumeEditor.jsx
│   └── Settings.jsx
│
├── components/
│   └── ProtectedRoute.jsx
│
├── App.jsx
└── index.css
```

---

## Folder Responsibilities

### `components/`

* `landing/` — Components used exclusively by the landing page.
* `dashboard/` — Dashboard layout, sidebar, navbar, cards.
* `resume/` — Resume builder stepper, forms, preview, zoom, upload, AI config.
* `settings/` — Settings page tabs, profile form, links, appearance.
* `ui/` — Generic reusable UI primitives (Button, Input, Reveal, ConfirmDialog, Toast).

### `context/`

React Context providers for global state:

* `AuthContext.jsx` — Authentication state (login, logout, session persistence via localStorage).
* `ResumeContext.jsx` — Resume data state with CRUD methods for all sections.

### `services/`

Business logic and external integrations:

* `fileExtractor.js` — Text extraction from PDF/DOCX files.
* `aiResumeParser.js` — Provider-agnostic AI parsing (Gemini, OpenAI, Hugging Face).
* `heuristicParser.js` — Built-in fallback parser (code-split, loaded on demand).
* `resumeParser.js` — Orchestrator: extract → AI (if configured) → heuristic fallback → normalize.

### `data/`

Static configuration and content:

* FAQ items, feature cards, footer navigation, landing page steps, default resume structure.

### `hooks/`

Reusable custom React hooks:

* `useScrollReveal.js` — Intersection Observer-based scroll animation.
* `useAuth.js` — Convenience wrapper for AuthContext.
* `useProtectedNavigation.js` — Navigation guard for feature cards.

### `pages/`

Top-level route pages:

* LandingPage, Login, SignUp, Dashboard, ResumeBuilder, ResumeEditor, Settings.

---

# Architecture & Data Flow

## Authentication

```
AuthProvider (context/AuthContext.jsx)
  ↓
useAuth hook (hooks/useAuth.js)
  ↓
ProtectedRoute (components/ProtectedRoute.jsx)
  ├─ Checks isAuthenticated
  ├─ Redirects to /login if unauthenticated
  └─ Renders children if authenticated
```

Credentials are hardcoded for prototype:
- Email: `hsarosh569@gmail.com`
- Password: `12345678`

Auth state is persisted to `localStorage` under key `pathfinder-auth`.

## Resume Parsing Pipeline

```
Upload file → fileExtractor.extractText(file)
                        ↓
                resumeParser.parseResume(file)
                        ↓
              ┌─── AI configured? ───┐
              ↓                      ↓
            Yes                     No
              ↓                      ↓
   aiResumeParser.aiParse()    heuristicParser (dynamic import)
              ↓                      ↓
         normalizeAIData()    normalizeHeuristicData()
              ↓                      ↓
         ResumeContext.loadParsedResume(data, fileInfo)
```

## Theme System

All colors are defined as CSS custom properties in `src/index.css`:
- `:root` — Light mode (default)
- `.dark` — Dark mode overrides

Tailwind config references `var(--color-*)` so all components using custom colors automatically respect the active theme. Theme preference is stored in `localStorage` under key `pathfinder-appearance`.

---

# Coding Guidelines

* Use React functional components and hooks only.
* Write clean, readable, and maintainable code.
* Prefer composition over duplication; avoid unnecessary abstraction.
* Use meaningful variable, function, and component names.
* Follow modern React best practices.
* Keep code simple and scalable.

---

# Component Rules

* Use PascalCase for every component.
* One component per file with a single responsibility.
* Create reusable components instead of duplicating UI.
* Extract repeated data into the `data/` folder.
* Generic UI belongs in `components/ui/`.
* Feature-specific components belong in their respective folders.
* Never hardcode content that belongs in `data/`.

---

# State Management Rules

* Auth state goes in `AuthContext`.
* Resume data goes in `ResumeContext`.
* Form state stays local to the component.
* User preferences (theme, settings) persist to `localStorage`.
* AI provider configuration persists to `localStorage`.
* Resume state must never reset when navigating between stepper steps.
* Preview must stay synchronized with form state in real time.

---

# UI/UX Guidelines

* Build responsive layouts for desktop, tablet, and mobile.
* Use `h-screen overflow-hidden` + scrollable main area pattern for dashboard.
* Keep spacing consistent using the project's spacing scale.
* Maintain consistent typography using the project's font-size tokens.
* Build reusable UI patterns before duplicating.
* Prioritize accessibility (semantic HTML, ARIA, keyboard nav).
* Create clean and modern interfaces without visual clutter.
* Keep animations subtle and purposeful.
* Use `focus-visible` for focus indicators (not `focus`).

---

# AI Assistant Guidelines

Before making changes:

* Read the existing project structure and CLAUDE.md.
* Reuse existing components whenever possible.
* Search for similar implementations before creating new ones.
* Keep the architecture consistent.
* Prefer simple and maintainable solutions.
* Follow the project's coding conventions.
* Keep AI features provider-agnostic — never hardcode to a single AI provider.
* Always use `npm run build` to verify changes compile without errors.

---

# Git Commit Convention

Use Conventional Commits.

Examples:

* `feat: add landing page FAQ section`
* `feat: implement authentication with ProtectedRoute`
* `feat: add resume upload and AI parsing pipeline`
* `feat: create settings page with profile editing and dark mode`
* `fix: resolve sidebar responsive overlap on mobile`
* `docs: update WORKFLOW.md with new features`
* `style: improve button hover states`
* `refactor: extract heuristic parser to separate module`
* `chore: install lucide-react dependency`

---

# Framework Rules

* This project uses React + Vite. Do not migrate to Next.js, CRA, or another framework.
* Use JavaScript only unless explicitly requested otherwise.
* Do not add backend or database — prototype uses localStorage and client-side AI calls.

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

* Resume creation and improvement
* AI-powered resume parsing (upload → AI → structured data)
* Cover letter generation
* Interview preparation
* Job application tracking
* AI-powered career guidance
* Profile and settings management

The application should remain clean, scalable, maintainable, and easy to extend as new features are added.

---

# Additional Project Rules

1. Never hardcode UI data except temporary authentication credentials.
2. Resume preview must always stay synchronized with the editor forms.
3. Dashboard must be fully responsive with proper empty states.
4. Sidebar remains fixed on desktop; only the content area scrolls.
5. Forms should never lose user data when navigating between stepper steps.
6. Keep reusable UI components in `components/ui/`.
7. AI features should remain provider-agnostic (Gemini/OpenAI/Hugging Face).
8. Verify every UI change by running `npm run build` and checking for errors.
9. Avoid duplicated layouts by extracting reusable UI into shared components.
10. Use CSS custom properties for theming — never hardcode colors in components.
11. Always wrap dashboard routes with `<ProtectedRoute>`.
12. Keep documentation updated alongside code changes.
