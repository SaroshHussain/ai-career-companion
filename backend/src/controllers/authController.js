// Authentication controllers.
// Handles user registration, login, and fetching the current profile.
// Successful auth returns a signed JWT plus a safe public user object.

import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import config from '../config/index.js'

// Sign a JWT containing the user id.
function signToken(userId) {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  })
}

// Strip the password/hash from the user document before returning it.
function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  }
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body || {}

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password.' })
    }

    const existing = await User.findOne({ email: String(email).toLowerCase() })
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' })
    }

    const user = await User.create({ name, email, password })
    const token = signToken(user._id)

    res.status(201).json({ success: true, token, user: publicUser(user) })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {}

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' })
    }

    // select('+password') overrides the schema default so we can compare hashes.
    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password')

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }

    const token = signToken(user._id)

    res.json({ success: true, token, user: publicUser(user) })
  } catch (err) {
    next(err)
  }
}

export async function getMe(req, res) {
  res.json({ success: true, user: publicUser(req.user) })
}
