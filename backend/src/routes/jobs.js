// Jobs routes — endpoints for searching jobs via Jooble and
// fetching individual jobs from recent searches.
// All routes are prefixed with /api in app.js.

import { Router } from 'express'
import { searchJobsHandler, getJobHandler } from '../controllers/jobsController.js'

const router = Router()

router.get('/jobs', searchJobsHandler)
router.get('/jobs/:id', getJobHandler)

export default router
