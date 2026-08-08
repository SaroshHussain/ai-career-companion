// File text extraction — runs entirely in the browser.
// PDFs are read with pdfjs-dist, DOCX files with mammoth. No backend
// call is made; the extracted text is returned for parsing.

import * as pdfjsLib from 'pdfjs-dist'
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import mammoth from 'mammoth'

pdfjsLib.GlobalWorkerOptions.workerSrc = PdfWorker

// A PDF "text item" can be a single run of text at a given x/y position.
// Different runs live on the same visual line (e.g. a name and a title, or
// a company and its date). Naively concatenating item.str produces jammed
// output like "Alex JohnsonSenior Frontend Developer" or missing word
// spaces. This reconstructs proper lines and spacing from item geometry.

const LINE_TOLERANCE = 3 // max y delta (points) before a new line starts
const GAP_SPACE_THRESHOLD = 2 // x gap (points) before a space is inserted

function collapseLetterSpacing(str) {
  // Section headers use letter-spacing, which pdfjs renders as
  // "P R O F E S S I O N A L". Collapse such runs back to normal words
  // so section detection works: "PROFESSIONAL".
  const trimmed = str.trim()
  if (!trimmed) return str
  const tokens = trimmed.split(/\s+/)
  const singleLetters = tokens.filter((t) => t.length === 1).length
  const isSingleLetterRun =
    tokens.length >= 3 &&
    singleLetters / tokens.length >= 0.6 &&
    /^[A-Z0-9.\/'-]+$/.test(trimmed.replace(/\s+/g, ''))
  if (isSingleLetterRun) {
    return trimmed.replace(/\s+/g, '')
  }
  return str
}

function reconstructText(items) {
  const textItems = items.filter((item) => item && typeof item.str === 'string')

  // Group consecutive items into visual lines by y-position.
  const lines = []
  let current = []
  let prevY = null
  for (const item of textItems) {
    const y = item.transform ? item.transform[5] : 0
    if (prevY !== null && Math.abs(y - prevY) > LINE_TOLERANCE && current.length) {
      lines.push(current)
      current = []
    }
    current.push(item)
    prevY = y
  }
  if (current.length) lines.push(current)

  return lines
    .map((line) => {
      // Order runs left to right, then join with a space only when there is
      // a real horizontal gap between them.
      line.sort((a, b) => (a.transform?.[4] || 0) - (b.transform?.[4] || 0))
      let text = ''
      let prevEnd = null
      for (const item of line) {
        const str = collapseLetterSpacing(item.str)
        const x = item.transform?.[4] || 0
        const width = item.width || str.length * 5
        if (str.trim() === '') {
          // Whitespace run — preserve a single space between words.
          if (text && !text.endsWith(' ')) text += ' '
          prevEnd = x + width
          continue
        }
        if (prevEnd !== null && x - prevEnd > GAP_SPACE_THRESHOLD && !text.endsWith(' ')) {
          text += ' '
        }
        text += str
        prevEnd = x + width
      }
      return text.replace(/[ \t]+/g, ' ').trim()
    })
    .join('\n')
}

async function extractFromPdf(file) {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise

  const pages = []
  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    pages.push(reconstructText(content.items))
  }
  return pages.join('\n\n')
}

async function extractFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

export async function extractText(file) {
  const ext = `.${(file.name.split('.').pop() || '').toLowerCase()}`

  if (ext === '.pdf' || file.type === 'application/pdf') {
    return extractFromPdf(file)
  }

  if (
    ext === '.docx' ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return extractFromDocx(file)
  }

  throw new Error('Unsupported file format. Please upload a PDF or DOCX file.')
}
