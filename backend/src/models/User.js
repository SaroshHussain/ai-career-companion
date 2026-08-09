// User model.
// Stores account credentials for authentication. Passwords are never kept
// in plain text — they are hashed with bcrypt before being saved, and the
// password field is excluded from query results by default.

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      // Don't return the hash in normal queries (e.g. /auth/me).
      select: false,
    },
  },
  {
    timestamps: true,
  },
)

// Hash the password automatically whenever it is set or changed.
// Mongoose 9 pre hooks are promise-based — no `next` callback is provided.
userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Compare a candidate password with the stored hash.
userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
