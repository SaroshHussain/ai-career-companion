function cleanText(text) {
  return text
    .replace(/\f/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/Page\s*\d+\s*(of\s*\d+)?/gi, '')
    .replace(/[•·●]/g, '-')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => {
      if (!l) return false
      if (/^\d+$/.test(l.trim())) return false
      if (/^www\./.test(l) && l.length < 50) return true
      return l.length > 1
    })
    .join('\n')
}

function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  return match ? match[0] : ''
}

function extractPhone(text) {
  const match = text.match(
    /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
  )
  return match ? match[0] : ''
}

function extractLinkedIn(text) {
  const match = text.match(
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[a-zA-Z0-9_-]+\/?/i,
  )
  return match ? match[0].replace(/^https?:\/\//, '') : ''
}

function extractGitHub(text) {
  const match = text.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+\/?/i,
  )
  return match ? match[0].replace(/^https?:\/\//, '') : ''
}

function extractWebsite(text) {
  const match = text.match(
    /(?:(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/,
  )
  if (!match) return ''
  const url = match[0]
  if (
    url.includes('linkedin') ||
    url.includes('github') ||
    url.includes('@')
  ) {
    return ''
  }
  return url.replace(/^https?:\/\//, '')
}

function extractLines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function isSectionHeader(line) {
  const sectionHeaders = [
    'experience',
    'education',
    'skills',
    'projects',
    'work experience',
    'professional experience',
    'employment history',
    'work history',
    'technical skills',
    'core competencies',
    'certifications',
    'languages',
    'summary',
    'professional summary',
    'profile',
    'objective',
    'about me',
    'publications',
    'honors',
    'awards',
    'volunteer',
    'references',
    'additional',
  ]
  const lower = line.toLowerCase().replace(/[^a-z\s]/g, '').trim()
  return sectionHeaders.some(
    (h) =>
      lower === h ||
      lower === h + ':' ||
      lower.startsWith(h + ' ') ||
      lower.endsWith(' ' + h),
  )
}

function parseSections(lines) {
  const sections = {}
  let currentSection = 'header'
  sections[currentSection] = []

  for (const line of lines) {
    if (isSectionHeader(line)) {
      currentSection = line.toLowerCase().replace(/[^a-z\s]/g, '').trim()
      sections[currentSection] = []
    } else {
      sections[currentSection].push(line)
    }
  }

  return sections
}

function parseExperienceSection(lines) {
  const entries = []
  let current = null

  for (const line of lines) {
    const dateMatch = line.match(
      /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|Spring|Summer|Fall|Winter)?\s*\d{4})\s*[-–—to]+\s*(Present|Current|Now|((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|Spring|Summer|Fall|Winter)?\s*\d{4}))/i,
    )

    if (dateMatch && current) {
      entries.push(current)
      current = null
    }

    if (!current) {
      current = {
        jobTitle: '',
        company: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        description: '',
        achievements: '',
      }
    }

    if (dateMatch) {
      const parts = line.split(/[-–—]/)
      current.startDate = parts[0]?.trim() || ''
      const endStr = parts[1]?.trim() || ''
      current.currentlyWorking =
        /present|current|now/i.test(endStr)
      current.endDate = current.currentlyWorking ? '' : endStr
      const beforeDate = line.replace(dateMatch[0], '').trim()
      if (beforeDate && !current.jobTitle) {
        current.jobTitle = beforeDate
      }
    } else if (!current.jobTitle) {
      current.jobTitle = line
    } else if (!current.company) {
      const companyIndicators = [
        ' at ',
        ' | ',
        ' \u2014 ',
        ' \u2013 ',
        ' - ',
        'inc',
        'llc',
        'ltd',
        'corp',
        'technologies',
        'solutions',
        'services',
        'company',
      ]
      if (
        companyIndicators.some((ind) => line.toLowerCase().includes(ind)) ||
        line === line.toUpperCase()
      ) {
        current.company = line.replace(/^(at|@)\s*/i, '')
      } else if (!current.company) {
        current.company = line
      }
    } else {
      current.description += (current.description ? ' ' : '') + line
    }
  }

  if (current) entries.push(current)

  return entries.map((e) => ({
    ...e,
    startDate: e.startDate || '',
    endDate: e.endDate || '',
  }))
}

function parseEducationSection(lines) {
  const entries = []
  let current = null

  for (const line of lines) {
    const dateMatch = line.match(
      /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*\d{4})\s*[-–—to]+\s*(Present|((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*\d{4}))/i,
    )

    if (dateMatch && current) {
      entries.push(current)
      current = null
    }

    if (!current) {
      current = {
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        grade: '',
        description: '',
      }
    }

    if (dateMatch) {
      const parts = line.split(/[-–—]/)
      current.startDate = parts[0]?.trim() || ''
      current.endDate = parts[1]?.trim() || ''
      const beforeDate = line.replace(dateMatch[0], '').trim()
      if (beforeDate && !current.institution) {
        current.institution = beforeDate
      }
    } else if (!current.institution) {
      current.institution = line
    } else if (!current.degree) {
      const degreeKeywords = [
        'bachelor',
        'master',
        'phd',
        'doctor',
        'associate',
        'b.s.',
        'm.s.',
        'ph.d.',
        'ba',
        'bs',
        'ma',
        'ms',
        'mba',
        'b.tech',
        'm.tech',
        'b.e.',
        'm.e.',
        'high school',
        'diploma',
        'certificate',
      ]
      if (degreeKeywords.some((kw) => line.toLowerCase().includes(kw))) {
        current.degree = line
      } else {
        current.fieldOfStudy = line
      }
    } else {
      current.description += (current.description ? ' ' : '') + line
    }
  }

  if (current) entries.push(current)
  return entries
}

function parseSkillsSection(lines) {
  const technical = []
  const soft = []
  const languages = []
  const certifications = []

  for (const line of lines) {
    const items = line.split(/[,•·|/]\s*/).filter(Boolean)
    for (const item of items) {
      const clean = item.replace(/^[-•·*]\s*/, '').trim()
      if (!clean) continue

      const lower = clean.toLowerCase()
      if (
        ['english', 'spanish', 'french', 'german', 'mandarin', 'japanese',
          'portuguese', 'arabic', 'hindi', 'italian', 'russian', 'korean',
          'dutch', 'polish', 'turkish', 'vietnamese', 'thai', 'swedish',
          'norwegian', 'danish', 'finnish', 'hebrew', 'greek'].some(
          (lang) => lower.includes(lang) || lower === lang,
        )
      ) {
        languages.push(clean)
      } else if (
        ['certified', 'certification', 'license', 'professional ',
          'aws certified', 'google', 'scrum', 'pmp', 'cissp', 'comptia',
          'ccna', 'ceh', 'itil'].some((kw) => lower.includes(kw))
      ) {
        certifications.push(clean)
      } else {
        technical.push(clean)
      }
    }
  }

  return { technical, soft, languages, certifications }
}

function parseProjectsSection(lines) {
  const entries = []
  let current = null

  for (const line of lines) {
    if (!current) {
      current = {
        name: line,
        role: '',
        startDate: '',
        endDate: '',
        description: '',
        technologies: [],
        githubLink: '',
        liveLink: '',
      }
    } else if (!current.description) {
      current.description = line
    } else {
      current.description += ' ' + line
    }
  }

  if (current) entries.push(current)
  return entries
}

export default function heuristicParse(rawText) {
  const cleaned = cleanText(rawText)
  const lines = extractLines(cleaned)
  const sections = parseSections(lines)

  const email = extractEmail(cleaned)
  const phone = extractPhone(cleaned)
  const linkedIn = extractLinkedIn(cleaned)
  const github = extractGitHub(cleaned)
  const portfolio = extractWebsite(cleaned)

  let fullName = ''
  let professionalTitle = ''
  let location = ''

  const headerLines = sections['header'] || []
  if (headerLines.length > 0) {
    fullName = headerLines[0]
    if (headerLines.length > 1) professionalTitle = headerLines[1]
  }

  for (const line of headerLines) {
    if (line.includes(',') && /[A-Z][a-z]+/.test(line)) {
      const parts = line.split(',')
      if (parts.length === 2 && /^[A-Z]/.test(parts[0]) && /^[A-Z]{2}/.test(parts[1].trim())) {
        location = line
      }
    }
  }

  const summaryKeys = ['summary', 'professional summary', 'profile', 'objective', 'about me']
  let professionalSummary = ''
  for (const key of summaryKeys) {
    if (sections[key] && sections[key].length > 0) {
      professionalSummary = sections[key].join(' ')
      break
    }
  }

  const experienceKeys = ['experience', 'work experience', 'professional experience', 'employment history', 'work history']
  let experience = []
  for (const key of experienceKeys) {
    if (sections[key] && sections[key].length > 0) {
      experience = parseExperienceSection(sections[key])
      break
    }
  }

  const educationKeys = ['education']
  let education = []
  for (const key of educationKeys) {
    if (sections[key] && sections[key].length > 0) {
      education = parseEducationSection(sections[key])
      break
    }
  }

  const skillsKeys = ['skills', 'technical skills', 'core competencies']
  let skills = { technical: [], soft: [], languages: [], certifications: [] }
  for (const key of skillsKeys) {
    if (sections[key] && sections[key].length > 0) {
      skills = parseSkillsSection(sections[key])
      break
    }
  }

  const projectsKeys = ['projects', 'project']
  let projects = []
  for (const key of projectsKeys) {
    if (sections[key] && sections[key].length > 0) {
      projects = parseProjectsSection(sections[key])
      break
    }
  }

  const cleanField = (val) => (typeof val === 'string' ? val.replace(/\s+/g, ' ').trim() : val)

  return {
    personal: {
      fullName: cleanField(fullName),
      professionalTitle: cleanField(professionalTitle),
      email: cleanField(email),
      phone: cleanField(phone),
      location: cleanField(location),
      portfolio: cleanField(portfolio),
      linkedin: cleanField(linkedIn),
      github: cleanField(github),
      professionalSummary: cleanField(professionalSummary),
    },
    education: education.map((e) => ({
      ...e,
      institution: cleanField(e.institution),
      degree: cleanField(e.degree),
      fieldOfStudy: cleanField(e.fieldOfStudy),
      description: cleanField(e.description),
    })),
    experience: experience.map((e) => ({
      ...e,
      jobTitle: cleanField(e.jobTitle),
      company: cleanField(e.company),
      description: cleanField(e.description),
      achievements: cleanField(e.achievements),
    })),
    projects: projects.map((p) => ({
      ...p,
      name: cleanField(p.name),
      role: cleanField(p.role),
      description: cleanField(p.description),
    })),
    skills,
  }
}
