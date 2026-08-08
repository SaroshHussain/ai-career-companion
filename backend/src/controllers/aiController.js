// AI controller — provides endpoints for testing AI integration
// and generating resume content, cover letters, etc.

import { generateText } from '../services/groq.js'
import { generateChatResponse } from '../services/gemini.js'

// System prompt for the AI Assistant chat. Establishes the assistant's
// role and the context of the app so every reply is grounded in the
// career-companion domain.
const ASSISTANT_SYSTEM_PROMPT = `You are Pathfinder, an AI career companion embedded in a web app that helps users build resumes, find jobs, prepare for interviews, and write cover letters.

The user is preparing for an interview. Help them succeed by:
- Answering interview questions and giving structured, realistic example answers.
- Offering tips for behavioral (STAR method), technical, and HR-round interviews.
- Reviewing their approach and suggesting improvements.
- Suggesting questions they can ask the interviewer.
- Staying encouraging and professional.

The app around you lets the user build/edit a resume, search jobs via Jooble, generate cover letters, and use a career dashboard. Keep answers concise (a few short paragraphs or a short list), practical, and directly useful. Ask a clarifying question when the user's request is ambiguous. Do not invent specific facts about the user's resume; if needed, ask them to provide details.`

export async function chatWithAssistant(req, res, next) {
  try {
    const { messages } = req.body

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Messages array is required.',
      })
    }

    const reply = await generateChatResponse(ASSISTANT_SYSTEM_PROMPT, messages)

    res.json({
      success: true,
      data: { reply },
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

function buildCoverLetterPrompt(resumeData, application) {
  const parts = []

  const personal = resumeData?.personal || {}
  parts.push(
    `Applicant name: ${personal.fullName || 'N/A'}\n` +
      `Professional title: ${personal.professionalTitle || 'N/A'}\n` +
      `Email: ${personal.email || 'N/A'}\n` +
      `Phone: ${personal.phone || 'N/A'}\n` +
      `Location: ${personal.location || personal.city || personal.address || 'N/A'}`,
  )

  if (resumeData?.professionalSummary || personal.professionalSummary) {
    parts.push(`Professional summary: ${personal.professionalSummary || resumeData.professionalSummary}`)
  }

  if (resumeData?.experience?.length > 0) {
    const expLines = resumeData.experience.map((e) => {
      const title = e.jobTitle || 'Untitled'
      const company = e.company ? ` at ${e.company}` : ''
      const duration = e.startDate ? `${e.startDate}${e.endDate ? ` to ${e.endDate}` : ' (present)'}` : ''
      return `- ${title}${company}${duration ? ` (${duration})` : ''}`
    })
    parts.push(`Experience:\n${expLines.join('\n')}`)
  }

  if (resumeData?.skills?.technical?.length > 0) {
    parts.push(`Technical skills: ${resumeData.skills.technical.join(', ')}`)
  }

  if (resumeData?.projects?.length > 0) {
    const projLines = resumeData.projects.map((p) => `- ${p.name || 'Untitled'}`)
    parts.push(`Projects:\n${projLines.join('\n')}`)
  }

  if (resumeData?.education?.length > 0) {
    const eduLines = resumeData.education.map((e) => {
      const degree = e.degree || 'Degree'
      const field = e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ''
      const institution = e.institution ? `, ${e.institution}` : ''
      return `- ${degree}${field}${institution}`
    })
    parts.push(`Education:\n${eduLines.join('\n')}`)
  }

  const context = parts.join('\n\n')

  return `You are a professional cover letter writer. Write a persuasive, ATS-friendly cover letter based on the applicant's resume below and the role they are applying for.

Application details:
- Company: ${application.company || 'the company'}
- Job title: ${application.position || 'the position'}
- Additional notes from applicant: ${application.notes || 'None'}

Resume:
${context}

Requirements:
- Address the letter to the hiring manager, mentioning the company and the specific role.
- Open with a strong hook connecting the applicant's background to the role.
- Highlight 2-4 most relevant accomplishments or skills from the resume.
- Keep it to 3-4 short paragraphs. Do not invent facts not present in the resume.
- Sign off with the applicant's full name.
- Return only the letter body (no salutation placeholder notes, no subject line), formatted with blank lines between paragraphs.`
}

export async function generateCoverLetter(req, res, next) {
  try {
    const { resumeData, application } = req.body

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Resume data is required.',
      })
    }

    if (!application || (!application.company && !application.position)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least a company name or job title.',
      })
    }

    const prompt = buildCoverLetterPrompt(resumeData, application || {})
    const letter = await generateText(prompt)

    res.json({
      success: true,
      data: { letter: letter.trim() },
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
