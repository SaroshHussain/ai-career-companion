// Resume parser orchestrator.
// Step 1 — extracts text from the uploaded file (PDF/DOCX) in the browser.
// Step 2 — sends the extracted text to the backend (port 5000), which calls
// the Gemini API, extracts all fields, and returns structured JSON in the
// exact shape the resume editor's state expects. The backend response is
// returned as-is; ResumeContext.loadParsedResume normalizes it further
// (adds ids, maps summary -> professionalSummary, etc.).

import { extractText } from './fileExtractor'
import { parseResumeText } from './api'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_EXTENSIONS = ['.pdf', '.docx']

function validateFile(file) {
  if (!file) {
    throw new Error('No file selected.')
  }
  const ext = `.${(file.name.split('.').pop() || '').toLowerCase()}`
  if (!ALLOWED_EXTENSIONS.includes(ext) && file.type !== 'application/pdf') {
    throw new Error('Invalid file format. Only PDF and DOCX files are allowed.')
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large. Maximum file size is 10 MB.')
  }
}

export async function parseResume(file, onStage) {
  validateFile(file)

  // Step 1 — extract raw text from the file in the browser.
  onStage?.('uploading')
  const text = await extractText(file)

  if (!text || !text.trim()) {
    throw new Error('No text could be extracted from the file. The file may be empty or corrupted.')
  }

  // Step 2 — send the text to the backend. The backend calls the Gemini API
  // and returns structured JSON matching the frontend's expected shape.
  onStage?.('parsing')
  const result = await parseResumeText(text)

  const parsed = result?.data
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Could not parse the resume. Please try another file.')
  }

  return parsed
}
