export async function generateResumePDF(resumeData) {
  const { pdf } = await import('@react-pdf/renderer')
  const { ResumePDFDocument } = await import('../components/resume/ResumePDF')

  const doc = ResumePDFDocument({ data: resumeData })
  const instance = pdf(doc)
  const blob = await instance.toBlob()

  return blob
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  // Defer cleanup so the browser has time to begin the download before the
  // object URL is revoked (revoking synchronously can abort the download).
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 1000)
}

export function getPDFFilename(personal) {
  const name = personal?.fullName?.trim()
  if (name) {
    return `${name.replace(/\s+/g, '_')}_Resume.pdf`
  }
  return 'Resume.pdf'
}
