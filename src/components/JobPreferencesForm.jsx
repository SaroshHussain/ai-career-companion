import FormField from './FormField'
import useJobPreferences from '../hooks/useJobPreferences'
import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  WORK_LOCATIONS,
} from '../utils/jobPreferences'

const inputClassName =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

const selectClassName = `${inputClassName} bg-white`

function JobPreferencesForm() {
  const {
    preferences,
    errors,
    isSaved,
    updateField,
    toggleEmploymentType,
    resetForm,
    submitForm,
  } = useJobPreferences()

  return (
    <form onSubmit={submitForm} className="space-y-8" noValidate>
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Role Details</h2>
          <p className="mt-1 text-sm text-slate-600">
            Tell us what kind of position you are looking for.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Desired Role"
            htmlFor="desiredRole"
            required
            error={errors.desiredRole}
          >
            <input
              id="desiredRole"
              name="desiredRole"
              type="text"
              value={preferences.desiredRole}
              onChange={(event) =>
                updateField('desiredRole', event.target.value)
              }
              placeholder="e.g. Frontend Developer"
              className={inputClassName}
            />
          </FormField>

          <FormField
            label="Experience Level"
            htmlFor="experienceLevel"
            error={errors.experienceLevel}
          >
            <select
              id="experienceLevel"
              name="experienceLevel"
              value={preferences.experienceLevel}
              onChange={(event) =>
                updateField('experienceLevel', event.target.value)
              }
              className={selectClassName}
            >
              <option value="">Select level</option>
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Industries"
            htmlFor="industries"
            hint="Separate multiple industries with commas."
            error={errors.industries}
          >
            <input
              id="industries"
              name="industries"
              type="text"
              value={preferences.industries}
              onChange={(event) =>
                updateField('industries', event.target.value)
              }
              placeholder="e.g. Technology, Healthcare"
              className={inputClassName}
            />
          </FormField>

          <FormField
            label="Key Skills"
            htmlFor="skills"
            hint="List skills separated by commas."
            error={errors.skills}
          >
            <textarea
              id="skills"
              name="skills"
              rows={3}
              value={preferences.skills}
              onChange={(event) => updateField('skills', event.target.value)}
              placeholder="e.g. React, JavaScript, Tailwind CSS"
              className={inputClassName}
            />
          </FormField>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Work Preferences
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Define how and where you prefer to work.
          </p>
        </div>

        <FormField label="Employment Type" htmlFor="employmentTypes">
          <div className="grid gap-3 sm:grid-cols-2">
            {EMPLOYMENT_TYPES.map((type) => (
              <label
                key={type}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition-colors hover:border-indigo-300"
              >
                <input
                  type="checkbox"
                  checked={preferences.employmentTypes.includes(type)}
                  onChange={() => toggleEmploymentType(type)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                {type}
              </label>
            ))}
          </div>
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Work Location Preference"
            htmlFor="workLocation"
            error={errors.workLocation}
          >
            <select
              id="workLocation"
              name="workLocation"
              value={preferences.workLocation}
              onChange={(event) =>
                updateField('workLocation', event.target.value)
              }
              className={selectClassName}
            >
              <option value="">Select preference</option>
              {WORK_LOCATIONS.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Preferred Locations"
            htmlFor="preferredLocations"
            hint="Cities or regions you are open to."
            error={errors.preferredLocations}
          >
            <input
              id="preferredLocations"
              name="preferredLocations"
              type="text"
              value={preferences.preferredLocations}
              onChange={(event) =>
                updateField('preferredLocations', event.target.value)
              }
              placeholder="e.g. New York, London, Remote"
              className={inputClassName}
            />
          </FormField>
        </div>

        <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={preferences.willingToRelocate}
            onChange={(event) =>
              updateField('willingToRelocate', event.target.checked)
            }
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          I am willing to relocate for the right opportunity
        </label>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Compensation & Availability
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Optional details to help match you with suitable roles.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <FormField
            label="Minimum Salary"
            htmlFor="minSalary"
            error={errors.minSalary}
          >
            <input
              id="minSalary"
              name="minSalary"
              type="number"
              min="0"
              value={preferences.minSalary}
              onChange={(event) =>
                updateField('minSalary', event.target.value)
              }
              placeholder="50000"
              className={inputClassName}
            />
          </FormField>

          <FormField
            label="Maximum Salary"
            htmlFor="maxSalary"
            error={errors.maxSalary}
          >
            <input
              id="maxSalary"
              name="maxSalary"
              type="number"
              min="0"
              value={preferences.maxSalary}
              onChange={(event) =>
                updateField('maxSalary', event.target.value)
              }
              placeholder="90000"
              className={inputClassName}
            />
          </FormField>

          <FormField
            label="Available From"
            htmlFor="availableFrom"
            error={errors.availableFrom}
          >
            <input
              id="availableFrom"
              name="availableFrom"
              type="date"
              value={preferences.availableFrom}
              onChange={(event) =>
                updateField('availableFrom', event.target.value)
              }
              className={inputClassName}
            />
          </FormField>
        </div>
      </section>

      {isSaved && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          Your job preferences have been saved successfully.
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={resetForm}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Reset
        </button>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Save Preferences
        </button>
      </div>
    </form>
  )
}

export default JobPreferencesForm
