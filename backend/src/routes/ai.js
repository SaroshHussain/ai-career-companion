// AI routes — exposes endpoints for testing and interacting with
// the Gemini model. All routes are prefixed with /api in app.js.

import { Router } from 'express'
import { testAi } from '../controllers/aiController.js'

const router = Router()

router.get('/test-ai', testAi)

export default router
