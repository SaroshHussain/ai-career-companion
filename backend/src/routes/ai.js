// AI routes — exposes endpoints for testing and interacting with
// the Groq model. All routes are prefixed with /api in app.js.

import { Router } from 'express'
import { testAi, generateSummary, generateCoverLetter, chatWithAssistant } from '../controllers/aiController.js'

const router = Router()

router.get('/test-ai', testAi)
router.post('/ai/generate-summary', generateSummary)
router.post('/ai/generate-cover-letter', generateCoverLetter)
router.post('/ai/chat', chatWithAssistant)

export default router
