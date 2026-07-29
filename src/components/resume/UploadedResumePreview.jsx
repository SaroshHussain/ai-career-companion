import { useState } from 'react'
import { HiOutlineDocumentText, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi2'

function UploadedResumePreview({ file }) {
  const [expanded, setExpanded] = useState(false)

  if (!file) return null

  const isPDF = file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf')

  return (
    <div className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-surface-container-low"
      >
        <div className="flex items-center gap-2">
          <HiOutlineDocumentText className="text-lg text-primary" aria-hidden />
          <div>
            <p className="text-body-sm font-medium text-on-surface">Original Uploaded Resume</p>
            <p className="text-label-sm text-on-surface-variant">{file.name}</p>
          </div>
        </div>
        {expanded ? (
          <HiOutlineChevronUp className="text-lg text-on-surface-variant" aria-hidden />
        ) : (
          <HiOutlineChevronDown className="text-lg text-on-surface-variant" aria-hidden />
        )}
      </button>

      {expanded && isPDF && (
        <div className="border-t border-outline-variant/30">
          <object
            data={file.dataURL}
            type="application/pdf"
            className="h-[500px] w-full"
            aria-label="Uploaded resume preview"
          >
            <div className="flex flex-col items-center gap-3 p-8 text-center">
              <HiOutlineDocumentText className="text-4xl text-on-surface-variant" aria-hidden />
              <p className="text-body-sm text-on-surface-variant">
                Your browser does not support PDF preview.
              </p>
              <a
                href={file.dataURL}
                download={file.name}
                className="rounded-lg bg-primary px-4 py-2 text-label-sm font-medium text-white transition hover:bg-primary/90"
              >
                Download {file.name}
              </a>
            </div>
          </object>
        </div>
      )}
    </div>
  )
}

export default UploadedResumePreview
