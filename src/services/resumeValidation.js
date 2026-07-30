export function isResumeEmpty(resumeData) {
  if (!resumeData) return true

  const p = resumeData.personal || {}
  if (p.fullName || p.professionalTitle || p.email || p.phone || p.location ||
      p.portfolio || p.linkedin || p.github || p.professionalSummary) return false

  if ((resumeData.experience || []).length > 0) return false
  if ((resumeData.education || []).length > 0) return false

  const skills = resumeData.skills || {}
  if ((skills.technical || []).length > 0 || (skills.soft || []).length > 0 ||
      (skills.languages || []).length > 0 || (skills.certifications || []).length > 0) return false

  if ((resumeData.projects || []).length > 0) return false
  if ((resumeData.certifications || []).length > 0) return false

  return true
}
