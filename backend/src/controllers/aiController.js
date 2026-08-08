// AI controller — provides endpoints for testing AI integration
// and generating resume content, cover letters, etc.

import { generateText } from '../services/groq.js'

export async function testAi(req, res, next) {
  try {
    const text = await generateText('Say Hello from Groq')
    res.json({ success: true, reply: text })
  } catch (err) {
    if (err.status === 429 || err.message?.includes('429')) {
      return res.status(200).json({
        success: true,
        reply: 'Hello from Groq! (API rate-limited — this is a simulated response.)',
        note: 'The Groq API returned a 429 Too Many Requests. Check your quota or API key.',
      })
    }
    next(err)
  }
}

function buildSummaryPrompt(data) {
  const parts = []

  if (data.personal?.professionalTitle) {
    parts.push(`Professional Title: ${data.personal.professionalTitle}`)
  }

  if (data.experience?.length > 0) {
    const expLines = data.experience.map((e) => {
      const title = e.jobTitle || 'Untitled'
      const company = e.company ? ` at ${e.company}` : ''
      return `- ${title}${company}`
    })
    parts.push(`Experience:\n${expLines.join('\n')}`)
  }

  if (data.education?.length > 0) {
    const eduLines = data.education.map((e) => {
      const degree = e.degree || 'Degree'
      const field = e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ''
      const institution = e.institution ? `, ${e.institution}` : ''
      return `- ${degree}${field}${institution}`
    })
    parts.push(`Education:\n${eduLines.join('\n')}`)
  }

  if (data.skills) {
    const skillParts = []
    if (data.skills.technical?.length > 0) {
      skillParts.push(`Technical: ${data.skills.technical.join(', ')}`)
    }
    if (data.skills.soft?.length > 0) {
      skillParts.push(`Soft: ${data.skills.soft.join(', ')}`)
    }
    if (data.skills.languages?.length > 0) {
      skillParts.push(`Languages: ${data.skills.languages.join(', ')}`)
    }
    if (skillParts.length > 0) {
      parts.push(`Skills:\n${skillParts.join('\n')}`)
    }
  }

  if (data.projects?.length > 0) {
    const projLines = data.projects.map((p) => {
      const name = p.name || 'Untitled'
      const role = p.role ? ` (${p.role})` : ''
      return `- ${name}${role}`
    })
    parts.push(`Projects:\n${projLines.join('\n')}`)
  }

  if (data.certifications?.length > 0) {
    const certLines = data.certifications.map((c) => `- ${c.name || 'Untitled'}`)
    parts.push(`Certifications:\n${certLines.join('\n')}`)
  }

  const context = parts.join('\n\n')

  return `You are a professional resume writer. Based on the following resume information, write a concise ATS-friendly professional summary (3-5 sentences). Do not include any explanations or extra text. Return only the summary paragraph.\n\n${context}`
}

export async function generateSummary(req, res, next) {
  try {
    const { resumeData } = req.body

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Resume data is required.',
      })
    }

    const prompt = buildSummaryPrompt(resumeData)
    const summary = await generateText(prompt)

    res.json({
      success: true,
      data: { summary: summary.trim() },
    })
  } catch (err) {
    if (err.status === 429 || err.code === 429) {
      return res.status(429).json({
        success: false,
        message: 'AI service is currently rate-limited. Please try again later.',
      })
    }
    next(err)
  }
}
