// Global error-handling middleware.
// Catches any error thrown (or passed via next(err)) and returns
// a consistent JSON response. In development the stack trace is included.
// Handles Multer errors (wrong file type, oversized uploads) by mapping
// their error codes to appropriate HTTP statuses.

import multer from 'multer'

const multerStatusMap = {
  LIMIT_FILE_SIZE: 413,       // Payload Too Large
  LIMIT_UNEXPECTED_FILE: 400, // Field name mismatch
}

export default function errorHandler(err, _req, res, _next) {
  // Multer-specific errors (e.g. LIMIT_FILE_SIZE, LIMIT_UNEXPECTED_FILE).
  if (err instanceof multer.MulterError) {
    const status = multerStatusMap[err.code] || 400
    return res.status(status).json({
      success: false,
      message: err.message,
    })
  }

  // Custom errors that set err.status (e.g. file type filter in upload.js).
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    })
  }

  // Fallback — unexpected server errors.
  const status = err.status || 500
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
