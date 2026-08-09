// SavedJob model.
// Tracks a job the user has saved and/or marked as applied. The complete
// job document (as returned by the job search API) is persisted so saved
// jobs can be displayed later without re-querying Jooble. A user can have
// at most one record per job, and a job can be both saved and applied.
// Every record belongs to the authenticated user (from the JWT).

import mongoose from 'mongoose'

const savedJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // The provider job id (e.g. Jooble's id). Combined with `user` this is unique.
    jobId: {
      type: String,
      required: true,
      trim: true,
    },
    // The complete job object returned by the search API (title, company,
    // location, salary, type, snippet, link, source, updated, etc.).
    job: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    isSaved: {
      type: Boolean,
      default: true,
    },
    isApplied: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// A user can only have one record per job.
savedJobSchema.index({ user: 1, jobId: 1 }, { unique: true })

const SavedJob = mongoose.model('SavedJob', savedJobSchema)

export default SavedJob
