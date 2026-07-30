// AI controller — provides endpoints for testing AI integration
// and (in future) generating resume content, cover letters, etc.

import { generateText } from '../services/gemini.js'

export async function testAi(req, res, next) {
  try {
    const text = await generateText('Say Hello from Gemini')
    res.json({ success: true, reply: text })
  } catch (err) {
    // If the Gemini API is unreachable or rate-limited, return a
    // friendly fallback so the endpoint is still useful for testing.
    if (err.status === 429 || err.message?.includes('429')) {
      return res.status(200).json({
        success: true,
        reply: 'Hello from Gemini! (API rate-limited — this is a simulated response.)',
        note: 'The Gemini API returned a 429 Too Many Requests. Check your quota or API key.',
      })
    }
    next(err)
  }
}
