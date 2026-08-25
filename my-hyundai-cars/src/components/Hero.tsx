import CTAButton from './CTAButton'
import SceneBackdrop from './art/SceneBackdrop'
import VehicleImage from './art/VehicleImage'
import { whatsAppLinkFor } from '../config/site'
import { CINEMATIC_PAINT } from './art/carSpecs'

export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-ink text-bone">
      <SceneBackdrop tone="night" horizon={0.74} className="absolute inset-0 h-full w-full" />

      <div className="absolute inset-x-0 top-[13%] h-[25%] sm:top-[14%] sm:h-[30%] lg:inset-x-auto lg:top-auto lg:right-[1%] lg:bottom-[17%] lg:h-[42%] lg:w-[56%]">
        <VehicleImage
          specKey="palisade"
          alt="Hyundai Palisade shown in profile"
          paint={CINEMATIC_PAINT}
          rimLight
          headlightGlow
          loading="eager"
          className="h-full w-full"
        />
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/25 lg:bg-gradient-to-r lg:from-ink lg:via-ink/70 lg:to-transparent"
        aria-hidden="true"
      />

      <div className="shell relative z-10 flex min-h-[100svh] flex-col justify-end pt-28 pb-[7.5rem] sm:pb-32 lg:min-h-[min(92vh,900px)] lg:justify-center lg:pt-32 lg:pb-28">
        <div className="max-w-[34rem] lg:max-w-[40rem]">
          <p className="eyebrow text-white/55">Premium Consultation</p>

          <h1 className="mt-6 text-[clamp(2.6rem,8.6vw,6.5rem)] leading-[0.98] font-light text-white lg:mt-8">
            Your Hyundai.
            <br />
            Your Way.
          </h1>

          <p className="mt-6 max-w-[42ch] text-[1rem] leading-relaxed text-white/70 sm:text-[1.0625rem] lg:mt-8 lg:text-[1.125rem]">
            Whether you're buying for yourself, your family, or your business, we'll help you find
            the right Hyundai solution tailored to your needs.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:mt-12">
            <CTAButton href={whatsAppLinkFor('default')} tone="onDark" variant="solid">
              Talk to a Hyundai Consultant
            </CTAButton>
            <CTAButton
              href="#discovery"
              tone="onDark"
              variant="ghost"
              external={false}
              withArrow={false}
            >
              Explore Your Options
            </CTAButton>
          </div>
        </div>
      </div>

      <div
        className="absolute right-0 bottom-10 left-0 z-10 hidden lg:block"
        aria-hidden="true"
      >
        <div className="shell flex items-center gap-4">
          <span className="eyebrow text-white/40">Scroll</span>
          <span className="h-px w-16 bg-white/25" />
        </div>
      </div>
    </section>
  )
}
