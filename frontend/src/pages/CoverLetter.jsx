import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineDocumentText,
  HiOutlineArrowPath,
  HiOutlineExclamationTriangle,
  HiCheckCircle,
  HiOutlineBuildingOffice2,
} from 'react-icons/hi2'
import { HiOutlineDownload } from 'react-icons/hi'

import DashboardLayout from '../components/dashboard/DashboardLayout'
import Markdown from '../components/ui/Markdown'
import ResumePicker from '../components/resume/ResumePicker'
import { useResume } from '../context/ResumeContext'
import { generateCoverLetter, getResumeDocuments } from '../services/api'
import { generateCoverLetterPDF, downloadBlob, getCoverLetterFilename } from '../services/pdfExport'

const STATUS = { IDLE: 'idle', GENERATING: 'generating', SUCCESS: 'success', ERROR: 'error' }

function CoverLetter() {
  const navigate = useNavigate()
  const { resumeData, resumeId, loadResumeById } = useResume()
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState(STATUS.IDLE)
  const [error, setError] = useState(null)
  const [letter, setLetter] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)

  const [resumes, setResumes] = useState([])
  const [resumesLoading, setResumesLoading] = useState(true)
  const [resumesError, setResumesError] = useState(null)

  const loadResumes = useCallback(async () => {
    setResumesLoading(true)
    setResumesError(null)
    try {
      const data = await getResumeDocuments()
      setResumes(data?.resumes || [])
    } catch (err) {
      console.error('[CoverLetter] failed to load saved resumes', err)
      setResumesError(err.message || 'Failed to load saved resumes.')
    } finally {
      setResumesLoading(false)
    }
  }, [])

  useEffect(() => {
    loadResumes()
  }, [loadResumes])

  // Selecting a resume marks it as the active resume (same behaviour as the
  // Resume Builder) so its data becomes the cover letter context.
  const handleSelectResume = async (id) => {
    setResumesError(null)
    try {
      await loadResumeById(id)
    } catch (err) {
      console.error('[CoverLetter] failed to select resume', err)
      setResumesError(err.message || 'Failed to load that resume.')
    }
  }

  const hasResume = Boolean(
    resumeData?.personal?.fullName || resumeData?.personal?.professionalTitle || resumeData?.experience?.length,
  )

  const handleGenerate = async (event) => {
    event.preventDefault()

    if (!company.trim() && !position.trim()) {
      setError('Please provide at least a company name or job title.')
      return
    }

    setStatus(STATUS.GENERATING)
    setError(null)
    setLetter('')

    try {
      const data = await generateCoverLetter(resumeData, {
        company: company.trim(),
        position: position.trim(),
        notes: notes.trim(),
      })
      setLetter(data.data.letter)
      setStatus(STATUS.SUCCESS)
    } catch (err) {
      console.error('[CoverLetter] generation failed', err)
      setError(err.message || 'Failed to generate cover letter. Please try again.')
      setStatus(STATUS.ERROR)
    }
  }

  const handleDownload = async () => {
    if (isDownloading) return
    setIsDownloading(true)
    try {
      const blob = await generateCoverLetterPDF(letter, resumeData)
      const filename = getCoverLetterFilename(resumeData.personal, { company })
      downloadBlob(blob, filename)
    } catch (err) {
      console.error('[CoverLetter] download failed', err)
      setError('Failed to download PDF. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-headline-lg text-on-surface">Cover Letter</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Tell us where you are applying and we&apos;ll draft a tailored cover letter from your resume.
          </p>
        </div>

        <ResumePicker
          resumes={resumes}
          selectedId={resumeId}
          onSelect={handleSelectResume}
          isLoading={resumesLoading}
          error={resumesError}
        />

        {!hasResume && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-4">
            <HiOutlineExclamationTriangle className="mt-0.5 text-lg text-amber-600 shrink-0" aria-hidden />
            <div>
              <p className="text-body-sm font-medium text-amber-800">No resume found</p>
              <p className="mt-0.5 text-label-sm text-amber-700">
                Upload your resume first so we can use your details to write a strong cover letter.
              </p>
              <button
                type="button"
                onClick={() => navigate('/dashboard/resume')}
                className="mt-2 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-label-sm font-medium text-amber-700 transition hover:bg-amber-100"
              >
                Upload Resume
              </button>
            </div>
          </div>
        )}

        <form
          onSubmit={handleGenerate}
          className="space-y-4 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-card sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cl-company" className="text-label-sm font-medium text-on-surface">
                Company
              </label>
              <input
                id="cl-company"
                type="text"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="e.g. Google, Microsoft"
                className="mt-1.5 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="cl-position" className="text-label-sm font-medium text-on-surface">
                Job Title
              </label>
              <input
                id="cl-position"
                type="text"
                value={position}
                onChange={(event) => setPosition(event.target.value)}
                placeholder="e.g. Frontend Engineer"
                className="mt-1.5 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label htmlFor="cl-notes" className="text-label-sm font-medium text-on-surface">
              Anything to highlight? <span className="text-on-surface-variant">(optional)</span>
            </label>
            <textarea
              id="cl-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              placeholder="e.g. I was referred by a friend, or I want to emphasize a specific project."
              className="mt-1.5 w-full resize-y rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <HiOutlineExclamationTriangle className="mt-0.5 text-lg text-red-500 shrink-0" aria-hidden />
              <p className="text-body-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === STATUS.GENERATING}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {status === STATUS.GENERATING ? (
              <>
                <HiOutlineArrowPath className="animate-spin text-base" aria-hidden />
                Writing your cover letter...
              </>
            ) : (
              <>
                <HiOutlineDocumentText className="text-base" aria-hidden />
                Generate Cover Letter
              </>
            )}
          </button>
        </form>

        {status === STATUS.SUCCESS && letter && (
          <div className="overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-lowest shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/30 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2">
                <HiCheckCircle className="text-lg text-green-600" aria-hidden />
                <p className="text-body-sm font-medium text-on-surface">Your cover letter is ready</p>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDownloading ? (
                  <HiOutlineArrowPath className="animate-spin text-base" aria-hidden />
                ) : (
                  <HiOutlineDownload className="text-base" aria-hidden />
                )}
                Download PDF
              </button>
            </div>
            <div className="space-y-4 px-5 py-6 sm:px-6">
              <Markdown className="text-body-md text-on-surface-variant">{letter}</Markdown>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-3">
          <HiOutlineBuildingOffice2 className="mt-0.5 text-base text-on-surface-variant shrink-0" aria-hidden />
          <p className="text-label-sm text-on-surface-variant">
            The cover letter is generated using your resume details and the information above.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CoverLetter
