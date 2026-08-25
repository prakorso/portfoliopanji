import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { PROCESS_STEPS } from '../data/content'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-bone py-24 sm:py-28 lg:py-40">
      <div className="shell">
        <SectionHeading
          eyebrow="How It Works"
          title="Simple From First Conversation to Delivery."
          className="max-w-[42rem]"
        />

        <ol className="mt-14 grid md:grid-cols-2 md:gap-x-10 md:gap-y-14 lg:mt-20 lg:grid-cols-4 lg:gap-x-8">
          {PROCESS_STEPS.map((step, i) => (
            <li
              key={step.number}
              className="border-t border-rule last:border-b md:border-b-0 md:last:border-b-0"
            >
              <Reveal delay={i * 90}>
                <div className="flex gap-5 py-7 sm:gap-7 md:block md:py-0 md:pt-8">
                  <span
                    className="font-mono text-[1.625rem] leading-none font-light text-ink/30 tabular-nums sm:text-[1.875rem] md:text-[2.5rem]"
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>
                  <div className="md:mt-9">
                    <h3 className="text-[1.125rem] leading-snug font-normal tracking-[-0.02em] text-ink sm:text-[1.25rem]">
                      {step.title}
                    </h3>
                    <p className="mt-2.5 max-w-[34ch] text-[0.9375rem] leading-relaxed text-mute">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
