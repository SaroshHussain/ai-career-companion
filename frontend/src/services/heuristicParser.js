// Heuristic resume parser — extracts structured data from raw resume text
// entirely in the browser. It recognizes common section headers, parses
// contact details, dates, and entry blocks, and returns the normalized
// shape that ResumeContext expects. This is intentionally tolerant: when
// a field cannot be identified it defaults to "" / [] instead of failing.

const SECTION_MAP = [
  { key: 'summary', regex: /^(professional\s+)?(summary|profile|objective|about\s+me|career\s+objective|personal\s+statement|overview|highlights|intro)(\s*:\s*)?$/i },
  { key: 'experience', regex: /^(work\s+)?(professional\s+|relevant\s+)?(experience|employment\s+history|work\s+history|employment|career\s+history|professional\s+history)(\s*:\s*)?$/i },
  { key: 'education', regex: /^(academic\s+)?(background|qualifications?)?\s*(education|academic\s+qualifications)(\s*&\s*training|\s*&\s*certifications)?(\s*:\s*)?$/i },
  { key: 'skills', regex: /^(technical\s+)?(skills|core\s+competencies|expertise|competencies|key\s+skills|technologies|tech\s+stack)(\s*&\s*expertise|\s*&\s*skills)?(\s*:\s*)?$/i },
  { key: 'projects', regex: /^(key|personal|academic|selected|featured)?\s*(projects|project\s+experience|portfolio|side\s+projects)(\s*:\s*)?$/i },
  { key: 'certifications', regex: /^(professional\s+)?(certifications?|licenses?|licenses\s*&\s*certifications|credentials?)(\s*:\s*)?$/i },
  { key: 'awards', regex: /^(honors\s*&\s*)?(awards|honors|achievements|recognition|awards\s*&\s*recognition)(\s*:\s*)?$/i },
  { key: 'publications', regex: /^(research\s+)?(publications?|papers|publications\s*&\s*presentations)(\s*:\s*)?$/i },
  { key: 'volunteer', regex: /^volunteer(\s+experience|\s+work)?(\s*:\s*)?$/i },
  { key: 'interests', regex: /^(personal\s+)?(interests|hobbies|activities|hobbies\s*&\s*interests)(\s*:\s*)?$/i },
  { key: 'references', regex: /^references(\s+available\s+upon\s+request)?(\s*:\s*)?$/i },
]

const HEADER_KEYS = SECTION_MAP.map((s) => s.key)

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/
const PHONE_RE = /(\+?[\d][\d\s().-]{6,}\d)/
const URL_RE = /(?:https?:\/\/)?(?:www\.)?([\w-]+\.)+(?:com|dev|io|net|org|me|app|ai|co|edu|in)\/[\w./~:?=&%-]*/gi

const MONTH_RE = '(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)'
const YEAR_TOKEN = '(?:19|20)\\d{2}'
const DATE_TOKEN = `(?:${MONTH_RE}\\.?\\s*)?(?:\\d{1,2}/)?${YEAR_TOKEN}`
const DATE_RANGE_RE = new RegExp(
  `(${DATE_TOKEN})\\s*(?:-|–|—|to|\\/)\\s*((${DATE_TOKEN})|present|current|now|ongoing)`,
  'i',
)
const SINGLE_DATE_RE = new RegExp(`\\b(${DATE_TOKEN})\\b`, 'i')

const MONTH_NAMES = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
}

const DEGREE_RE = /\b(?:b\.?s\.?|b\.?a\.?|b\.?sc\.?|b\.?eng\.?|bachelor(?:\s+of\s+\w+)?|m\.?s\.?|m\.?a\.?|m\.?sc\.?|m\.?ba\b|m\.?eng\.?|master(?:\s+of\s+\w+)?|ph\.?d\.?|doctorate|associate(?:\s+degree)?|h\.?nd\b|b\.?tech\b|m\.?tech\b)\b/i

const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'freelance', 'remote', 'temporary', 'permanent', 'volunteer', 'apprenticeship']

