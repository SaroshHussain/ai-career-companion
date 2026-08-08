// AI routes — exposes endpoints for testing and interacting with
// the Groq model. All routes are prefixed with /api in app.js.

import { Router } from 'express'
import { testAi, generateSummary } from '../controllers/aiController.js'

const router = Router()

router.get('/test-ai', testAi)
router.post('/ai/generate-summary', generateSummary)

export default router
