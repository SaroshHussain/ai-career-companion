// Resume document controllers.
// CRUD for persisted resume documents. All routes are protected by the JWT
// middleware, so every query is scoped to req.user — a user can only read,
// update, or delete their own resumes.

import mongoose from 'mongoose'
import Resume from '../models/Resume.js'

// Serialize a resume document for the client.
function serializeResume(doc) {
  return {
    id: doc._id,
    name: doc.name,
    data: doc.data,
    fileInfo: doc.fileInfo || null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

// POST /api/resumes — create a new resume from parsed/edited data.
export async function createResume(req, res, next) {
  try {
    const { name, data, fileInfo } = req.body || {}

    if (!data || typeof data !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Request body must include a "data" object with the resume fields.',
      })
    }

    const resume = await Resume.create({
      user: req.user._id,
      name: name?.trim() || 'Untitled Resume',
      data,
      fileInfo: fileInfo || undefined,
    })

    res.status(201).json({ success: true, resume: serializeResume(resume) })
  } catch (err) {
    next(err)
  }
}

// GET /api/resumes — list the current user's resumes (newest first).
export async function listResumes(req, res, next) {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 })

    res.json({
      success: true,
      count: resumes.length,
      resumes: resumes.map(serializeResume),
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/resumes/:id — fetch a single resume by id.
export async function getResumeById(req, res, next) {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid resume id.' })
    }

    const resume = await Resume.findOne({ _id: id, user: req.user._id })

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' })
    }

    res.json({ success: true, resume: serializeResume(resume) })
  } catch (err) {
    next(err)
  }
}

// PUT /api/resumes/:id — update an existing resume.
export async function updateResume(req, res, next) {
  try {
    const { id } = req.params
    const { name, data, fileInfo } = req.body || {}

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid resume id.' })
    }

    const updates = {}
    if (typeof name === 'string') updates.name = name.trim() || 'Untitled Resume'
    if (data && typeof data === 'object') updates.data = data
    if (fileInfo && typeof fileInfo === 'object') updates.fileInfo = fileInfo

    const resume = await Resume.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updates,
      { new: true },
    )

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' })
    }

    res.json({ success: true, resume: serializeResume(resume) })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/resumes/:id — delete a resume.
export async function deleteResume(req, res, next) {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid resume id.' })
    }

    const resume = await Resume.findOneAndDelete({ _id: id, user: req.user._id })

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' })
    }

    res.json({ success: true, message: 'Resume deleted.' })
  } catch (err) {
    next(err)
  }
}
