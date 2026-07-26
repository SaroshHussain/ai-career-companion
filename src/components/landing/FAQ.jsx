import { MdExpandMore } from 'react-icons/md'

import { faqItems } from '../../data/faq'
import Reveal from '../ui/Reveal'

function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-margin-mobile py-3xl md:px-gutter">
      <h2 className="mb-2xl text-center text-headline-lg text-on-surface">Common Questions</h2>

      <div className="space-y-md">
        {faqItems.map((item, index) => (
          <Reveal key={item.question} delay={index * 75}>
            <details className="group rounded-xl border border-outline-variant bg-surface-container-lowest p-md transition-all hover:border-primary">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-md font-bold text-on-surface outline-none [&::-webkit-details-marker]:hidden">
                {item.question}
                <MdExpandMore className="text-[1.4rem] transition-transform duration-200 group-open:rotate-180" aria-hidden />
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