const SKILL_KEYWORDS = {
  technical: ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'c ', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'sql', 'html', 'css', 'scss', 'sass', 'shell', 'bash', 'powershell', 'r ', 'matlab', 'scala', 'golang', 'dart', 'graphql', 'rest', 'api', 'agile', 'scrum', 'kanban', 'selenium', 'cypress', 'jest', 'mocha', 'unit testing', 'tdd', 'oop', 'data structures', 'algorithms', 'machine learning', 'deep learning', 'nlp', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'opencv', 'git', 'redux', 'next.js', 'c', 'c++'],
  frameworks: ['react', 'react.js', 'reactjs', 'vue', 'angular', 'svelte', 'next', 'node', 'node.js', 'nodejs', 'express', 'django', 'flask', 'spring', 'spring boot', 'laravel', 'rails', 'rails', '.net', 'asp.net', 'bootstrap', 'tailwind', 'jquery', 'flutter', 'electron', 'ember', 'backbone', 'drupal', 'wordpress', 'laravel', 'fastapi', 'fastify'],
  tools: ['git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'trello', 'figma', 'sketch', 'photoshop', 'illustrator', 'docker', 'kubernetes', 'jenkins', 'ci/cd', 'webpack', 'vite', 'babel', 'eslint', 'npm', 'yarn', 'pnpm', 'postman', 'swagger', 'vscode', 'intellij', 'eclipse', 'linux', 'unix', 'macos', 'windows', 'excel', 'word', 'powerpoint', 'notion', 'slack', 'xcode', 'android studio', 'azure devops'],
  databases: ['postgresql', 'mysql', 'mongodb', 'sqlite', 'oracle', 'sql server', 'redis', 'cassandra', 'dynamodb', 'elasticsearch', 'neo4j', 'firebase', 'supabase', 'mariadb', 'couchdb', 'graphql'],
  cloud: ['aws', 'azure', 'gcp', 'google cloud', 'amazon web services', 'heroku', 'vercel', 'netlify', 'cloudflare', 'digitalocean', 'firebase', 'terraform', 'serverless', 'lambda', 'ec2', 's3', 'docker', 'kubernetes', 'jenkins'],
  soft: ['leadership', 'communication', 'teamwork', 'team player', 'problem solving', 'problem-solving', 'critical thinking', 'creativity', 'time management', 'organization', 'organizational', 'collaboration', 'adaptability', 'flexibility', 'mentoring', 'presentation', 'public speaking', 'negotiation', 'conflict resolution', 'decision making', 'attention to detail', 'multitasking', 'work ethic', 'initiative', 'ownership', 'empathy', 'emotional intelligence'],
  languages: ['english', 'urdu', 'spanish', 'french', 'german', 'chinese', 'mandarin', 'arabic', 'hindi', 'punjabi', 'bengali', 'russian', 'japanese', 'korean', 'italian', 'portuguese', 'dutch', 'turkish', 'persian', 'swahili'],
}

// ----- helpers -------------------------------------------------------------

function cleanLines(rawText) {
  return rawText
    .replace(/\r\n?/g, '\n')
    .replace(/\u00a0/g, ' ')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
}

function splitBlocks(lines) {
  const blocks = []
  let cur = []
  for (const line of lines) {
    if (!line) {
      if (cur.length) {
        blocks.push(cur)
        cur = []
      }
    } else {
      cur.push(line)
    }
  }
  if (cur.length) blocks.push(cur)
  return blocks
}

function isBullet(line) {
  return /^\s*(?:[-•*▪◦·→–]|\d+[.)]\s|\u2022)/.test(line)
}

function stripBullet(line) {
  return line.replace(/^\s*(?:[-•*▪◦·→–]\s*|\d+[.)]\s*)/, '').trim()
}

function dedupe(arr) {
  const seen = new Set()
  const out = []
  for (const item of arr || []) {
    if (typeof item !== 'string') continue
    const t = item.trim()
    if (!t) continue
    const key = t.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(t)
  }
  return out
}

