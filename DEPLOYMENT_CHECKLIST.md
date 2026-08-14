# Deployment Checklist (FE-11 Template)

Project: Pathfinder AI
Deployed frontend: https://pathfinder-ai-app.vercel.app/
Deployed backend: https://ai-career-companion-production-31e3.up.railway.app/

Checklist (mark each item when complete):

- [x] Build verified locally (`npm run build` in frontend)
- [x] Environment variables configured in deployment (GROQ_KEY / GEMINI_KEY if used)
- [x] Backend connected to production MongoDB and the connection string is secured (Railway env)
- [x] CORS configured to allow frontend origin
- [x] Error reporting: basic logging to console (consider Sentry for production)
- [ ] Monitoring: uptime checks and basic alerting configured
- [ ] Rate limit policy documented for AI provider usage
- [x] Rollback plan: redeploy previous working commit from `main` (manual Vercel/Railway redeploy)
- [ ] Secrets rotation process documented
- [ ] Backup plan for uploaded resumes (currently stored on server; consider S3)
- [x] HTTPS enforced via hosting platforms

How it fails safely

- AI parsing failures: backend catches parse errors and returns raw extracted text so the frontend can still show editable content.
- Upload size/type validation: frontend validates file types; backend limits size and rejects unsupported mimetypes.
- Unauthenticated access: dashboard routes protected on frontend; backend routes that require auth validate JWTs.

Rollback plan

1. In Vercel/Railway, select the previous successful deployment and click "Redeploy".
2. If the previous commit is broken, revert the PR/commit on `main` and redeploy.
3. If DB migrations were applied, restore the DB from backup (not implemented; document before running destructive migrations).

Sign-off

- Deployed by: (your name)
- Date: (fill date)
