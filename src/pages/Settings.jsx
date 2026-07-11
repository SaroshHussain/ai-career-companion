import JobPreferencesForm from '../components/JobPreferencesForm'

function Settings() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Job Preferences
        </h1>
        <p className="mt-2 text-slate-600">
          Set your career goals and work preferences so AI Career Companion can
          tailor recommendations to your needs.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <JobPreferencesForm />
      </div>
    </div>
  )
}

export default Settings
