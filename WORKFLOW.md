# AI Career Companion Development Workflow

This document describes the development workflow used while building the **AI Career Companion**. It covers the initial landing page implementation comparison as well as the full-featured production build including authentication, dashboard, resume builder, and settings.

---

## Landing Page Implementation — Prompt Engineering Comparison

During the initial phase, the landing page was implemented twice using two different prompting approaches to evaluate how prompt quality affects code quality, maintainability, and review effort.

### Objective

Implement the **Landing Page** in two separate branches:

- **Round One:** Use a single vague prompt and accept the generated output with minimal changes.
- **Round Two:** Use a detailed prompt including project context, file references, design constraints, reusable component requirements, expected behavior, and a verification step.

The goal was to compare both implementations and identify how prompt engineering improves AI-assisted software development.

---

### Round One — Vague Prompt

The first implementation used a simple prompt requesting a landing page without providing detailed project context or constraints.

The generated page contained basic sections (Hero, Features, CTA, Footer) but had several issues:

- Components were duplicated instead of reused.
- Folder structure did not fully follow the project architecture.
- Inconsistent spacing and typography.
- Styling differed from the existing design system.
- Responsiveness required manual fixes.
- Some sections lacked polish and consistency.

---

### Round Two — Precise Prompt

The second implementation used a detailed prompt that included references to the existing project structure, folder locations, design system guidelines, Tailwind CSS conventions, color palette, typography hierarchy, responsive requirements, accessibility expectations, and verification instructions.

The generated implementation integrated naturally into the existing project, reused existing components, followed the established folder structure, maintained consistent spacing and typography, and required only minor refinements.

---

### Lessons Learned

Prompt quality has a direct impact on development quality. Providing detailed project context, architectural constraints, reusable component guidelines, expected behavior, and verification requirements enables AI to generate cleaner, more maintainable, and production-ready code.

---

## Standard Development Workflow

For all future development, the following workflow is used:

### 1. Understand

- Read the project documentation and CLAUDE.md.
- Understand the folder structure and component hierarchy.
- Review existing components before creating new ones.
- Follow the project's design system (colors, typography, spacing, shadows).

### 2. Plan

- Break the task into smaller, verifiable steps.
- Identify reusable UI components and data patterns.
- Decide file placement following the existing structure.
- Consider responsive behavior, accessibility, and edge cases.
- Review the existing codebase for patterns to follow.

### 3. Build

- Use React functional components only.
- One component per file, focused on a single responsibility.
- Reuse existing UI primitives from `components/ui/`.
- Store configurable content in `data/` — never hardcode.
- Use custom hooks for reusable logic in `hooks/`.
- Keep styling consistent using Tailwind CSS utility classes.
- Use the design system tokens defined in `tailwind.config.js`.

### 4. Verify

- Test responsiveness across desktop, tablet, and mobile.
- Check accessibility (keyboard navigation, ARIA labels, semantic HTML).
- Remove unused imports and dead code.
- Verify no console errors in development.
- Run the build:
  ```bash
  npm run build
  ```
- The project must build successfully before committing.

---

## Authentication Workflow

```
User navigates to /dashboard
        ↓
ProtectedRoute checks auth state
        ↓
Not authenticated → redirect to /login
Authenticated → render dashboard
```

### Login flow:

1. User enters email and password.
2. On submit, credentials are validated against the hardcoded store:
   - Email: `hsarosh569@gmail.com`
   - Password: `12345678`
3. Invalid credentials show an inline error: "Invalid email or password."
4. Valid credentials create an auth object `{ isAuthenticated, email, name }` stored in React Context and persisted to `localStorage`.
5. User is redirected to `/dashboard`.
6. On page refresh, `localStorage` restores the session automatically.
7. Already-authenticated users are auto-redirected from `/login` to `/dashboard`.

### Sign Out:

1. User clicks "Sign Out" in the sidebar.
2. A centered confirmation modal appears with the title "Sign Out" and message: "Are you sure you want to sign out? You will need to sign in again to access your dashboard."
3. Cancel closes the modal; Sign Out clears auth state and `localStorage`, then redirects to `/login`.

### Route protection:

- All `/dashboard/*` routes are wrapped with `<ProtectedRoute>`.
- Unauthenticated users are redirected to `/login` with `replace: true`.
- The auth state is managed centrally via `AuthContext` and the `useAuth` hook.

---

## Dashboard Workflow

### Layout:

- Fixed left sidebar with navigation items.
- Top navbar with search bar, notifications icon, and AI Assistant button.
- Main content area scrolls independently.
- Sidebar can be collapsed/expanded on desktop.
- On mobile, sidebar is hidden by default and opened via hamburger menu overlay.