function addIds(arr, prefix) {
  return (arr || []).map((item, i) => ({
    id: `${prefix}-${Date.now()}-${i}`,
    ...item,
  }))
}

function normalizeUrl(value) {
  if (!value) return ''
  const v = value.trim()
  if (/^https?:\/\//i.test(v)) return v
  if (/^[\w-]+\.(dev|com|io|net|org|me|github\.io|vercel\.app|netlify\.app|ai|co|app)(\/|$)/i.test(v)) {
    return `https://${v}`
  }
  return v
}

function normalizePhone(value) {
  if (!value) return ''
  const cleaned = value.replace(/[^\d+]/g, '')
  if (cleaned.length < 7) return value.trim()
  return cleaned
}

function parseNumberDate(value) {
  const v = String(value).trim()
  if (!v) return ''
  // "MM/YYYY" or "YYYY"
  const m = v.match(/^(\d{1,2})\/(\d{4})$/)
  if (m) return `${m[2]}-${String(m[1]).padStart(2, '0')}`
  const y = v.match(/^(\d{4})$/)
  if (y) return y[1]
  // "Mon YYYY" / "Month YYYY"
  const named = v.match(new RegExp(`^(${MONTH_RE})\\.?\\s*(${YEAR_TOKEN})$`, 'i'))
  if (named) {
    const month = MONTH_NAMES[named[1].slice(0, 3).toLowerCase()]
    return `${named[2]}-${String(month).padStart(2, '0')}`
  }
  return v
}

// Extract start/end dates from a line. Returns null if none found.
function extractDates(line) {
  const range = line.match(DATE_RANGE_RE)
  if (range) {
    const end = /present|current|now|ongoing/i.test(range[2])
      ? ''
      : parseNumberDate(range[2])
    return {
      startDate: parseNumberDate(range[1]),
      endDate: end,
      currentlyWorking: !end && range[2] !== undefined,
    }
  }
  const single = line.match(SINGLE_DATE_RE)
  if (single) {
    return { startDate: parseNumberDate(single[1]), endDate: '', currentlyWorking: false }
  }
  return null
}

function looksLikePersonName(line) {
  // Two+ capitalized words, no digits, no punctuation-only. Reasonably short.
  if (!line || line.length > 60) return false
  if (/\d/.test(line)) return false
  const words = line.split(/\s+/)
  if (words.length < 2 || words.length > 5) return false
  if (EMAIL_RE.test(line) || PHONE_RE.test(line)) return false
  if (!/^[A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]*)+$/.test(line)) return false
  // Exclude common heading words.
  if (/^(resume|cv|curriculum\s+vitae)$/i.test(line)) return false
  return true
}

function splitBySeparators(line) {
  // "Title | Company | Dates" and "Title - Company" variants.
  const pipeParts = line.split('|').map((p) => p.trim()).filter(Boolean)
  if (pipeParts.length >= 2) return pipeParts
  const dashParts = line.split(/\s+[–—]\s+/).map((p) => p.trim()).filter(Boolean)
  if (dashParts.length >= 2 && dashParts[1].length < 60) return dashParts
  return null
}

// ----- section detection ---------------------------------------------------

function detectSection(line) {
  for (const { key, regex } of SECTION_MAP) {
    if (regex.test(line) && line.length <= 45) return key
  }
  return null
}

// ----- parsers -------------------------------------------------------------

