import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import SolutionRows from './SolutionRows'
import SceneBackdrop from './art/SceneBackdrop'
import VehicleImage from './art/VehicleImage'
import { WHY_US } from '../data/content'
import { STUDIO_PAINT } from './art/carSpecs'

export default function WhyUs() {
  return (
    <section id="why-us" className="bg-paper py-24 sm:py-28 lg:py-40">
      <div className="shell grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-20 xl:gap-28">
        <Reveal className="lg:sticky lg:top-32">
          <div className="relative isolate aspect-[4/3] overflow-hidden bg-ink sm:aspect-[16/10] lg:aspect-[4/5]">
            <SceneBackdrop
              tone="graphite"
              horizon={0.6}
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-x-[3%] top-[34%] h-[36%] lg:top-[40%] lg:h-[30%]">
              <VehicleImage
                specKey="ioniq-5"
                alt="Hyundai IONIQ 5 in a studio setting"
                paint={STUDIO_PAINT}
                rimLight
                headlightGlow
                className="h-full w-full"
              />
            </div>
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
              aria-hidden="true"
            />
          </div>
        </Reveal>

        <div>
          <SectionHeading
            eyebrow="Why My Hyundai Cars"
            title="More Than Just Choosing a Car."
            copy="A dedicated consultation experience designed around your actual needs."
          />
          <div className="mt-10 lg:mt-12">
            <SolutionRows rows={WHY_US} />
          </div>
        </div>
      </div>
    </section>
  )
}
