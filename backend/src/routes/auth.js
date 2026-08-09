// Authentication routes — mounted at /api.
// register and login are public; /auth/me is protected by JWT.

import { Router } from 'express'
import { register, login, getMe } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

// POST /api/auth/register — create a new account.
router.post('/auth/register', register)

// POST /api/auth/login — exchange credentials for a JWT.
router.post('/auth/login', login)

// GET /api/auth/me — return the currently authenticated user.
router.get('/auth/me', protect, getMe)

export default router
