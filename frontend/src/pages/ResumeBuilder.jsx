import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineDocumentPlus, HiOutlineArrowPath, HiCheckCircle,
  HiOutlineCloudArrowUp, HiOutlineExclamationTriangle, HiOutlineBriefcase,
  HiOutlineDocumentText, HiOutlineChevronRight,
} from 'react-icons/hi2'
import { MdDescription } from 'react-icons/md'

import DashboardLayout from '../components/dashboard/DashboardLayout'
import ResumeOptionCard from '../components/resume/ResumeOptionCard'
import { useResume } from '../context/ResumeContext'
import { useJobSearch } from '../context/JobSearchContext'
import { parseResume } from '../services/resumeParser'
import { getResumeDocuments } from '../services/api'

// Pulls the user's job-search defaults from a parsed resume: the headline
// professional title and the city they live in. Falls back to the first
// experience entry's job title and to a city extracted from the location.
function extractJobSearchDefaults(parsed) {
  const personal = parsed?.personal || {}

  const keyword =
    personal.professionalTitle?.trim() ||
    parsed?.experience?.[0]?.jobTitle?.trim() ||
    ''

  const city =
    personal.city?.trim() ||
    personal.location?.trim()?.split(',')[0]?.trim() ||
    personal.address?.trim() ||
    ''

  return { keyword, region: city }
}

function UploadZone({ onFileSelected, disabled }) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFile = (file) => {
    if (onFileSelected) onFileSelected(file)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        onDrop={disabled ? undefined : handleDrop}
        onDragOver={disabled ? undefined : handleDragOver}
        onDragLeave={disabled ? undefined : handleDragLeave}
        onClick={() => { if (!disabled) inputRef.current?.click() }}
        className={`flex w-full cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          disabled ? 'cursor-not-allowed opacity-60' : ''
        } ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-outline-variant/50 hover:border-primary/50 hover:bg-surface-container-low'
        }`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload resume file"
        onKeyDown={(event) => {
          if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
      >
        <HiOutlineCloudArrowUp className="text-4xl text-primary" aria-hidden />
        <div>
          <p className="text-body-sm font-medium text-on-surface">Upload Resume</p>
          <p className="mt-1 text-label-sm text-on-surface-variant">Drag & drop or click to browse</p>
        </div>
        <div className="flex gap-2">
          {['PDF', 'DOCX'].map((format) => (
            <span key={format} className="rounded-md bg-surface-container-low px-2 py-0.5 text-label-sm text-on-surface-variant">
              {format}
            </span>
          ))}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files[0]
          if (file) handleFile(file)
        }}
      />
      <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
        <MdDescription className="text-base" aria-hidden />
        Upload your existing resume and let Pathfinder AI improve it.
      </div>
    </div>
  )
}