function parseContact(rawLines, personal) {
  const allText = rawLines.join(' ')

  const emailMatch = allText.match(EMAIL_RE)
  if (emailMatch) personal.email = emailMatch[0].replace(/[,;]/g, '')

  const phoneMatch = allText.match(PHONE_RE)
  if (phoneMatch && !phoneMatch[0].includes('@')) {
    personal.phone = normalizePhone(phoneMatch[1] || phoneMatch[0])
  }

  const urls = allText.match(URL_RE) || []
  for (const url of urls) {
    const lower = url.toLowerCase()
    if (!personal.linkedin && /linkedin\.com\/(in|company)/.test(lower)) {
      personal.linkedin = normalizeUrl(url.replace(/[,;]$/, ''))
    } else if (!personal.github && /github\.com\//.test(lower) && !/^https:\/\/www\./.test(lower) && !personal.github) {
      personal.github = normalizeUrl(url.replace(/[,;]$/, ''))
    } else if (!personal.portfolio && !/linkedin|github/.test(lower)) {
      personal.portfolio = normalizeUrl(url.replace(/[,;]$/, ''))
    }
  }

  // Fallback for bare "linkedin.com/in/xyz" or "github.com/xyz" without scheme.
  const linkedinBare = allText.match(/(?:linkedin\.com\/in\/|linkedin\.com\/company\/)[\w.-]+/i)
  if (linkedinBare && !personal.linkedin) personal.linkedin = normalizeUrl(linkedinBare[0].replace(/[,;]/g, ''))
  const githubBare = allText.match(/github\.com\/[\w.-]+/i)
  if (githubBare && !personal.github) personal.github = normalizeUrl(githubBare[0].replace(/[,;]/g, ''))
}

function parseHeaderBlock(lines) {
  // Split "Title | Company | ..." style lines first.
  const flat = []
  for (const line of lines) {
    const parts = splitBySeparators(line)
    if (parts) flat.push(...parts)
    else flat.push(line)
  }

  const entry = {
    jobTitle: '', company: '', employmentType: '', location: '',
    startDate: '', endDate: '', currentlyWorking: false,
  }
  const rest = []
  for (const line of flat) {
    const dates = extractDates(line)
    if (dates) {
      entry.startDate = dates.startDate || entry.startDate
      if (dates.currentlyWorking) entry.currentlyWorking = true
      entry.endDate = dates.endDate || entry.endDate
    } else {
      rest.push(line)
    }
  }

  const title = rest.shift() || ''
  entry.jobTitle = title
  if (rest.length) entry.company = rest.shift()
  if (rest.length) entry.location = rest.shift()

  // Detect employment type / location inline in the company line.
  const company = entry.company
  if (company) {
    const empType = EMPLOYMENT_TYPES.find((t) => company.toLowerCase().includes(t))
    if (empType) {
      entry.employmentType = empType
      entry.company = company
        .split(new RegExp(`[,|]\\s*${empType}`, 'i'))
        .join('')
        .replace(new RegExp(`\\s*${empType}`, 'i'), '')
        .trim()
    }
  }

  return entry
}

function parseExperience(lines) {
  const entries = []
  const blocks = splitBlocks(lines)

  for (const block of blocks) {
    const bullets = []
    const headers = []
    for (const line of block) {
      if (isBullet(line)) bullets.push(stripBullet(line))
      else headers.push(line)
    }

    const header = headers.length ? parseHeaderBlock(headers) : null
    const description = bullets.join('\n')
    const techMatch = description.match(/technologies?[:;]\s*(.+)/i)

    if (header) {
      header.description = description
      if (techMatch) {
        header.technologiesUsed = dedupe(techMatch[1].split(/[,;•]\s*/))
        header.description = description.replace(/technologies?[:;].*/i, '').trim()
      }
      entries.push(header)
    } else if (description) {
      entries.push({
        jobTitle: '', company: '', employmentType: '', location: '',
        startDate: '', endDate: '', currentlyWorking: false,
        description,
        achievements: '',
        technologiesUsed: techMatch ? dedupe(techMatch[1].split(/[,;•]\s*/)) : [],
      })
    }
  }

  return entries
}

