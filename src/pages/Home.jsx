const features = [
  {
    title: 'AI Resume Builder',
    description:
      'Create polished, ATS-friendly resumes tailored to your target roles.',
  },
  {
    title: 'Cover Letter Generator',
    description:
      'Generate personalized cover letters that highlight your strengths.',
  },
  {
    title: 'Interview Preparation',
    description:
      'Practice with AI-driven questions and feedback to build confidence.',
  },
  {
    title: 'Job Application Tracker',
    description:
      'Organize applications, deadlines, and follow-ups in one place.',
  },
]

function Home() {
  return (
    <>
      <section
        id="get-started"
        className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-200">
            Your AI-powered career assistant
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Advance your career with confidence
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-indigo-100 sm:text-lg">
            AI Career Companion helps you build stronger resumes, craft compelling
            cover letters, prepare for interviews, and manage your job search —
            all in one place.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#features"
              className="w-full rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-50 sm:w-auto"
            >
              Explore Features
            </a>
            <a
              href="#resume"
              className="w-full rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              Build Your Resume
            </a>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Everything you need to land your next role
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Purpose-built tools to support every stage of your job search journey.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              id={
                index === 0
                  ? 'resume'
                  : index === 2
                    ? 'interview'
                    : index === 3
                      ? 'tracker'
                      : undefined
              }
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default Home
