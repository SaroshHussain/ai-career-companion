// AI-powered resume parser.
// Sends extracted resume text to the Groq AI model and asks it to
// return structured JSON. The prompt is engineered to extract the
// maximum amount of information from ANY resume layout, recognize
// many section-title variants, preserve original wording, normalize
// dates/phones/URLs, and never fabricate data. The response shape is
// validated and defaulted so downstream consumers always get a usable
// object.
//
// The returned shape is the CANONICAL resume shape used by both the
// frontend editor and the persisted Resume model: the professional
// summary lives in `personal.professionalSummary` (not a top-level
// `summary` key), and `skills` includes a `certifications` category.

import { generateText } from './groq.js'

const TOP_KEYS = [
  'personal',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'awards',
  'publications',
  'volunteer',
  'interests',
  'references',
]

function buildPrompt(text) {
  return `You are an expert resume parser. Extract structured data from the following resume text and return ONLY valid JSON. Do not include markdown formatting, code fences, or any text outside the JSON object.

Return exactly this structure — use empty strings "" for missing text values, false for missing booleans, and [] for missing arrays:
{
  "personal": { "fullName": "", "professionalTitle": "", "email": "", "phone": "", "address": "", "city": "", "state": "", "country": "", "location": "", "portfolio": "", "linkedin": "", "github": "", "professionalSummary": "" },
  "experience": [{ "jobTitle": "", "company": "", "employmentType": "", "location": "", "startDate": "", "endDate": "", "currentlyWorking": false, "description": "", "achievements": "", "technologiesUsed": [] }],
  "education": [{ "institution": "", "degree": "", "fieldOfStudy": "", "location": "", "startDate": "", "endDate": "", "grade": "", "description": "" }],
  "skills": { "technical": [], "soft": [], "tools": [], "frameworks": [], "languages": [], "databases": [], "cloud": [], "certifications": [] },
  "projects": [{ "name": "", "role": "", "startDate": "", "endDate": "", "description": "", "technologies": [], "githubLink": "", "liveLink": "" }],
  "certifications": [{ "name": "", "issuer": "", "date": "", "credentialId": "", "url": "" }],
  "awards": [{ "title": "", "issuer": "", "date": "", "description": "" }],
  "publications": [{ "title": "", "publisher": "", "date": "", "url": "", "description": "" }],
  "volunteer": [{ "role": "", "organization": "", "location": "", "startDate": "", "endDate": "", "currentlyActive": false, "description": "" }],
  "interests": [],
  "references": [{ "name": "", "jobTitle": "", "company": "", "email": "", "phone": "" }]
}

GENERAL INSTRUCTIONS:
- Read the ENTIRE resume before extracting. Resume layouts vary widely — ATS, single-column, two-column, sidebar, modern, multi-page, academic CV, student, creative. Never assume a fixed order.
- Contact info (name, email, phone, address, city, state, country, LinkedIn, GitHub, portfolio) may be at the top, in a sidebar, in a header/footer, in an icon bar, or spread across the page. Scan everything.
- Extract EVERY entry in every section. Never stop after the first entry. If there are 8 jobs, return all 8.
- NEVER invent, guess, or hallucinate data. If something is not present, return "" or [].
- Preserve the original wording from the resume — do not paraphrase, reword, summarize, or truncate bullet points and descriptions. Keep them verbatim, including the bullet markers (-, •, *).
- Remove duplicate entries and duplicate skills (same item appearing more than once, possibly with slightly different casing).
- Split multi-line or comma-separated lists (e.g. a skills line "Java, Python, SQL") into separate array items.
- Normalize dates to YYYY-MM (month and year visible) or YYYY (only year visible). If the text uses "Present"/"Current"/"Now"/"Ongoing" for an end date, set endDate to "" and the *Currently flag to true.
- Normalize phone numbers: keep the digits and leading "+" country code, remove spaces, dashes, and parentheses (e.g. "+1 (555) 123-4567" → "+15551234567").
- Normalize URLs: ensure full URLs include the scheme (prepend "https://" when missing, e.g. "linkedin.com/in/jane" → "https://linkedin.com/in/jane"). Do not fabricate URLs.
- Return ONLY valid JSON. No explanations, no markdown, no extra text.

SECTION-BY-SECTION RULES:

PERSONAL:
- fullName: the person's full name. Usually the largest text at the top. Do not include contact details.
- professionalTitle: the role headline directly under the name (e.g. "Senior Software Engineer", "Marketing Manager").
- email: any email address found anywhere.
- phone: any phone number (see normalization rules above).
- address: street address / street + city if given as a full postal address.
- city: the city of residence.
- state: state, province, or region of residence.
- country: the country of residence.
- location: a readable combined location, e.g. "San Francisco, CA" or "Berlin, Germany". If the resume only lists separate address/city/state/country, compose this field from them.
- portfolio: any personal website or portfolio URL that is NOT linkedin.com or github.com.
- linkedin: full LinkedIn URL. Look for "linkedin.com/in/" patterns, even without a scheme.
- github: full GitHub URL. Look for "github.com/" patterns, even without a scheme.

SUMMARY:
- Section may be titled "Professional Summary", "Profile", "Summary", "About Me", "Career Objective", "Objective", "Summary of Qualifications", "Personal Statement", "Overview", "Highlights", "Intro".
- Extract the full text exactly as written — do not truncate — and put it in personal.professionalSummary (NOT a top-level "summary" key).

EXPERIENCE:
- Section may be titled "Experience", "Work Experience", "Employment History", "Work History", "Employment", "Professional Experience", "Relevant Experience", "Career History", "Professional History".
- Extract ALL entries. For each entry:
  - jobTitle: the role/position title.
  - company: the employer name.
  - employmentType: if mentioned (e.g. "Full-time", "Part-time", "Contract", "Internship", "Freelance", "Remote").
  - location: the work location (city, state, country, or "Remote").
  - startDate, endDate: see date normalization rules.
  - currentlyWorking: true ONLY if the end date is "Present", "Current", "Now", or ongoing (case-insensitive).
  - description: ALL bullet points and responsibilities under this role. Preserve original wording verbatim, including bullet markers.
  - achievements: notable accomplishments, metrics, quantifiable results, awards, or promotions — only if clearly separated from general responsibilities. If not separated, leave "" and keep everything in description.
  - technologiesUsed: an array of technologies, tools, frameworks, or languages explicitly mentioned for this role (e.g. in a "Technologies:" line under the job). If not mentioned, leave [].

EDUCATION:
- Section may be titled "Education", "Academic Background", "Education & Training", "Qualifications", "Academic Qualifications", "Education & Certifications".
- Extract ALL entries. For each entry:
  - institution: school or university name.
  - degree: degree type (e.g. "Bachelor of Science", "Master of Arts", "B.Sc.", "MBA", "High School Diploma", "PhD").
  - fieldOfStudy: the major or concentration (e.g. "Computer Science", "Marketing").
  - location: school location (city, state, country).
  - startDate, endDate: see date normalization rules.
  - grade: GPA, percentage, or class if mentioned (e.g. "3.8 GPA", "First Class Honours", "Summa Cum Laude", "2:1").
  - description: honors, activities, relevant coursework, thesis titles, societies — if mentioned.

SKILLS:
- Sections may be titled "Skills", "Technical Skills", "Core Competencies", "Expertise", "Key Skills", "Skills & Expertise", "Areas of Expertise", "Competencies", "Technologies", "Tech Stack".
- Categorize every skill into the appropriate array:
  - technical: programming languages, libraries, APIs, methodologies (e.g. "JavaScript", "Python", "Agile").
  - soft: interpersonal skills (e.g. "Leadership", "Communication", "Teamwork", "Problem Solving").
  - tools: software, IDEs, platforms, productivity tools (e.g. "Git", "Jira", "Figma", "Excel").
  - frameworks: frameworks and libraries (e.g. "React", "Django", "Node.js", "Spring").
  - languages: HUMAN languages with optional proficiency (e.g. "English (Native)", "Spanish (Fluent)").
  - databases: database systems and query languages (e.g. "PostgreSQL", "MySQL", "MongoDB", "SQL").
  - cloud: cloud platforms and services (e.g. "AWS", "Azure", "GCP", "Docker", "Kubernetes").
  - certifications: professional certifications, licenses, and credentials named as skills (e.g. "AWS Certified", "PMP", "Google Analytics").
- If unsure which category a skill belongs to, use technical. When in doubt, prefer technical over soft.
- Extract ALL skills mentioned, split comma-separated lists into individual items, and remove duplicates.

PROJECTS:
- Section may be titled "Projects", "Key Projects", "Personal Projects", "Academic Projects", "Project Experience", "Portfolio", "Selected Projects".
- Extract ALL projects. For each:
  - name: project title.
  - role: role on the project if mentioned.
  - startDate, endDate: see date normalization rules.
  - description: description of the project. Preserve original wording.
  - technologies: array of technologies/tools used in the project.
  - githubLink: GitHub repository URL if present.
  - liveLink: live/demo URL if present.

CERTIFICATIONS:
- Section may be titled "Certifications", "Licenses", "Licenses & Certifications", "Professional Certifications", "Credentials".
- Extract ALL entries. For each:
  - name: certification name (e.g. "AWS Solutions Architect", "PMP").
  - issuer: the issuing organization (e.g. "Amazon Web Services", "PMI").
  - date: issue date in YYYY-MM or YYYY format.
  - credentialId: credential ID or license number if available.
  - url: URL to verify the credential if available.

AWARDS:
- Section may be titled "Awards", "Honors", "Honors & Awards", "Achievements", "Awards & Recognition", "Recognition".
- Extract ALL entries. For each: title, issuer (who gave the award), date, description.

PUBLICATIONS:
- Section may be titled "Publications", "Research", "Papers", "Publications & Presentations", "Research Publications".
- Extract ALL entries. For each: title, publisher (journal/conference), date, url (DOI/link if present), description (abstract/notes if present).

VOLUNTEER:
- Section may be titled "Volunteer", "Volunteer Experience", "Volunteering", "Community Involvement", "Community Service", "Volunteer Work", "Extracurricular Activities".
- Extract ALL entries. For each: role, organization, location, startDate, endDate, currentlyActive (true if ongoing), description.

INTERESTS:
- Section may be titled "Interests", "Hobbies", "Activities", "Personal Interests", "Hobbies & Interests".
- Extract as a flat array of individual interests/hobbies (e.g. "Chess", "Photography", "Hiking"). Split comma-separated lists.

REFERENCES:
- Section may be titled "References", "References Available Upon Request", "Professional References".
- Only extract actual named references (name, plus optionally job title, company, email, phone). If the resume merely says "References available upon request", return an empty array and do not fabricate names.

Resume text:
${text}`
}

