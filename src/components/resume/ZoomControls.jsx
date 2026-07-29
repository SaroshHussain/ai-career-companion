import { HiOutlineMagnifyingGlassPlus, HiOutlineMagnifyingGlassMinus } from 'react-icons/hi2'
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md'

function ZoomControls({ zoom, onZoomIn, onZoomOut, onFitWidth, onFitPage }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-1">
      <button
        type="button"
        onClick={onZoomOut}
        className="rounded-md p-1.5 text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface"
        aria-label="Zoom out"
        title="Zoom Out"
      >
        <HiOutlineMagnifyingGlassMinus className="text-base" />
      </button>

      <span className="min-w-[44px] text-center text-label-sm font-medium text-on-surface">
        {Math.round(zoom * 100)}%
      </span>

      <button
        type="button"
        onClick={onZoomIn}
        className="rounded-md p-1.5 text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface"
        aria-label="Zoom in"
        title="Zoom In"
      >
        <HiOutlineMagnifyingGlassPlus className="text-base" />
      </button>

      <div className="mx-1 h-4 w-px bg-outline-variant/50" />

      <button
        type="button"
        onClick={onFitWidth}
        className="rounded-md p-1.5 text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface"
        aria-label="Fit to width"
        title="Fit Width"
      >
        <MdFullscreen className="text-base" />
      </button>

      <button
        type="button"
        onClick={onFitPage}
        className="rounded-md p-1.5 text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface"
        aria-label="Fit to page"
        title="Fit Page"
      >
        <MdFullscreenExit className="text-base" />
      </button>
    </div>
  )
}

export default ZoomControls
