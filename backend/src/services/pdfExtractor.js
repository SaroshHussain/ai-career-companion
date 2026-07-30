// PDF text extraction service.
// Uses pdf-parse to extract plain text from a PDF file buffer.
// The PDFParse class accepts a Uint8Array and returns per-page
// text via getText(). Returns the concatenated plain text.

import { readFileSync } from 'fs'
import { PDFParse } from 'pdf-parse'

export async function extractPdfText(filePath) {
  let buffer
  try {
    buffer = readFileSync(filePath)
  } catch (err) {
    throw Object.assign(new Error(`Failed to read PDF file: ${err.message}`), { status: 500 })
  }

  const parser = new PDFParse(new Uint8Array(buffer))

  let result
  try {
    result = await parser.getText()
  } catch (err) {
    throw Object.assign(new Error(`Failed to parse PDF: ${err.message}`), { status: 422 })
  }

  if (!result || !result.text) {
    throw Object.assign(new Error('No extractable text found in the PDF.'), { status: 422 })
  }

  // Strip the page footer added by pdf-parse (e.g. "-- 1 of 1 --").
  const cleanText = result.text.replace(/-- \d+ of \d+ --\n*/g, '').trim()

  return cleanText
}
