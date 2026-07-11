import { useState } from 'react'
import {
  defaultJobPreferences,
  loadJobPreferences,
  saveJobPreferences,
  validateJobPreferences,
} from '../utils/jobPreferences'

function useJobPreferences() {
  const [preferences, setPreferences] = useState(loadJobPreferences)
  const [errors, setErrors] = useState({})
  const [isSaved, setIsSaved] = useState(false)

  const updateField = (name, value) => {
    setPreferences((prev) => ({ ...prev, [name]: value }))
    setIsSaved(false)

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const toggleEmploymentType = (type) => {
    setPreferences((prev) => {
      const employmentTypes = prev.employmentTypes.includes(type)
        ? prev.employmentTypes.filter((item) => item !== type)
        : [...prev.employmentTypes, type]

      return { ...prev, employmentTypes }
    })
    setIsSaved(false)
  }

  const resetForm = () => {
    setPreferences(defaultJobPreferences)
    setErrors({})
    setIsSaved(false)
    localStorage.removeItem('ai-career-companion-job-preferences')
  }

  const submitForm = (event) => {
    event.preventDefault()

    const validationErrors = validateJobPreferences(preferences)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      setIsSaved(false)
      return false
    }

    saveJobPreferences(preferences)
    setIsSaved(true)
    return true
  }

  return {
    preferences,
    errors,
    isSaved,
    updateField,
    toggleEmploymentType,
    resetForm,
    submitForm,
  }
}

export default useJobPreferences
