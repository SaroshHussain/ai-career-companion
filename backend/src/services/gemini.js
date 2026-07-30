// Gemini AI service.
// Wraps the @google/genai SDK to provide a simple interface for
// sending prompts to the Gemini model. The API key is loaded from
// the environment variable GEMINI_API_KEY. If the key is missing,
// calls will fail with a clear error.

import { GoogleGenAI } from '@google/genai'

const MODEL = 'gemini-2.0-flash'

let client = null

function getClient() {
  if (client) return client

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw Object.assign(
      new Error('GEMINI_API_KEY is not configured in the environment.'),
      { status: 500 },
    )
  }

  client = new GoogleGenAI({ apiKey })
  return client
}

export async function generateText(prompt) {
  const ai = getClient()

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      maxOutputTokens: 8192,
      temperature: 0.1,
    },
  })

  const candidate = response?.candidates?.[0]
  const text = candidate?.content?.parts?.[0]?.text || ''
  const blockReason = candidate?.safetyRatings
    ?.filter((r) => r.blocked)
    ?.map((r) => r.category)
    ?.join(', ')

  if (!text && blockReason) {
    throw Object.assign(
      new Error(`Gemini response blocked by safety filters: ${blockReason}`),
      { status: 422 },
    )
  }

  return text
}
