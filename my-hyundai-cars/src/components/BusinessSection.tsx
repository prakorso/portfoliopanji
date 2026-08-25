import CTAButton from './CTAButton'
import SectionHeading from './SectionHeading'
import SolutionRows from './SolutionRows'
import Reveal from './Reveal'
import SceneBackdrop from './art/SceneBackdrop'
import CarArt from './art/CarArt'
import { BUSINESS_SOLUTIONS } from '../data/content'
import { CAR_SPECS, CINEMATIC_PAINT } from './art/carSpecs'
import { whatsAppLinkFor } from '../config/site'

const FLEET = ['santa-fe', 'palisade', 'stargazer'] as const

export default function BusinessSection() {
  return (
    <section id="business" className="relative isolate overflow-hidden bg-ink text-bone">
      <SceneBackdrop tone="night" horizon={0.7} className="absolute inset-0 h-full w-full" />

      <div
        className="absolute inset-x-0 bottom-[2%] hidden h-[22%] items-end justify-center gap-[1%] px-4 opacity-90 sm:flex sm:h-[24%] lg:h-[26%]"
        aria-hidden="true"
      >
        {FLEET.map((key, i) => (
          <CarArt
            key={key}
            spec={CAR_SPECS[key]}
            paint={CINEMATIC_PAINT}
            title=""
            decorative
            rimLight
            className={`h-full w-1/3 max-w-[420px] ${i === 1 ? 'opacity-100' : 'opacity-70'}`}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-ink/72"
        aria-hidden="true"
      />

      <div className="shell relative z-10 py-24 sm:py-28 sm:pb-44 lg:py-40 lg:pb-56">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20 xl:gap-28">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              eyebrow="For Your Business"
              title={'More Than a Car.\nA Mobility Solution for Your Business.'}
              copy="From corporate fleets to mobility businesses, we'll help you find the right Hyundai solution around your operational needs."
              tone="dark"
            />
            <Reveal delay={120}>
              <CTAButton
                href={whatsAppLinkFor('business')}
                tone="onDark"
                variant="solid"
                className="mt-9 w-full sm:w-auto"
              >
                Discuss Your Business Needs
              </CTAButton>
            </Reveal>
          </div>

          <SolutionRows rows={BUSINESS_SOLUTIONS} tone="dark" />
        </div>
      </div>
    </section>
  )
}
