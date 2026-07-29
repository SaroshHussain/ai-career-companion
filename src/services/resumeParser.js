import { extractText } from './fileExtractor'
import { getAIConfig, aiParse } from './aiResumeParser'

function normalizeAIData(aiData) {
  const d = aiData || {}

  const personal = {
    fullName: d.personal?.fullName || '',
    professionalTitle: d.personal?.professionalTitle || '',
    email: d.personal?.email || '',
    phone: d.personal?.phone || '',
    location: d.personal?.location || '',
    portfolio: d.personal?.portfolio || '',
    linkedin: d.personal?.linkedin || '',
    github: d.personal?.github || '',
    professionalSummary: d.summary || '',
  }

  const experience = (d.experience || []).map((e, i) => ({
    id: `exp-${Date.now()}-${i}`,
    jobTitle: e.position || '',
    company: e.company || '',
    startDate: e.startDate || '',
    endDate: e.endDate || '',
    currentlyWorking: /present|current|now/i.test(e.endDate || ''),
    description: Array.isArray(e.description) ? e.description.join('\n') : (e.description || ''),
    achievements: '',
  }))

  const education = (d.education || []).map((e, i) => ({
    id: `edu-${Date.now()}-${i}`,
    institution: e.institution || '',
    degree: e.degree || '',
    fieldOfStudy: e.field || '',
    startDate: e.startDate || '',
    endDate: e.endDate || '',
    grade: '',
    description: '',
  }))

  const projects = (d.projects || []).map((p, i) => ({
    id: `proj-${Date.now()}-${i}`,
    name: p.name || '',
    role: '',
    startDate: '',
    endDate: '',
    description: p.description || '',
    technologies: Array.isArray(p.technologies) ? p.technologies : [],
    githubLink: p.github || '',
    liveLink: p.live || '',
  }))

  const skills = {
    technical: Array.isArray(d.skills) ? d.skills : [],
    soft: [],
    languages: Array.isArray(d.languages) ? d.languages : [],
    certifications: Array.isArray(d.certifications) ? d.certifications : [],
  }

  return { personal, education, experience, projects, skills }
}

function normalizeHeuristicData(parsed) {
  return {
    personal: {
      fullName: parsed.personal?.fullName || '',
      professionalTitle: parsed.personal?.professionalTitle || '',
      email: parsed.personal?.email || '',
      phone: parsed.personal?.phone || '',
      location: parsed.personal?.location || '',
      portfolio: parsed.personal?.portfolio || '',
      linkedin: parsed.personal?.linkedin || '',
      github: parsed.personal?.github || '',
      professionalSummary: parsed.personal?.professionalSummary || '',
    },
    education: (parsed.education || []).map((e) => ({
      id: e.id || `edu-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      institution: e.institution || '',
      degree: e.degree || '',
      fieldOfStudy: e.fieldOfStudy || '',
      startDate: e.startDate || '',
      endDate: e.endDate || '',
      grade: e.grade || '',
      description: e.description || '',
    })),
    experience: (parsed.experience || []).map((e) => ({
      id: e.id || `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      jobTitle: e.jobTitle || '',
      company: e.company || '',
      startDate: e.startDate || '',
      endDate: e.endDate || '',
      currentlyWorking: e.currentlyWorking || false,
      description: e.description || '',
      achievements: e.achievements || '',
    })),
    projects: (parsed.projects || []).map((p) => ({
      id: p.id || `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: p.name || '',
      role: p.role || '',
      startDate: p.startDate || '',
      endDate: p.endDate || '',
      description: p.description || '',
      technologies: p.technologies || [],
      githubLink: p.githubLink || '',
      liveLink: p.liveLink || '',
    })),
    skills: {
      technical: parsed.skills?.technical || [],
      soft: parsed.skills?.soft || [],
      languages: parsed.skills?.languages || [],
      certifications: parsed.skills?.certifications || [],
    },
  }
}

export async function parseResume(file) {
  const text = await extractText(file)

  const config = getAIConfig()

  if (config && config.provider !== 'local' && config.apiKey) {
    try {
      const aiData = await aiParse(text, config.provider, config.apiKey)
      return normalizeAIData(aiData)
    } catch (aiErr) {
      console.warn('AI parsing failed, falling back to heuristic:', aiErr.message)
    }
  }

  const { default: heuristicParse } = await import('./heuristicParser')
  const parsed = heuristicParse(text)
  return normalizeHeuristicData(parsed)
}
