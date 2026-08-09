// Centralized configuration loaded from environment variables.
// All hardcoded values are kept here so the rest of the app
// reads from this module rather than process.env directly.

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  // Comma-separated list of allowed frontend origins for CORS.
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean),
  isDev: process.env.NODE_ENV !== 'production',

  // MongoDB connection string. Falls back to null so the server can still
  // boot (with a warning) if no database is configured.
  mongoUri: process.env.MONGODB_URI || null,

  jwt: {
    // Secret used to sign and verify auth tokens.
    secret: process.env.JWT_SECRET || 'pathfinder_dev_secret',
    // Token lifetime, e.g. "7d".
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  upload: {
    // Directory where uploaded files are stored temporarily.
    dest: join(__dirname, '..', '..', 'uploads'),
    // Maximum file size in bytes (10 MB).
    maxFileSize: 10 * 1024 * 1024,
    // Allowed MIME types for resume uploads.
    allowedMimeTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
}

export default config
