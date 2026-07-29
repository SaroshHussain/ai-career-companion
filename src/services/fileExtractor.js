import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString()

import mammoth from 'mammoth'

export async function extractText(file) {
  const fileType = file.type || ''
  const fileName = file.name || ''

  if (
    fileType === 'application/pdf' ||
    fileName.toLowerCase().endsWith('.pdf')
  ) {
    return extractPDFText(file)
  }

  if (
    fileType.includes('wordprocessingml') ||
    fileName.toLowerCase().endsWith('.docx')
  ) {
    return extractDOCXText(file)
  }

  throw new Error('Unsupported format. Please upload a PDF or DOCX file.')
}

async function extractPDFText(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const text = content.items.map((item) => item.str).join(' ')
    pages.push(text)
  }
  return pages.join('\n\n')
}

async function extractDOCXText(file) {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}