function parseEducation(lines) {
  const entries = []
  const blocks = splitBlocks(lines)

  for (const block of blocks) {
    const bullets = []
    const headers = []
    for (const line of block) {
      if (isBullet(line)) bullets.push(stripBullet(line))
      else headers.push(line)
    }

    if (!headers.length) {
      // Education described only in bullets (uncommon).
      entries.push({
        institution: '', degree: '', fieldOfStudy: '', location: '',
        startDate: '', endDate: '', grade: '', description: bullets.join('\n'),
      })
      continue
    }

    const entry = { institution: '', degree: '', fieldOfStudy: '', location: '', startDate: '', endDate: '', grade: '', description: bullets.join('\n') }
    const rest = []
    for (const line of headers) {
      const dates = extractDates(line)
      if (dates) {
        entry.startDate = dates.startDate || entry.startDate
        if (dates.currentlyWorking) entry.currentlyWorking = true
        entry.endDate = dates.endDate || entry.endDate
      } else {
        rest.push(line)
      }
    }

    // Find the degree line.
    let degreeIdx = -1
    for (let i = 0; i < rest.length; i += 1) {
      if (DEGREE_RE.test(rest[i])) {
        degreeIdx = i
        break
      }
    }

    if (degreeIdx !== -1) {
      const degreeLine = rest[degreeIdx]
      const degMatch = degreeLine.match(DEGREE_RE)
      entry.degree = degMatch ? degMatch[0].trim() : ''
      entry.fieldOfStudy = degreeLine.replace(DEGREE_RE, '').replace(/^\s*[-,–—]\s*/, '').trim()
      const institution = rest.filter((_, i) => i !== degreeIdx).join(' ')
      entry.institution = institution || rest[0] || ''
    } else if (rest.length >= 2) {
      entry.institution = rest[0]
      entry.degree = rest[1]
    } else if (rest.length === 1) {
      entry.institution = rest[0]
    }

    // Grade detection.
    const gradeMatch = (bullets.join('\n') + ' ' + headers.join(' ')).match(/(?:gpa\s*[:.]?\s*[\d.]+(?:\s*\/\s*\d+)?|\d+\.\d+\s+gpa)/i)
    if (gradeMatch) entry.grade = gradeMatch[0].trim()
    else {
      const pct = (bullets.join('\n') + ' ' + headers.join(' ')).match(/(?:percentage|cgpa)\s*[:.]?\s*[\d.]+/i)
      if (pct) entry.grade = pct[0].trim()
    }

    entries.push(entry)
  }

  return entries
}

function categorizeSkill(value) {
  const lower = value.toLowerCase()
  let best = 'technical'
  for (const [cat, words] of Object.entries(SKILL_KEYWORDS)) {
    for (const word of words) {
      if (lower === word || lower.startsWith(`${word} (`) || lower.startsWith(`${word} `)) {
        best = cat
        break
      }
    }
    if (best !== 'technical') break
  }
  // Manual language detection as a hard override for top languages.
  if (/^(english|urdu|spanish|french|german|chinese|mandarin|arabic|hindi|punjabi|bengali|russian|japanese|korean|italian|portuguese|dutch|turkish|persian|swahili)(\s*\([^)]*\))?$/i.test(value)) {
    return 'languages'
  }
  return best
}

function parseSkills(lines) {
  const skills = {
    technical: [], soft: [], tools: [], frameworks: [], languages: [], databases: [], cloud: [],
  }
  for (const line of lines) {
    const cleaned = isBullet(line) ? stripBullet(line) : line
    const items = cleaned.split(/[,;•|]\s*|\s{2,}/).map((s) => s.trim()).filter(Boolean)
    for (let item of items) {
      item = item.replace(/:$/, '').replace(/^\s*[-•]\s*/, '').trim()
      if (!item || /^(skills|technical|soft|tools|frameworks|languages|databases|cloud)$/i.test(item)) continue
      const cat = categorizeSkill(item)
      skills[cat].push(item)
    }
  }
  for (const key of Object.keys(skills)) skills[key] = dedupe(skills[key])
  return skills
}

