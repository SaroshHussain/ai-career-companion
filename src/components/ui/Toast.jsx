import { useEffect } from 'react'
import { HiCheckCircle, HiXMark } from 'react-icons/hi2'

function Toast({ message, isOpen, onClose, duration }) {
  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(onClose, duration || 3000)
    return () => clearTimeout(timer)
  }, [isOpen, onClose, duration])

  if (!isOpen) return null

  return (
    <div className="fixed bottom-6 right-6 z-[70]" role="status" aria-live="polite">
      <style>{`
        @keyframes toast-slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .toast-enter { animation: toast-slide-up 250ms ease-out; }
      `}</style>
      <div className="toast-enter flex items-center gap-3 rounded-xl border border-green-200 bg-white px-5 py-3.5 shadow-lg">
        <HiCheckCircle className="text-xl text-green-600 shrink-0" aria-hidden />
        <p className="text-body-sm font-medium text-on-surface">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 rounded-md p-0.5 text-on-surface-variant hover:text-on-surface"
          aria-label="Dismiss"
        >
          <HiXMark className="text-lg" />
        </button>
      </div>
    </div>
  )
}

export default Toast
