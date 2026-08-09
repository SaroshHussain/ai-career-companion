// Saved jobs routes — mounted at /api/saved-jobs.
// All routes require a valid JWT; records are scoped to req.user.
// /stats must be registered before the /:jobId routes so "stats" is never
// treated as a job id.

import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import {
  saveJob,
  listSavedJobs,
  getSavedJobsStats,
  getSavedJob,
  unsaveJob,
  setAppliedStatus,
} from '../controllers/savedJobsController.js'

const router = Router()

router.use(protect)

router.post('/', saveJob)
router.get('/', listSavedJobs)
router.get('/stats', getSavedJobsStats)
router.get('/:jobId', getSavedJob)
router.delete('/:jobId', unsaveJob)
router.patch('/:jobId', setAppliedStatus)

export default router
