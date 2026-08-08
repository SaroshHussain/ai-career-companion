export function isResumeEmpty(resumeData) {
  if (!resumeData) return true

  const p = resumeData.personal || {}
  if (p.fullName || p.professionalTitle || p.email || p.phone || p.location ||
      p.address || p.city || p.state || p.country ||
      p.portfolio || p.linkedin || p.github || p.professionalSummary) return false

  if ((resumeData.experience || []).length > 0) return false
  if ((resumeData.education || []).length > 0) return false

  const skills = resumeData.skills || {}
  const skillCategories = ['technical', 'soft', 'tools', 'frameworks', 'languages', 'databases', 'cloud', 'certifications']
  for (const cat of skillCategories) {
    if ((skills[cat] || []).length > 0) return false
  }

  if ((resumeData.projects || []).length > 0) return false
  if ((resumeData.certifications || []).length > 0) return false
  if ((resumeData.awards || []).length > 0) return false
  if ((resumeData.publications || []).length > 0) return false
  if ((resumeData.volunteer || []).length > 0) return false
  if ((resumeData.interests || []).length > 0) return false
  if ((resumeData.references || []).length > 0) return false

  return true
}
