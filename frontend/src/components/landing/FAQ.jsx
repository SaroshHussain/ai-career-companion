import { MdExpandMore } from 'react-icons/md'
import { HelpCircle } from 'lucide-react'

import { faqItems } from '../../data/faq'
import Reveal from '../ui/Reveal'

function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-margin-mobile py-3xl md:px-gutter">
      <div className="mb-2xl text-center">
        <div className="mb-md inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-primary">
          <HelpCircle className="h-4 w-4" aria-hidden />
          <span className="text-label-sm uppercase tracking-wider">FAQ</span>
        </div>
        <h2 className="text-headline-lg text-on-surface">Common Questions</h2>
      </div>

      <div className="space-y-md">
        {faqItems.map((item, index) => (
          <Reveal key={item.question} delay={index * 75}>
            <details className="group rounded-xl border border-outline-variant bg-surface-container-lowest p-md transition-all hover:border-primary">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-md font-bold text-on-surface outline-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-3">
                  <HelpCircle className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>{item.question}</span>
                </span>
                <MdExpandMore className="shrink-0 text-[1.4rem] transition-transform duration-200 group-open:rotate-180" aria-hidden />
              </summary>
              <p className="mt-md text-body-sm text-on-surface-variant">{item.answer}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default FAQ