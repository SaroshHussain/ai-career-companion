# Capstone Submission: Pathfinder AI

Project Brief (one paragraph)

Pathfinder AI is an AI-powered career companion that helps users upload or build resumes, generate cover letters, search and save jobs, and practice interview responses. It targets job seekers and early-career professionals who want an integrated, privacy-conscious tool to improve their applications and interview readiness. I chose this idea because it lets me combine accessible frontend components, real-world file parsing, and meaningful LLM-powered resume parsing and generation into a single, demonstrable product.

Live App

- Frontend: https://pathfinder-ai-app.vercel.app/
- Backend: https://ai-career-companion-production-31e3.up.railway.app/

Repository

- GitHub: [(link to repo)](https://github.com/SaroshHussain/ai-career-companion) — ensure your repo is pushed and public.

How to run locally (one command to install & start)

```bash
npm install && npm run dev
```

Architecture overview

- Frontend: React + Vite (src/)
- Backend: Express + Node (backend/src/) — handles file uploads, AI orchestration, and persistence
- AI services: Groq/Gemini adapters in `backend/src/services/` (gemini.js, groq.js, resumeParser.js)
- Persistence: MongoDB (used in backend; connection string in environment)

AI integration (summary)

- Resume parsing: `backend/src/services/resumeParser.js` — sends extracted resume text to Groq (or configured provider) with a structured prompt that returns strict JSON. The parser enforces defaults and normalization to avoid hallucination.
- Assistant/chat: `backend/src/controllers/aiController.js` — uses a system prompt (`ASSISTANT_SYSTEM_PROMPT`) to set the assistant role as Pathfinder, keeping replies concise and domain-specific.
- API keys: GEMINI_KEY and GROQ_KEY configured in backend environment variables.

Known limitations & future improvements

- Authentication is currently a prototype (hardcoded credentials). Replace with real auth and user accounts.
- Tests are not yet implemented — will add unit and E2E tests next.
- Need multi-template resume output and server-side rate-limit handling improvements.

Testing (placeholder)

- Tests will be added in a follow-up commit. For now, include test evidence screenshots and coverage reports in this folder when available.

Performance & accessibility audits

- Run Lighthouse locally and paste the report or a screenshot into `docs/a11y/` and `docs/perf/`.
- Run axe or WAVE and include the output; document at least one concrete fix you applied.

Deployment & operation

- See DEPLOYMENT_CHECKLIST.md for the filled checklist and rollback instructions.

What I completed now

- Added this Capstone submission scaffolding and deployment checklist file.
- Documented AI integration and prompt locations.

What you (owner) need to do to finish the capstone

1. Add screenshots: UI flows, Lighthouse report, axe output, and at least one test result screenshot. Place them under `docs/screenshots/`.
2. Run Lighthouse (mobile + desktop) and paste scores in this file or `docs/perf/lighthouse.md`.
3. Run an accessibility scan (axe or WAVE), fix at least one issue, and note the change in this file.
4. Add at least one unit test for a critical component and an end-to-end test for the upload→parse→edit flow (you said we'll add tests later). Commit tests and coverage artifacts.
5. Fill in the GitHub repo URL above and ensure the site is deployed from `main` or `production` branch.
6. Add a one-page Reflection (save as `docs/REFLECTION.md`).

If you’d like, I can: create the `docs/` folders, add Lighthouse run instructions, and prepare a sample unit test scaffold now.
