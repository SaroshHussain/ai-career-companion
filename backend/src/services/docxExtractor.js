// DOCX text extraction service.
// Uses mammoth to extract plain text from a .docx file buffer.
// Returns the extracted text or throws a descriptive error.

import { readFileSync } from 'fs'
import mammoth from 'mammoth'

export async function extractDocxText(filePath) {
  let buffer
  try {
    buffer = readFileSync(filePath)
  } catch (err) {
    throw Object.assign(new Error(`Failed to read DOCX file: ${err.message}`), { status: 500 })
  }

  let result
  try {
    result = await mammoth.extractRawText({ buffer })
  } catch (err) {
    throw Object.assign(new Error(`Failed to parse DOCX: ${err.message}`), { status: 422 })
  }

  const text = (result.value || '').trim()
  if (!text) {
    throw Object.assign(new Error('No extractable text found in the DOCX file.'), { status: 422 })
  }

  return text
}