const SKILL_CATEGORIES = ['technical', 'soft', 'tools', 'frameworks', 'languages', 'databases', 'cloud', 'certifications']

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
  if (typeof data !== 'object' || data === null) {
    data = {}
  }

  // Ensure every expected top-level key exists with a valid default.
  for (const key of TOP_KEYS) {
    if (!(key in data) || data[key] === null || data[key] === undefined) {
      if (key === 'personal') data[key] = {}
      else if (key === 'skills') data[key] = {}
      else data[key] = []
    }
  }

  // personal must be an object — reset if it's the wrong type.
  if (typeof data.personal !== 'object' || data.personal === null) {
    data.personal = {}
  }
  for (const field of [
    'fullName', 'professionalTitle', 'email', 'phone', 'address', 'city',
    'state', 'country', 'location', 'portfolio', 'linkedin', 'github',
    'professionalSummary',
  ]) {
    if (typeof data.personal[field] !== 'string') data.personal[field] = ''
  }

  // Backward compatibility: older AI responses put the summary in a top-level
  // "summary" key. Move it into personal.professionalSummary and drop it so the
  // stored document always uses the canonical shape.
  if (typeof data.summary === 'string' && data.summary.trim()) {
    if (!data.personal.professionalSummary) {
      data.personal.professionalSummary = data.summary.trim()
    }
  }
  delete data.summary

  // Arrays that must be arrays.
  for (const key of ['experience', 'education', 'projects', 'certifications', 'awards', 'publications', 'volunteer', 'interests', 'references']) {
    if (!Array.isArray(data[key])) {
      data[key] = []
    }
  }

  // skills must be an object with array properties.
  if (typeof data.skills !== 'object' || data.skills === null) {
    data.skills = {}
  }
  for (const sk of SKILL_CATEGORIES) {
    if (!Array.isArray(data.skills[sk])) {
      data.skills[sk] = []
    }
  }

  return data
}

