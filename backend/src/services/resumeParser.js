// AI-powered resume parser.
// Sends extracted resume text to the Gemini model and asks it to
// return structured JSON. Strips markdown fences, validates the
// response shape, and falls back to partial data if parsing fails.

import { generateText } from './gemini.js'

const EXPECTED_TOP_KEYS = ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications']

function buildPrompt(text) {
  return `You are a resume parser. Extract structured data from the following resume text and return ONLY valid JSON. Do not include markdown formatting, code fences, or any text outside the JSON object.

Return exactly this structure:
{
  "personal": { "fullName": "", "professionalTitle": "", "email": "", "phone": "", "location": "", "portfolio": "", "linkedin": "", "github": "" },
  "summary": "",
  "experience": [{ "jobTitle": "", "company": "", "startDate": "", "endDate": "", "currentlyWorking": false, "description": "", "achievements": "" }],
  "education": [{ "institution": "", "degree": "", "fieldOfStudy": "", "startDate": "", "endDate": "", "grade": "", "description": "" }],
  "skills": { "technical": [], "soft": [], "languages": [] },
  "projects": [{ "name": "", "role": "", "startDate": "", "endDate": "", "description": "", "technologies": [], "githubLink": "", "liveLink": "" }],
  "certifications": [{ "name": "", "issuer": "", "date": "", "url": "" }]
}

Rules:
- Fill every field you can find data for. Use empty strings or empty arrays for missing data.
- dates should be in YYYY-MM format when available.
- "currentlyWorking": true only if the text explicitly says "present" or "current".
- skills.technical, skills.soft, and skills.languages should be arrays of strings.
- For certifications, if only a name is mentioned without issuer/date/url, still include it.

Resume text:
${text}`
}

function cleanJsonResponse(raw) {
  let cleaned = raw.trim()

  // Remove markdown code fences (```json ... ``` or ``` ... ```).
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim()
  }

  // Remove any leading/trailing non-JSON characters.
  const firstBrace = cleaned.indexOf('{')
  const lastBrace = cleaned.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1)
  }

  return cleaned
}

function validateParsedData(data) {
  const errors = []

  // Check top-level keys exist.
  for (const key of EXPECTED_TOP_KEYS) {
    if (!(key in data)) {
      errors.push(`Missing top-level key: "${key}"`)
    }
  }

  // personal must be an object.
  if (data.personal && typeof data.personal !== 'object') {
    errors.push('"personal" must be an object')
  }

  // summary must be a string.
  if (data.summary !== undefined && typeof data.summary !== 'string') {
    errors.push('"summary" must be a string')
  }

  // Arrays must be arrays.
  for (const key of ['experience', 'education', 'projects', 'certifications']) {
    if (data[key] !== undefined && !Array.isArray(data[key])) {
      errors.push(`"${key}" must be an array`)
    }
  }

  // skills must be an object with array properties.
  if (data.skills && typeof data.skills === 'object') {
    for (const sk of ['technical', 'soft', 'languages']) {
      if (data.skills[sk] !== undefined && !Array.isArray(data.skills[sk])) {
        errors.push(`"skills.${sk}" must be an array`)
      }
    }
  }

  return errors
}

export async function parseResumeText(resumeText) {
  if (!resumeText || typeof resumeText !== 'string') {
    throw Object.assign(new Error('Resume text is required for parsing.'), { status: 400 })
  }

  const prompt = buildPrompt(resumeText)

  const raw = await generateText(prompt)

  if (!raw) {
    throw Object.assign(new Error('AI returned an empty response.'), { status: 502 })
  }

  const cleaned = cleanJsonResponse(raw)

  let parsed
  try {
    parsed = JSON.parse(cleaned)
  } catch (err) {
    throw Object.assign(
      new Error(`Failed to parse AI response as JSON: ${err.message}. Raw: ${raw.slice(0, 200)}`),
      { status: 502 },
    )
  }

  const validationErrors = validateParsedData(parsed)
  if (validationErrors.length > 0) {
    throw Object.assign(
      new Error(`AI response failed validation: ${validationErrors.join('; ')}`),
      { status: 502 },
    )
  }

  return parsed
}
