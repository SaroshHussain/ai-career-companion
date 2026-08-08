import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineDocumentPlus, HiOutlineArrowPath, HiCheckCircle,
  HiOutlineCloudArrowUp, HiOutlineExclamationTriangle, HiOutlineBriefcase,
} from 'react-icons/hi2'
import { MdDescription } from 'react-icons/md'

import DashboardLayout from '../components/dashboard/DashboardLayout'
import ResumeOptionCard from '../components/resume/ResumeOptionCard'
import { useResume } from '../context/ResumeContext'
import { useJobSearch } from '../context/JobSearchContext'
import { parseResume } from '../services/resumeParser'

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
  const { loadParsedResume, resetToNew } = useResume()
  const { updatePreferences } = useJobSearch()
  const [status, setStatus] = useState(STATUS.IDLE)
  const [error, setError] = useState(null)
  const [parsedFileInfo, setParsedFileInfo] = useState(null)
  const [searchDefaults, setSearchDefaults] = useState(null)

  const handleCreate = () => {
    resetToNew()
    navigate('/dashboard/resume/new')
  }

  const handleFileSelected = async (file) => {
    setStatus(STATUS.UPLOADING)
    setError(null)
    setParsedFileInfo(null)

    try {
      const parsed = await parseResume(file, (stage) => {
        setStatus(stage === 'uploading' ? STATUS.UPLOADING : STATUS.PARSING)
      })

      const defaults = extractJobSearchDefaults(parsed)
      loadParsedResume(parsed, { name: file.name, type: file.type, size: file.size })
      updatePreferences(defaults)
      setSearchDefaults(defaults)
      setParsedFileInfo({ name: file.name, size: file.size })
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
          <h1 className="text-headline-lg text-on-surface">Resume Builder</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Create a new resume from scratch or upload an existing one to edit it.
          </p>
        </div>

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