// Jobs controller — exposes endpoints for searching jobs via Jooble
// and looking up individual jobs returned by recent searches.
//
// Jooble's API has no per-job detail endpoint, so the most recent search
// results are kept in an in-memory cache. GET /jobs/:id reads from that
// cache so the frontend detail page can deep-link (and survive refresh).

import { searchJobs } from '../services/jooble.js'

// In-memory store of jobs from recent searches, keyed by job id.
// Bounded — we prune once it grows past MAX_CACHED_JOBS.
const jobCache = new Map()
const MAX_CACHED_JOBS = 500

function cacheJobs(jobs) {
  for (const job of jobs) {
    if (job.id != null) {
      jobCache.set(String(job.id), job)
    }
  }

  if (jobCache.size > MAX_CACHED_JOBS) {
    const excess = jobCache.size - MAX_CACHED_JOBS
    for (const key of jobCache.keys()) {
      if (excess <= 0) break
      jobCache.delete(key)
      excess -= 1
    }
  }
}

export async function searchJobsHandler(req, res, next) {
  try {
    const keywords = (req.query.keywords || req.query.keyword || '').trim()
    const region = (req.query.region || req.query.rgns || '').trim()

    if (!keywords) {
      return res.status(400).json({
        success: false,
        message: 'A search keyword is required.',
      })
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const resultsPerPage = Math.min(
      50,
      Math.max(1, parseInt(req.query.resultsPerPage, 10) || 20),
    )

    const data = await searchJobs({
      keywords,
      region,
      page,
      resultsPerPage,
    })

    const jobs = Array.isArray(data.jobs) ? data.jobs : []
    cacheJobs(jobs)

    res.json({
      success: true,
      data: {
        totalCount: data.totalCount || jobs.length,
        page,
        resultsPerPage,
        jobs,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function getJobHandler(req, res, next) {
  try {
    const job = jobCache.get(String(req.params.id))

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found. Please search again from the job finder.',
      })
    }

    res.json({ success: true, data: { job } })
  } catch (err) {
    next(err)
  }
}
