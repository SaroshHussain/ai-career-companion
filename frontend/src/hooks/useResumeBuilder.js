import { useState, useCallback } from 'react'

function useResumeBuilder(initialData) {
  const [resumeData, setResumeData] = useState(initialData)

  const updatePersonal = useCallback((field, value) => {
    setResumeData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
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

  const updateSkills = useCallback((category, items) => {
    setResumeData((prev) => ({
      ...prev,
      skills: { ...prev.skills, [category]: items },
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

  const resetResume = useCallback(() => {
    setResumeData(initialData)
  }, [initialData])

  return {
    resumeData,
    updatePersonal,
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
    updateSkills,
    addSkillItem,
    removeSkillItem,
    updateSkillItem,
    resetResume,
  }
}

export default useResumeBuilder
