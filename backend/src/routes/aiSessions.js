// AI session routes — mounted at /api/ai-sessions.
// All routes require a valid JWT; sessions are scoped to req.user.

import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import {
  createSession,
  listSessions,
  getSession,
  updateSession,
  deleteSession,
} from '../controllers/aiSessionsController.js'

const router = Router()

router.use(protect)

router.post('/', createSession)
router.get('/', listSessions)
router.get('/:id', getSession)
router.put('/:id', updateSession)
router.delete('/:id', deleteSession)

export default router
