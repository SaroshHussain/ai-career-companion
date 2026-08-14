# Pathfinder AI

**An AI-powered career companion** that helps professionals build resumes, practice interviews, generate cover letters, and manage their job search — all in one modern, responsive dashboard.

---

## Features

### Authentication
- Sign In with hardcoded credentials (prototype)
- Session persistence via `localStorage`
- Route protection — unauthenticated users cannot access the dashboard
- Sign Out confirmation dialog with accessible modal

### Dashboard
- Responsive layout (desktop, tablet, mobile)
- Fixed collapsible sidebar with smooth transitions
- Dynamic user greeting using the authenticated user's name
- Clean empty states for every section instead of placeholder data
- Search bar, notifications, and AI Assistant access in the top navbar

### Resume Builder

Two ways to create a resume:

**Upload Existing Resume**
1. Upload a PDF, DOC, or DOCX file.
2. Text is extracted using `pdfjs-dist` or `mammoth`.
3. Extracted text is sent to a configurable AI provider (Gemini, OpenAI, Hugging Face).
4. The AI returns structured JSON with all sections identified.
5. Forms are pre-filled; every field is editable.
6. Live A4 preview updates in real time.
7. Download the polished resume as a PDF.

**Create from Scratch**
1. Start with empty forms in a 6-step wizard (Personal, Education, Experience, Skills, Projects, Preview).
2. Add multiple entries for experience, education, and projects.
3. Editable tag-based skill input.
4. Live preview updates instantly with every change.
5. Download as a PDF.

### AI Resume Parsing

- Provider-agnostic architecture supports Gemini, OpenAI, and Hugging Face.
- Users configure their own API key via the AI Parser Settings modal.
- Built-in heuristic parser serves as an automatic fallback when no AI provider is configured.
- Strict prompt engineering ensures the AI returns valid JSON matching the expected schema.

### Resume Preview

- A4-sized document rendering (595px × 842px).
- Professional typography, section headings, and bullet points.
- Zoom controls (in, out, fit width, fit page).
- Multi-page support for long resumes.
- PDF download via `react-to-print`.

### Settings

- Tabbed interface (Profile, Account, Notifications, Security, Billing).
- Profile editing: avatar upload (PNG/JPG, 2MB limit), name, title, bio.
- Personal information: email, phone, location with inline validation.
- Professional links: LinkedIn, portfolio, GitHub with URL validation.
- Appearance: Light / Dark / System theme toggle.
- Changes persist to `localStorage` with a success toast notification.

### Landing Page

- Hero section with AI-powered career messaging
- Feature grid (Resume Optimization, Interview Coach, Job Matching, Cover Letter)
- Three-step process (Upload Profile, AI Optimization, Land the Offer)
- FAQ accordion
- Newsletter subscription footer
- Responsive at all breakpoints

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 6 |
| Language | JavaScript (ES6+) |
| Styling | Tailwind CSS 3 (CSS custom properties for theming) |
| Routing | React Router DOM 7 |
| Icons | react-icons, lucide-react |
| PDF Parsing | pdfjs-dist, mammoth |
| PDF Export | react-to-print |
| AI Providers | Gemini, OpenAI, Hugging Face (configurable) |

---

## Folder Structure

```
src/
├── components/
│   ├── landing/          # Landing page sections
│   ├── dashboard/        # Dashboard layout, sidebar, navbar, cards
│   ├── resume/           # Resume builder stepper, forms, preview, zoom
│   ├── settings/         # Settings page tabs, profile, links, appearance
│   └── ui/               # Reusable UI primitives
├── context/
│   ├── AuthContext.jsx    # Authentication state (login, logout, localStorage)
│   └── ResumeContext.jsx  # Resume data state and CRUD methods
├── hooks/                 # Custom React hooks
├── services/
│   ├── fileExtractor.js   # PDF/DOCX text extraction
│   ├── aiResumeParser.js  # Provider-agnostic AI parsing
│   ├── heuristicParser.js # Built-in fallback parser
│   └── resumeParser.js    # Orchestration layer
├── data/                  # Static content (FAQ, features, steps, etc.)
├── pages/                 # Route-level page components
├── App.jsx                # Application root with routing
└── index.css              # Global styles and CSS custom properties
```

---

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Capstone status

- Capstone scaffold added: [CAPSTONE.md](CAPSTONE.md)
- Deployment checklist: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- AI integration notes: [AI_INTEGRATION.md](AI_INTEGRATION.md)
- Docs and audit instructions: [docs/README.md](docs/README.md), [docs/AUDIT_INSTRUCTIONS.md](docs/AUDIT_INSTRUCTIONS.md)

---

## Project Status

The prototype is fully functional with the following capabilities:

- **Landing page** with all marketing sections
- **Authentication** with login/logout and protected routes
- **Dashboard** with responsive layout and empty states
- **Resume builder** with upload-to-parse-to-edit workflow
- **AI-powered resume parsing** with provider-agnostic configuration
- **Live A4 resume preview** with zoom and PDF download
- **Settings page** with profile editing and dark mode
- **Responsive design** across desktop, tablet, and mobile

---

## Future Improvements

- Real authentication with backend integration
- User accounts with database persistence
- Multiple resume templates and themes
- Multiple resume versions per user
- AI interview feedback with scoring
- Job tracking and application management dashboard
- Resume scoring and ATS compatibility analysis
- Cloud storage for uploaded documents
- Social login (Google, LinkedIn, GitHub)
- Email notifications and reminders