function SuccessState({ fileName, fileSize, onStartEditing, onFindJobs, searchDefaults }) {
  const formatSize = (bytes) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1048576).toFixed(1)} MB`
  }
  const ext = fileName.split('.').pop().toUpperCase()
  const hasDefaults = searchDefaults?.keyword || searchDefaults?.region

  return (
    <div className="flex flex-col gap-3">
      <div className="flex w-full flex-col items-center gap-3 rounded-xl border-2 border-green-200 bg-green-50 p-8 text-center">
        <HiCheckCircle className="text-4xl text-green-600" aria-hidden />
        <div>
          <p className="text-body-sm font-medium text-green-800">Resume uploaded successfully</p>
          <p className="mt-1 text-label-sm text-on-surface-variant">
            {fileName} ({ext}{fileSize ? `, ${formatSize(fileSize)}` : ''})
          </p>
          <p className="mt-1 text-label-sm text-on-surface-variant">
            Your resume has been parsed. Review and edit the extracted information.
          </p>
        </div>
      </div>

      {hasDefaults && (
        <div className="flex w-full flex-col items-center gap-1.5 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-4 text-center">
          <p className="text-label-sm text-on-surface-variant">
            We found <span className="font-medium text-on-surface">{searchDefaults.keyword || 'your role'}</span>
            {searchDefaults.region ? ` in ${searchDefaults.region}` : ''} — jump straight into your job search.
          </p>
          <button
            type="button"
            onClick={onFindJobs}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-label-sm font-medium text-primary transition hover:bg-primary/20"
          >
            <HiOutlineBriefcase className="text-base" aria-hidden />
            Find Jobs Now
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onStartEditing}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-sm font-medium text-white transition hover:bg-primary/90"
      >
        Start Editing Resume
      </button>
    </div>
  )
}

const STATUS = { IDLE: 'idle', UPLOADING: 'uploading', PARSING: 'parsing', SUCCESS: 'success', ERROR: 'error' }

function ResumeBuilder() {
  const navigate = useNavigate()
  const { loadParsedResume, resetToNew, saveResumeToServer, loadResumeById, resumeId } = useResume()
  const { updatePreferences } = useJobSearch()
  const [status, setStatus] = useState(STATUS.IDLE)
  const [error, setError] = useState(null)
  const [parsedFileInfo, setParsedFileInfo] = useState(null)
  const [searchDefaults, setSearchDefaults] = useState(null)
  const [resumeCount, setResumeCount] = useState(0)
  const [resumes, setResumes] = useState([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState(null)
  const [loadingResumeId, setLoadingResumeId] = useState(null)

  // Load saved resumes from the backend (drives both the count and the list).
  const loadResumes = useCallback(async () => {
    setListLoading(true)
    setListError(null)
    try {
      const data = await getResumeDocuments()
      setResumes(data?.resumes || [])
      if (typeof data?.count === 'number') setResumeCount(data.count)
    } catch (err) {
      console.error('[ResumeBuilder] failed to load saved resumes', err)
      setListError(err.message || 'Failed to load saved resumes.')
    } finally {
      setListLoading(false)
    }
  }, [])

  useEffect(() => {
    loadResumes()
  }, [loadResumes])

  const handleCreate = () => {
    resetToNew()
    navigate('/dashboard/resume/new')
  }

  // Load a saved resume into the app (ResumeContext) and point the job
  // search defaults at it, then open it in the editor.
  const handleSelectResume = async (id) => {
    setLoadingResumeId(id)
    setListError(null)
    try {
      const resume = await loadResumeById(id)
      if (resume) {
        updatePreferences(extractJobSearchDefaults(resume.data))
        navigate('/dashboard/resume/edit')
      }
    } catch (err) {
      console.error('[ResumeBuilder] failed to load resume', err)
      setListError(err.message || 'Failed to load that resume.')
    } finally {
      setLoadingResumeId(null)
    }
  }

  const handleFileSelected = async (file) => {
    setStatus(STATUS.UPLOADING)
    setError(null)
    setParsedFileInfo(null)

    try {
      const parsed = await parseResume(file, (stage) => {
        setStatus(stage === 'uploading' ? STATUS.UPLOADING : STATUS.PARSING)
      })

      const fileInfo = { name: file.name, type: file.type, size: file.size }
      const defaults = extractJobSearchDefaults(parsed)
      loadParsedResume(parsed, fileInfo)
      updatePreferences(defaults)
      setSearchDefaults(defaults)
      setParsedFileInfo(fileInfo)

      // Persist the parsed resume to the backend so it can be reopened by id.
      try {
        await saveResumeToServer(parsed, fileInfo)
        loadResumes()
      } catch (saveErr) {
        console.error('[ResumeBuilder] failed to save resume to server', saveErr)
      }

      setStatus(STATUS.SUCCESS)
    } catch (err) {
      console.error('[ResumeBuilder] upload/parse failed', err)
      setError(err.message || 'Failed to parse resume. Please try again.')
      setStatus(STATUS.ERROR)
    }
  }

  const handleRetry = () => {
    setStatus(STATUS.IDLE)
    setError(null)
  }

  const handleStartEditing = () => {
    navigate('/dashboard/resume/edit', { state: { mode: 'upload' } })
  }

  const handleFindJobs = () => {
    navigate('/dashboard/jobs')
  }

  const isProcessing = status === STATUS.UPLOADING || status === STATUS.PARSING

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-headline-lg text-on-surface">
            Resume Builder <span className="text-on-surface-variant">({resumeCount})</span>
          </h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Create a new resume from scratch or upload an existing one to edit it.
          </p>
        </div>

        {/* Saved Resumes */}
        <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-headline-sm text-on-surface">Saved Resumes</h2>
            {resumeCount > 0 && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-label-sm text-primary">
                {resumeCount} saved
              </span>
            )}
          </div>

          {listError && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <HiOutlineExclamationTriangle className="mt-0.5 text-lg text-red-500 shrink-0" aria-hidden />
              <p className="text-body-sm text-red-700">{listError}</p>
            </div>
          )}

          {listLoading && (
            <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
              <HiOutlineArrowPath className="animate-spin text-lg text-primary" aria-hidden />
              <p className="text-body-sm text-primary">Loading saved resumes...</p>
            </div>
          )}

          {!listLoading && !listError && resumes.length === 0 && (
            <p className="rounded-lg border-2 border-dashed border-outline-variant/20 px-4 py-6 text-center text-body-sm text-on-surface-variant">
              No saved resumes yet. Upload one above to get started.
            </p>
          )}

          {!listLoading && resumes.length > 0 && (
            <ul className="flex flex-col gap-2">
              {resumes.map((resume) => {
                const fullName = resume.data?.personal?.fullName?.trim()
                const isActive = resumeId === resume.id
                const updated = new Date(resume.updatedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
                return (
                  <li key={resume.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectResume(resume.id)}
                      disabled={loadingResumeId === resume.id}
                      className={`flex w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-left transition hover:bg-surface-container-low ${
                        isActive
                          ? 'border-primary/40 bg-primary/5'
                          : 'border-outline-variant/30 bg-surface-container-lowest'
                      } disabled:cursor-wait disabled:opacity-70`}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-primary/15 text-primary' : 'bg-primary/10 text-primary'}`}>
                        {loadingResumeId === resume.id ? (
                          <HiOutlineArrowPath className="animate-spin text-base" aria-hidden />
                        ) : (
                          <HiOutlineDocumentText className="text-base" aria-hidden />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-body-sm font-medium text-on-surface">
                          {fullName || resume.name || 'Untitled Resume'}
                          {isActive && (
                            <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                              Active
                            </span>
                          )}
                        </p>
                        <p className="truncate text-label-sm text-on-surface-variant">
                          {resume.name !== (fullName || resume.name) && fullName
                            ? `${resume.name} • Updated ${updated}`
                            : `Updated ${updated}`}
                        </p>
                      </div>
                      <HiOutlineChevronRight className="shrink-0 text-on-surface-variant" aria-hidden />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* Uploading state */}
        {status === STATUS.UPLOADING && (
          <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <HiOutlineArrowPath className="animate-spin text-lg text-primary" aria-hidden />
            <p className="text-body-sm text-primary">Reading your resume...</p>
          </div>
        )}

        {/* Parsing state */}
        {status === STATUS.PARSING && (
          <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <HiOutlineArrowPath className="animate-spin text-lg text-primary" aria-hidden />
            <p className="text-body-sm text-primary">Parsing resume content...</p>
          </div>
        )}

        {/* Error state */}
        {status === STATUS.ERROR && (
          <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-4">
            <div className="flex items-start gap-3">
              <HiOutlineExclamationTriangle className="mt-0.5 text-lg text-red-500 shrink-0" aria-hidden />
              <div>
                <p className="text-body-sm font-medium text-red-800">Upload failed</p>
                <p className="mt-0.5 text-label-sm text-red-700">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="self-start rounded-lg border border-red-300 bg-white px-3 py-1.5 text-label-sm font-medium text-red-700 transition hover:bg-red-50"
            >
              Try again
            </button>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <ResumeOptionCard
            icon={HiOutlineDocumentPlus}
            title="Create New Resume"
            description="Start from scratch with our guided resume builder. Fill in your details step by step."
            onClick={handleCreate}
          />

          {status === STATUS.SUCCESS ? (
            <SuccessState
              fileName={parsedFileInfo.name}
              fileSize={parsedFileInfo.size}
              onStartEditing={handleStartEditing}
              onFindJobs={handleFindJobs}
              searchDefaults={searchDefaults}
            />
          ) : (
            <UploadZone onFileSelected={handleFileSelected} disabled={isProcessing} />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ResumeBuilder