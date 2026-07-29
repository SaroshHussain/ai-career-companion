import { HiOutlineSparkles } from 'react-icons/hi2'
import { MdArrowForward } from 'react-icons/md'

function AIInsightsCard() {
  return (
    <section className="flex flex-col gap-4 rounded-lg bg-primary-container p-5 text-white shadow-card">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
        <HiOutlineSparkles className="text-xl" aria-hidden />
      </div>

      <div>
        <h2 className="text-headline-md text-white">Boost your visibility</h2>
        <p className="mt-1 text-body-sm text-white/80">
          Optimize your profile with AI-powered suggestions to attract more recruiters.
        </p>
      </div>

      <button
        type="button"
        className="mt-auto inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-label-sm font-medium text-primary-container transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
      >
        Get AI Insights
        <MdArrowForward aria-hidden />
      </button>
    </section>
  )
}

export default AIInsightsCard