### Empty states:

The dashboard shows clean empty states instead of placeholder analytics:

- **Resume Builder** — "No resume has been created yet." + CTA button
- **Job Finder** — "No job searches yet."
- **Interview Coach** — "No interview sessions yet."
- **Cover Letter** — "No cover letters created yet."

### User greeting:

The welcome message uses the authenticated user's name: "Welcome back, Sarosh Hussain!"

---

## Resume Builder Workflow

### Option 1: Upload Existing Resume

```
Upload Resume (PDF / DOC / DOCX)
        ↓
Extract raw text (pdfjs-dist / mammoth)
        ↓
Check AI provider configuration
        ↓
If AI configured → Send text to AI model (Gemini / OpenAI / Hugging Face)
Else → Use heuristic parser (local fallback)
        ↓
AI returns structured JSON with sections:
  - Personal info (name, email, phone, links)
  - Professional summary
  - Experience (position, company, dates, bullet points)
  - Education (institution, degree, field, dates)
  - Skills (technical, soft, languages, certifications)
  - Projects (name, description, technologies, links)
        ↓
Populate editor forms with structured data
        ↓
Forms are fully editable
        ↓
Live preview updates in real time
        ↓
User can download the updated resume as PDF
```

### AI Provider Configuration:

- The AI parser is provider-agnostic.
- Supported providers: **Google Gemini**, **OpenAI**, **Hugging Face**.
- Users enter their own API key via the "AI Parser Settings" button on the Resume Builder landing page.
- Keys are stored in `localStorage` and never sent to external servers.
- If no AI provider is configured, the built-in heuristic parser is used as fallback.

### Prompt Engineering for AI Parsing:

The AI is given a strict system prompt instructing it to return ONLY valid JSON in the expected schema. Rules include:
- Maintain original hierarchy (companies with jobs, dates with entries).
- Bullet points become array items.
- Identify sections: Personal, Summary, Experience, Education, Skills, Projects, Certifications, Languages.
- Unrecognized content goes into an "uncategorized" field.
- No markdown, no code fences, no explanation — pure JSON.

### Option 2: Create New Resume

1. User clicks "Create New Resume" on the Resume Builder landing page.
2. Multi-step form wizard with 6 steps:
   - **Personal** — Name, title, email, phone, location, links, summary
   - **Education** — Institution, degree, field, dates (add/remove multiple entries)
   - **Experience** — Job title, company, dates, description, achievements (add/remove multiple)
   - **Skills** — Technical skills, soft skills, certifications (editable tag-based input)
   - **Projects** — Name, description, technologies, links (add/remove multiple)
   - **Preview** — Full A4 document preview with zoom controls
3. Live preview updates instantly as forms change.
4. Download the final resume as a PDF using `react-to-print`.

### Resume Editor Layout:

- **Left panel:** Scrollable 6-step stepper with form content.
- **Right panel:** Sticky A4-sized live preview with zoom controls (zoom in, zoom out, fit width, fit page).
- On mobile, the layout stacks vertically (forms above, preview below).
- Uploaded document reference shown as collapsible section above the preview.

### Resume Preview:

- A4 dimensions (595px × 842px) with proper margins.
- Professional typography with section headings, bullet points, and spacing.
- Multi-page support for long resumes.
- Sections: header, summary, experience, projects, education, skills, languages, certifications.
- No raw text — all content rendered as structured HTML.
- Soft shadow and responsive scaling.

---

## Job Finder Workflow

### Flow:

```
Dashboard → "Job Finder" card → /dashboard/jobs
        ↓
Search form (keywords + region)
        ↓
GET /api/jobs?keywords=...&region=...&page=1&resultsPerPage=20
        ↓
Backend → POST https://jooble.org/api/{JOOBLE_API_KEY}
        ↓
Card grid (title, company, location, type, salary, snippet, source, updated)
        ↓
Click card → /dashboard/jobs/:jobId (job detail page)
```

### Backend:

- **`services/jooble.js`** — Calls the Jooble REST API with `fetch`. API key comes from `JOOBLE_API_KEY` env var and is passed in the URL path (`https://jooble.org/api/{key}`).
- **Region param**: The Jooble public docs describe a `location` parameter, but the actual API accepts a region field (`rgns`) — this is verified working and always used.
- **`controllers/jobsController.js`** — `GET /api/jobs` validates keywords, delegates to the Jooble service, and returns `{ totalCount, page, resultsPerPage, jobs }`. Individual jobs from recent searches are kept in a bounded in-memory cache.
- **`GET /api/jobs/:id`** — Jooble has no per-job detail endpoint, so this reads from the in-memory cache of recent search results. Returns 404 if the job is no longer cached (deep links after a server restart need a fresh search).

