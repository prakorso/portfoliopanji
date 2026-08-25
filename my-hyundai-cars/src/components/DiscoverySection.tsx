import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import SceneBackdrop, { type SceneTone } from './art/SceneBackdrop'
import VehicleImage from './art/VehicleImage'
import { CINEMATIC_PAINT, STUDIO_PAINT, type Paint } from './art/carSpecs'

type Panel = {
  eyebrow: string
  title: string
  description: string
  specKey: string
  alt: string
  tone: SceneTone
  paint: Paint
  variant: 'light' | 'dark'
}

const PANELS: Panel[] = [
  {
    eyebrow: 'Personal',
    title: 'Designed for Your Journey.',
    description: 'Find a Hyundai that fits your lifestyle, family, and everyday needs.',
    specKey: 'creta',
    alt: 'Hyundai compact SUV on a bright studio plate',
    tone: 'light',
    paint: STUDIO_PAINT,
    variant: 'light',
  },
  {
    eyebrow: 'Business',
    title: 'Engineered for Enterprise.',
    description: 'Build the right Hyundai solution for your company, fleet, or mobility business.',
    specKey: 'santa-fe',
    alt: 'Hyundai SUV in a dark cinematic setting',
    tone: 'night',
    paint: CINEMATIC_PAINT,
    variant: 'dark',
  },
]

export default function DiscoverySection() {
  return (
    <section id="discovery" className="bg-paper py-24 sm:py-28 lg:py-40">
      <div className="shell">
        <SectionHeading
          title="What Are You Looking For?"
          copy="Start with what you need. We'll help you find the right Hyundai solution."
          className="max-w-[38rem]"
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 md:gap-5 lg:mt-20 lg:gap-8">
          {PANELS.map((panel, i) => {
            const light = panel.variant === 'light'
            return (
              <Reveal key={panel.eyebrow} delay={i * 110}>
                {/* Informational only — deliberately not a link or button. */}
                <article
                  className={`relative isolate aspect-[4/3] overflow-hidden sm:aspect-[16/10] lg:aspect-[5/4] ${
                    light ? 'bg-bone' : 'bg-ink'
                  }`}
                >
                  <SceneBackdrop
                    tone={panel.tone}
                    horizon={0.76}
                    streaks={false}
                    className="absolute inset-0 h-full w-full"
                  />
                  <div className="absolute inset-x-[4%] top-[12%] h-[38%] sm:h-[40%]">
                    <VehicleImage
                      specKey={panel.specKey}
                      alt={panel.alt}
                      paint={panel.paint}
                      rimLight={!light}
                      className="h-full w-full"
                    />
                  </div>
                  <div
                    className={`absolute inset-0 ${
                      light
                        ? 'bg-gradient-to-t from-bone from-28% via-bone/70 via-44% to-transparent to-56%'
                        : 'bg-gradient-to-t from-black/88 from-24% via-black/35 via-44% to-transparent to-58%'
                    }`}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                    <p className={`eyebrow ${light ? 'text-mute' : 'text-white/60'}`}>
                      {panel.eyebrow}
                    </p>
                    <h3
                      className={`mt-4 text-[clamp(1.5rem,3.6vw,2.25rem)] leading-[1.08] font-light ${
                        light ? 'text-ink' : 'text-white'
                      }`}
                    >
                      {panel.title}
                    </h3>
                    <p
                      className={`mt-3 max-w-[36ch] text-[0.9375rem] leading-relaxed sm:text-base ${
                        light ? 'text-mute' : 'text-white/70'
                      }`}
                    >
                      {panel.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
