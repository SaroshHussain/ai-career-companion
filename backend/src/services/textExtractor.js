// Text extraction orchestrator.
// Dispatches to the correct extractor based on the file's MIME type.
// Adding a new format only requires creating a new extractor and adding
// it to the mapping below.

import { extractPdfText } from './pdfExtractor.js'
import { extractDocxText } from './docxExtractor.js'

const extractorMap = {
  'application/pdf': extractPdfText,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': extractDocxText,
}

export async function extractText(filePath, mimetype) {
  const extractor = extractorMap[mimetype]

  if (!extractor) {
    throw Object.assign(
      new Error(`Unsupported file type: ${mimetype}. Only PDF and DOCX are supported.`),
      { status: 400 },
    )
  }

  return extractor(filePath)
}
