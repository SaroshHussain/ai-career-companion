// Jooble job search service.
// Sends job search requests to the Jooble REST API using fetch. The API
// key is loaded from the environment variable JOOBLE_API_KEY and passed
// in the request URL path:
//   Endpoint: POST https://jooble.org/api/{apiKey}
//   Auth:     API key in the URL path (no auth headers)
//
// Note: Jooble's public web docs describe a `location` parameter, but the
// actual API accepts a region field (`rgns`) instead — verified with live
// requests. We always send `rgns`.

const JOOBLE_BASE_URL = 'https://jooble.org/api/'

// Maximum number of results Jooble returns per page.
const MAX_RESULTS_PER_PAGE = 50

function getApiKey() {
  const apiKey = process.env.JOOBLE_API_KEY
  if (!apiKey) {
    throw Object.assign(
      new Error('JOOBLE_API_KEY is not configured in the environment.'),
      { status: 500 },
    )
  }
  return apiKey
}

// Normalize a non-2xx / API-level error into a consistent error object
// with a status so downstream handlers (rate-limit detection, etc.)
// can react to it.
function raiseHttpError(status, body) {
  let message = `Jooble API request failed with status ${status}.`
  let providerMessage = ''

  try {
    const parsed = typeof body === 'string' ? JSON.parse(body) : body
    providerMessage = parsed?.error || parsed?.message || ''
  } catch {
    /* ignore parse errors */
  }

  if (providerMessage) {
    message = providerMessage
  }

  const err = Object.assign(new Error(message), { status })
  err.provider = providerMessage
  throw err
}

// Search for jobs. Accepts the search criteria and returns the raw
// Jooble response ({ totalCount, jobs }). The page argument is 1-based.
export async function searchJobs({
  keywords,
  region,
  page = 1,
  resultsPerPage = 20,
}) {
  const apiKey = getApiKey()

  const body = { keywords }
  if (region) body.rgns = region
  body.page = String(page)

  if (resultsPerPage > 0 && resultsPerPage <= MAX_RESULTS_PER_PAGE) {
    body.ResultOnPage = String(resultsPerPage)
  }

  let res
  try {
    res = await fetch(`${JOOBLE_BASE_URL}${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch (err) {
    throw Object.assign(
      new Error(`Unable to reach the Jooble API: ${err.message || err}`),
      { status: 502 },
    )
  }

  if (!res.ok) {
    const bodyText = await res.text()
    raiseHttpError(res.status, bodyText)
  }

  const data = await res.json()

  if (!data || !Array.isArray(data.jobs)) {
    throw Object.assign(
      new Error('The Jooble API returned an unexpected response.'),
      { status: 502 },
    )
  }

  return data
}
