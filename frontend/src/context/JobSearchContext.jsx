// JobSearchContext — shared state for the Job Finder feature.
// Holds two kinds of data:
//
//  1. `preferences` — the user's default job search, derived from their
//     resume (job title + city). Persisted to localStorage under
//     "pathfinder-job-preferences" so it survives full page refreshes.
//     ResumeBuilder writes it after a successful upload; JobFinder reads
//     it to prefill and auto-run a search.
//
//  2. `cachedSearch` — the most recent search results (in-memory only).
//     JobFinder uses this so navigating away and back to /dashboard/jobs
//     does not re-hit the Jooble API; a full page refresh clears it.

import { createContext, useContext, useState, useCallback } from 'react'

const PREFERENCES_KEY = 'pathfinder-job-preferences'

function loadPreferences() {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return {
      keyword: typeof parsed?.keyword === 'string' ? parsed.keyword : '',
      region: typeof parsed?.region === 'string' ? parsed.region : '',
    }
  } catch {
    return null
  }
}

const JobSearchContext = createContext(null)

export function JobSearchProvider({ children }) {
  const [preferences, setPreferences] = useState(loadPreferences)
  const [cachedSearch, setCachedSearch] = useState(null)

  const updatePreferences = useCallback(({ keyword, region }) => {
    const next = {
      keyword: keyword?.trim() || '',
      region: region?.trim() || '',
    }

    setPreferences(next)

    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next))
    } catch {
      /* storage unavailable — keep in-memory value */
    }
  }, [])

  const cacheSearchResults = useCallback((search) => {
    setCachedSearch(search)
  }, [])

  const clearCachedSearch = useCallback(() => {
    setCachedSearch(null)
  }, [])

  const value = {
    preferences,
    updatePreferences,
    cachedSearch,
    cacheSearchResults,
    clearCachedSearch,
  }

  return <JobSearchContext.Provider value={value}>{children}</JobSearchContext.Provider>
}

export function useJobSearch() {
  const ctx = useContext(JobSearchContext)
  if (!ctx) throw new Error('useJobSearch must be used within JobSearchProvider')
  return ctx
}