function parseProjects(lines) {
  const projects = []
  const blocks = splitBlocks(lines)
  for (const block of blocks) {
    const headers = []
    const bullets = []
    for (const line of block) {
      if (isBullet(line)) bullets.push(stripBullet(line))
      else headers.push(line)
    }
    const project = {
      name: '', role: '', startDate: '', endDate: '', description: bullets.join('\n'),
      technologies: [], githubLink: '', liveLink: '',
    }
    const rest = []
    for (const line of headers) {
      const dates = extractDates(line)
      if (dates) {
        project.startDate = dates.startDate || project.startDate
        if (dates.currentlyWorking) project.currentlyWorking = true
        project.endDate = dates.endDate || project.endDate
      } else rest.push(line)
    }
    if (rest.length) project.name = rest.shift()
    if (rest.length && !project.name) project.name = rest.shift()
    if (rest.length) project.role = rest[0]

    // Detect links in headers/description.
    const combined = headers.join(' ') + ' ' + project.description
    const gh = combined.match(/(?:https?:\/\/)?github\.com\/[\w.-]+/i)
    if (gh) project.githubLink = normalizeUrl(gh[0])
    const live = combined.match(/https?:\/\/[^\s]+/i)
    if (live && live[0] !== gh?.[0]) project.liveLink = normalizeUrl(live[0])

    const techMatch = combined.match(/technolog(?:y|ies)[^:]*[:;]\s*(.+)/i)
    if (techMatch) project.technologies = dedupe(techMatch[1].split(/[,;•]\s*/))

    if (project.name || project.description) projects.push(project)
  }
  return projects
}

function parseSimpleSection(lines) {
  // Certifications / Awards / Publications / Volunteer entries are usually
  // a short header line plus optional details on the following lines.
  const entries = []
  const blocks = splitBlocks(lines)
  for (const block of blocks) {
    const headers = []
    const bullets = []
    for (const line of block) {
      if (isBullet(line)) bullets.push(stripBullet(line))
      else headers.push(line)
    }
    const all = [...headers, ...bullets]
    if (!all.length) continue
    const entry = { description: bullets.join('\n') }
    const first = all.shift()
    const urls = first.match(URL_RE) || []
    if (urls.length) entry.url = normalizeUrl(urls[0].replace(/[,;]$/, ''))
    entry.title = first.replace(/[,;:]$/, '')
    if (all.length) entry.detail = all.join(' ')
    entries.push(entry)
  }
  return entries
}

function parseVolunteer(lines) {
  const blocks = splitBlocks(lines)
  const entries = []
  for (const block of blocks) {
    const headers = []
    const bullets = []
    for (const line of block) {
      if (isBullet(line)) bullets.push(stripBullet(line))
      else headers.push(line)
    }
    const entry = { role: '', organization: '', location: '', startDate: '', endDate: '', currentlyActive: false, description: bullets.join('\n') }
    const rest = []
    for (const line of headers) {
      const dates = extractDates(line)
      if (dates) {
        entry.startDate = dates.startDate || entry.startDate
        if (dates.currentlyWorking) entry.currentlyActive = true
        entry.endDate = dates.endDate || entry.endDate
      } else rest.push(line)
    }
    if (rest.length) entry.role = rest.shift()
    if (rest.length) entry.organization = rest.shift()
    if (rest.length) entry.location = rest.shift()
    if (entry.role || entry.organization || entry.description) entries.push(entry)
  }
  return entries
}

function parseReferences(lines) {
  const refs = []
  for (const line of lines) {
    const cleaned = isBullet(line) ? stripBullet(line) : line
    if (!cleaned) continue
    const email = cleaned.match(EMAIL_RE)
    const phone = cleaned.match(PHONE_RE)
    const name = cleaned
      .replace(EMAIL_RE, '')
      .replace(PHONE_RE, '')
      .replace(/[,;]$/, '')
      .trim()
    if (name && name.length > 1 && !/references available/i.test(name)) {
      refs.push({ name, jobTitle: '', company: '', email: email ? email[0] : '', phone: phone ? normalizePhone(phone[0]) : '' })
    }
  }
  return refs
}

function parseInterests(lines) {
  const interests = []
  for (const line of lines) {
    const cleaned = isBullet(line) ? stripBullet(line) : line
    const items = cleaned.split(/[,;•|]\s*/).map((s) => s.trim()).filter(Boolean)
    for (const item of items) {
      if (item.length <= 40 && !/^(interests|hobbies|activities)$/i.test(item)) interests.push(item)
    }
  }
  return dedupe(interests)
}

// ----- orchestrator --------------------------------------------------------

