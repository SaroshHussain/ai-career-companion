// Gemini AI service.
// Calls the Gemini REST API directly with fetch. The API key is loaded
// from the environment variable GEMINI_KEY and sent as a header.
//   Base URL: https://generativelanguage.googleapis.com/v1beta
//   Endpoint: POST /models/{model}:generateContent
//   Auth:     x-goog-api-key header
//
// Model name uses the alias that is guaranteed to be available to new
// users; check the exact value in GEMINI_MODEL if you have a different
// model enabled on your plan.

const DEFAULT_MODEL = 'gemini-flash-latest'

const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta'

function getApiKey() {
  const apiKey = process.env.GEMINI_KEY
  if (!apiKey) {
    throw Object.assign(
      new Error('GEMINI_KEY is not configured in the environment.'),
      { status: 500 },
    )
  }
  return apiKey
}

function getModel() {
  return process.env.GEMINI_MODEL || DEFAULT_MODEL
}

// Normalize a non-2xx / API-level error into a consistent error object
// with a status, so downstream handlers (rate-limit detection, etc.)
// can react to it.
function raiseHttpError(status, body) {
  let message = `Gemini API request failed with status ${status}.`
  let providerMessage = ''

  try {
    const parsed = typeof body === 'string' ? JSON.parse(body) : body
    providerMessage = parsed?.error?.message || parsed?.message || ''
  } catch {
    /* ignore parse errors */
  }

  if (providerMessage) {
    message = providerMessage
  }

  const err = Object.assign(new Error(message), { status })
  err.provider = providerMessage
  throw err
}

// Send a chat-style request. `messages` is an array of
// { role: 'user' | 'model', content: string }. `systemPrompt` sets the
// context/behaviour for the assistant.
export async function generateChatResponse(systemPrompt, messages) {
  const apiKey = getApiKey()
  const model = getModel()

  const contents = (messages || [])
    .filter((m) => m && typeof m.content === 'string' && m.content.trim())
    .map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

  if (contents.length === 0) {
    throw Object.assign(new Error('No chat messages provided.'), { status: 400 })
  }

  const payload = {
    contents,
    systemInstruction: systemPrompt
      ? { parts: [{ text: systemPrompt }] }
      : undefined,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  }

  let res
  try {
    res = await fetch(
      `${API_BASE_URL}/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(payload),
      },
    )
  } catch (err) {
    throw Object.assign(
      new Error(`Unable to reach the Gemini API: ${err.message || err}`),
      { status: 502 },
    )
  }

  if (!res.ok) {
    const bodyText = await res.text()
    raiseHttpError(res.status, bodyText)
  }

  const data = await res.json()
  const text =
    data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || ''

  if (!text.trim()) {
    const blockReason = data?.candidates?.[0]?.finishReason || 'unknown'
    throw Object.assign(
      new Error(`Gemini returned no text (finish reason: ${blockReason}).`),
      { status: 422 },
    )
  }

  return text
}
