// Resume routes — handles file upload, text extraction, and
// AI-powered parsing into structured JSON.

import { Router } from 'express'
import upload from '../middleware/upload.js'
import { uploadResume, parseResume } from '../controllers/resumeController.js'

const router = Router()

// POST /api/resume/upload — accept a single PDF/DOCX file under the "resume" field.
router.post('/upload', upload.single('resume'), uploadResume)

// POST /api/resume/parse — accepts { text } in the body and returns structured JSON.
router.post('/parse', parseResume)

export default router
