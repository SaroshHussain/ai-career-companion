// Resume parser service — uploads a file to the backend, extracts text,
// parses it with Gemini AI, and normalises the result for ResumeContext.
// The normalizer maps every extracted field, removes duplicates, and
// ensures the shape exactly matches what the Resume Builder expects.

import { uploadResume, parseResumeText } from './api'

function addIds(arr, prefix) {
  return (arr || []).map((item, i) => ({
    id: `${prefix}-${Date.now()}-${i}`,
    ...item,
  }))
}

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

function normalizeUrl(value) {
  if (!value) return ''
  const v = value.trim()
  if (/^https?:\/\//i.test(v)) return v
  // Bare domains and paths that are clearly URLs get a scheme.
  if (/^[\w-]+\.(dev|com|io|net|org|me|github\.io|vercel\.app|netlify\.app)(\/|$)/i.test(v)) {
    return `https://${v}`
  }
  return v
}

function normalizePhone(value) {
  if (!value) return ''
  // Keep digits and leading +, drop spaces/dashes/parens.
  const cleaned = value.replace(/[^\d+]/g, '')
  if (cleaned.length < 7) return value.trim()
  return cleaned
}

function normalizeBackendData(apiData) {
  const d = apiData || {}

  const personal = {
    fullName: d.personal?.fullName || '',
    professionalTitle: d.personal?.professionalTitle || '',
    email: d.personal?.email || '',
    phone: normalizePhone(d.personal?.phone),
    address: d.personal?.address || '',
    city: d.personal?.city || '',
    state: d.personal?.state || '',
    country: d.personal?.country || '',
    location: d.personal?.location || '',
    portfolio: normalizeUrl(d.personal?.portfolio),
    linkedin: normalizeUrl(d.personal?.linkedin),
    github: normalizeUrl(d.personal?.github),
    professionalSummary: d.summary || '',
  }

  // Compose a location from granular address parts if none was given.
  if (!personal.location) {
    personal.location = [personal.city, personal.state, personal.country]
      .filter(Boolean)
      .join(', ')
  }

  return {
    personal,
    education: addIds(d.education, 'edu').map((e) => ({
      institution: e.institution || '',
      degree: e.degree || '',
      fieldOfStudy: e.fieldOfStudy || '',
      location: e.location || '',
      startDate: e.startDate || '',
      endDate: e.endDate || '',
      grade: e.grade || '',
      description: e.description || '',
    })),
    experience: addIds(d.experience, 'exp').map((e) => ({
      jobTitle: e.jobTitle || '',
      company: e.company || '',
      employmentType: e.employmentType || '',
      location: e.location || '',
      startDate: e.startDate || '',
      endDate: e.endDate || '',
      currentlyWorking: e.currentlyWorking || /present|current|now/i.test(e.endDate || ''),
      description: e.description || '',
      achievements: e.achievements || '',
      technologiesUsed: dedupeStrings(e.technologiesUsed),
    })),
    projects: addIds(d.projects, 'proj').map((p) => ({
      name: p.name || '',
      role: p.role || '',
      startDate: p.startDate || '',
      endDate: p.endDate || '',
      description: p.description || '',
      technologies: dedupeStrings(p.technologies),
      githubLink: normalizeUrl(p.githubLink),
      liveLink: normalizeUrl(p.liveLink),
    })),
    skills: {
      technical: dedupeStrings(d.skills?.technical),
      soft: dedupeStrings(d.skills?.soft),
      tools: dedupeStrings(d.skills?.tools),
      frameworks: dedupeStrings(d.skills?.frameworks),
      languages: dedupeStrings(d.skills?.languages),
      databases: dedupeStrings(d.skills?.databases),
      cloud: dedupeStrings(d.skills?.cloud),
    },
    certifications: addIds(d.certifications, 'cert').map((c) => ({
      name: c.name || '',
      issuer: c.issuer || '',
      date: c.date || '',
      credentialId: c.credentialId || '',
      url: normalizeUrl(c.url),
    })),
    awards: addIds(d.awards, 'award').map((a) => ({
      title: a.title || '',
      issuer: a.issuer || '',
      date: a.date || '',
      description: a.description || '',
    })),
    publications: addIds(d.publications, 'pub').map((p) => ({
      title: p.title || '',
      publisher: p.publisher || '',
      date: p.date || '',
      url: normalizeUrl(p.url),
      description: p.description || '',
    })),
    volunteer: addIds(d.volunteer, 'vol').map((v) => ({
      role: v.role || '',
      organization: v.organization || '',
      location: v.location || '',
      startDate: v.startDate || '',
      endDate: v.endDate || '',
      currentlyActive: v.currentlyActive || /present|current|now/i.test(v.endDate || ''),
      description: v.description || '',
    })),
    interests: dedupeStrings(d.interests),
    references: addIds(d.references, 'ref').map((r) => ({
      name: r.name || '',
      jobTitle: r.jobTitle || '',
      company: r.company || '',
      email: r.email || '',
      phone: normalizePhone(r.phone),
    })),
  }
}

export async function parseResume(file, onStage) {
  // Step 1 — upload file and get extracted text.
  onStage?.('uploading')
  let uploadResult
  try {
    uploadResult = await uploadResume(file)
  } catch (err) {
    console.error('[resumeParser] upload failed', err)
    throw err
  }
  const text = uploadResult.data?.text

  if (!text) {
    throw new Error('No text could be extracted from the file. The file may be empty or corrupted.')
  }

  // Step 2 — send text to AI parser and get structured JSON.
  onStage?.('parsing')
  let parseResult
  try {
    parseResult = await parseResumeText(text)
  } catch (err) {
    console.error('[resumeParser] parsing failed', err)
    throw err
  }
  const parsed = parseResult.data

  // Step 3 — normalise to match ResumeContext shape.
  return normalizeBackendData(parsed)
}
