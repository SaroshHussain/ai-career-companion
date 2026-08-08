import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { HiOutlineMagnifyingGlass, HiOutlineArrowPath, HiOutlineExclamationTriangle, HiOutlineBriefcase } from 'react-icons/hi2'

import DashboardLayout from '../components/dashboard/DashboardLayout'
import JobCard from '../components/jobs/JobCard'
import { useJobSearch } from '../context/JobSearchContext'
import { searchJobs } from '../services/api'

const RESULTS_PER_PAGE = 20

// Jooble caps results per search request (verified ~1000). Clamp total
// pages so the pagination bar doesn't render hundreds of page buttons
// while the API can't actually reach them.
const MAX_TOTAL_PAGES = 50

function SearchForm({ keywords, region, onKeywordsChange, onRegionChange, onSubmit, isSearching }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ keywords: keywords.trim(), region: region.trim() })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-card sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label htmlFor="job-keywords" className="text-label-sm font-medium text-on-surface">
          Keywords
        </label>
        <div className="relative mt-1.5">
          <HiOutlineMagnifyingGlass
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            aria-hidden
          />
          <input
            id="job-keywords"
            type="text"
            value={keywords}
            onChange={(event) => onKeywordsChange(event.target.value)}
            placeholder="e.g. software engineer, data analyst"
            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pl-10 pr-3 text-body-md text-on-surface placeholder:text-on-surface-variant outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex-1">
        <label htmlFor="job-region" className="text-label-sm font-medium text-on-surface">
          Region
        </label>
        <input
          id="job-region"
          type="text"
          value={region}
          onChange={(event) => onRegionChange(event.target.value)}
          placeholder="e.g. Islamabad, Lahore, Remote"
          className="mt-1.5 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <button
        type="submit"
        disabled={isSearching}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-label-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSearching ? (
          <>
            <HiOutlineArrowPath className="animate-spin text-base" aria-hidden />
            Searching...
          </>
        ) : (
          <>
            <HiOutlineMagnifyingGlass className="text-base" aria-hidden />
            Search Jobs
          </>
        )}
      </button>
    </form>
  )
}

// Returns the page numbers to display around the current page, using
// ellipses for gaps. Always includes the first and last pages.
function buildPageList(current, total) {
  const pages = new Set([1, total])
  for (let p = current - 1; p <= current + 1; p += 1) {
    if (p >= 1 && p <= total) pages.add(p)
  }

  const sorted = [...pages].sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < sorted.length; i += 1) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('ellipsis')
    }
    result.push(sorted[i])
  }
  return result
}

function Pagination({ page, totalPages, totalCount, onPageChange, isSearching }) {
  if (totalPages <= 1) return null

  const pageList = buildPageList(page, totalPages)

  return (
    <div className="flex flex-col items-center gap-3">
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button
          type="button"
          disabled={page <= 1 || isSearching}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-label-sm text-on-surface transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        {pageList.map((item, index) => {
          if (item === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className="px-1.5 text-label-sm text-on-surface-variant" aria-hidden>
                &hellip;
              </span>
            )
          }

          const pageNumber = item
          return (
            <button
              key={pageNumber}
              type="button"
              disabled={isSearching}
              onClick={() => onPageChange(pageNumber)}
              aria-current={pageNumber === page ? 'page' : undefined}
              className={`rounded-lg px-3 py-1.5 text-label-sm transition disabled:cursor-not-allowed ${
                pageNumber === page
                  ? 'bg-primary font-medium text-white'
                  : 'border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
              }`}
            >
              {pageNumber}
            </button>
          )
        })}

        <button
          type="button"
          disabled={page >= totalPages || isSearching}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-label-sm text-on-surface transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </nav>
      <p className="text-label-sm text-on-surface-variant">
        Page {page} of {totalPages}
      </p>
    </div>
  )
}

function EmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-outline-variant/50 bg-surface-container-lowest px-6 py-12 text-center">
      <HiOutlineBriefcase className="text-4xl text-on-surface-variant" aria-hidden />
      <div>
        <p className="text-body-sm font-medium text-on-surface">No jobs found</p>
        <p className="mt-1 text-label-sm text-on-surface-variant">
          Try different keywords or a broader region.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-label-sm font-medium text-on-surface transition hover:bg-surface-container-low"
      >
        Reset search
      </button>
    </div>
  )
}