// De-duplicate a list of objects based on a stable signature.
function dedupeObjects(arr, getKey) {
  const seen = new Set()
  const out = []
  for (const item of arr || []) {
    if (typeof item !== 'object' || item === null) continue
    const key = getKey(item)
    if (key && seen.has(key)) continue
    if (key) seen.add(key)
    out.push(item)
  }
  return out
}

// De-duplicate a flat list of strings (case-insensitive), trimming whitespace.
function dedupeStrings(arr) {
  const seen = new Set()
  const out = []
  for (const item of arr || []) {
    if (typeof item !== 'string') continue
    const trimmed = item.trim()
    if (!trimmed) continue
    const key = trimmed.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(trimmed)
  }
  return out
}

// Post-process the parsed data: normalize, de-duplicate, and guard
// against malformed entries so downstream consumers never crash.
function sanitizeParsed(data) {
  data = fillDefaults(data)

  const norm = (s) => (typeof s === 'string' ? s.trim() : '')

  // Personal — normalize URLs to include a scheme when it's obviously a URL.
  for (const field of ['portfolio', 'linkedin', 'github']) {
    const val = norm(data.personal[field])
    data.personal[field] = /^https?:\/\//i.test(val) ? val : val ? `https://${val}` : ''
  }

  // Experience entries.
  data.experience = dedupeObjects(data.experience, (e) => {
    const left = norm(e.jobTitle).toLowerCase()
    const right = norm(e.company).toLowerCase()
    const dates = `${norm(e.startDate)}-${norm(e.endDate)}`
    return `${left}|${right}|${dates}`
  }).map((e) => ({
    jobTitle: norm(e.jobTitle),
    company: norm(e.company),
    employmentType: norm(e.employmentType),
    location: norm(e.location),
    startDate: norm(e.startDate),
    endDate: norm(e.endDate),
    currentlyWorking: Boolean(e.currentlyWorking),
    description: norm(e.description),
    achievements: norm(e.achievements),
    technologiesUsed: dedupeStrings(e.technologiesUsed),
  }))

  // Education entries.
  data.education = dedupeObjects(data.education, (e) => {
    const institution = norm(e.institution).toLowerCase()
    const degree = norm(e.degree).toLowerCase()
    return `${institution}|${degree}`
  }).map((e) => ({
    institution: norm(e.institution),
    degree: norm(e.degree),
    fieldOfStudy: norm(e.fieldOfStudy),
    location: norm(e.location),
    startDate: norm(e.startDate),
    endDate: norm(e.endDate),
    grade: norm(e.grade),
    description: norm(e.description),
  }))

  // Projects.
  data.projects = dedupeObjects(data.projects, (p) => norm(p.name).toLowerCase()).map((p) => ({
    name: norm(p.name),
    role: norm(p.role),
    startDate: norm(p.startDate),
    endDate: norm(p.endDate),
    description: norm(p.description),
    technologies: dedupeStrings(p.technologies),
    githubLink: norm(p.githubLink),
    liveLink: norm(p.liveLink),
  }))

  // Certifications.
  data.certifications = dedupeObjects(data.certifications, (c) => norm(c.name).toLowerCase()).map((c) => ({
    name: norm(c.name),
    issuer: norm(c.issuer),
    date: norm(c.date),
    credentialId: norm(c.credentialId),
    url: norm(c.url),
  }))

  // Awards.
  data.awards = dedupeObjects(data.awards, (a) => norm(a.title).toLowerCase()).map((a) => ({
    title: norm(a.title),
    issuer: norm(a.issuer),
    date: norm(a.date),
    description: norm(a.description),
  }))

  // Publications.
  data.publications = dedupeObjects(data.publications, (p) => norm(p.title).toLowerCase()).map((p) => ({
    title: norm(p.title),
    publisher: norm(p.publisher),
    date: norm(p.date),
    url: norm(p.url),
    description: norm(p.description),
  }))

  // Volunteer.
  data.volunteer = dedupeObjects(data.volunteer, (v) => {
    const role = norm(v.role).toLowerCase()
    const org = norm(v.organization).toLowerCase()
    return `${role}|${org}`
  }).map((v) => ({
    role: norm(v.role),
    organization: norm(v.organization),
    location: norm(v.location),
    startDate: norm(v.startDate),
    endDate: norm(v.endDate),
    currentlyActive: Boolean(v.currentlyActive),
    description: norm(v.description),
  }))

  // References.
  data.references = dedupeObjects(data.references, (r) => norm(r.name).toLowerCase()).map((r) => ({
    name: norm(r.name),
    jobTitle: norm(r.jobTitle),
    company: norm(r.company),
    email: norm(r.email),
    phone: norm(r.phone),
  }))

  // Skills.
  for (const sk of SKILL_CATEGORIES) {
    data.skills[sk] = dedupeStrings(data.skills[sk])
  }
  // Interests.
  data.interests = dedupeStrings(data.interests)

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

  return sanitizeParsed(parsed)
}
