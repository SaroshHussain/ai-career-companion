import { MdCelebration, MdTune, MdUploadFile } from 'react-icons/md'

import { steps } from '../../data/steps'
import Reveal from '../ui/Reveal'

const iconMap = {
  upload_file: MdUploadFile,
  tune: MdTune,
  celebration: MdCelebration,
}

function HowItWorks() {
  return (
    <section id="solutions" className="bg-surface-container-low py-3xl">
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-gutter">
        <div className="mb-2xl text-center">
          <h2 className="text-headline-lg text-on-surface">Three Steps to Success</h2>
        </div>

        <div className="relative flex flex-col gap-xl md:flex-row md:items-start md:justify-between md:gap-2xl">
          <div className="absolute left-[10%] right-[10%] top-12 -z-0 hidden h-[2px] bg-outline-variant/30 md:block" />

          {steps.map((step, index) => {
            const Icon = iconMap[step.icon]

            return (
              <Reveal key={step.title} delay={index * 100} className="relative z-10 flex flex-1 flex-col items-center text-center">
                <div
                  className={`mb-lg flex h-20 w-20 items-center justify-center rounded-full border bg-white transition-colors ${
                    step.emphasis === 'primary'
                      ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20'
                      : 'border-outline-variant text-primary shadow-sm hover:border-primary'
                  }`}
                >
                  <Icon className="text-[40px]" aria-hidden />
                </div>
                <h3 className="mb-sm text-headline-md text-on-surface">{step.title}</h3>
                <p className="max-w-xs text-body-sm text-on-surface-variant">{step.description}</p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks