// API client for the Pathfinder backend.
// Wraps fetch with consistent JSON handling. Every failure mode is
// translated into a meaningful, user-facing message instead of leaking
// raw browser errors like "Failed to fetch". The underlying error is
// always logged to the console so the real cause can be debugged.

const API_BASE = '/api'

// Requests that hang this long are aborted (default 30s; file uploads
// and AI parsing can legitimately take a few seconds).
const REQUEST_TIMEOUT_MS = 30000

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB, matches backend config
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const ALLOWED_EXTENSIONS = ['.pdf', '.docx']

class ApiError extends Error {
  constructor(message, { status = 0, cause } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.cause = cause
  }
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`
  const headers = { 'Accept': 'application/json', ...(options.headers || {}) }

  // Build an AbortController so hung requests fail with a clear timeout
  // message instead of the browser's generic network error.
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let res
  try {
    res = await fetch(url, { ...options, headers, signal: controller.signal })
  } catch (err) {
    // fetch rejects on network failure, CORS block, or abort.
    const aborted = err && err.name === 'AbortError'
    console.error(`[api] request failed for ${path}`, err)
    throw new ApiError(
      aborted
        ? 'The request timed out. The server may be busy, please try again.'
        : 'Cannot connect to the server. Please check your connection and try again.',
      { cause: err },
    )
  } finally {
    clearTimeout(timeoutId)
  }

  // Read the raw body once, then try to parse it as JSON. A missing or
  // non-JSON body must NOT throw — it becomes a generic error message.
  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }

  if (!res.ok) {
    const backendMessage = data?.message
    const message = classifyHttpError(res.status, backendMessage, text, path)
    console.error(`[api] ${res.status} for ${path}`, backendMessage || text)
    throw new ApiError(message, { status: res.status })
  }

  if (!data) {
    console.error(`[api] empty response body for ${path}`)
    throw new ApiError('The server returned an empty response. Please try again.')
  }

  return data
}

// Maps HTTP status codes (and backend-provided messages) to clear,
// user-friendly errors.
function classifyHttpError(status, backendMessage, rawText, path) {
  const isUpload = path.includes('/upload')
  const isParse = path.includes('/parse')

  // Prefer the backend's own message for validation failures, since it is
  // already descriptive (e.g. "Only PDF and DOCX files are allowed.").
  if (status === 400 && backendMessage) return backendMessage
  if (status === 400) return 'Invalid file format. Only PDF and DOCX files are allowed.'

  if (status === 413) return 'File too large. Maximum file size is 10 MB.'
  if (status === 415) return 'Unsupported file format. Please upload a PDF or DOCX file.'
  if (status === 404) return 'Upload service is unavailable. Please try again later.'

  if (status === 422) {
    return isParse
      ? 'Resume parsing failed. The file could not be read. Please try another file.'
      : 'Could not read the file. It may be empty or corrupted.'
  }

  if (status === 429) {
    return 'AI extraction is temporarily rate-limited. Please wait a moment and try again.'
  }

  if (status >= 500) {
    return isParse
      ? 'Resume parsing service is temporarily unavailable. Please try again.'
      : 'Upload service is temporarily unavailable. Please try again.'
  }

  if (rawText) return rawText
  return backendMessage || `Request failed with status ${status}.`
}

function validateResumeFile(file) {
  if (!file) {
    throw new Error('No file selected.')
  }
  const ext = `.${(file.name.split('.').pop() || '').toLowerCase()}`
  const isAllowed =
    ALLOWED_MIME_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext)
  if (!isAllowed) {
    throw new Error('Invalid file format. Only PDF and DOCX files are allowed.')
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large. Maximum file size is 10 MB.')
  }
}

export async function uploadResume(file) {
  validateResumeFile(file)
  const form = new FormData()
  form.append('resume', file)
  return request('/resume/upload', { method: 'POST', body: form })
}

export async function parseResumeText(text) {
  if (!text || !text.trim()) {
    throw new Error('Could not extract any text from the file. The file may be empty or corrupted.')
  }
  return request('/resume/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
}

export async function generateSummary(resumeData) {
  return request('/ai/generate-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeData }),
  })
}