### Frontend:

- **`pages/JobFinder.jsx`** — Search form (keywords + region), responsive card grid, pagination, empty state, and error state. Search params sync to the URL query string so results survive refresh.
- **`pages/JobDetailPage.jsx`** — Shows title, company, location, type, salary, source, updated date, description snippet, and an "Apply on Jooble" link. Accepts the job via router state for instant render, falling back to `GET /api/jobs/:id`.
- **`components/jobs/JobCard.jsx`** — Reusable card for a single search result.
- **`services/api.js`** — `searchJobs()` and `getJob()` helpers.

### Notes:

- Results are snippets/truncated excerpts from Jooble — there is no full description in the API response.
- Salary is free-text when present and may be empty.
- 403 from Jooble means an invalid API key; 404 means the endpoint is unavailable.

---

## Settings Workflow

### Page structure:

- Tabbed interface with 5 tabs: **Profile**, **Account**, **Notifications**, **Security**, **Billing**.
- Only the Profile tab is fully implemented; other tabs show a "Coming Soon" placeholder.

### Profile tab sections:

1. **Profile** — Avatar upload (PNG/JPG, 2MB limit, preview immediately), full name, professional title, bio textarea.
2. **Personal Information** — Email (validated), phone (validated), location.
3. **Professional Links** — LinkedIn, portfolio website, GitHub (URL validated).
4. **Appearance** — Light / Dark / System theme selector. Theme is applied immediately via CSS variables on `<html>` and persisted in `localStorage`.
5. **Save / Cancel** — Save persists all fields to `localStorage` and shows a success toast. Cancel restores the last saved state.

### Dark mode:

- All custom design tokens are defined as CSS custom properties in `src/index.css`.
- A `.dark` class override block defines dark-mode equivalents.
- Selecting "Dark" adds `class="dark"` to `<html>`.
- Selecting "System" listens to `prefers-color-scheme` media query.
- Every component using the custom Tailwind color classes automatically switches theme.

---

## Code Architecture

### Context providers

- **`AuthContext`** — Authentication state, login/logout methods, localStorage persistence with SSR guards.
- **`ResumeContext`** — Resume data state, CRUD operations for all sections (personal, education, experience, skills, projects), upload file tracking.

### Services

- **`fileExtractor.js`** — Pure text extraction from PDF/DOCX using pdfjs-dist and mammoth.
- **`aiResumeParser.js`** — Provider-agnostic AI parsing with Gemini, OpenAI, and Hugging Face support. Includes prompt engineering and JSON extraction.
- **`heuristicParser.js`** — Built-in fallback parser with section detection, date parsing, and field extraction. Code-split as a separate chunk.
- **`resumeParser.js`** — Orchestration layer: extract text, try AI (if configured), fall back to heuristic, normalize output.

### Component organization

- `components/landing/` — Landing page sections (Hero, FeatureBento, HowItWorks, FAQ, Footer, Navbar).
- `components/dashboard/` — Dashboard layout (DashboardLayout, Sidebar, TopNavbar, StatCard, etc.).
- `components/resume/` — Resume builder components (stepper, forms, preview, zoom controls, upload zone).
- `components/settings/` — Settings page components (tabs, profile section, personal info, links, appearance).
- `components/ui/` — Reusable UI primitives (Button, Input, Reveal, ConfirmDialog, Toast).

---

## Responsive Design

All pages are responsive across desktop, tablet, and mobile:

- **Sidebar:** Fixed on desktop, collapsible. Overlay on mobile with hamburger toggle.
- **Dashboard:** Cards wrap in responsive grid (4 → 2 → 1 columns).
- **Resume Editor:** Two-column on desktop, stacked on mobile.
- **Settings:** Two-column inputs collapse to single column.
- **Auth pages:** Centered card layout with flexible width.
- **Landing:** Fluid typography and spacing at all breakpoints.
- **No horizontal scrolling** anywhere.

---

## Accessibility

- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`).
- ARIA attributes (`role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-selected`, `aria-expanded`).
- Keyboard navigation (Escape closes modals, Tab cycles focus, Enter submits forms).
- Focus management (auto-focus modal content, restore focus on close).
- Screen reader labels on icon-only buttons.
- `prefers-reduced-motion` compatible (CSS animations are subtle and short).
