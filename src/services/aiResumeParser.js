const SYSTEM_PROMPT = `You are a resume parser. Extract structured information from the resume text below and return ONLY valid JSON with this exact schema:

{
  "personal": {
    "fullName": "",
    "professionalTitle": "",
    "email": "",
    "phone": "",
    "location": "",
    "portfolio": "",
    "linkedin": "",
    "github": ""
  },
  "summary": "",
  "experience": [
    {
      "position": "",
      "company": "",
      "startDate": "",
      "endDate": "",
      "description": []
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "startDate": "",
      "endDate": ""
    }
  ],
  "skills": [],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": [],
      "github": "",
      "live": ""
    }
  ],
  "certifications": [],
  "languages": []
}

RULES:
1. Maintain the original hierarchy. Company names stay with their jobs, dates stay with their jobs.
2. Bullet points become array items in "description".
3. Identify these sections: Personal Information, Professional Summary, Experience, Education, Skills, Projects, Certifications, Languages.
4. If a section cannot be confidently identified, place it under "uncategorized" instead of mixing with another section. Include "uncategorized" as a top-level key with string value.
5. Extract as much detail as possible. For skills, list individual skills as separate items.
6. For projects, extract name, description, technologies used, and any links.
7. For education, extract institution, degree, field of study, and dates.
8. Return ONLY the JSON object, no markdown, no code fences, no explanation.`

const STORAGE_KEY = 'ai-career-companion-ai-config'

export function getAIConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export function saveAIConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

export function clearAIConfig() {
  localStorage.removeItem(STORAGE_KEY)
}

export const PROVIDERS = {
  GEMINI: {
    id: 'gemini',
    label: 'Google Gemini',
    description: 'Gemini 2.0 Flash (free tier available)',
    keyLabel: 'Gemini API Key',
    keyPlaceholder: 'AIzaSy...',
  },
  OPENAI: {
    id: 'openai',
    label: 'OpenAI',
    description: 'GPT-4o mini (paid API)',
    keyLabel: 'OpenAI API Key',
    keyPlaceholder: 'sk-...',
  },
  HUGGINGFACE: {
    id: 'huggingface',
    label: 'Hugging Face',
    description: 'Mistral / Llama (free tier)',
    keyLabel: 'Hugging Face API Token',
    keyPlaceholder: 'hf_...',
  },
  LOCAL: {
    id: 'local',
    label: 'Local Parser',
    description: 'Built-in heuristic parser (no API key needed)',
    keyLabel: '',
    keyPlaceholder: '',
  },
}

function buildUserPrompt(text) {
  return `Extract resume data from this text:\n\n${text}`
}

async function parseWithGemini(text, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT + '\n\n' + buildUserPrompt(text) }],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 8192,
    },
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Gemini API error (${response.status}): ${errText}`)
  }

  const data = await response.json()
  const candidate = data?.candidates?.[0]
  const raw = candidate?.content?.parts?.[0]?.text || ''

  return extractJSON(raw)
}

async function parseWithOpenAI(text, apiKey) {
  const url = 'https://api.openai.com/v1/chat/completions'

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(text) },
    ],
    temperature: 0.1,
    max_tokens: 8192,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`OpenAI API error (${response.status}): ${errText}`)
  }

  const data = await response.json()
  const raw = data?.choices?.[0]?.message?.content || ''

  return extractJSON(raw)
}

async function parseWithHuggingFace(text, apiKey) {
  const url =
    'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3'

  const prompt = `<s>[INST] ${SYSTEM_PROMPT}\n\n${buildUserPrompt(text)} [/INST]`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        temperature: 0.1,
        max_new_tokens: 4096,
        return_full_text: false,
      },
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Hugging Face API error (${response.status}): ${errText}`)
  }

  const data = await response.json()
  const raw = Array.isArray(data) ? data[0]?.generated_text || '' : ''

  return extractJSON(raw)
}

function extractJSON(raw) {
  const cleaned = raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  const braceStart = cleaned.indexOf('{')
  const braceEnd = cleaned.lastIndexOf('}')

  if (braceStart === -1 || braceEnd === -1) {
    throw new Error('No JSON object found in AI response')
  }

  const jsonStr = cleaned.slice(braceStart, braceEnd + 1)

  try {
    return JSON.parse(jsonStr)
  } catch {
    throw new Error('AI returned malformed JSON. Please try again or use the Local Parser.')
  }
}

export async function aiParse(text, providerId, apiKey) {
  switch (providerId) {
    case 'gemini':
      return parseWithGemini(text, apiKey)
    case 'openai':
      return parseWithOpenAI(text, apiKey)
    case 'huggingface':
      return parseWithHuggingFace(text, apiKey)
    default:
      throw new Error(`Unknown AI provider: ${providerId}`)
  }
}
