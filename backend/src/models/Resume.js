// Resume model.
// Persists a user's parsed/edited resume as a single document so it can be
// reopened by id. The `data` field stores the full normalized resume shape
// the frontend editor uses (personal, experience, education, skills, etc.).
// Every resume belongs to a user (from the JWT), so list/get operations are
// scoped per account.

import mongoose from 'mongoose'

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // A short human-friendly label (defaults to the original file name).
    name: {
      type: String,
      trim: true,
      default: 'Untitled Resume',
    },
    // The full resume document in the frontend editor's shape.
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // Original uploaded file metadata (when created from an upload).
    // Stored as Mixed because it contains a key literally named "type"
    // (the MIME type), which would clash with Mongoose's type keyword.
    fileInfo: {
      type: mongoose.Schema.Types.Mixed,
      default: undefined,
    },
  },
  {
    timestamps: true,
  },
)

const Resume = mongoose.model('Resume', resumeSchema)

export default Resume