export function parseResumeText(rawText) {
  const rawLines = cleanLines(rawText)
  const lines = rawLines.filter(Boolean)

  const personal = {
    fullName: '', professionalTitle: '', email: '', phone: '', address: '',
    city: '', state: '', country: '', location: '', portfolio: '', linkedin: '', github: '',
    professionalSummary: '',
  }

  // Name + title from the first lines (before any section header).
  let sectionStart = lines.length
  for (let i = 0; i < lines.length; i += 1) {
    if (detectSection(lines[i])) {
      sectionStart = i
      break
    }
  }

  const preamble = lines.slice(0, sectionStart)
  parseContact(preamble, personal)

  let nameIdx = -1
  for (let i = 0; i < preamble.length && i < 6; i += 1) {
    if (looksLikePersonName(preamble[i])) {
      nameIdx = i
      break
    }
  }
  if (nameIdx !== -1) {
    personal.fullName = preamble[nameIdx].replace(/[,;]$/, '')
    for (let i = nameIdx + 1; i < Math.min(preamble.length, nameIdx + 4); i += 1) {
      const t = preamble[i]
      if (EMAIL_RE.test(t) || PHONE_RE.test(t) || URL_RE.test(t) || looksLikePersonName(t)) continue
      if (t.length <= 70 && !detectSection(t)) {
        personal.professionalTitle = t.replace(/[,;]$/, '')
        break
      }
    }
  }

  // Contact info can also appear inside the preamble's first line block.
  parseContact(preamble, personal)

  const sections = {}
  let currentKey = null
  for (let i = 0; i < lines.length; i += 1) {
    const key = detectSection(lines[i])
    if (key) {
      currentKey = key
      sections[key] = sections[key] || []
      continue
    }
    if (currentKey) sections[currentKey].push(lines[i])
  }

  const summaryText = (sections.summary || []).join(' ')
  if (summaryText && summaryText.length > 2) {
    personal.professionalSummary = summaryText.replace(/^[:.\-•\s]+/, '')
  }

  // Compose location from contact lines in the preamble.
  const locationLine = preamble
    .filter((l) => /^(city|state|country|location)\s*[:;]/i.test(l))
    .map((l) => l.replace(/^(city|state|country|location)\s*[:;]\s*/i, ''))
    .filter(Boolean)
    .join(', ')
  if (locationLine) personal.location = locationLine

  const data = {
    personal,
    education: parseEducation(sections.education || []),
    experience: parseExperience(sections.experience || []),
    projects: parseProjects(sections.projects || []),
    skills: parseSkills(sections.skills || []),
    certifications: [],
    awards: [],
    publications: [],
    volunteer: parseVolunteer(sections.volunteer || []),
    interests: parseInterests(sections.interests || []),
    references: parseReferences(sections.references || []),
  }

  // Simple list sections.
  const certs = parseSimpleSection(sections.certifications || [])
  data.certifications = certs.map((c) => ({
    name: c.title || '',
    issuer: c.detail || '',
    date: '',
    credentialId: '',
    url: c.url || '',
  }))
  const awards = parseSimpleSection(sections.awards || [])
  data.awards = awards.map((a) => ({
    title: a.title || '',
    issuer: a.detail || '',
    date: '',
    description: a.description || '',
  }))
  const pubs = parseSimpleSection(sections.publications || [])
  data.publications = pubs.map((p) => ({
    title: p.title || '',
    publisher: p.detail || '',
    date: '',
    url: p.url || '',
    description: p.description || '',
  }))

  // Extract certifications from the skills section if present there.
  if (!data.certifications.length && Array.isArray(sections.skills)) {
    const certLines = sections.skills.filter((l) => /certification|certified|credential|license/i.test(l))
    if (certLines.length) {
      data.certifications = certLines.map((c) => ({
        name: isBullet(c) ? stripBullet(c) : c.replace(/certifications?:?\s*/i, ''),
        issuer: '',
        date: '',
        credentialId: '',
        url: '',
      }))
    }
  }

  return data
}
