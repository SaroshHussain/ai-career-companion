// AISession model.
// Persists an AI Assistant conversation so chats survive page reloads and
// users can revisit past sessions. Each session belongs to the authenticated
// user and stores the ordered list of user/assistant messages.

import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

const aiSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'New Chat',
      trim: true,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
)

const AISession = mongoose.model('AISession', aiSessionSchema)

export default AISession
