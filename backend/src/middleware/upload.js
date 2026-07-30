// Multer middleware configuration for file uploads.
// Validates file type and size before the file reaches the controller.
// Files are stored in the uploads/ directory with a unique timestamped name.

import multer from 'multer'
import { extname, join } from 'path'
import { mkdirSync } from 'fs'
import config from '../config/index.js'

// Ensure the upload directory exists at startup.
mkdirSync(config.upload.dest, { recursive: true })

// Configure disk storage: keep original extension, add timestamp to avoid collisions.
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.upload.dest)
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${uniqueSuffix}${extname(file.originalname)}`)
  },
})

// File-type filter — rejects anything that isn't PDF or DOCX.
function fileFilter(_req, file, cb) {
  if (config.upload.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    const err = new Error('Only PDF and DOCX files are allowed.')
    err.status = 400
    cb(err, false)
  }
}

// Pre-configured multer instance exported as a middleware factory.
// Call with .single('resume') to accept a single file under the "resume" field.
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.upload.maxFileSize },
})

export default upload