function JobFinder() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { preferences, cachedSearch, cacheSearchResults } = useJobSearch()
  const [keywords, setKeywords] = useState('')
  const [region, setRegion] = useState('')
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)
  const hasInitialized = useRef(false)

  const jobs = results?.jobs || []
  const totalCount = results?.totalCount || 0
  const totalPages = results?.totalPages || 0

  const runSearch = useCallback(async ({ keywords: kw, region: rg }, pageNumber = 1) => {
    setIsSearching(true)
    setError(null)

    try {
      const data = await searchJobs({ keywords: kw, region: rg, page: pageNumber, resultsPerPage: RESULTS_PER_PAGE })
      const { jobs: foundJobs, totalCount: foundCount, resultsPerPage } = data.data

      const maxPages = Math.ceil(foundCount / resultsPerPage)
      const cappedTotalPages = Math.max(1, Math.min(maxPages, MAX_TOTAL_PAGES))

      const nextResults = {
        jobs: foundJobs,
        totalCount: foundCount,
        totalPages: cappedTotalPages,
      }

      setResults(nextResults)
      setKeywords(kw)
      setRegion(rg)
      setPage(pageNumber)
      setSearchParams({ keywords: kw, region: rg, page: String(pageNumber) }, { replace: true })

      cacheSearchResults({
        keywords: kw,
        region: rg,
        page: pageNumber,
        totalPages: cappedTotalPages,
        totalCount: foundCount,
        jobs: foundJobs,
      })
    } catch (err) {
      console.error('[JobFinder] search failed', err)
      setError(err.message || 'Failed to search jobs. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }, [cacheSearchResults, setSearchParams])

  // Restore a cached search (same keywords/region/page) so navigating back
  // to /dashboard/jobs doesn't re-hit the Jooble API. Falls back to fetching.
  const restoreFromCache = useCallback((cached) => {
    setKeywords(cached.keywords)
    setRegion(cached.region)
    setPage(cached.page)
    setResults({
      jobs: cached.jobs,
      totalCount: cached.totalCount,
      totalPages: cached.totalPages,
    })
    setSearchParams(
      { keywords: cached.keywords, region: cached.region, page: String(cached.page) },
      { replace: true },
    )
  }, [setSearchParams])

  // On first mount:
  //   1. If the URL has search params, use them (restoring cached results
  //      when they match, otherwise fetching).
  //   2. Otherwise, if we have cached results, restore them so the page
  //      never reloads when navigating back.
  //   3. Otherwise, if the user has job-search preferences (from their
  //      uploaded resume), prefill the form and auto-run that search.
  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    const urlKeywords = searchParams.get('keywords')

    if (urlKeywords) {
      const urlRegion = searchParams.get('region') || ''
      const urlPage = parseInt(searchParams.get('page'), 10) || 1

      const matchesCache =
        cachedSearch &&
        cachedSearch.keywords === urlKeywords &&
        cachedSearch.region === urlRegion &&
        cachedSearch.page === urlPage

      if (matchesCache) {
        restoreFromCache(cachedSearch)
      } else {
        runSearch({ keywords: urlKeywords, region: urlRegion }, urlPage)
      }
      return
    }

    if (cachedSearch) {
      restoreFromCache(cachedSearch)
      return
    }

    if (preferences?.keyword) {
      setKeywords(preferences.keyword)
      setRegion(preferences.region || '')
      runSearch(
        { keywords: preferences.keyword, region: preferences.region || '' },
        1,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (values, pageNumber = 1) => {
    runSearch(values, pageNumber)
  }

  const handlePageChange = (pageNumber) => {
    if (pageNumber === page) return
    runSearch({ keywords, region }, pageNumber)
  }

  const handleReset = () => {
    setResults(null)
    setError(null)
    setKeywords('')
    setRegion('')
    setPage(1)
    setSearchParams({}, { replace: true })
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-headline-lg text-on-surface">Job Finder</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Search thousands of jobs across the web and find your next opportunity.
          </p>
        </div>

        <SearchForm
          keywords={keywords}
          region={region}
          onKeywordsChange={setKeywords}
          onRegionChange={setRegion}
          onSubmit={handleSearch}
          isSearching={isSearching}
        />

        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-4">
            <HiOutlineExclamationTriangle className="mt-0.5 text-lg text-red-500 shrink-0" aria-hidden />
            <p className="text-body-sm text-red-700">{error}</p>
          </div>
        )}

        {results && jobs.length === 0 && !error && <EmptyState onReset={handleReset} />}

        {results && jobs.length > 0 && (
          <>
            <p className="text-label-sm text-on-surface-variant">
              {totalCount.toLocaleString()} job{totalCount === 1 ? '' : 's'} found
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              isSearching={isSearching}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default JobFinder
