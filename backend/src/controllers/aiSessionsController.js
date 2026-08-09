// AI session controllers.
// CRUD for persisted AI Assistant conversations. All routes are protected by
// the JWT middleware, so every query is scoped to req.user.

import mongoose from 'mongoose'
import AISession from '../models/AISession.js'

function serializeSession(doc) {
  return {
    id: doc._id,
    title: doc.title,
    messages: doc.messages || [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

function serializeSessionSummary(doc) {
  return {
    id: doc._id,
    title: doc.title,
    messageCount: (doc.messages || []).length,
    updatedAt: doc.updatedAt,
  }
}

function validateMessages(messages) {
  return (
    Array.isArray(messages) &&
    messages.every(
      (message) =>
        message &&
        typeof message === 'object' &&
        (message.role === 'user' || message.role === 'assistant') &&
        typeof message.content === 'string' &&
        message.content.trim().length > 0,
    )
  )
}

// POST /api/ai-sessions — create a new session (optionally with a title and
// the first messages).
export async function createSession(req, res, next) {
  try {
    const { title, messages } = req.body || {}

    if (messages !== undefined && !validateMessages(messages)) {
      return res.status(400).json({
        success: false,
        message: 'messages must be an array of { role: "user"|"assistant", content: string }.',
      })
    }

    const session = await AISession.create({
      user: req.user._id,
      title: title?.trim() || 'New Chat',
      messages: messages || [],
    })

    res.status(201).json({ success: true, session: serializeSession(session) })
  } catch (err) {
    next(err)
  }
}

// GET /api/ai-sessions — list the user's sessions (most recently updated
// first). Messages are omitted so the list stays lightweight.
export async function listSessions(req, res, next) {
  try {
    const sessions = await AISession.find({ user: req.user._id }).sort({ updatedAt: -1 })

    res.json({
      success: true,
      count: sessions.length,
      sessions: sessions.map(serializeSessionSummary),
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/ai-sessions/:id — fetch a single session including messages.
export async function getSession(req, res, next) {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid session id.' })
    }

    const session = await AISession.findOne({ _id: id, user: req.user._id })

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' })
    }

    res.json({ success: true, session: serializeSession(session) })
  } catch (err) {
    next(err)
  }
}

// PUT /api/ai-sessions/:id — replace the title and/or the full message list.
export async function updateSession(req, res, next) {
  try {
    const { id } = req.params
    const { title, messages } = req.body || {}

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid session id.' })
    }

    if (messages !== undefined && !validateMessages(messages)) {
      return res.status(400).json({
        success: false,
        message: 'messages must be an array of { role: "user"|"assistant", content: string }.',
      })
    }

    const updates = {}
    if (typeof title === 'string') updates.title = title.trim() || 'New Chat'
    if (messages !== undefined) updates.messages = messages

    const session = await AISession.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updates,
      { new: true, returnDocument: 'after' },
    )

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' })
    }

    res.json({ success: true, session: serializeSession(session) })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/ai-sessions/:id — delete a session.
export async function deleteSession(req, res, next) {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid session id.' })
    }

    const session = await AISession.findOneAndDelete({ _id: id, user: req.user._id })

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' })
    }

    res.json({ success: true, message: 'Session deleted.' })
  } catch (err) {
    next(err)
  }
}
