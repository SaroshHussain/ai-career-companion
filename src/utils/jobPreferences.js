export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
]

export const WORK_LOCATIONS = ['Remote', 'Hybrid', 'On-site', 'Flexible']

export const EXPERIENCE_LEVELS = [
  'Entry Level',
  'Mid Level',
  'Senior Level',
  'Lead',
  'Executive',
]

export const STORAGE_KEY = 'ai-career-companion-job-preferences'

export const defaultJobPreferences = {
  desiredRole: '',
  industries: '',
  employmentTypes: [],
  workLocation: '',
  preferredLocations: '',
  minSalary: '',
  maxSalary: '',
  experienceLevel: '',
  skills: '',
  willingToRelocate: false,
  availableFrom: '',
}

export function loadJobPreferences() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultJobPreferences

    const parsed = JSON.parse(stored)
    return { ...defaultJobPreferences, ...parsed }
  } catch {
    return defaultJobPreferences
  }
}

export function saveJobPreferences(preferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
}

export function validateJobPreferences(preferences) {
  const errors = {}

  if (!preferences.desiredRole.trim()) {
    errors.desiredRole = 'Desired role is required.'
  }

  if (preferences.minSalary && preferences.maxSalary) {
    const min = Number(preferences.minSalary)
    const max = Number(preferences.maxSalary)

    if (min > max) {
      errors.maxSalary = 'Maximum salary must be greater than minimum salary.'
    }
  }

  return errors
}
