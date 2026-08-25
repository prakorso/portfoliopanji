import CTAButton from './CTAButton'
import Reveal from './Reveal'
import SceneBackdrop from './art/SceneBackdrop'
import VehicleImage from './art/VehicleImage'
import { CINEMATIC_PAINT } from './art/carSpecs'
import { whatsAppLinkFor } from '../config/site'

export default function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-bone">
      <SceneBackdrop tone="night" horizon={0.66} className="absolute inset-0 h-full w-full" />

      <div className="absolute inset-x-[4%] top-[5%] h-[22%] sm:inset-x-[12%] sm:h-[24%] lg:inset-x-[30%] lg:top-[6%] lg:h-[27%]">
        <VehicleImage
          specKey="santa-fe"
          alt="Hyundai SUV at night"
          paint={CINEMATIC_PAINT}
          rimLight
          headlightGlow
          decorative
          className="h-full w-full"
        />
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/35"
        aria-hidden="true"
      />

      <div className="shell relative z-10 flex flex-col items-start pt-[14rem] pb-28 sm:pt-[16rem] sm:pb-32 lg:items-center lg:pt-[21rem] lg:pb-40 lg:text-center">
        <Reveal className="lg:max-w-[46rem]">
          <h2 className="text-[clamp(2.1rem,6vw,4rem)] leading-[1.03] font-light text-white">
            Ready to Find Your Hyundai?
          </h2>
          <p className="mt-5 max-w-[44ch] text-[1rem] leading-relaxed text-white/70 sm:text-[1.0625rem] lg:mx-auto lg:mt-6">
            Tell us what you're looking for and let's find the right option for you.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4 lg:mt-11 lg:justify-center">
            <CTAButton href={whatsAppLinkFor('general')} tone="onDark" variant="solid">
              Talk to a Hyundai Consultant
            </CTAButton>
            <CTAButton
              href="#models"
              tone="onDark"
              variant="ghost"
              external={false}
              withArrow={false}
            >
              Explore Hyundai Models
            </CTAButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
