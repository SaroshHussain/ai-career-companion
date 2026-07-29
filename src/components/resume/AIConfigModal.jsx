import { useState, useEffect } from 'react'
import { HiOutlineXMark, HiOutlineEye, HiOutlineEyeSlash, HiOutlineSparkles } from 'react-icons/hi2'
import { getAIConfig, saveAIConfig, clearAIConfig, PROVIDERS } from '../../services/aiResumeParser'

function AIConfigModal({ isOpen, onClose }) {
  const [selectedProvider, setSelectedProvider] = useState('local')
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const config = getAIConfig()
      if (config) {
        setSelectedProvider(config.provider || 'local')
        setApiKey(config.apiKey || '')
      } else {
        setSelectedProvider('local')
        setApiKey('')
      }
      setSaved(false)
    }
  }, [isOpen])

  const handleSave = () => {
    if (selectedProvider === 'local') {
      clearAIConfig()
    } else {
      saveAIConfig({ provider: selectedProvider, apiKey })
    }
    setSaved(true)
    setTimeout(() => onClose(), 800)
  }

  const provider = PROVIDERS[Object.keys(PROVIDERS).find((k) => PROVIDERS[k].id === selectedProvider)]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl bg-surface-container-lowest p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HiOutlineSparkles className="text-2xl text-primary" />
            <h2 className="text-headline-md text-on-surface">AI Parser Settings</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
          >
            <HiOutlineXMark className="text-xl" />
          </button>
        </div>

        {saved ? (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-body-sm text-green-700">
            Settings saved successfully.
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-body-sm text-on-surface-variant">
              Choose an AI provider to intelligently parse your resume. The AI extracts structured data — sections, dates, hierarchy — far more accurately than a basic text parser.
            </p>

            <div>
              <label className="mb-2 block text-label-sm font-medium text-on-surface">Provider</label>
              <div className="grid gap-2">
                {Object.values(PROVIDERS).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedProvider(p.id)
                      if (p.id === 'local') setApiKey('')
                    }}
                    className={`flex items-start gap-3 rounded-lg border p-3 text-left transition ${
                      selectedProvider === p.id
                        ? 'border-primary bg-primary/5'
                        : 'border-outline-variant/50 hover:border-outline-variant'
                    }`}
                  >
                    <div
                      className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
                        selectedProvider === p.id
                          ? 'border-primary bg-primary'
                          : 'border-outline-variant'
                      }`}
                    />
                    <div>
                      <p className="text-body-sm font-medium text-on-surface">{p.label}</p>
                      <p className="text-label-sm text-on-surface-variant">{p.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedProvider !== 'local' && provider && (
              <div>
                <label htmlFor="ai-api-key" className="mb-1.5 block text-label-sm font-medium text-on-surface">
                  {provider.keyLabel}
                </label>
                <div className="relative">
                  <input
                    id="ai-api-key"
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={provider.keyPlaceholder}
                    className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low p-2.5 pr-10 text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((s) => !s)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                  >
                    {showKey ? <HiOutlineEyeSlash className="text-lg" /> : <HiOutlineEye className="text-lg" />}
                  </button>
                </div>
                <p className="mt-1.5 text-label-sm text-on-surface-variant">
                  Your API key is stored locally and never sent to our servers.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-outline-variant/50 px-4 py-2.5 text-label-sm font-medium text-on-surface transition hover:bg-surface-container-low"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={selectedProvider !== 'local' && !apiKey.trim()}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-label-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIConfigModal
