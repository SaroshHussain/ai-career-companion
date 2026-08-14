# Audit Instructions

Lighthouse (Chrome)

1. Build and serve the production bundle locally:

```bash
cd frontend
npm run build
npm run preview
```

2. Open Chrome, go to `http://localhost:5173` (or the preview port), open DevTools > Lighthouse, and run both Mobile and Desktop audits. Save the JSON reports under `docs/perf/`.

axe (accessibility)

1. Install axe DevTools for Chrome or run axe-core programmatically.
2. Run an audit on key pages (Landing, Resume Builder, Dashboard). Save output under `docs/a11y/`.

Suggestions

- Aim for Lighthouse 85+ on mobile and 90+ on desktop.
- Fix critical contrast and landmark/aria roles first to improve accessibility.
