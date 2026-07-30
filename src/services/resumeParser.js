// Resume parser service — uploads a file to the backend, extracts text,
// parses it with Gemini AI, and normalises the result for ResumeContext.

import { uploadResume, parseResumeText } from './api'

function addIds(arr, prefix) {
  return (arr || []).map((item, i) => ({
    id: `${prefix}-${Date.now()}-${i}`,
    ...item,
  }))
}

function normalizeBackendData(apiData) {
  const d = apiData || {}

  return {
    personal: {
      fullName: d.personal?.fullName || '',
      professionalTitle: d.personal?.professionalTitle || '',
      email: d.personal?.email || '',
      phone: d.personal?.phone || '',
      location: d.personal?.location || '',
      portfolio: d.personal?.portfolio || '',
      linkedin: d.personal?.linkedin || '',
      github: d.personal?.github || '',
      professionalSummary: d.summary || '',
    },
    education: addIds(d.education, 'edu').map((e) => ({
      institution: e.institution || '',
      degree: e.degree || '',
      fieldOfStudy: e.fieldOfStudy || '',
      startDate: e.startDate || '',
      endDate: e.endDate || '',
      grade: e.grade || '',
      description: e.description || '',
      ...e,
    })),
    experience: addIds(d.experience, 'exp').map((e) => ({
      jobTitle: e.jobTitle || '',
      company: e.company || '',
      startDate: e.startDate || '',
      endDate: e.endDate || '',
      currentlyWorking: e.currentlyWorking || /present|current|now/i.test(e.endDate || ''),
      description: e.description || '',
      achievements: e.achievements || '',
      ...e,
    })),
    projects: addIds(d.projects, 'proj').map((p) => ({
      name: p.name || '',
      role: p.role || '',
      startDate: p.startDate || '',
      endDate: p.endDate || '',
      description: p.description || '',
      technologies: Array.isArray(p.technologies) ? p.technologies : [],
      githubLink: p.githubLink || '',
      liveLink: p.liveLink || '',
      ...p,
    })),
    skills: {
      technical: Array.isArray(d.skills?.technical) ? d.skills.technical : [],
      soft: Array.isArray(d.skills?.soft) ? d.skills.soft : [],
      languages: Array.isArray(d.skills?.languages) ? d.skills.languages : [],
      certifications: (d.certifications || []).map((c) => c.name || ''),
    },
    certifications: addIds(d.certifications, 'cert').map((c) => ({
      name: c.name || '',
      issuer: c.issuer || '',
      date: c.date || '',
      url: c.url || '',
      ...c,
    })),
  }
}

export async function parseResume(file) {
  // Step 1 — upload file and get extracted text.
  const uploadResult = await uploadResume(file)
  const text = uploadResult.data?.text

  if (!text) {
    throw new Error('No text could be extracted from the file.')
  }

  // Step 2 — send text to AI parser and get structured JSON.
  const parseResult = await parseResumeText(text)
  const parsed = parseResult.data

  // Step 3 — normalise to match ResumeContext shape.
  return normalizeBackendData(parsed)
}
