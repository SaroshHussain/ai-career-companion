import { HiSparkles } from 'react-icons/hi2'
import { MdAnalytics, MdDescription, MdRecordVoiceOver, MdWork } from 'react-icons/md'

import { features } from '../../data/features'
import Reveal from '../ui/Reveal'

const iconMap = {
  description: MdDescription,
  record_voice_over: MdRecordVoiceOver,
  work: MdWork,
  analytics: MdAnalytics,
}

function FeatureBento() {
  return (
    <section id="features" className="mx-auto max-w-container-max px-margin-mobile py-3xl md:px-gutter">
      <div className="mb-2xl text-center">
        <h2 className="mb-md text-headline-lg text-on-surface">Supercharge Every Step</h2>
        <p className="mx-auto max-w-2xl text-body-md text-on-surface-variant">
          Our specialized AI agents focus on the four pillars of a successful job hunt.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
        {features.map((feature) => {
          const Icon = iconMap[feature.icon]

          if (feature.variant === 'resume') {
            return (
              <Reveal key={feature.title} className="md:col-span-7">
                <article className="flex h-full flex-col justify-between rounded-lg border border-outline-variant bg-surface-container-lowest p-xl shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
                  <div>
                    <div className="mb-lg flex h-12 w-12 items-center justify-center rounded bg-primary/10 text-primary">
                      <Icon className="text-[32px]" aria-hidden />
                    </div>
                    <h3 className="mb-base text-headline-md text-on-surface">{feature.title}</h3>
                    <p className="text-body-md text-on-surface-variant">{feature.description}</p>
                  </div>
                  <div className="mt-xl flex items-center justify-between border-t border-outline-variant/30 pt-xl">
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-label-sm font-label-sm text-secondary">
                      <HiSparkles className="text-[14px]" aria-hidden /> AI Enhanced
                    </span>
                    <a href="#" className="text-label-md text-primary transition hover:underline">
                      Learn more
                    </a>
                  </div>
                </article>
              </Reveal>
            )
          }

          if (feature.variant === 'interview') {
            return (
              <Reveal key={feature.title} delay={100} className="md:col-span-5">
                <article className="h-full rounded-lg border border-outline-variant bg-surface-container-high p-xl shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
                  <div className="mb-lg flex h-12 w-12 items-center justify-center rounded bg-secondary/10 text-secondary">
                    <Icon className="text-[32px]" aria-hidden />
                  </div>
                  <h3 className="mb-base text-headline-md text-on-surface">{feature.title}</h3>
                  <p className="text-body-md text-on-surface-variant">{feature.description}</p>
                  <div className="mt-xl flex -space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary-container text-[10px] text-white">
                      JD
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-secondary-container text-[10px] text-white">
                      MK
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-surface-dim text-[10px] text-on-surface">
                      +12
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          }

          if (feature.variant === 'matching') {
            return (
              <Reveal key={feature.title} delay={150} className="md:col-span-5">
                <article className="h-full rounded-lg border border-outline-variant bg-surface-container-lowest p-xl shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
                  <div className="mb-lg flex h-12 w-12 items-center justify-center rounded bg-tertiary-container/10 text-tertiary-container">
                    <Icon className="text-[32px]" aria-hidden />
                  </div>
                  <h3 className="mb-base text-headline-md text-on-surface">{feature.title}</h3>
                  <p className="text-body-md text-on-surface-variant">{feature.description}</p>
                </article>
              </Reveal>
            )
          }

          return (
            <Reveal key={feature.title} delay={200} className="md:col-span-7">
              <article className="relative h-full overflow-hidden rounded-lg border border-primary bg-primary-container p-xl text-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
                <div className="relative z-10">
                  <div className="mb-lg flex h-12 w-12 items-center justify-center rounded bg-white/20 backdrop-blur-md">
                    <Icon className="text-[32px]" aria-hidden />
                  </div>
                  <h3 className="mb-base text-headline-md text-white">{feature.title}</h3>
                  <p className="max-w-md text-body-md text-primary-fixed">{feature.description}</p>
                </div>
                <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
              </article>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

export default FeatureBento