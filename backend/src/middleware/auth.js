// Authentication middleware.
// Verifies the JWT sent by the client (Authorization: Bearer <token>) and
// attaches the requesting user to req.user. Fails with 401 for any missing,
// invalid, or expired token.

import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import config from '../config/index.js'

export async function protect(req, res, next) {
  try {
    let token = null
    const header = req.headers.authorization

    if (header && header.startsWith('Bearer ')) {
      token = header.slice(7)
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token provided.' })
    }

    const decoded = jwt.verify(token, config.jwt.secret)

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user no longer exists.' })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, invalid or expired token.' })
  }
}
