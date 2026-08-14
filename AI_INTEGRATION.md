# AI Integration Notes

This document summarizes where AI is used in the project, the prompts, and how to configure keys.

Resume parsing

- Location: `backend/src/services/resumeParser.js`
- Provider: Groq by default (`backend/src/services/groq.js`), with Gemini adapter available (`backend/src/services/gemini.js`).
- Prompt: The parser builds a strict, explicit JSON prompt (see `buildPrompt()` in `resumeParser.js`) that instructs the model to return ONLY valid JSON, a canonical schema, and strict normalization rules (dates, phones, URLs). The prompt emphasizes "Do not invent" and preserves original wording.
- Response handling: `cleanJsonResponse()` strips code fences and non-JSON wrappers; `fillDefaults()` applies schema defaults and normalizes missing fields.

Assistant chat & cover letters

- Location: `backend/src/controllers/aiController.js`
- System prompt: `ASSISTANT_SYSTEM_PROMPT` defines the assistant persona (Pathfinder) and instructs concise, practical answers. It asks the model to ask clarifying questions as needed and not to invent facts from the user's resume.
- Cover letter generation: `generateCoverLetter` route constructs a focused prompt using the job posting and the user's parsed resume.

API keys and environment variables

- `GEMINI_KEY` — Gemini API key (x-goog-api-key header)
- `GEMINI_MODEL` — optional Gemini model alias
- `GROQ_KEY` — Groq API key (Bearer token)
- These must be set in your deployment environment (Vercel, Railway). Do not commit keys to the repo.

Rate limits and fallbacks

- The server catches provider errors and returns structured error responses. When parsing fails, the backend returns the raw extracted text so the frontend can still let users edit content.
- Consider adding retries with exponential backoff and request batching to reduce failures.

Prompt engineering notes

- Keep temperature low for parsing tasks (`temperature: 0.1` in `groq.js`) to encourage deterministic output.
- Use explicit schema instructions and normalization rules to avoid hallucinations.
- Strip any non-JSON wrappers from responses before parsing.

Where to update prompts

- `backend/src/services/resumeParser.js` — the full instruction prompt lives in `buildPrompt()`.
- `backend/src/controllers/aiController.js` — assistant system prompt constant.
