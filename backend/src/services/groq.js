// Groq AI service.
// Calls the Groq Chat Completions API (OpenAI-compatible) directly with
// fetch. The API key is loaded from the environment variable GROQ_KEY
// and sent as a Bearer token, per Groq's API docs:
//   Base URL: https://api.groq.com/openai/v1
//   Endpoint: POST /chat/completions
//   Auth:     Authorization: Bearer $GROQ_API_KEY

const MODEL = 'llama-3.3-70b-versatile'

const API_URL = 'https://api.groq.com/openai/v1/chat/completions'

function getApiKey() {
  const apiKey = process.env.GROQ_KEY
  if (!apiKey) {
    throw Object.assign(
      new Error('GROQ_KEY is not configured in the environment.'),
      { status: 500 },
    )
  }
  return apiKey
}

// Normalize a non-2xx / API-level error into a consistent error object
// with a status, so downstream handlers (rate-limit detection, etc.)
// can react to it.
function raiseHttpError(status, body) {
  let message = `Groq API request failed with status ${status}.`
  let providerMessage = ''

  try {
    const parsed = typeof body === 'string' ? JSON.parse(body) : body
    providerMessage = parsed?.error?.message || parsed?.message || ''
  } catch {
    /* ignore parse errors */
  }

  if (providerMessage) {
    message = `${providerMessage}`
  }

  const err = Object.assign(new Error(message), { status })
  err.provider = providerMessage
  throw err
}

export async function generateText(prompt) {
  const apiKey = getApiKey()

  let res
  try {
    res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 8192,
      }),
    })
  } catch (err) {
    throw Object.assign(
      new Error(`Unable to reach the Groq API: ${err.message || err}`),
      { status: 502 },
    )
  }

  if (!res.ok) {
    const bodyText = await res.text()
    raiseHttpError(res.status, bodyText)
  }

  const data = await res.json()

  const text = data?.choices?.[0]?.message?.content || ''
  const refusal = data?.choices?.[0]?.message?.refusal || ''

  if (!text && refusal) {
    throw Object.assign(
      new Error(`Groq response refused: ${refusal}`),
      { status: 422 },
    )
  }

  return text
}
