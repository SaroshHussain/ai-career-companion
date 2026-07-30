// Health-check route — mounted at GET /api/health.
// Kept in a separate route file so that additional public
// monitoring endpoints can be added here later.

import { Router } from 'express'
import { getHealth } from '../controllers/healthController.js'

const router = Router()

router.get('/health', getHealth)

export default router
