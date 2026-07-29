import { useState, useRef } from 'react'
import { HiOutlineCloudArrowUp, HiCheckCircle } from 'react-icons/hi2'
import { MdDescription } from 'react-icons/md'

function ResumeUploader({ onUpload, onStartEditing }) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const inputRef = useRef(null)

  const formatSize = (bytes) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1048576).toFixed(1)} MB`
  }

  const handleFile = async (file) => {
    const fileInfo = {
      name: file.name,
      type: file.type,
      size: file.size,
      file,
      dataURL: '',
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      fileInfo.dataURL = event.target.result
      setUploadedFile(fileInfo)
      if (onUpload) onUpload(fileInfo)
    }
    reader.readAsDataURL(file)
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

  if (uploadedFile) {
    const ext = uploadedFile.name.split('.').pop().toUpperCase()
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex w-full flex-col items-center gap-3 rounded-xl border-2 border-green-200 bg-green-50 p-8 text-center">
          <HiCheckCircle className="text-4xl text-green-600" aria-hidden />
          <div>
            <p className="text-body-sm font-medium text-green-800">Resume uploaded successfully</p>
            <p className="mt-1 text-label-sm text-on-surface-variant">
              {uploadedFile.name} ({ext}
              {uploadedFile.size ? `, ${formatSize(uploadedFile.size)}` : ''})
            </p>
            <p className="mt-1 text-label-sm text-on-surface-variant">
              Parsing resume content...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`flex w-full cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-outline-variant/50 hover:border-primary/50 hover:bg-surface-container-low'
        }`}
        role="button"
        tabIndex={0}
        aria-label="Upload resume file"
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
      >
        <HiOutlineCloudArrowUp className="text-4xl text-primary" aria-hidden />
        <div>
          <p className="text-body-sm font-medium text-on-surface">Upload Resume</p>
          <p className="mt-1 text-label-sm text-on-surface-variant">
            Drag & drop or click to browse
          </p>
        </div>
        <div className="flex gap-2">
          {['PDF', 'DOC', 'DOCX'].map((format) => (
            <span
              key={format}
              className="rounded-md bg-surface-container-low px-2 py-0.5 text-label-sm text-on-surface-variant"
            >
              {format}
            </span>
          ))}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
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

export default ResumeUploader
