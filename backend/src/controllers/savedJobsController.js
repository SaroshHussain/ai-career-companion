// Saved job controllers.
// Tracks jobs the user saves and/or marks as applied. A single SavedJob
// record holds both flags for a given job (identified by the provider jobId),
// so a job can be saved, applied, or both. Records are scoped to the
// authenticated user (req.user) — a user can only see their own jobs.
//
// Record lifecycle:
//   - Save          -> upsert with isSaved: true
//   - Unsave        -> isSaved: false (record removed if not also applied)
//   - Mark applied  -> upsert with isApplied: true (needs the job payload)
//   - Unmark applied-> isApplied: false (record removed if not also saved)

import SavedJob from '../models/SavedJob.js'

function serializeSavedJob(doc) {
  return {
    id: doc._id,
    jobId: doc.jobId,
    job: doc.job,
    isSaved: doc.isSaved,
    isApplied: doc.isApplied,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

// Removes a record when it no longer carries any state (not saved and not
// applied). Returns the deleted document, or null when it is still needed.
async function pruneIfEmpty(userId, jobId) {
  const doc = await SavedJob.findOne({ user: userId, jobId })
  if (!doc) return null
  if (!doc.isSaved && !doc.isApplied) {
    return SavedJob.findOneAndDelete({ _id: doc._id })
  }
  return null
}

// POST /api/saved-jobs — save a job (body: { jobId, job }).
export async function saveJob(req, res, next) {
  try {
    const { jobId, job } = req.body || {}

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'A jobId is required.' })
    }

    if (!job || typeof job !== 'object') {
      return res.status(400).json({ success: false, message: 'A job object is required.' })
    }

    const record = await SavedJob.findOneAndUpdate(
      { user: req.user._id, jobId: String(jobId) },
      { $set: { job, isSaved: true } },
      { upsert: true, returnDocument: 'after' },
    )

    res.status(201).json({ success: true, savedJob: serializeSavedJob(record) })
  } catch (err) {
    next(err)
  }
}

// GET /api/saved-jobs — list the user's saved jobs (newest first).
export async function listSavedJobs(req, res, next) {
  try {
    const jobs = await SavedJob.find({ user: req.user._id, isSaved: true }).sort({ createdAt: -1 })

    res.json({
      success: true,
      count: jobs.length,
      savedJobs: jobs.map(serializeSavedJob),
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/saved-jobs/stats — counts used by the dashboard.
// Must be registered before the /:jobId routes.
export async function getSavedJobsStats(req, res, next) {
  try {
    const [saved, applied] = await Promise.all([
      SavedJob.countDocuments({ user: req.user._id, isSaved: true }),
      SavedJob.countDocuments({ user: req.user._id, isApplied: true }),
    ])

    res.json({ success: true, data: { saved, applied } })
  } catch (err) {
    next(err)
  }
}

// GET /api/saved-jobs/:jobId — fetch the record for one job so the frontend
// can render the correct save/applied state.
export async function getSavedJob(req, res, next) {
  try {
    const record = await SavedJob.findOne({
      user: req.user._id,
      jobId: String(req.params.jobId),
    })

    if (!record) {
      return res.status(404).json({ success: false, message: 'Job not saved.' })
    }

    res.json({ success: true, savedJob: serializeSavedJob(record) })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/saved-jobs/:jobId — remove a job from the user's saved list.
export async function unsaveJob(req, res, next) {
  try {
    const jobId = String(req.params.jobId)
    const record = await SavedJob.findOneAndUpdate(
      { user: req.user._id, jobId },
      { $set: { isSaved: false } },
      { returnDocument: 'after' },
    )

    if (!record) {
      return res.status(404).json({ success: false, message: 'Job not saved.' })
    }

    await pruneIfEmpty(req.user._id, jobId)

    res.json({ success: true, message: 'Job removed from saved jobs.' })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/saved-jobs/:jobId — mark or unmark a job as applied.
// Body: { isApplied: boolean, job?: object } — the job payload is required
// only when enabling applied so a record can be created on the fly.
export async function setAppliedStatus(req, res, next) {
  try {
    const jobId = String(req.params.jobId)
    const { isApplied, job } = req.body || {}

    if (typeof isApplied !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isApplied must be a boolean.' })
    }

    if (isApplied) {
      if (!job || typeof job !== 'object') {
        return res.status(400).json({ success: false, message: 'A job object is required when marking a job as applied.' })
      }

      const record = await SavedJob.findOneAndUpdate(
        { user: req.user._id, jobId },
        { $set: { job, isApplied: true } },
        { upsert: true, returnDocument: 'after' },
      )

      return res.json({ success: true, savedJob: serializeSavedJob(record) })
    }

    const record = await SavedJob.findOneAndUpdate(
      { user: req.user._id, jobId },
      { $set: { isApplied: false } },
      { returnDocument: 'after' },
    )

    if (!record) {
      return res.status(404).json({ success: false, message: 'Job not found.' })
    }

    await pruneIfEmpty(req.user._id, jobId)

    res.json({ success: true, message: 'Applied status removed.' })
  } catch (err) {
    next(err)
  }
}
