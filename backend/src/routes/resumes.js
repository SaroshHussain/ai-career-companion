// Resume document routes — mounted at /api/resumes.
// All routes require a valid JWT (the user's resumes are scoped by req.user).

import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import {
  createResume,
  listResumes,
  getResumeById,
  updateResume,
  deleteResume,
} from '../controllers/resumeDocumentsController.js'

const router = Router()

// Every route here is protected — no anonymous access to resume documents.
router.use(protect)

router.post('/', createResume)
router.get('/', listResumes)
router.get('/:id', getResumeById)
router.put('/:id', updateResume)
router.delete('/:id', deleteResume)

export default router
