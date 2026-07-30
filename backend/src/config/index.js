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
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  isDev: process.env.NODE_ENV !== 'production',

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
