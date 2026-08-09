import { createContext, useContext, useState, useCallback } from 'react'
import { normalizeParsedResume } from '../services/resumeLoader'
import {
  createResumeDocument,
  getResumeDocumentById,
  updateResumeDocument,
} from '../services/api'

const RESUME_ID_KEY = 'pathfinder-resume-id'

const ResumeContext = createContext(null)

function readResumeId() {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(RESUME_ID_KEY) || null
  } catch {
    return null
  }
}

function persistResumeId(id) {
  if (typeof window === 'undefined') return
  try {
    if (id) window.localStorage.setItem(RESUME_ID_KEY, id)
    else window.localStorage.removeItem(RESUME_ID_KEY)
  } catch {
    // ignore storage failures
  }
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

const emptyResume = {
  personal: {
    fullName: '',
    professionalTitle: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    location: '',
    portfolio: '',
    linkedin: '',
    github: '',
    professionalSummary: '',
  },
  education: [],
  experience: [],
  projects: [],
  skills: {
    technical: [],
    soft: [],
    tools: [],
    frameworks: [],
    languages: [],
    databases: [],
    cloud: [],
  },
  certifications: [],
  awards: [],
  publications: [],
  volunteer: [],
  interests: [],
  references: [],
}

export function ResumeProvider({ children }) {
  const [resumeData, setResumeData] = useState(emptyResume)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [mode, setMode] = useState('new')
  // Id of the persisted resume document on the backend (if any).
  const [resumeId, setResumeId] = useState(readResumeId)

  const loadParsedResume = useCallback((parsedData, file) => {
    setResumeData(normalizeParsedResume(parsedData))
    setUploadedFile(file)
    setMode('upload')
  }, [])

  const resetToNew = useCallback(() => {
    setResumeData(emptyResume)
    setUploadedFile(null)
    setMode('new')
    setResumeId(null)
    persistResumeId(null)
  }, [])

  // Create or update the resume document on the backend and keep its id.
  // Accepts explicit overrides so callers can persist freshly parsed data
  // without waiting for context state to flush.
  // Note: the data is saved AS-IS (no normalization) so the exact shape the
  // backend API returned — including every field such as the top-level
  // "summary" — is preserved in MongoDB.
  const saveResumeToServer = useCallback(async (dataOverride, fileOverride) => {
    const data = dataOverride || resumeData
    const file = fileOverride || uploadedFile
    const name = data.personal?.fullName?.trim() || file?.name || 'Untitled Resume'
    const payload = {
      name,
      data,
      fileInfo: file
        ? { name: file.name, type: file.type, size: file.size }
        : undefined,
    }

    let result
    if (resumeId) {
      result = await updateResumeDocument(resumeId, payload)
    } else {
      result = await createResumeDocument(payload)
      const id = result?.resume?.id
      if (id) {
        setResumeId(id)
        persistResumeId(id)
      }
    }

    return result?.resume || null
  }, [resumeData, uploadedFile, resumeId])

  // Load a saved resume document from the backend by id.
  const loadResumeById = useCallback(async (id) => {
    const result = await getResumeDocumentById(id)
    const resume = result?.resume
    if (resume) {
      setResumeId(id)
      persistResumeId(id)
      setResumeData(normalizeParsedResume(resume.data))
      setMode('edit')
    }
    return resume || null
  }, [])

  const loadResume = useCallback((data) => {
    setResumeData(data)
  }, [])

  const updatePersonal = useCallback((field, value) => {
    setResumeData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }))
  }, [])

  const updateSummary = useCallback((value) => {
    setResumeData((prev) => ({
      ...prev,
      personal: { ...prev.personal, professionalSummary: value },
    }))
  }, [])

  const addEducation = useCallback(() => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: `edu-${Date.now()}`,
          institution: '',
          degree: '',
          fieldOfStudy: '',
          location: '',
          startDate: '',
          endDate: '',
          grade: '',
          description: '',
        },
      ],
    }))
  }, [])

  const updateEducation = useCallback((id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }))
  }, [])

  const removeEducation = useCallback((id) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }))
  }, [])

  const addExperience = useCallback(() => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: `exp-${Date.now()}`,
          jobTitle: '',
          company: '',
          employmentType: '',
          location: '',
          startDate: '',
          endDate: '',
          currentlyWorking: false,
          description: '',
          achievements: '',
        },
      ],
    }))
  }, [])

  const updateExperience = useCallback((id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }))
  }, [])

  const removeExperience = useCallback((id) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== id),
    }))
  }, [])

  const addProject = useCallback(() => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: `proj-${Date.now()}`,
          name: '',
          role: '',
          startDate: '',
          endDate: '',
          description: '',
          technologies: [],
          githubLink: '',
          liveLink: '',
        },
      ],
    }))
  }, [])

  const updateProject = useCallback((id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }))
  }, [])

  const removeProject = useCallback((id) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
    }))
  }, [])

  const addProjectTechnology = useCallback((projectId, tech) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((item) =>
        item.id === projectId
          ? { ...item, technologies: [...item.technologies, tech] }
          : item,
      ),
    }))
  }, [])

  const removeProjectTechnology = useCallback((projectId, index) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((item) =>
        item.id === projectId
          ? { ...item, technologies: item.technologies.filter((_, i) => i !== index) }
          : item,
      ),
    }))
  }, [])

  const addSkillItem = useCallback((category, item) => {
    setResumeData((prev) => ({
      ...prev,
      skills: { ...prev.skills, [category]: [...prev.skills[category], item] },
    }))
  }, [])

  const removeSkillItem = useCallback((category, index) => {
    setResumeData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index),
      },
    }))
  }, [])

  const updateSkillItem = useCallback((category, index, newValue) => {
    setResumeData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].map((item, i) =>
          i === index ? newValue : item,
        ),
      },
    }))
  }, [])

  const addCertification = useCallback(() => {
    setResumeData((prev) => ({
      ...prev,
      certifications: [
        ...(prev.certifications || []),
        { id: `cert-${Date.now()}`, name: '', issuer: '', date: '', url: '' },
      ],
    }))
  }, [])

  const updateCertification = useCallback((id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).map((c) =>
        c.id === id ? { ...c, [field]: value } : c,
      ),
    }))
  }, [])

  const removeCertification = useCallback((id) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter((c) => c.id !== id),
    }))
  }, [])

  const addAward = useCallback(() => {
    setResumeData((prev) => ({
      ...prev,
      awards: [
        ...(prev.awards || []),
        { id: `award-${Date.now()}`, title: '', issuer: '', date: '', description: '' },
      ],
    }))
  }, [])

  const updateAward = useCallback((id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      awards: (prev.awards || []).map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    }))
  }, [])

  const removeAward = useCallback((id) => {
    setResumeData((prev) => ({
      ...prev,
      awards: (prev.awards || []).filter((a) => a.id !== id),
    }))
  }, [])

  const addPublication = useCallback(() => {
    setResumeData((prev) => ({
      ...prev,
      publications: [
        ...(prev.publications || []),
        { id: `pub-${Date.now()}`, title: '', publisher: '', date: '', url: '', description: '' },
      ],
    }))
  }, [])

  const updatePublication = useCallback((id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      publications: (prev.publications || []).map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }))
  }, [])

  const removePublication = useCallback((id) => {
    setResumeData((prev) => ({
      ...prev,
      publications: (prev.publications || []).filter((p) => p.id !== id),
    }))
  }, [])

  const addVolunteer = useCallback(() => {
    setResumeData((prev) => ({
      ...prev,
      volunteer: [
        ...(prev.volunteer || []),
        {
          id: `vol-${Date.now()}`,
          role: '',
          organization: '',
          location: '',
          startDate: '',
          endDate: '',
          currentlyActive: false,
          description: '',
        },
      ],
    }))
  }, [])

  const updateVolunteer = useCallback((id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      volunteer: (prev.volunteer || []).map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    }))
  }, [])

  const removeVolunteer = useCallback((id) => {
    setResumeData((prev) => ({
      ...prev,
      volunteer: (prev.volunteer || []).filter((v) => v.id !== id),
    }))
  }, [])

  const addReference = useCallback(() => {
    setResumeData((prev) => ({
      ...prev,
      references: [
        ...(prev.references || []),
        { id: `ref-${Date.now()}`, name: '', jobTitle: '', company: '', email: '', phone: '' },
      ],
    }))
  }, [])

  const updateReference = useCallback((id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      references: (prev.references || []).map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    }))
  }, [])

  const removeReference = useCallback((id) => {
    setResumeData((prev) => ({
      ...prev,
      references: (prev.references || []).filter((r) => r.id !== id),
    }))
  }, [])

  const addInterest = useCallback((item) => {
    setResumeData((prev) => ({
      ...prev,
      interests: dedupeStrings([...(prev.interests || []), item]),
    }))
  }, [])

  const removeInterest = useCallback((index) => {
    setResumeData((prev) => ({
      ...prev,
      interests: (prev.interests || []).filter((_, i) => i !== index),
    }))
  }, [])

  const value = {
    resumeData,
    uploadedFile,
    mode,
    resumeId,
    loadParsedResume,
    resetToNew,
    saveResumeToServer,
    loadResumeById,
    loadResume,
    updatePersonal,
    updateSummary,
    addEducation,
    updateEducation,
    removeEducation,
    addExperience,
    updateExperience,
    removeExperience,
    addProject,
    updateProject,
    removeProject,
    addProjectTechnology,
    removeProjectTechnology,
    addSkillItem,
    removeSkillItem,
    updateSkillItem,
    addCertification,
    updateCertification,
    removeCertification,
    addAward,
    updateAward,
    removeAward,
    addPublication,
    updatePublication,
    removePublication,
    addVolunteer,
    updateVolunteer,
    removeVolunteer,
    addReference,
    updateReference,
    removeReference,
    addInterest,
    removeInterest,
  }

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
}

export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be used within ResumeProvider')
  return ctx
}
