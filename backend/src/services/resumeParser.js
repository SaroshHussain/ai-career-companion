// AI-powered resume parser.
// Sends extracted resume text to the Gemini model and asks it to
// return structured JSON. Strips markdown fences, validates the
// response shape, and falls back to partial data if parsing fails.

import { generateText } from './gemini.js'

const TOP_KEYS = ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications']

function buildPrompt(text) {
  return `You are a precise resume parser. Extract structured data from the following resume text and return ONLY valid JSON. Do not include markdown formatting, code fences, or any text outside the JSON object.

Return exactly this structure — use empty strings "" for missing text values, false for missing booleans, and [] for missing arrays:
{
  "personal": { "fullName": "", "professionalTitle": "", "email": "", "phone": "", "location": "", "portfolio": "", "linkedin": "", "github": "" },
  "summary": "",
  "experience": [{ "jobTitle": "", "company": "", "employmentType": "", "location": "", "startDate": "", "endDate": "", "currentlyWorking": false, "description": "", "achievements": "" }],
  "education": [{ "institution": "", "degree": "", "fieldOfStudy": "", "location": "", "startDate": "", "endDate": "", "grade": "", "description": "" }],
  "skills": { "technical": [], "soft": [], "languages": [] },
  "projects": [{ "name": "", "role": "", "startDate": "", "endDate": "", "description": "", "technologies": [], "githubLink": "", "liveLink": "" }],
  "certifications": [{ "name": "", "issuer": "", "date": "", "credentialId": "", "url": "" }]
}

GENERAL INSTRUCTIONS:
- Read the ENTIRE resume before extracting. Resume layouts vary widely — do not assume a fixed order.
- Contact info (name, email, phone, location, LinkedIn, GitHub, portfolio) may be at the top, in a sidebar, in a header/footer, or spread across the page. Scan everything.
- Extract EVERY piece of information that appears. Never invent or hallucinate missing data.
- Preserve the original wording from the resume — do not paraphrase or reword bullet points.
- Return ONLY valid JSON. No explanations, no markdown, no extra text.

SECTION-BY-SECTION RULES:

PERSONAL:
- fullName: the person's full name. Usually the largest text at the top.
- professionalTitle: the role headline directly under the name (e.g. "Senior Software Engineer", "Marketing Manager").
- email: any email address found anywhere.
- phone: any phone number. Include country code if present. Standardize to international format.
- location: city, state, province, or country. Often near contact info.
- portfolio: any personal website or portfolio URL that is NOT linkedin.com or github.com.
- linkedin: full LinkedIn URL. Look for "linkedin.com/in/" patterns.
- github: full GitHub URL. Look for "github.com/" patterns.

SUMMARY:
- Also called "Professional Summary", "Profile", "About Me", "Career Objective", "Summary of Qualifications", "Personal Statement".
- Extract the full text exactly as written — do not truncate.

EXPERIENCE:
- Section may be titled "Experience", "Work Experience", "Work History", "Employment", "Professional Experience", "Relevant Experience", "Career History".
- Extract ALL entries. For each entry:
  - jobTitle: the role/position title.
  - company: the employer name.
  - employmentType: if mentioned (e.g. "Full-time", "Part-time", "Contract", "Internship", "Freelance").
  - location: the work location (city, state, remote).
  - startDate, endDate: use YYYY-MM when month and year are visible, YYYY when only year, or "" if not found.
  - currentlyWorking: true ONLY if the end date is "Present", "Current", "Now", or ongoing (case-insensitive).
  - description: ALL bullet points and responsibilities under this role. Preserve original wording. Include everything.
  - achievements: notable accomplishments, metrics, or quantifiable results if clearly separated from responsibilities.

EDUCATION:
- Section may be titled "Education", "Academic Background", "Qualifications", "Education & Training".
- Extract ALL entries. For each entry:
  - institution: school or university name.
  - degree: degree type (e.g. "Bachelor of Science", "Master of Arts", "B.Sc.", "MBA", "High School Diploma").
  - fieldOfStudy: the major or concentration (e.g. "Computer Science", "Marketing").
  - location: school location (city, state).
  - startDate, endDate: same format rules as experience.
  - grade: GPA, percentage, or class if mentioned (e.g. "3.8 GPA", "First Class Honours", "Summa Cum Laude").
  - description: honors, activities, relevant coursework, thesis titles — if mentioned.

SKILLS:
- Section may be titled "Skills", "Technical Skills", "Core Competencies", "Expertise", "Key Skills", "Skills & Expertise", "Languages & Technologies".
- technical: programming languages, frameworks, libraries, tools, databases, cloud platforms, software, technologies. Each skill is one string.
- soft: interpersonal skills (e.g. "Leadership", "Communication", "Teamwork", "Problem Solving").
- languages: human languages (e.g. "English", "Spanish", "French") with optional proficiency (e.g. "English (Native)", "Spanish (Fluent)").
- If a skill could be either technical or soft, put it in technical. When in doubt, prefer technical over soft.
- Extract ALL skills mentioned — do not deduplicate or merge similar skills.

PROJECTS:
- Section may be titled "Projects", "Key Projects", "Personal Projects", "Academic Projects", "Project Experience".
- For each project:
  - name: project title.
  - role: role on the project if mentioned.
  - startDate, endDate: same format rules.
  - description: brief description of the project. Preserve original wording.
  - technologies: array of technologies/tools used in the project.
  - githubLink: GitHub repository URL if present.
  - liveLink: live/demo URL if present.

CERTIFICATIONS:
- Section may be titled "Certifications", "Licenses", "Certifications & Licenses", "Professional Certifications", "Licenses & Certifications".
- For each certification:
  - name: certification name (e.g. "AWS Solutions Architect", "PMP").
  - issuer: the issuing organization (e.g. "Amazon Web Services", "PMI").
  - date: issue date in YYYY-MM or YYYY format.
  - credentialId: credential ID or license number if available.
  - url: URL to verify the credential if available.

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

function fillDefaults(data) {
  // Ensure every expected key exists with a valid default.
  for (const key of TOP_KEYS) {
    if (!(key in data) || data[key] === null || data[key] === undefined) {
      if (key === 'personal') data[key] = {}
      else if (key === 'summary') data[key] = ''
      else if (key === 'skills') data[key] = { technical: [], soft: [], languages: [] }
      else data[key] = []
    }
  }

  // personal must be an object — reset if it's the wrong type.
  if (typeof data.personal !== 'object' || data.personal === null) {
    data.personal = {}
  }
  // summary must be a string.
  if (typeof data.summary !== 'string') {
    data.summary = ''
  }
  // Arrays that must be arrays.
  for (const key of ['experience', 'education', 'projects', 'certifications']) {
    if (!Array.isArray(data[key])) {
      data[key] = []
    }
  }
  // skills must be an object with array properties.
  if (typeof data.skills !== 'object' || data.skills === null) {
    data.skills = { technical: [], soft: [], languages: [] }
  }
  for (const sk of ['technical', 'soft', 'languages']) {
    if (!Array.isArray(data.skills[sk])) {
      data.skills[sk] = []
    }
  }

  return data
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

  return fillDefaults(parsed)
}
